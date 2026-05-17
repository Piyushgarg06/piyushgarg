/* ================================================================
   PIYUSH GARG — AI ENGINEER PORTFOLIO
   Interactive JS: Particles, Typewriter, 3D Tilt, Scroll FX
   ================================================================ */

// ===== CURSOR GLOW =====
const glow = document.querySelector('.cursor-glow');
if (glow) {
    window.addEventListener('mousemove', e => {
        glow.style.left = `${e.clientX}px`;
        glow.style.top = `${e.clientY}px`;
    });
}

// ===== PROGRESS BAR =====
const progress = document.querySelector('.progress-bar');
if (progress) {
    window.addEventListener('scroll', () => {
        const h = document.documentElement;
        progress.style.width =
            (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100 + '%';
    });
}

// ===== SCROLL REVEAL (staggered) =====
const reveals = document.querySelectorAll('.reveal');
const revealOnScroll = () => {
    reveals.forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight - 100) {
            el.classList.add('active');
        }
    });
};
window.addEventListener('scroll', revealOnScroll);
revealOnScroll();

// ===== FOOTER YEAR =====
const yearEl = document.getElementById('footerYear');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ===== ENHANCED PARTICLE NETWORK =====
const canvas = document.getElementById('particleCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouseX = null, mouseY = null;
    const isMobile = window.innerWidth < 768;
    let time = 0;

    // Pulse wave state
    let pulseWaves = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createParticles() {
        const area = canvas.width * canvas.height;
        const count = isMobile ? 35 : Math.min(Math.floor(area / 14000), 120);
        particles = [];
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.35,
                vy: (Math.random() - 0.5) * 0.35,
                r: Math.random() * 1.8 + 0.5,
                hue: Math.random() > 0.5 ? 192 : 270,  // cyan or purple
                phase: Math.random() * Math.PI * 2,      // for pulsing
            });
        }
    }

    function spawnPulse() {
        pulseWaves.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: 0,
            maxRadius: 250 + Math.random() * 150,
            speed: 1.5 + Math.random(),
            opacity: 0.15,
        });
    }

    function drawParticles() {
        time += 0.01;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Spawn pulse waves occasionally
        if (Math.random() < 0.003) spawnPulse();

        // Draw pulse waves
        pulseWaves.forEach((pw, idx) => {
            pw.radius += pw.speed;
            pw.opacity = 0.15 * (1 - pw.radius / pw.maxRadius);
            if (pw.radius >= pw.maxRadius) {
                pulseWaves.splice(idx, 1);
                return;
            }
            ctx.beginPath();
            ctx.arc(pw.x, pw.y, pw.radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(0, 212, 255, ${pw.opacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();
        });

        // Update + draw particles
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

            // Mouse repulsion
            if (mouseX !== null) {
                const dx = p.x - mouseX;
                const dy = p.y - mouseY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 160) {
                    p.x += (dx / dist) * 1.0;
                    p.y += (dy / dist) * 1.0;
                }
            }

            // Pulsing opacity
            const pulse = 0.3 + 0.2 * Math.sin(time * 2 + p.phase);

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);

            if (p.hue === 192) {
                ctx.fillStyle = `rgba(0, 212, 255, ${pulse})`;
            } else {
                ctx.fillStyle = `rgba(168, 85, 247, ${pulse * 0.8})`;
            }
            ctx.fill();

            // Subtle glow around larger particles
            if (p.r > 1.2) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
                ctx.fillStyle = p.hue === 192
                    ? `rgba(0, 212, 255, ${pulse * 0.06})`
                    : `rgba(168, 85, 247, ${pulse * 0.05})`;
                ctx.fill();
            }
        });

        // Draw connections
        const maxDist = isMobile ? 85 : 120;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < maxDist) {
                    const alpha = 0.14 * (1 - dist / maxDist);
                    // Blend colors based on connected particles
                    const mixHue = (particles[i].hue + particles[j].hue) / 2;
                    if (mixHue > 230) {
                        ctx.strokeStyle = `rgba(120, 140, 255, ${alpha})`;
                    } else {
                        ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`;
                    }
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.lineWidth = 0.6;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(drawParticles);
    }

    resizeCanvas();
    createParticles();
    drawParticles();

    window.addEventListener('resize', () => {
        resizeCanvas();
        createParticles();
    });

    window.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
}

// ===== TYPEWRITER TERMINAL =====
const terminalBody = document.getElementById('terminalBody');
if (terminalBody) {
    const lines = [
        { text: '$ python portfolio.py', cls: 'prompt' },
        { text: '> Loading modules... ✓', cls: 'success' },
        { text: '> Specialization: AI & ML Engineering', cls: 'output' },
        { text: '> Status: Building the future', cls: 'highlight' },
    ];

    let lineIdx = 0;
    let charIdx = 0;
    let currentEl = null;

    function typeLine() {
        if (lineIdx >= lines.length) return;

        const { text, cls } = lines[lineIdx];

        if (charIdx === 0) {
            currentEl = document.createElement('div');
            currentEl.className = `line ${cls}`;
            terminalBody.appendChild(currentEl);
        }

        if (charIdx < text.length) {
            currentEl.textContent = text.substring(0, charIdx + 1);
            charIdx++;
            setTimeout(typeLine, 25 + Math.random() * 20);
        } else {
            lineIdx++;
            charIdx = 0;
            setTimeout(typeLine, 350);
        }
    }

    // Start after a short delay
    setTimeout(typeLine, 600);
}

// ===== 3D CARD TILT =====
document.querySelectorAll('.project-card, .skill-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rx = ((y - cy) / cy) * -5;
        const ry = ((x - cx) / cx) * 5;

        card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-3px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
        card.style.transition = 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)';
    });

    card.addEventListener('mouseenter', () => {
        card.style.transition = 'transform 0.1s ease';
    });
});
