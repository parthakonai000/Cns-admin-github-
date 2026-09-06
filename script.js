// ══════════════════════════════════════════════════════════════
//  FIXED HEADER LAYOUT ENGINE
//  Dynamically measures ticker + navbar heights and sets:
//  - nav top = ticker height
//  - #home padding-top = ticker height + nav height
//  Runs on load, resize, and orientation change for full
//  responsiveness. Uses ResizeObserver where available.
// ══════════════════════════════════════════════════════════════
(function() {
    const ticker  = document.getElementById('ticker-bar');
    const nav     = document.getElementById('main-nav');
    const hero    = document.getElementById('home');

    function applyHeaderLayout() {
        const tickerH = ticker ? ticker.offsetHeight : 0;
        const navH    = nav    ? nav.offsetHeight    : 0;
        const totalH  = tickerH + navH;

        // Position nav directly below ticker
        if (nav) nav.style.top = tickerH + 'px';

        // Set a CSS variable that the hero-container uses for its top padding
        // Extra breathing room: 40px desktop, 24px mobile
        const extra = window.innerWidth >= 768 ? 40 : 24;
        document.documentElement.style.setProperty('--hero-top-pad', (totalH + extra) + 'px');

        // Apply to hero container directly
        const heroContainer = document.querySelector('.hero-container');
        if (heroContainer) {
            heroContainer.style.paddingTop = (totalH + extra) + 'px';
        }

        // Store CSS vars for scroll-margin-top on anchor sections
        document.documentElement.style.setProperty('--header-height', totalH + 'px');
        document.documentElement.style.setProperty('--ticker-height', tickerH + 'px');
        document.documentElement.style.setProperty('--nav-height', navH + 'px');
    }

    // Run immediately (DOM is ready at this script tag)
    applyHeaderLayout();

    // Re-run after fonts/images load (can shift heights)
    window.addEventListener('load', applyHeaderLayout);

    // Re-run on resize (mobile keyboard, orientation, window resize)
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(applyHeaderLayout, 60);
    });
    window.addEventListener('orientationchange', function() {
        setTimeout(applyHeaderLayout, 200);
    });

    // ResizeObserver: catches any dynamic height changes (e.g. text reflow)
    if (window.ResizeObserver) {
        const ro = new ResizeObserver(function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(applyHeaderLayout, 30);
        });
        if (ticker) ro.observe(ticker);
        if (nav)    ro.observe(nav);
    }
})();

// ── PORTAL MODAL ──────────────────────────────────────────────
// Portal removed — buttons now link directly to student_protal.html

// ── Lucide Icons ──────────────────────────────────────────────
lucide.createIcons();

// ── Page Loader ───────────────────────────────────────────────
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('page-loader').classList.add('hidden');
    }, 700);
});

// ── Mobile Menu ───────────────────────────────────────────────
const btn  = document.getElementById('mobile-menu-btn');
const menu = document.getElementById('mobile-menu');
btn.addEventListener('click', () => menu.classList.toggle('hidden'));
document.querySelectorAll('#mobile-menu a').forEach(l => l.addEventListener('click', () => menu.classList.add('hidden')));

// ── Navbar Scroll Effect (shadow only — top is managed by layout engine) ──
window.addEventListener('scroll', () => {
    const nav = document.getElementById('main-nav');
    if (window.scrollY > 10) { nav.classList.add('shadow-md'); nav.classList.remove('shadow-sm'); }
    else                     { nav.classList.add('shadow-sm'); nav.classList.remove('shadow-md'); }
    document.getElementById('scrollTopBtn').classList.toggle('show', window.scrollY > 400);
});

