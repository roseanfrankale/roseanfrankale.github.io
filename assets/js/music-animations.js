 gsap.registerPlugin(ScrollTrigger);

// Hero fade in
gsap.from("#hero h1, #hero p", {
  opacity: 0,
  y: 50,
  duration: 1,
  stagger: 0.3,
});

// Section reveal for each band showcase
gsap.utils.toArray(".music-showcase").forEach((section) => {
  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top 80%",
      toggleActions: "play none none none",
    },
  });

  timeline
    .from(section.querySelector('.band-title'), { y: 50, opacity: 0, duration: 0.8, ease: 'power3.out' })
    .from(section.querySelectorAll('.band-meta, .band-description, .notable-performances, .performance-list'), { y: 30, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' }, '-=0.5')
    .from(section.querySelector('.video-card, .img-fluid'), { y: 50, opacity: 0, duration: 1, ease: 'power3.out' }, '-=0.8');
});

// --- Video Lightbox Logic ---
document.addEventListener('DOMContentLoaded', function() {
  const videoCards = document.querySelectorAll('.video-card');
  const lightbox = document.getElementById('lightbox');
  const lightboxVideo = document.getElementById('lightbox-video');
  const closeBtn = document.getElementById('lightbox-close');

  if (!lightbox || !lightboxVideo || !closeBtn) return;

  function showLightbox(youtubeId) {
    lightboxVideo.src = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`;
    lightbox.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function hideLightbox() {
    lightboxVideo.src = ''; // Stop the video
    lightbox.classList.add('hidden');
    document.body.style.overflow = '';
  }

  videoCards.forEach(card => {
    card.addEventListener('click', function() {
      const youtubeId = this.dataset.youtubeId;
      if (youtubeId) {
        showLightbox(youtubeId);
      }
    });
  });

  closeBtn.addEventListener('click', hideLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      hideLightbox();
    }
  });

  // Add keyboard support to close with Escape key
  document.addEventListener('keydown', function(e) {
    // Check if the lightbox is not hidden and the Escape key is pressed
    if (!lightbox.classList.contains('hidden') && e.key === 'Escape') {
      hideLightbox();
    }
  });
});