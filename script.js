/* =====================================================
   CHARLYSE JOBE — PORTFOLIO
   JavaScript — same features, toned down particles
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // =====================================================
    // 1. Particle Background (subtle)
    // =====================================================
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.3;
            this.vy = (Math.random() - 0.5) * 0.3;
            this.radius = Math.random() * 1.2 + 0.4;
            this.opacity = Math.random() * 0.3 + 0.05;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(96, 165, 250, ${this.opacity})`;
            ctx.fill();
        }
    }

    function initParticles() {
        const count = Math.min(Math.floor((canvas.width * canvas.height) / 25000), 50);
        particles = [];
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function drawConnections() {
        const maxDist = 130;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < maxDist) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(96, 165, 250, ${(1 - dist / maxDist) * 0.07})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        drawConnections();
        requestAnimationFrame(animate);
    }

    resizeCanvas();
    initParticles();
    animate();
    window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });

    // =====================================================
    // 2. Typing Animation
    // =====================================================
    const typedElement = document.getElementById('typed-text');
    const words = [' Engineer', ' Analyst', ' Specialist'];
    let wordIndex = 0, charIndex = 0, isDeleting = false, speed = 100;

    function typeEffect() {
        const word = words[wordIndex];
        if (isDeleting) {
            typedElement.textContent = word.substring(0, charIndex - 1);
            charIndex--;
            speed = 50;
        } else {
            typedElement.textContent = word.substring(0, charIndex + 1);
            charIndex++;
            speed = 100;
        }

        if (!isDeleting && charIndex === word.length) {
            isDeleting = true;
            speed = 2000;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            speed = 400;
        }
        setTimeout(typeEffect, speed);
    }

    setTimeout(typeEffect, 1000);

    // =====================================================
    // 3. Navbar
    // =====================================================
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('.section, .hero');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);

        let current = '';
        sections.forEach(s => {
            if (window.scrollY >= s.offsetTop - 200) current = s.id;
        });
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + current);
        });
    }, { passive: true });

    // =====================================================
    // 4. Mobile Nav
    // =====================================================
    const navToggle = document.getElementById('nav-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (navToggle && mobileMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // =====================================================
    // 5. Scroll Reveal
    // =====================================================
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));

    // =====================================================
    // 6. Counter Animation
    // =====================================================
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target);
                const start = performance.now();
                const duration = 1800;

                function update(now) {
                    const progress = Math.min((now - start) / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    const val = Math.floor(eased * target);
                    entry.target.textContent = target >= 1000 ? val.toLocaleString() : val;
                    if (progress < 1) requestAnimationFrame(update);
                    else entry.target.textContent = target >= 1000 ? target.toLocaleString() : target;
                }

                requestAnimationFrame(update);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number').forEach(el => counterObserver.observe(el));

    // =====================================================
    // 7. Language Bars
    // =====================================================
    const langObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('animated'), 200);
                langObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.language-fill').forEach(el => langObserver.observe(el));

    // =====================================================
    // 8. Smooth Scroll
    // =====================================================
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(a.getAttribute('href'));
            if (target) {
                window.scrollTo({ top: target.offsetTop - 75, behavior: 'smooth' });
            }
        });
    });

    // =====================================================
    // 9. Project Modals
    // =====================================================
    const overlay = document.getElementById('modal-overlay');
    const projectCards = document.querySelectorAll('.project-card[data-modal]');

    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal || !overlay) return;
        overlay.classList.add('active');
        modal.style.display = 'block';
        document.body.classList.add('modal-open');
        // Trigger reflow then animate
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                modal.classList.add('active');
            });
        });
    }

    function closeAllModals() {
        document.querySelectorAll('.project-modal').forEach(m => {
            m.classList.remove('active');
            setTimeout(() => { m.style.display = 'none'; }, 350);
        });
        overlay.classList.remove('active');
        document.body.classList.remove('modal-open');
    }

    projectCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Don't open modal if clicking a link inside the card
            if (e.target.closest('a')) return;
            const modalId = card.dataset.modal;
            if (modalId) openModal(modalId);
        });
    });

    if (overlay) {
        overlay.addEventListener('click', closeAllModals);
    }

    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAllModals();
    });

});
