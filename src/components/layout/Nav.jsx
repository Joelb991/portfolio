
import { Link, useLocation } from "react-router-dom";
import { accent, palette } from "@/styles/palette";
import LinkedInIcon from "@/components/icons/LinkedInIcon";
import GitHubIcon from "@/components/icons/GitHubIcon";
import ResumeIcon from "@/components/icons/ResumeIcon";
import Button from "@/components/ui/Button";

const links = [
  { label: "Home", path: "/" },
  { label: "Projects", path: "/projects" },
  { label: "Interests", path: "/interests" },
  { label: "Contact", path: "/contact" },
];

export default function Nav() {
  const { pathname } = useLocation();

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: `${palette.darkerBg}ee`, backdropFilter: "blur(12px)",
      borderBottom: `1px solid ${palette.jetBlack}`,
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "12px 28px",
    }}>
      <Link to="/" style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>
        Bryan <span style={{ color: accent }}>Garcia</span>
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        {links.map(l => (
          <Link
            key={l.path}
            to={l.path}
            style={{
              color: pathname === l.path ? accent : palette.ashGrey,
              fontSize: 12.5, fontWeight: 500,
              letterSpacing: "0.5px", textTransform: "uppercase",
              transition: "color 0.3s",
            }}
          >
            {l.label}
          </Link>
        ))}

        <div style={{ width: 1, height: 18, background: `${palette.ashGrey}33`, margin: "0 4px" }} />

        <a href="https://www.linkedin.com/in/brygarcia" target="_blank" rel="noreferrer"
          style={{ color: palette.ashGrey, display: "flex", transition: "color 0.3s" }}
          onMouseEnter={e => e.currentTarget.style.color = accent}
          onMouseLeave={e => e.currentTarget.style.color = palette.ashGrey}>
          <LinkedInIcon />
        </a>

        <a href="https://www.github.com/Joelb991" target="_blank" rel="noreferrer"
          style={{ color: palette.ashGrey, display: "flex", transition: "color 0.3s" }}
          onMouseEnter={e => e.currentTarget.style.color = accent}
          onMouseLeave={e => e.currentTarget.style.color = palette.ashGrey}>
          <GitHubIcon />
        </a>

        <Button href="/BryanGarcia2026WebsiteResume.pdf" filled small style={{ padding: "5px 14px", fontSize: 11.5, borderRadius: 50, color: "#fff", border: `1.5px solid ${accent}` }}>
          <ResumeIcon /> Resume
        </Button>
      </div>
    </nav>
  );
}

