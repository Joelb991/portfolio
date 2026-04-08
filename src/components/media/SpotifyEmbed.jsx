
export default function SpotifyEmbed({ uri, height = 80 }) {
  // URI may include a query string (e.g. "playlist/ID?trackId=...")
  // Split it out so we don't produce a double-? in the embed URL.
  const [path, params] = uri.split("?");
  const src = `https://open.spotify.com/embed/${path}?utm_source=generator&theme=0${params ? `&${params}` : ""}`;

  return (
    <iframe
      style={{ borderRadius: 12, border: "none", width: "100%" }}
      src={src}
      height={height}
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
    />
  );
}
