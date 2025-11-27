// Case Study Template JavaScript
document.addEventListener('DOMContentLoaded', function() {
  const heroImage = document.querySelector('.hero-case-image');
  const caseTitle = document.querySelector('.case-title');
  const heroBadges = document.querySelectorAll('.hero-case-badge');

  if (heroImage && typeof ColorThief !== 'undefined') {
    const colorThief = new ColorThief();

    const applyGradient = (imgElement) => {
      try {
        // Get a palette of 2 colors from the image
        const palette = colorThief.getPalette(imgElement, 2);
        if (palette && palette.length >= 2) {
          const color1 = `rgb(${palette[0].join(',')})`;
          const color2 = `rgb(${palette[1].join(',')})`;

          if (caseTitle) {
            caseTitle.style.background = `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`;
            caseTitle.style.webkitBackgroundClip = 'text';
            caseTitle.style.backgroundClip = 'text';
            caseTitle.style.webkitTextFillColor = 'transparent';
          }

          if (heroBadges.length > 0) {
            heroBadges.forEach(badgeContainer => {
              const badges = badgeContainer.querySelectorAll('.badge');
              badges.forEach(badge => {
                badge.style.backgroundColor = color1;
              });
            });
          }
        }
      } catch (e) {
        console.error("Error applying color thief gradient:", e);
        // Fallback to default styling if there's an error
        caseTitle.style.background = '';
      }
    };

    // Ensure the image is loaded before trying to extract colors
    if (heroImage.complete) {
      applyGradient(heroImage);
    } else {
      heroImage.addEventListener('load', function() {
        applyGradient(this);
      });
    }
  }

  // Badge Hover Logic
  // Function to darken an RGB color
  function darkenColor(rgbString, percent) {
    const rgb = rgbString.match(/\d+/g).map(Number);
    const p = percent / 100;
    const r = Math.max(0, Math.floor(rgb[0] * (1 - p)));
    const g = Math.max(0, Math.floor(rgb[1] * (1 - p)));
    const b = Math.max(0, Math.floor(rgb[2] * (1 - p)));
    return `rgb(${r}, ${g}, ${b})`;
  }

  // Use a MutationObserver to watch for style changes on the badges from Color Thief.
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
        const badge = mutation.target;

        if (badge.classList.contains('badge') && badge.style.backgroundColor && !badge.dataset.hoverInitialized) {
          badge.dataset.hoverInitialized = 'true'; // Prevent re-attaching listeners
          const originalColor = badge.style.backgroundColor;
          const hoverColor = darkenColor(originalColor, 15);

          badge.addEventListener('mouseenter', () => {
            badge.style.backgroundColor = hoverColor;
            badge.style.transition = 'background-color 0.2s ease-in-out';
          });

          badge.addEventListener('mouseleave', () => {
            badge.style.backgroundColor = originalColor;
          });
        }
      }
    }
  });
  document.querySelectorAll('.badge').forEach(badge => {
    observer.observe(badge, { attributes: true });
  }

  // GSAP Animations
  gsap.registerPlugin(ScrollTrigger);

  // Scroll progress bar
  gsap.to('.scroll-progress-bar', {
    scrollTrigger: {
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1
    },
    scaleX: 1,
    ease: 'none'
  });

  // Hero animations
  const heroTimeline = gsap.timeline();
  
  if (document.querySelector('.case-title')) {
    heroTimeline
      .from('.case-title', {
        duration: 1.2,
        y: 100,
        opacity: 0,
        ease: 'power3.out'
      })
      .from('.case-subtitle', {
        duration: 1,
        y: 50,
        opacity: 0,
        ease: 'power3.out'
      }, '-=0.8')
      .from('.hero-mockup', {
        duration: 1,
        y: 50,
        opacity: 0,
        ease: 'power3.out'
      }, '-=0.6')
      .from('.meta-item', {
        duration: 0.8,
        y: 30,
        opacity: 0,
        stagger: 0.1,
        ease: 'power3.out'
      }, '-=0.4');
  }

  // Section animations
  gsap.utils.toArray('.section-title').forEach(title => {
    gsap.from(title, {
      scrollTrigger: {
        trigger: title,
        start: 'top 85%'
      },
      duration: 1,
      y: 50,
      opacity: 0,
      ease: 'power3.out'
    });
  });

  // Section descriptions
  gsap.utils.toArray('.section-description').forEach(desc => {
    gsap.from(desc, {
      scrollTrigger: {
        trigger: desc,
        start: 'top 85%'
      },
      duration: 0.8,
      y: 30,
      opacity: 0,
      delay: 0.2,
      ease: 'power3.out'
    });
  });

  // Cards animations
  gsap.utils.toArray('.problem-card, .solution-card').forEach(card => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 85%'
      },
      duration: 0.8,
      y: 50,
      opacity: 0,
      ease: 'power3.out'
    });
  });

  // Process timeline
  gsap.utils.toArray('.process-step').forEach(step => {
    gsap.from(step, {
      scrollTrigger: {
        trigger: step,
        start: 'top 85%'
      },
      duration: 1,
      y: 50,
      opacity: 0,
      ease: 'power3.out'
    });
  });

  // Gallery items
  if (document.querySelector('.image-gallery')) {
    gsap.from('.gallery-item', {
      scrollTrigger: {
        trigger: '.image-gallery',
        start: 'top 85%'
      },
      duration: 0.8,
      y: 50,
      opacity: 0,
      stagger: 0.1,
      ease: 'power3.out'
    });
  }

  // Before/After comparison
  if (document.querySelector('.before-after')) {
    gsap.from('.comparison-item', {
      scrollTrigger: {
        trigger: '.before-after',
        start: 'top 85%'
      },
      duration: 1,
      x: (index) => index === 0 ? -50 : 50,
      opacity: 0,
      stagger: 0.3,
      ease: 'power3.out'
    });
  }

  // Results grid animation
  if (document.querySelector('.results-grid')) {
    gsap.from('.result-item', {
      scrollTrigger: {
        trigger: '.results-grid',
        start: 'top 85%'
      },
      duration: 0.8,
      y: 50,
      opacity: 0,
      stagger: 0.2,
      ease: 'power3.out'
    });
  }

  // Section numbers animation
  gsap.utils.toArray('.section-number').forEach(number => {
    gsap.from(number, {
      scrollTrigger: {
        trigger: number,
        start: 'top 90%'
      },
      duration: 0.6,
      y: 20,
      opacity: 0,
      ease: 'power3.out'
    });
  });

  // CTA section animation
  if (document.querySelector('.cta-section')) {
    gsap.from('.cta-title, .cta-text', {
      scrollTrigger: {
        trigger: '.cta-section',
        start: 'top 85%'
      },
      duration: 1,
      y: 30,
      opacity: 0,
      stagger: 0.2,
      ease: 'power3.out'
    });

    gsap.from('.cta-buttons .btn-primary, .cta-buttons .btn-secondary', {
      scrollTrigger: {
        trigger: '.cta-buttons',
        start: 'top 85%'
      },
      duration: 0.8,
      y: 30,
      opacity: 0,
      stagger: 0.2,
      delay: 0.4,
      ease: 'power3.out'
    });
  }

  // Smooth scrolling for navigation
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

  // Navbar scroll effect
  let lastScrollY = window.scrollY;
  
  window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 100) {
      navbar.style.transform = currentScrollY > lastScrollY ? 'translateY(-100%)' : 'translateY(0)';
    } else {
      navbar.style.transform = 'translateY(0)';
    }
    
    lastScrollY = currentScrollY;
  });

});