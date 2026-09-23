import AnimatedSection from "./AnimatedSection";
import { data } from "../constants/data";

export default function Contact() {
  const links = [
    {
      label: "Email",
      href: `https://mail.google.com/mail/?view=cm&fs=1&to=${data.contact.email}`,
      external: true,
      shortLabel: data.contact.email,
    },
    {
      label: "GitHub",
      href: data.contact.github,
      external: true,
      shortLabel: "Piyushgarg06",
    },
    {
      label: "LinkedIn",
      href: data.contact.linkedin,
      external: true,
      shortLabel: "piyushgargtech",
    },
  ];

  return (
    <section id="contact" style={{ padding: "96px 0 112px" }}>
      <div className="container">
        <AnimatedSection>
          {/* Section label */}
          <p className="section-label">Get In Touch</p>

          {/* Big editorial heading */}
          <h2
            className="font-display"
            style={{
              fontSize: "clamp(40px, 7vw, 88px)",
              fontWeight: 900,
              color: "var(--text)",
              lineHeight: 1.0,
              marginBottom: 32,
              letterSpacing: "-0.03em",
              maxWidth: 800,
            }}
          >
            Let's work
            <br />
            together.
          </h2>

          {/* Context copy */}
          <p
            style={{
              fontSize: 16,
              color: "var(--text-2)",
              lineHeight: 1.8,
              maxWidth: 560,
              marginBottom: 52,
              fontWeight: 300,
            }}
          >
            I'm currently looking for AI&nbsp;/ ML internships. If you're
            building something at the intersection of language models, graphs,
            or developer tooling — let's talk.
          </p>

          {/* Links — vertical on mobile, horizontal on desktop */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 0,
            }}
            className="contact-links"
          >
            {links.map((link, i) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                aria-label={`${link.label}: ${link.shortLabel}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "20px 0",
                  borderTop: i === 0 ? "1px solid var(--border)" : "none",
                  borderBottom: "1px solid var(--border)",
                  textDecoration: "none",
                  color: "inherit",
                  transition: "background 0.15s, padding-left 0.2s",
                  position: "relative",
                  overflow: "hidden",
                  cursor: "none",
                }}
                className="contact-row"
                onMouseEnter={(e) => {
                  e.currentTarget.style.paddingLeft = "12px";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.paddingLeft = "0px";
                }}
              >
                {/* Accent left fill */}
                <span
                  aria-hidden="true"
                  className="contact-row-fill"
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 2,
                    background: "var(--accent)",
                    transform: "scaleY(0)",
                    transformOrigin: "bottom",
                    transition: "transform 0.22s ease-out",
                  }}
                />

                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: 10,
                      color: "var(--muted)",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      minWidth: 64,
                    }}
                  >
                    {link.label}
                  </span>
                  <span
                    style={{
                      fontSize: 16,
                      color: "var(--text)",
                      fontWeight: 400,
                    }}
                  >
                    {link.shortLabel}
                  </span>
                </div>

                <span
                  aria-hidden="true"
                  style={{
                    fontSize: 18,
                    color: "var(--muted)",
                    transition: "color 0.15s, transform 0.15s",
                  }}
                  className="contact-arrow"
                >
                  ↗
                </span>
              </a>
            ))}
          </div>
        </AnimatedSection>
      </div>

      <style>{`
        .contact-row:hover .contact-row-fill {
          transform: scaleY(1);
        }
        .contact-row:hover .contact-arrow {
          color: var(--accent);
          transform: translate(2px, -2px);
        }
        @media (min-width: 640px) {
          .contact-links {
            max-width: 640px;
          }
        }
      `}</style>
    </section>
  );
}
