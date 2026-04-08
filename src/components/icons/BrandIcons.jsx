
export function SpotifyIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#1DB954">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

export function StravaIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#FC4C02">
      <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
    </svg>
  );
}

export function BandcampIcon({ size = 16 }) {
  // Bandcamp's characteristic chevron/arrow mark
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#1DA0C3">
      <path d="M0 18.75l7.438-13.5H24L16.5 18.75z" />
    </svg>
  );
}

export function LetterboxdIcon({ size = 16 }) {
  // Three overlapping circles — Letterboxd's brand mark
  const r = size * 0.38;
  const cy = size / 2;
  return (
    <svg width={size * 1.8} height={size} viewBox={`0 0 ${size * 1.8} ${size}`} fill="none">
      <circle cx={r + 1} cy={cy} r={r} fill="#40BCF4" />
      <circle cx={size * 0.9} cy={cy} r={r} fill="#00E054" />
      <circle cx={size * 1.8 - r - 1} cy={cy} r={r} fill="#FF8000" />
    </svg>
  );
}

