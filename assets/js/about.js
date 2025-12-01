document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Tab Functionality ---
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.dataset.target;
      const targetContent = document.getElementById(targetId);

      // Update button styles
      tabButtons.forEach(btn => {
        btn.classList.remove('bg-accent', 'text-white', 'border-accent', 'shadow-lg', 'shadow-accent/25', 'scale-105');
        btn.classList.add('bg-transparent', 'text-text-muted', 'border-gray-200', 'dark:border-gray-800', 'hover:border-accent', 'hover:text-accent');
      });
      button.classList.add('bg-accent', 'text-white', 'border-accent', 'shadow-lg', 'shadow-accent/25', 'scale-105');
      button.classList.remove('bg-transparent', 'text-text-muted', 'border-gray-200', 'dark:border-gray-800', 'hover:border-accent', 'hover:text-accent');

      // Show/hide content with a fade effect
      tabContents.forEach(content => {
        if (content.id === targetId) {
          content.classList.remove('hidden');
          // Simple fade-in animation
          setTimeout(() => content.style.opacity = 1, 10); 
        } else {
          content.classList.add('hidden');
          content.style.opacity = 0;
        }
      });
    });
  });

  // Initialize opacity for tab contents for fade-in effect
  tabContents.forEach(content => {
    if (!content.classList.contains('hidden')) {
      content.style.opacity = 1;
    } else {
      content.style.opacity = 0;
    }
    content.style.transition = 'opacity 0.4s ease-in-out';
  });


  // --- 2. Lightbox Functionality ---
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTrigger = document.querySelector('.lightbox-trigger');
  const lightboxClose = document.getElementById('lightbox-close');

  const openLightbox = () => {
    const profileImgSrc = document.querySelector('.lightbox-trigger img').src;
    lightboxImg.src = profileImgSrc;
    lightbox.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    setTimeout(() => lightbox.classList.remove('opacity-0'), 10); // Fade in
  };

  const closeLightbox = () => {
    lightbox.classList.add('opacity-0');
    document.body.style.overflow = ''; // Restore scrolling
    setTimeout(() => lightbox.classList.add('hidden'), 300); // Hide after fade out
  };

  if (lightboxTrigger) {
    lightboxTrigger.addEventListener('click', openLightbox);
  }
  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }
  if (lightbox) {
    // Close lightbox if clicking on the dark background
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }
  // Close with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !lightbox.classList.contains('hidden')) {
      closeLightbox();
    }
  });

});