
import { palette } from "@/styles/palette";
import { spotifyEmbeds, profileLinks } from "@/data/interests";
import { playlistTracks } from "@/data/playlistTracks";
import FadeIn from "@/components/ui/FadeIn";
import SpotifyEmbed from "@/components/media/SpotifyEmbed";
import ProfileLink from "@/components/media/ProfileLink";
import EraDistribution from "@/components/music/EraDistribution";
import PopularityScatter from "@/components/music/PopularityScatter";
import DiscoveryTimeline from "@/components/music/DiscoveryTimeline";
import Ridgeline from "@/components/music/Ridgeline";
import InterestSection from "./InterestSection";

const glass = {
  background: "rgba(255, 255, 255, 0.04)",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  borderRadius: 16,
  padding: "22px",
};

const panelLabel = {
  color: `${palette.ashGrey}77`,
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "1.5px",
  textTransform: "uppercase",
  margin: "0 0 12px",
};

const sourceLabel = {
  color: `${palette.ashGrey}44`,
  fontSize: 10,
  fontWeight: 500,
  textAlign: "right",
  marginTop: 12,
};

// Quick stats from the playlist data
const avgPopularity = playlistTracks.length > 0
  ? Math.round(playlistTracks.reduce((s, t) => s + (t.popularity || 0), 0) / playlistTracks.length)
  : 0;
const mostObscure = playlistTracks.length > 0
  ? [...playlistTracks].sort((a, b) => a.popularity - b.popularity)[0]
  : null;

export default function MusicSection() {
  return (
    <InterestSection
      title="Music"
      subtitle="What I Listen To"
      bg={palette.darkerBg}
      profileLink={<ProfileLink {...profileLinks.bandcamp} />}
    >
      {/* ── Row 1: Spotify Embed + Music DNA ──────────────────────────────── */}
      <FadeIn delay={0.1}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "stretch" }}>

          {/* Left — Spotify playlist */}
          <div style={{ ...glass, display: "flex", flexDirection: "column", gap: 14 }}>
            <p style={panelLabel}>Playlist</p>
            <SpotifyEmbed uri={spotifyEmbeds.playlist} height={460} />
          </div>

          {/* Right — Ridgeline */}
          <div style={{ ...glass, display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <p style={panelLabel}>Genre × Era — Ridgeline </p>
              <p style={{ color: "#fff", fontSize: 18, fontWeight: 700, margin: "0 0 6px", letterSpacing: "-0.4px" }}>Listening Topography</p>
              <p style={{ color: `${palette.ashGrey}99`, fontSize: 13, lineHeight: 1.75, margin: 0 }}>
                Each ridge maps a genre across the decades — peaks where the music clusters.
              </p>
            </div>
            {playlistTracks.length > 0 && <Ridgeline tracks={playlistTracks} />}
            <p style={sourceLabel}>Source: Spotify API · Release dates</p>
          </div>

        </div>
      </FadeIn>

      {/* ── Row 2: Era Distribution ───────────────────────────────────────── */}
      {playlistTracks.length > 0 && (
        <FadeIn delay={0.2}>
          <div style={{ ...glass, marginTop: 28 }}>
            <p style={panelLabel}>Release Year — Distribution</p>
            <p style={{ color: "#fff", fontSize: 18, fontWeight: 700, margin: "0 0 6px", letterSpacing: "-0.4px" }}>
              Which Eras Define My Taste?
            </p>
            <p style={{ color: `${palette.ashGrey}99`, fontSize: 13, lineHeight: 1.75, margin: "0 0 16px" }}>
              {playlistTracks.length} tracks across {[...new Set(playlistTracks.map(t => t.decade))].length} decades — genre-stacked to show what each era contributes.
            </p>
            <EraDistribution tracks={playlistTracks} />
            <p style={sourceLabel}>Source: Spotify API · Release dates & genres</p>
          </div>
        </FadeIn>
      )}

      {/* ── Row 3: Popularity vs. Obscurity ───────────────────────────────── */}
      {playlistTracks.length > 0 && (
        <FadeIn delay={0.3}>
          <div style={{ ...glass, marginTop: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
              <div>
                <p style={panelLabel}>Popularity vs. Release Year</p>
                <p style={{ color: "#fff", fontSize: 18, fontWeight: 700, margin: "0 0 6px", letterSpacing: "-0.4px" }}>
                  Mainstream or Deep Cuts?
                </p>
                <p style={{ color: `${palette.ashGrey}99`, fontSize: 13, lineHeight: 1.75, margin: 0 }}>
                  Each dot is a song. Hover for details, toggle by genre.
                </p>
              </div>
              <div style={{ display: "flex", gap: 20 }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ color: palette.coolSteel, fontSize: 24, fontWeight: 800 }}>{avgPopularity}</div>
                  <div style={{ color: `${palette.ashGrey}66`, fontSize: 9, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>Avg. Popularity</div>
                </div>
              </div>
            </div>
            <PopularityScatter tracks={playlistTracks} />
            <p style={sourceLabel}>Source: Deezer API · Popularity scores (0–100)</p>
          </div>
        </FadeIn>
      )}

      {/* ── Row 4: Discovery Timeline ─────────────────────────────────────── */}
      {playlistTracks.length > 0 && playlistTracks.some(t => t.addedAt) && (
        <FadeIn delay={0.4}>
          <div style={{ ...glass, marginTop: 20 }}>
            <p style={panelLabel}>Discovery Timeline — Added Over Time</p>
            <p style={{ color: "#fff", fontSize: 18, fontWeight: 700, margin: "0 0 6px", letterSpacing: "-0.4px" }}>
              When Did I Find These?
            </p>
            <p style={{ color: `${palette.ashGrey}99`, fontSize: 13, lineHeight: 1.75, margin: "0 0 16px" }}>
              Bars show songs added per month. The line tracks cumulative growth. Hover for details.
            </p>
            <DiscoveryTimeline tracks={playlistTracks} />
            <p style={sourceLabel}>Source: Spotify API · Playlist add dates</p>
          </div>
        </FadeIn>
      )}
    </InterestSection>
  );
}
