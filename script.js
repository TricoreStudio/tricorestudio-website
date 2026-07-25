/* ==========================================================================
   TRICORE STUDIO — Main JavaScript
   Structure:
     1. Preloader
     2. Scroll Progress Bar
     3. Navbar (scroll state, active link, mobile menu)
     4. Theme Toggle (LocalStorage)
     5. Typing Effect
     6. Scroll Reveal (IntersectionObserver)
     7. Animated Counters
     8. Service Filters
     9. Testimonial Track (infinite loop clone)
     10. Contact Form Validation + Success
     11. Newsletter Form
     12. Back To Top
     13. Button Ripple Effect
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------
     1. PRELOADER
  ------------------------------------------------------------------ */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader.classList.add('hidden'), 300);
  });
  // Fallback in case 'load' already fired or takes too long
  setTimeout(() => preloader && preloader.classList.add('hidden'), 2500);

  /* ------------------------------------------------------------------
     2. SCROLL PROGRESS BAR
  ------------------------------------------------------------------ */
  const progressBar = document.getElementById('scroll-progress');
  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
    progressBar.setAttribute('aria-valuenow', Math.round(pct));
  }

  /* ------------------------------------------------------------------
     3. NAVBAR — scroll state, active link, mobile menu
  ------------------------------------------------------------------ */
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  const navLinkItems = navLinks.querySelectorAll('a');
  const sections = document.querySelectorAll('main section[id]');

  function updateNavbarScrollState() {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }

  function updateActiveLink() {
    let current = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 140;
      if (window.scrollY >= sectionTop) current = section.id;
    });
    navLinkItems.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navLinkItems.forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  /* ------------------------------------------------------------------
     4. THEME TOGGLE — persisted via LocalStorage
  ------------------------------------------------------------------ */
  const themeToggle = document.getElementById('theme-toggle');
  const root = document.documentElement;
  const STORAGE_KEY = 'tricore-theme';

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) { /* storage unavailable */ }
  }

  (function initTheme() {
    let saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) { /* storage unavailable */ }
    if (saved) {
      applyTheme(saved || 'dark');
    } else {
      const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
      applyTheme(prefersLight ? 'light' : 'dark');
    }
  })();

  themeToggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });

  /* ------------------------------------------------------------------
     5. TYPING EFFECT (hero eyebrow)
  ------------------------------------------------------------------ */
  const typeTarget = document.getElementById('type-target');
  const typeWords = [
  'Automation',
  'Research',
  'Development',
  'Data',
  'Marketing',
  'Design',
  'Growth'
]
  let wordIndex = 0, charIndex = 0, deleting = false;

  function typeLoop() {
    if (!typeTarget) return;
    const word = typeWords[wordIndex];

    if (!deleting) {
      charIndex++;
      typeTarget.textContent = word.slice(0, charIndex);
      if (charIndex === word.length) {
        deleting = true;
        setTimeout(typeLoop, 1400);
        return;
      }
    } else {
      charIndex--;
      typeTarget.textContent = word.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % typeWords.length;
      }
    }
    setTimeout(typeLoop, deleting ? 45 : 90);
  }
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    typeLoop();
  } else if (typeTarget) {
    typeTarget.textContent = typeWords[0];
  }

  /* ------------------------------------------------------------------
     6. SCROLL REVEAL — IntersectionObserver
  ------------------------------------------------------------------ */
  const revealEls = document.querySelectorAll('[data-reveal]');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach((el) => revealObserver.observe(el));

  /* ------------------------------------------------------------------
     7. ANIMATED COUNTERS
  ------------------------------------------------------------------ */
  const counters = document.querySelectorAll('.stat-number[data-count]');
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const duration = 1600;
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  counters.forEach((el) => counterObserver.observe(el));

  /* ------------------------------------------------------------------
     8. SERVICE FILTERS
  ------------------------------------------------------------------ */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.getAttribute('data-filter');
      serviceCards.forEach((card) => {
        const match = filter === 'all' || card.getAttribute('data-category') === filter;
        card.hidden = !match;
      });
    });
  });

  /* ------------------------------------------------------------------
     9. TESTIMONIAL TRACK — clone cards for a seamless infinite loop
  ------------------------------------------------------------------ */
  const track = document.getElementById('testimonial-track');
  const cloneHost = document.getElementById('testimonial-track-clone');
  if (track && cloneHost) {
    const originalCards = track.querySelectorAll('.testimonial-card');
    originalCards.forEach((card) => {
      const clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      clone.querySelectorAll('a, button').forEach((el) => el.setAttribute('tabindex', '-1'));
      cloneHost.appendChild(clone);
    });
  }

  /* ------------------------------------------------------------------
   10. CONTACT FORM — validation + FormSubmit email
------------------------------------------------------------------ */

