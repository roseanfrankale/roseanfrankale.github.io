document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Reveal targets: feature content, pricing cards, and live preview panel
  const revealTargets = document.querySelectorAll('.cl-reveal, #live-preview .cl-glass-card, #pricing .cl-glass-card');
  
  if (!prefersReducedMotion && revealTargets.length > 0 && 'IntersectionObserver' in window) {
    revealTargets.forEach((element) => {
      const isRevealPanel = element.classList.contains('cl-reveal-panel');
      element.style.opacity = '0';
      element.style.transform = isRevealPanel ? 'translateY(26px) scale(0.985)' : 'translateY(16px)';
      if (isRevealPanel) {
        element.style.filter = 'blur(2px)';
        element.style.transition = 'opacity 620ms cubic-bezier(0.22, 1, 0.36, 1), transform 620ms cubic-bezier(0.22, 1, 0.36, 1), filter 620ms cubic-bezier(0.22, 1, 0.36, 1)';
      } else {
        element.style.transition = 'opacity 540ms cubic-bezier(0.22, 1, 0.36, 1), transform 540ms cubic-bezier(0.22, 1, 0.36, 1)';
      }
    });

    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }
        const isRevealPanel = entry.target.classList.contains('cl-reveal-panel');
        entry.target.style.opacity = '1';
        entry.target.style.transform = isRevealPanel ? 'translateY(0) scale(1)' : 'translateY(0)';
        if (isRevealPanel) {
          entry.target.style.filter = 'blur(0)';
        }
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

// ─── Live Preview Panel ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const viewPreviewBtn = document.getElementById('view-preview-btn');
  const livePreviewPanel = document.getElementById('live-preview');
  const closePreviewBtn = document.getElementById('close-preview-btn');

  function openPreviewPanel() {
    if (!livePreviewPanel) return;

    // Lazy-load the iframe only on first open
    const iframe = document.getElementById('preview-iframe');
    if (iframe && iframe.dataset.src && !iframe.getAttribute('src')) {
      iframe.setAttribute('src', iframe.dataset.src);
    }

    livePreviewPanel.classList.add('is-open');
    livePreviewPanel.removeAttribute('aria-hidden');

    // Re-init lucide icons inside the revealed section
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // Smooth scroll to the panel after transition starts
    setTimeout(() => {
      livePreviewPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  }

  function closePreviewPanel() {
    if (!livePreviewPanel) return;
    livePreviewPanel.classList.remove('is-open');
    livePreviewPanel.setAttribute('aria-hidden', 'true');

    // Scroll back to the hero button
    if (viewPreviewBtn) {
      setTimeout(() => {
        viewPreviewBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 80);
    }
  }

  if (viewPreviewBtn) {
    viewPreviewBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openPreviewPanel();
    });
  }

  if (closePreviewBtn) {
    closePreviewBtn.addEventListener('click', closePreviewPanel);
  }
});

// ─── Dark Mode Tooltip ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const html = document.documentElement;
  const darkTooltip = document.getElementById('dark-mode-tooltip');
  const themeToggle = document.getElementById('theme-toggle');

  if (!darkTooltip || !themeToggle) return;

  let autoTimeout = null;
  let dismissed = false;

  function showTooltip() {
    if (dismissed || html.getAttribute('data-theme') === 'dark') return;
    darkTooltip.classList.add('is-visible');
  }

  function dismissTooltip() {
    dismissed = true;
    darkTooltip.classList.remove('is-visible');
    if (autoTimeout) clearTimeout(autoTimeout);
  }

  // Auto-show after 2.5s, then auto-dismiss after 5s
  autoTimeout = setTimeout(() => {
    showTooltip();
    // Auto-dismiss 5s after it appears
    autoTimeout = setTimeout(dismissTooltip, 5000);
  }, 2500);

  // Also show immediately on hover (before the timer)
  themeToggle.addEventListener('mouseenter', showTooltip);
  themeToggle.addEventListener('mouseleave', () => {
    // Only hide on mouse-leave if it was shown by hover before the auto-timer fired
    if (!dismissed && darkTooltip.classList.contains('is-visible')) {
      // Keep it visible — let auto-dismiss or click handle it
    }
  });

  // Dismiss when the theme toggle is clicked (they acted on it)
  themeToggle.addEventListener('click', dismissTooltip, { once: true });

  // Clicking the tooltip itself also counts as dismissal
  darkTooltip.addEventListener('click', dismissTooltip);
});