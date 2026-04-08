
import { useState } from "react";
import { Link } from "react-router-dom";
import { accent, palette } from "@/styles/palette";
import { FEATURED_PROJECT, ALL_PROJECTS, FILTER_BUCKETS } from "@/data/projects";
import FadeIn from "@/components/ui/FadeIn";
import Tag from "@/components/ui/Tag";
import Button from "@/components/ui/Button";
import FilterChip from "@/components/ui/FilterChip";
import ScrollIndicator from "@/components/layout/ScrollIndicator";
import GitHubIcon from "@/components/icons/GitHubIcon";
import ExternalIcon from "@/components/icons/ExternalIcon";

function ProjectCard({ project, index }) {
  const [hov, setHov] = useState(false);
  return (
    <FadeIn delay={index * 0.06}>
      <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ borderRadius: 12, overflow: "hidden", background: palette.darkBg, border: `1px solid ${hov ? accent + "33" : accent + "0a"}`, transform: hov ? "translateY(-4px)" : "translateY(0)", transition: "all 0.35s", cursor: "pointer", display: "flex", flexDirection: "column" }}>
        <Link to={`/projects/${project.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
          <div style={{ height: 140, position: "relative", overflow: "hidden", background: `linear-gradient(135deg, ${accent}18, ${palette.darkerBg})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {project.cover
              ? <img src={project.cover} alt={project.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              : <span style={{ fontSize: 44, filter: "grayscale(0.3)" }}>{project.icon}</span>
            }
          </div>
          <div style={{ padding: "18px 20px 14px" }}>
            <h3 style={{ color: "#fff", fontSize: 14, fontWeight: 700, margin: "0 0 6px", lineHeight: 1.3 }}>{project.title}</h3>
            <p style={{ color: `${palette.ashGrey}99`, fontSize: 12, lineHeight: 1.65, margin: "0 0 12px" }}>{project.desc}</p>
            <div>{project.tags.map(t => <Tag key={t}>{t}</Tag>)}</div>
          </div>
        </Link>
        <div style={{ padding: "0 20px 20px", display: "flex", flexDirection: "column", flex: 1, justifyContent: "flex-end" }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", borderTop: `1px solid ${palette.jetBlack}`, paddingTop: 12 }}>
            <Link to={`/projects/${project.slug}`}
              style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 12px", borderRadius: 50, fontSize: 11, fontWeight: 600, textDecoration: "none", transition: "all 0.3s", border: `1px solid ${accent}44`, color: accent }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.background = `${accent}15`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = `${accent}44`; e.currentTarget.style.background = "transparent"; }}>
              View Details
            </Link>
            {project.links.map((l, j) => (
              <a key={j} href={l.url} target="_blank" rel="noreferrer"
                onClick={e => e.stopPropagation()}
                style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 12px", borderRadius: 50, fontSize: 11, fontWeight: 600, textDecoration: "none", transition: "all 0.3s", border: `1px solid ${palette.ashGrey}33`, color: palette.ashGrey }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.color = accent; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = `${palette.ashGrey}33`; e.currentTarget.style.color = palette.ashGrey; }}>
                {l.type === "github" ? <GitHubIcon size={11} /> : <ExternalIcon />}
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

export default function Projects() {
  const [filters, setFilters] = useState([]);
  const toggle = (f) => setFilters(p => p.includes(f) ? p.filter(x => x !== f) : [...p, f]);
  const filtered = filters.length === 0 ? ALL_PROJECTS : ALL_PROJECTS.filter(p => filters.some(f => p.categories.includes(f)));

  return (
    <div style={{ paddingTop: 60, minHeight: "100vh", background: palette.jetBlack }}>
      {/* Featured Hero */}
      <section style={{ position: "relative", height: "92vh", display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${palette.darkerBg} 0%, ${accent}15 40%, ${palette.jetBlack} 100%)` }}>
          {FEATURED_PROJECT.cover && (
            <img src={FEATURED_PROJECT.cover} alt={FEATURED_PROJECT.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.18 }} />
          )}
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, ${palette.jetBlack} 0%, ${palette.jetBlack}cc 25%, transparent 60%)` }} />
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to right, ${palette.jetBlack}dd 0%, transparent 50%)` }} />
        </div>
        <div style={{ position: "relative", zIndex: 2, maxWidth: 960, margin: "0 auto", width: "100%", padding: "0 48px 140px" }}>
          <p style={{ color: `${palette.ashGrey}66`, fontSize: 12, fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 8 }}>Featured Project</p>
          <h1 style={{ color: "#fff", fontSize: 48, fontWeight: 800, margin: "0 0 16px", letterSpacing: "-1.5px", lineHeight: 1.1, maxWidth: 600 }}>{FEATURED_PROJECT.title}</h1>
          <p style={{ color: `${palette.ashGrey}bb`, fontSize: 15, lineHeight: 1.7, marginBottom: 20, maxWidth: 520 }}>{FEATURED_PROJECT.desc}</p>
          <div style={{ marginBottom: 24 }}>{FEATURED_PROJECT.tags.map(t => <Tag key={t}>{t}</Tag>)}</div>
          <div style={{ display: "flex", gap: 12 }}>
            <Link to={`/projects/${FEATURED_PROJECT.slug}`} style={{ textDecoration: "none" }}>
              <Button small filled>View Details</Button>
            </Link>
            {FEATURED_PROJECT.links.map((l, i) => (
              <Button key={i} href={l.url} small>
                {l.type === "github" ? <GitHubIcon size={13} /> : <ExternalIcon size={13} />}
                {l.label}
              </Button>
            ))}
          </div>
        </div>
        <ScrollIndicator label="All Projects" />
      </section>

      {/* Filters + Grid */}
      <section style={{ padding: "48px 48px 80px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <FadeIn>
            <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 700, margin: "0 0 20px" }}>All Projects</h2>
            {Object.entries(FILTER_BUCKETS).map(([bucket, items]) => (
              <div key={bucket} style={{ marginBottom: 12 }}>
                <span style={{ color: `${palette.ashGrey}66`, fontSize: 11, fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", marginRight: 12 }}>{bucket}</span>
                <span style={{ display: "inline-flex", gap: 6, flexWrap: "wrap" }}>
                  {items.map(f => <FilterChip key={f} label={f} active={filters.includes(f)} onClick={() => toggle(f)} />)}
                </span>
              </div>
            ))}
            {filters.length > 0 && (
              <button onClick={() => setFilters([])} style={{ background: "none", border: "none", color: accent, fontSize: 12, fontWeight: 600, cursor: "pointer", padding: "8px 0", marginTop: 4 }}>
                Clear all filters
              </button>
            )}
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginTop: 28 }}>
            {filtered.map((p, i) => <ProjectCard key={p.title} project={p} index={i} />)}
            {filtered.length === 0 && (
              <p style={{ color: `${palette.ashGrey}55`, fontSize: 14, gridColumn: "1/-1", textAlign: "center", padding: 40 }}>No projects match the selected filters.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

