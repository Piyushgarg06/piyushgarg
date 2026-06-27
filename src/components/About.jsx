import AnimatedSection from "./AnimatedSection";
import { data } from "../constants/data";

export default function About() {
  return (
    <section id="about" style={{ padding: "120px 0" }}>
      <div className="container">
        <AnimatedSection>
          {/* Section label */}
          <p
            className="font-display"
            style={{
              fontSize: 13,
              color: "var(--muted)",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              marginBottom: 48,
            }}
          >
            About
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: 64,
            }}
            className="about-grid"
          >
            {/* Bio — left column */}
            <div>
              {data.about.bio.map((paragraph, i) => (
                <p
                  key={i}
                  style={{
                    fontSize: 16,
                    lineHeight: 1.8,
                    color: "var(--text)",
                    marginBottom: i < data.about.bio.length - 1 ? 28 : 0,
                  }}
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Details — right column */}
            <dl style={{ margin: 0 }}>
              {data.about.details.map((item, i) => (
                <div
                  key={item.label}
                  style={{
                    padding: "20px 0",
                    borderTop:
                      i === 0 ? "1px solid var(--border)" : "none",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  <dt
                    className="font-mono"
                    style={{
                      fontSize: 11,
                      color: "var(--muted)",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      marginBottom: 6,
                    }}
                  >
                    {item.label}
                  </dt>
                  <dd
                    style={{
                      fontSize: 15,
                      color: "var(--text)",
                      margin: 0,
                      lineHeight: 1.5,
                    }}
                  >
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </AnimatedSection>

        <style>{`
          @media (min-width: 768px) {
            .about-grid {
              grid-template-columns: 3fr 2fr !important;
            }
          }
        `}</style>
      </div>
    </section>
  );
}
