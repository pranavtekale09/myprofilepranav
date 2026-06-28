/* =========================================
   PRANAV TEKALE PORTFOLIO — JAVASCRIPT
   ========================================= */

/* ── Navbar scroll behavior ── */
const navbar = document.getElementById('navbar');
const scrollTopBtn = document.getElementById('scrollTop');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  // Navbar shadow
  navbar.classList.toggle('scrolled', scrollY > 20);

  // Scroll top button
  scrollTopBtn.classList.toggle('show', scrollY > 400);

  // Active nav link
  let current = '';
  sections.forEach(sec => {
    if (scrollY + 100 >= sec.offsetTop) current = sec.getAttribute('id');
  });
  navLinks.forEach(l => {
    l.classList.toggle('active', l.getAttribute('href') === `#${current}`);
  });
});

scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ── Hamburger ── */
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinksEl.classList.toggle('open');
});
navLinksEl.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinksEl.classList.remove('open');
  });
});

/* ── Typewriter Effect ── */
const roles = [
  'Computer Science Student',
  'Python Developer',
  'Web Developer',
  'AI Enthusiast',
  'Problem Solver'
];
let roleIdx = 0, charIdx = 0, deleting = false;
const typedEl = document.getElementById('typedRole');

function typeWriter() {
  const current = roles[roleIdx];
  if (!deleting) {
    typedEl.textContent = current.slice(0, ++charIdx);
    if (charIdx === current.length) {
      deleting = true;
      setTimeout(typeWriter, 2000);
      return;
    }
  } else {
    typedEl.textContent = current.slice(0, --charIdx);
    if (charIdx === 0) {
      deleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
    }
  }
  setTimeout(typeWriter, deleting ? 55 : 90);
}
setTimeout(typeWriter, 800);

/* ── Animated Canvas Background ── */
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let W, H, particles = [];

function resizeCanvas() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.r = Math.random() * 1.5 + 0.3;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.alpha = Math.random() * 0.5 + 0.1;
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(91,108,255,${this.alpha})`;
    ctx.fill();
  }
}

for (let i = 0; i < 100; i++) particles.push(new Particle());

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 130) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(91,108,255,${0.08 * (1 - dist / 130)})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

function animateCanvas() {
  ctx.clearRect(0, 0, W, H);
  // Gradient overlay
  const grad = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.8);
  grad.addColorStop(0, 'rgba(91,108,255,0.04)');
  grad.addColorStop(1, 'rgba(10,12,24,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
  drawConnections();
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateCanvas);
}
animateCanvas();

/* ── Intersection Observer — Reveal + Skill bars ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger sibling reveals
      const siblings = Array.from(entry.target.parentElement.children)
        .filter(el => el.classList.contains('reveal'));
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
        // Animate skill bars inside
        entry.target.querySelectorAll('.skill-fill').forEach(bar => {
          bar.style.width = bar.dataset.w + '%';
        });
        // Animate lang bars inside
        entry.target.querySelectorAll('.lang-fill').forEach(bar => {
          bar.style.width = bar.dataset.w + '%';
          bar.style.backgroundColor = bar.dataset.color;
        });
        // Count up stats
        entry.target.querySelectorAll('.stat-num').forEach(el => {
          animateCount(el, parseInt(el.dataset.count));
        });
      }, idx * 100);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── Count-up ── */
function animateCount(el, target) {
  const duration = 1400;
  const start = performance.now();
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}

/* ── Certificate Modal ── */
function openCertModal(src) {
  document.getElementById('certModalImg').src = src;
  document.getElementById('certModalDl').href = src;
  document.getElementById('certModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCertModal() {
  document.getElementById('certModal').classList.remove('open');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeCertModal(); });


/* ── Contact Form ── */
const form = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = form.querySelector('.form-submit');
  btn.textContent = 'Sending…';
  btn.disabled = true;
  setTimeout(() => {
    btn.style.display = 'none';
    formSuccess.classList.add('show');
    form.reset();
  }, 1500);
});

/* ── Smooth scroll for anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 72;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
