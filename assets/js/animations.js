// Enhanced animations.js - Complete GSAP animations for portfolio
document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(ScrollTrigger);

  // === HERO ANIMATIONS ===
  gsap.timeline()
    .from('.hero-title', {
      duration: 1,
      y: 50,
      opacity: 0,
      ease: 'power3.out'
    })
    .from('.hero-subtext', {
      duration: 1,
      y: 30,
      opacity: 0,
      ease: 'power3.out'
    }, '-=0.8') // Overlap with previous animation
    .from('.custom-btn-outline', {
      duration: 0.8,
      y: 30,
      stagger: 0.2,
      ease: 'power3.out'
    }, '-=0.6'); // Overlap slightly

  // === PROJECT CARDS ANIMATION ===
  gsap.from('.project-card', {
    scrollTrigger: {
      trigger: '#work',
      start: 'top 80%',
      once: true
    },
    duration: 0.8,
    y: 50,
    opacity: 0,
    stagger: 0.2,
    ease: 'power3.out'
  });

  // === ABOUT LEFT COLUMN ===
  gsap.from("#about .about-img-wrapper img", {
    scrollTrigger: {
      trigger: "#about",
      start: "top 80%",
      once: true
    },
    y: 60,
    opacity: 0,
    duration: 1,
    ease: "power3.out"
  });

  gsap.from("#about h2", {
    scrollTrigger: {
      trigger: "#about",
      start: "top 80%",
      once: true
    },
    x: -40,
    opacity: 0,
    delay: 0.2,
    duration: 1,
    ease: "power3.out"
  });

  gsap.from("#about p.lead", {
    scrollTrigger: {
      trigger: "#about",
      start: "top 80%",
      once: true
    },
    y: 30,
    opacity: 0,
    delay: 0.4,
    duration: 1,
    ease: "power3.out"
  });

  gsap.from("#about .custom-btn", {
    scrollTrigger: {
      trigger: "#about",
      start: "top 80%",
      once: true
    },
    scale: 0.8,
    y: 20,
    delay: 0.6,
    duration: 0.6,
    stagger: 0.2,
    ease: "back.out(1.7)"
  });

  // === ABOUT: Skills List ===
  gsap.from("#about-skills-list .col", {
    opacity: 0,
    y
    : 20,
    duration: 0.4,
    stagger: 0.05,
    ease: "power2.out",
    scrollTrigger: {
      trigger: "#about-skills-list", scroller: "#about .col-lg-6",
      start: "top 85%",
      once: true
    }
  });

  // === ABOUT: Experience Items ===
  gsap.from(".experience-item", {
    opacity: 0,
    y: 20,
    duration: 0.5,
    stagger: 0.2,
    ease: "power2.out",
    scrollTrigger: {
      trigger: "#about-experience", scroller: "#about .col-lg-6",
      start: "top 85%",
      once: true
    }
  });

  // === GENERIC results-item (if used elsewhere) ===
  gsap.from(".results-item", {
    opacity: 0,
    y: 20,
    duration: 0.5,
    stagger: 0.15,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".results-item",
      start: "top 85%",
      once: true
    }
  });

  // === CONTACT FORM ===
  gsap.from("#hubspot-form", {
    scrollTrigger: {
      trigger: "#hubspot-form",
      start: "top 85%",
      once: true
    },
    opacity: 0,
    y: 40,
    duration: 0.8,
    ease: "power2.out"
  });
});

// === SMOOTH SCROLLING FOR NAVIGATION ===
// Only apply smooth scrolling to nav links on the main page that start with #
document.querySelectorAll('.navbar a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    // If we are not on the index page, let the link behave normally
    if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') return;

    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// === ABOUT SECTION PILLS SCROLLING ===
document.addEventListener('DOMContentLoaded', () => {
  const pills = document.querySelectorAll('#about-pills .nav-link');
  const scrollContainer = document.querySelector('#about .col-lg-6');

  if (pills.length && scrollContainer) {
    pills.forEach(pill => {
      pill.addEventListener('click', function(e) {
        e.preventDefault();

        // Handle active state
        pills.forEach(p => p.classList.remove('active'));
        this.classList.add('active');

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          // Calculate position and scroll
          const containerTop = scrollContainer.scrollTop;
          const targetTop = targetElement.offsetTop - scrollContainer.offsetTop - 80; // 80px offset for sticky pills
          scrollContainer.scrollTo({
            top: containerTop + targetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  }
});
