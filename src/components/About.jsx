import AnimatedSection from "./AnimatedSection";
import { data } from "../constants/data";

export default function About() {
  return (
    <section id="about" style={{ padding: "112px 0 96px" }}>
      <div className="container">
        <AnimatedSection>
          {/* Section label */}
          <p className="section-label">About</p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "56px 72px",
            }}
            className="about-grid"
          >
            {/* Bio — first paragraph slightly larger, rest step down */}
            <div>
              {data.about.bio.map((paragraph, i) => (
                <p
                  key={i}
                  style={{
                    fontSize: i === 0 ? 17 : 15,
                    lineHeight: 1.82,
                    color: i === 0 ? "var(--text)" : "var(--text-2)",
                    marginBottom: i < data.about.bio.length - 1 ? 28 : 0,
                    fontWeight: i === 0 ? 400 : 300,
                  }}
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Details — right column with left border on desktop */}
            <dl
              className="about-details"
              style={{ margin: 0 }}
            >
              {data.about.details.map((item, i) => (
                <div
                  key={item.label}
                  style={{
                    padding: "18px 0",
                    borderTop: i === 0 ? "1px solid var(--border)" : "none",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  <dt
                    className="font-mono"
                    style={{
                      fontSize: 10,
                      color: "var(--muted)",
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                      marginBottom: 6,
                    }}
                  >
                    {item.label}
                  </dt>
                  <dd
                    style={{
                      fontSize: 14,
                      color: "var(--text)",
                      margin: 0,
                      lineHeight: 1.55,
                      fontWeight: 400,
                    }}
                  >
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </AnimatedSection>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .about-grid {
            grid-template-columns: 3fr 2fr !important;
          }
          .about-details {
            padding-left: 32px;
            border-left: 1px solid var(--border);
          }
        }
      `}</style>
    </section>
  );
}
