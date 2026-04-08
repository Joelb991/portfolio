import tkinter as tk
from tkinter import filedialog, scrolledtext
import sys
import os
import io
from spotifyOptimizer import optimize


class SpotifyOptimizerApp:
    def __init__(self, root):
        self.root = root

        # --- THEME CONFIGURATION ---
        self.colors = {
            "bg":           "#121212",
            "bg_card":      "#181818",
            "bg_elevated":  "#1E1E1E",
            "fg":           "#FFFFFF",
            "fg_dim":       "#B3B3B3",
            "accent":       "#1DB954",
            "accent_hover": "#1ED760",
            "input_bg":     "#2A2A2A",
            "input_border": "#3E3E3E",
            "input_focus":  "#1DB954",
            "input_fg":     "#FFFFFF",
            "error":        "#E35555",
            "title_bar":    "#0A0A0A",
            "btn_secondary":"#333333",
            "btn_sec_hover":"#444444",
            "divider":      "#2A2A2A",
        }

        self.fonts = {
            "title":    ("Helvetica Neue", 11, "bold"),
            "header":   ("Helvetica Neue", 16, "bold"),
            "subhead":  ("Helvetica Neue", 10),
            "label":    ("Helvetica Neue", 10),
            "entry":    ("Helvetica Neue", 10),
            "button":   ("Helvetica Neue", 10, "bold"),
            "btn_big":  ("Helvetica Neue", 12, "bold"),
            "mono":     ("Menlo", 10),
            "small":    ("Helvetica Neue", 9),
        }

        # --- LOAD ICON ---
        self.icon_img = None
        self._load_icon()

        # --- SETUP MAIN WINDOW ---
        self.setup_custom_window(self.root, "Spotify UI Optimization", 580, 650)

        # --- Variables ---
        self.input_path_var = tk.StringVar()
        self.output_folder_var = tk.StringVar()
        self.output_filename_var = tk.StringVar(value="output.xlsx")
        self.m_min_var = tk.StringVar(value="0")
        self.m_max_var = tk.StringVar(value="3")

        # --- CONTENT AREA ---
        self._build_content()

    def _load_icon(self):
        try:
            icon_file = "spotify_logo.png"
            if not os.path.exists(icon_file):
                icon_file = "spotify_logo.ico"
            if os.path.exists(icon_file):
                self.icon_original = tk.PhotoImage(file=icon_file)
                h = self.icon_original.height()
                scale = max(int(h / 18), 1)
                self.icon_img = self.icon_original.subsample(scale)
        except Exception:
            pass

    def setup_custom_window(self, window, title, w, h):
        window.title(title)
        window.overrideredirect(True)
        window.configure(bg=self.colors["bg"])

        sx = window.winfo_screenwidth()
        sy = window.winfo_screenheight()
        window.geometry(f"{w}x{h}+{(sx - w) // 2}+{(sy - h) // 2}")

        window.columnconfigure(0, weight=1)
        window.rowconfigure(1, weight=1)

        bar = tk.Frame(window, bg=self.colors["title_bar"], height=38)
        bar.grid(row=0, column=0, sticky="ew")
        bar.grid_propagate(False)
        bar.columnconfigure(1, weight=1)

        bar.bind("<Button-1>", self._start_move)
        bar.bind("<B1-Motion>", self._do_move)

        if self.icon_img:
            ico = tk.Label(bar, image=self.icon_img, bg=self.colors["title_bar"])
            ico.grid(row=0, column=0, padx=(12, 6), pady=6)
            ico.bind("<Button-1>", self._start_move)
            ico.bind("<B1-Motion>", self._do_move)

        ttl = tk.Label(
            bar, text=title, fg="#CCCCCC",
            bg=self.colors["title_bar"], font=self.fonts["title"]
        )
        ttl.grid(row=0, column=1, sticky="w", pady=6)
        ttl.bind("<Button-1>", self._start_move)
        ttl.bind("<B1-Motion>", self._do_move)

        ctrl_frame = tk.Frame(bar, bg=self.colors["title_bar"])
        ctrl_frame.grid(row=0, column=2, padx=(0, 4), pady=6)

        for symbol, hover_bg, cmd in [
            ("\u2500", "#555555", lambda: window.iconify() if hasattr(window, 'iconify') else None),
            ("\u2715", "#E81123", window.destroy),
        ]:
            b = tk.Label(
                ctrl_frame, text=symbol, fg="#888888",
                bg=self.colors["title_bar"], font=("Helvetica Neue", 10),
                width=3, cursor="hand2"
            )
            b.pack(side="left", padx=1)
            b.bind("<Enter>", lambda e, btn=b, c=hover_bg: btn.configure(bg=c, fg="white"))
            b.bind("<Leave>", lambda e, btn=b: btn.configure(bg=self.colors["title_bar"], fg="#888888"))
            b.bind("<Button-1>", lambda e, c=cmd: c())

    def _start_move(self, event):
        self._drag_x = event.x
        self._drag_y = event.y

    def _do_move(self, event):
        win = event.widget.winfo_toplevel()
        dx = event.x - self._drag_x
        dy = event.y - self._drag_y
        win.geometry(f"+{win.winfo_x() + dx}+{win.winfo_y() + dy}")

    def _build_content(self):
        outer = tk.Frame(self.root, bg=self.colors["bg"])
        outer.grid(row=1, column=0, sticky="nsew")
        outer.columnconfigure(0, weight=1)
        outer.rowconfigure(0, weight=1)

        canvas = tk.Canvas(outer, bg=self.colors["bg"], highlightthickness=0)
        canvas.grid(row=0, column=0, sticky="nsew")

        inner = tk.Frame(canvas, bg=self.colors["bg"])
        canvas.create_window((0, 0), window=inner, anchor="nw")
        inner.columnconfigure(0, weight=1)

        def _on_configure(e):
            canvas.configure(scrollregion=canvas.bbox("all"))
            canvas.itemconfig("all", width=canvas.winfo_width())

        inner.bind("<Configure>", _on_configure)
        canvas.bind("<Configure>", lambda e: canvas.itemconfig(
            canvas.find_all()[0], width=e.width
        ))

        hdr = tk.Frame(inner, bg=self.colors["bg"])
        hdr.grid(row=0, column=0, sticky="ew", padx=28, pady=(20, 4))

        tk.Label(
            hdr, text="Start Your Optimization",
            font=self.fonts["header"], bg=self.colors["bg"], fg=self.colors["fg"]
        ).pack(anchor="w")

        tk.Label(
            hdr, text="Configure your input, output, and constraints below.",
            font=self.fonts["subhead"], bg=self.colors["bg"], fg=self.colors["fg_dim"]
        ).pack(anchor="w", pady=(2, 0))

        tk.Frame(inner, bg=self.colors["divider"], height=1).grid(
            row=1, column=0, sticky="ew", padx=28, pady=(12, 0)
        )

        self._section_label(inner, "FILE CONFIGURATION", row=2)
        card1 = self._card(inner, row=3)
        self._file_row(card1, "Input Excel File", self.input_path_var,
                        self._browse_input, row=0, placeholder="Select .xlsx file\u2026")
        self._file_row(card1, "Output Folder", self.output_folder_var,
                        self._browse_output, row=1, placeholder="Select destination folder\u2026")
        self._text_row(card1, "Output Filename", self.output_filename_var, row=2)

        self._section_label(inner, "CONSTRAINTS", row=4)
        card2 = self._card(inner, row=5)
        c_inner = tk.Frame(card2, bg=self.colors["bg_card"])
        c_inner.pack(fill="x")
        c_inner.columnconfigure(1, weight=1)
        c_inner.columnconfigure(3, weight=1)

        self._small_input(c_inner, "Min Modules", self.m_min_var, col=0)
        self._small_input(c_inner, "Max Modules", self.m_max_var, col=2)

        btn_frame = tk.Frame(inner, bg=self.colors["bg"])
        btn_frame.grid(row=6, column=0, sticky="ew", padx=28, pady=(24, 20))

        self.optimize_btn = tk.Label(
            btn_frame, text="OPTIMIZE", font=self.fonts["btn_big"],
            bg=self.colors["accent"], fg="#000000",
            cursor="hand2", pady=12
        )
        self.optimize_btn.pack(fill="x")
        self.optimize_btn.bind("<Enter>", lambda e: self.optimize_btn.configure(
            bg=self.colors["accent_hover"]
        ))
        self.optimize_btn.bind("<Leave>", lambda e: self.optimize_btn.configure(
            bg=self.colors["accent"]
        ))
        self.optimize_btn.bind("<Button-1>", lambda e: self._run_optimization())

    # ... (widget builders, dialogs, and optimization runner)


if __name__ == "__main__":
    root = tk.Tk()
    app = SpotifyOptimizerApp(root)
    root.mainloop()
