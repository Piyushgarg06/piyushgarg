const glow = document.querySelector('.cursor-glow');
window.addEventListener('mousemove', e => {
  glow.style.left = `${e.clientX}px`;
  glow.style.top = `${e.clientY}px`;
});

const progress = document.querySelector('.progress-bar');
window.addEventListener('scroll', () => {
  const h = document.documentElement;
  progress.style.width =
    (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100 + '%';
});

const reveals = document.querySelectorAll('.reveal');
const revealOnScroll = () => {
  reveals.forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight - 120) {
      el.classList.add('active');
    }
  });
};
window.addEventListener('scroll', revealOnScroll);
revealOnScroll();