// ── SCROLL REVEAL ─────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── TYPEWRITER EFFECT ─────────────────────────────────────────
const phrases = [
    'comprehensive schooling from Class 1 to 12',
    'expert coaching for NEET & JEE',
    'mission admission preparation',
    'arts, recitation & co-curriculars',
];
let pi = 0, ci = 0, deleting = false;
const twEl = document.getElementById('typewriterEl');
function typeLoop() {
    const phrase = phrases[pi];
    if (!deleting) {
        twEl.textContent = phrase.substring(0, ci + 1);
        ci++;
        if (ci === phrase.length) { deleting = true; setTimeout(typeLoop, 2000); return; }
        setTimeout(typeLoop, 55);
    } else {
        twEl.textContent = phrase.substring(0, ci - 1);
        ci--;
        if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; setTimeout(typeLoop, 400); return; }
        setTimeout(typeLoop, 28);
    }
}
setTimeout(typeLoop, 1000);

// ── COUNTER ANIMATION ─────────────────────────────────────────
function animateCounter(el) {
    const target = +el.dataset.target;
    const dur    = 1800;
    const step   = 16;
    const inc    = target / (dur / step);
    let current  = 0;
    const timer  = setInterval(() => {
        current += inc;
        if (current >= target) { el.textContent = target; clearInterval(timer); return; }
        el.textContent = Math.floor(current);
    }, step);
}
const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.stat-number').forEach(animateCounter);
            counterObs.unobserve(entry.target);
        }
    });
}, { threshold: 0.4 });
document.querySelectorAll('.stat-card').forEach(c => counterObs.observe(c));

// ── RIPPLE EFFECT ─────────────────────────────────────────────
document.querySelectorAll('.btn-ripple').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left, y = e.clientY - rect.top;
        const ripple = document.createElement('span');
        ripple.classList.add('ripple-effect');
        const size = Math.max(rect.width, rect.height);
        ripple.style.cssText = `width:${size}px;height:${size}px;left:${x-size/2}px;top:${y-size/2}px`;
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 700);
    });
});

// ── FORM: Character Counter ───────────────────────────────────
const msgInput = document.getElementById('message');
const charDisp = document.getElementById('charCount');
if (msgInput) {
    msgInput.addEventListener('input', function() {
        const c = this.value.length;
        charDisp.textContent = `${c} character${c!==1?'s':''}`;
    });
}

// ── FORM: Email Validation ────────────────────────────────────
const emailInput = document.getElementById('email');
const emailIcon  = document.getElementById('emailIcon');
if (emailInput) {
    emailInput.addEventListener('input', function() {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!this.value)          emailIcon.className = 'fas fa-envelope text-gray-400 transition-colors duration-200';
        else if (re.test(this.value)) emailIcon.className = 'fas fa-check-circle text-green-500 transition-colors duration-200';
        else                      emailIcon.className = 'fas fa-exclamation-circle text-red-400 transition-colors duration-200';
    });
}

// ── FORM: WhatsApp Submission ─────────────────────────────────
function sendToWhatsApp(event) {
    event.preventDefault();
    const sb = document.getElementById('submitBtn'), bi = document.getElementById('btnIcon'), bt = document.getElementById('btnText');
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const userMsg = document.getElementById('message').value;
    sb.disabled = true; sb.classList.add('opacity-90','cursor-not-allowed');
    bi.className = 'fas fa-circle-notch fa-spin mr-2 text-xl'; bt.textContent = 'Connecting...';
    setTimeout(() => {
        const phone = "919378029299";
        const base  = "Hello, I'm interested in learning more about Chetana Shiksha Niketan. Could you please provide some more details about your courses or admission process?";
        let msg = `*New Admission Inquiry*\n\n*Name:* ${name}\n*Email:* ${email}\n\n*Message:*\n${base}`;
        if (userMsg.trim()) msg += `\n\n*Customer's Note:*\n${userMsg}`;
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
        sb.disabled = false; sb.classList.remove('opacity-90','cursor-not-allowed');
        bi.className = 'fab fa-whatsapp mr-2 text-xl group-hover:scale-110 transition-transform duration-200';
        bt.textContent = 'Send a Message';
    }, 800);
}