const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');
const formError = document.getElementById('form-error-banner');

function validateField(field) {
  const group = field.closest('.form-group');
  let valid = field.checkValidity();

  if (field.type === 'tel' && field.value.trim()) {
    valid = /^[0-9+\-\s()]{7,}$/.test(field.value.trim());
  }

  group.classList.toggle('invalid', !valid);
  return valid;
}

if (contactForm) {

  const fields = contactForm.querySelectorAll(
    'input[required], select[required], textarea[required], input[type="tel"]'
  );

  fields.forEach((field) => {
    field.addEventListener('blur', () => validateField(field));
  });


  contactForm.addEventListener('submit', async (e) => {

    e.preventDefault();

    let formValid = true;

    fields.forEach((field) => {
      if (!validateField(field)) {
        formValid = false;
      }
    });


    if (!formValid) {
      const firstInvalid = contactForm.querySelector(
        '.form-group.invalid input, .form-group.invalid select, .form-group.invalid textarea'
      );

      if (firstInvalid) {
        firstInvalid.focus();
      }

      return;
    }


    // Send form data to FormSubmit
    const formData = new FormData(contactForm);

    try {

      const response = await fetch(contactForm.action, {
        method: "POST",
        body: formData,
        headers: {
          "Accept": "application/json"
        }
      });


      if (response.ok) {

        // Hide form
        contactForm.classList.add('hidden-form');

        // Show success message
        formSuccess.classList.add('visible');

        // Reset form
        contactForm.reset();

      } else {

        throw new Error("Form submission failed");

      }


    } catch (error) {

      // Show error message
      if (formError) {
        formError.classList.add('visible');
      }

    }

  });

}

/* ------------------------------------------------------------------
   NEWSLETTER FORM — FormSubmit
------------------------------------------------------------------ */

const newsletterForm = document.getElementById("newsletter-form");

if (newsletterForm) {

  newsletterForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const input = newsletterForm.querySelector('input[type="email"]');
    const button = newsletterForm.querySelector("button");

    if (!input.checkValidity()) {
      input.reportValidity();
      return;
    }

    const original = button.innerHTML;

    try {

      const response = await fetch(newsletterForm.action, {
        method: "POST",
        body: new FormData(newsletterForm),
        headers: {
          Accept: "application/json"
        }
      });

      if (response.ok) {

        button.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
        `;

        input.value = "";

        setTimeout(() => {
          button.innerHTML = original;
        }, 2200);

      } else {

        alert("Subscription failed. Please try again.");

      }

    } catch (err) {

      alert("Something went wrong. Please try again.");

    }

  });

}


  /* ------------------------------------------------------------------
     12. BACK TO TOP
  ------------------------------------------------------------------ */
  const backToTop = document.getElementById('back-to-top');
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ------------------------------------------------------------------
     13. BUTTON RIPPLE EFFECT
  ------------------------------------------------------------------ */
  document.querySelectorAll('.btn').forEach((btn) => {
    btn.addEventListener('click', function (e) {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

  /* ------------------------------------------------------------------
     SCROLL LISTENERS (throttled via rAF)
  ------------------------------------------------------------------ */
  let ticking = false;
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateScrollProgress();
        updateNavbarScrollState();
        updateActiveLink();
        backToTop.classList.toggle('visible', window.scrollY > 500);
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll);
  onScroll();

  /* ------------------------------------------------------------------
     FOOTER YEAR
  ------------------------------------------------------------------ */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
