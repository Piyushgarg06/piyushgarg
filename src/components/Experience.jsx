import { data } from "../constants/data";

export default function Experience() {
  return (
    <section id="experience" style={{ padding: "120px 0" }}>
      <div className="container">
        {/* Section heading */}
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
          Experience
        </p>

        {/* Timeline rows — no animations per spec */}
        <div style={{ borderTop: "1px solid var(--border)" }}>
          {data.experience.map((item, i) => (
            <div
              key={i}
              style={{
                padding: "28px 0",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  flexWrap: "wrap",
                  gap: 8,
                  marginBottom: 10,
                }}
              >
                <h3
                  className="font-display"
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: "var(--text)",
                    lineHeight: 1.3,
                  }}
                >
                  {item.role}
                  <span
                    style={{
                      color: "var(--muted)",
                      fontWeight: 400,
                      marginLeft: 8,
                    }}
                  >
                    — {item.org}
                  </span>
                </h3>
                <span
                  className="font-mono"
                  style={{ fontSize: 12, color: "var(--muted)", flexShrink: 0 }}
                >
                  {item.period}
                </span>
              </div>
              <p
                style={{
                  fontSize: 14,
                  color: "var(--muted)",
                  lineHeight: 1.65,
                  maxWidth: 600,
                }}
              >
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
