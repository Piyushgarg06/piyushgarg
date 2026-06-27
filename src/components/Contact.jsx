import { data } from "../constants/data";

export default function Contact() {

  const links = [
    {
      label: "Email",
      href: `https://mail.google.com/mail/?view=cm&fs=1&to=${data.contact.email}`,
      external: true,
    },
    { label: "GitHub", href: data.contact.github, external: true },
    { label: "LinkedIn", href: data.contact.linkedin, external: true },
  ];

  return (
    <section id="contact" style={{ padding: "120px 0" }}>
      <div className="container">
        {/* Heading */}
        <h2
          className="font-display"
          style={{
            fontSize: "clamp(36px, 6vw, 72px)",
            fontWeight: 700,
            color: "var(--text)",
            lineHeight: 1.05,
            marginBottom: 28,
            letterSpacing: "-0.02em",
          }}
        >
          Let's work together.
        </h2>

        {/* Description */}
        <p
          style={{
            fontSize: 16,
            color: "var(--muted)",
            lineHeight: 1.8,
            maxWidth: 600,
            marginBottom: 44,
          }}
        >
          I'm currently looking for AI / ML internships. If you're building
          something at the intersection of language models, graphs, or developer
          tooling — let's talk.
        </p>

        {/* Links */}
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "center" }}>
          {links.map((link, i) => (
            <span key={link.label} style={{ display: "flex", alignItems: "center", gap: 24 }}>
              <a
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                onClick={link.onClick}
                className="contact-link"
              >
                {link.label}
              </a>
              {i < links.length - 1 && (
                <span style={{ color: "var(--border)", userSelect: "none" }}>·</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
