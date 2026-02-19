document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Reveal targets: feature cards, gallery slides, pricing cards, and live preview
  const revealTargets = document.querySelectorAll('.cl-reveal, #live-preview .cl-glass-card, #pricing .cl-glass-card, #screens .cl-slide');
  
  if (!prefersReducedMotion && revealTargets.length > 0 && 'IntersectionObserver' in window) {
    revealTargets.forEach((element) => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(16px)';
      element.style.transition = 'opacity 540ms cubic-bezier(0.22, 1, 0.36, 1), transform 540ms cubic-bezier(0.22, 1, 0.36, 1)';
    });

    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        currentObserver.unobserve(entry.target);
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });

    revealTargets.forEach((element) => observer.observe(element));
  }

  // Lightbox Functionality
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');
  const triggers = Array.from(document.querySelectorAll('.lightbox-trigger'));

  if (!lightbox || !lightboxImg || triggers.length === 0) {
    return;
  }

  const images = triggers
    .map((trigger) => trigger.querySelector('img'))
    .filter((img) => img && img.getAttribute('src'));

  if (images.length === 0) {
    return;
  }

  let currentIndex = 0;

  const displayImage = (index) => {
    if (index < 0 || index >= images.length) {
      return;
    }

    currentIndex = index;
    const source = images[index].getAttribute('src');
    const altText = images[index].getAttribute('alt') || 'ChronoLens screen';
    lightboxImg.setAttribute('src', source);
    lightboxImg.setAttribute('alt', altText);
  };

  const openLightbox = (index) => {
    displayImage(index);
    lightbox.classList.remove('hidden');
    requestAnimationFrame(() => lightbox.classList.remove('opacity-0'));
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.add('opacity-0');
    setTimeout(() => {
      lightbox.classList.add('hidden');
      document.body.style.overflow = '';
    }, 260);
  };

  const showNext = () => {
    displayImage((currentIndex + 1) % images.length);
  };

  const showPrev = () => {
    displayImage((currentIndex - 1 + images.length) % images.length);
  };

  triggers.forEach((trigger, index) => {
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      openLightbox(index);
    });

    trigger.setAttribute('tabindex', '0');
    trigger.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openLightbox(index);
      }
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', showNext);
  }
  if (prevBtn) {
    prevBtn.addEventListener('click', showPrev);
  }

  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (lightbox.classList.contains('hidden')) {
      return;
    }

    if (event.key === 'Escape') {
      closeLightbox();
    } else if (event.key === 'ArrowRight') {
      showNext();
    } else if (event.key === 'ArrowLeft') {
      showPrev();
    }
  });
});