import AnimatedSection from "./AnimatedSection";
import { data } from "../constants/data";

export default function Experience() {
  // MNB Research entry has been removed from data.js per user request.
  // Section will only show if there are experience entries.
  if (!data.experience || data.experience.length === 0) return null;

  return (
    <section id="experience" style={{ padding: "96px 0" }}>
      <div className="container">
        <AnimatedSection>
          {/* Section label */}
          <p className="section-label">Experience</p>

          <div style={{ borderTop: "1px solid var(--border)" }}>
            {data.experience.map((item, i) => (
              <div
                key={i}
                style={{
                  padding: "32px 0",
                  borderBottom: "1px solid var(--border)",
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: 16,
                }}
                className="exp-row"
              >
                {/* Top: role + period */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    gap: 12,
                  }}
                >
                  <div>
                    <h3
                      className="font-display"
                      style={{
                        fontSize: 20,
                        fontWeight: 700,
                        color: "var(--text)",
                        lineHeight: 1.25,
                        marginBottom: 4,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {item.role}
                    </h3>
                    <span
                      className="font-mono"
                      style={{
                        fontSize: 11,
                        color: "var(--muted)",
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                      }}
                    >
                      {item.org}
                    </span>
                  </div>

                  {/* Period chip */}
                  <span
                    className="font-mono"
                    style={{
                      fontSize: 11,
                      color: "var(--accent)",
                      border: "1px solid var(--accent)",
                      borderRadius: 2,
                      padding: "3px 8px",
                      letterSpacing: "0.04em",
                      whiteSpace: "nowrap",
                      alignSelf: "flex-start",
                      opacity: 0.8,
                    }}
                  >
                    {item.period}
                  </span>
                </div>

                {/* Description */}
                <p
                  style={{
                    fontSize: 14,
                    color: "var(--text-2)",
                    lineHeight: 1.7,
                    maxWidth: 640,
                    fontWeight: 300,
                  }}
                >
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
