document.addEventListener('DOMContentLoaded', function () {
  // Initialize Isotope for the masonry layout
  const isotopeGridElement = document.querySelector('.image-gallery');
  let iso;

  if (isotopeGridElement) {
    imagesLoaded(isotopeGridElement, function () {
      iso = new Isotope(isotopeGridElement, {
        itemSelector: '.gallery-item',
        layoutMode: 'masonry',
        percentPosition: true,
        masonry: {
          columnWidth: '.grid-sizer', // Use .grid-sizer for column width
          gutter: 10
        },
        transitionDuration: '0.6s' // Smooth transitions
      });
    });
  }

  // --- Lightbox Functionality ---
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-img'); // Corrected ID to match HTML
  const closeLightbox = document.getElementById('lightbox-close'); // Corrected ID to match HTML
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  // Select all anchor tags within gallery items for lightbox
  const galleryLinks = document.querySelectorAll('.image-gallery .gallery-item a');
  let currentIndex = 0;

  // Function to show the lightbox with a specific image
  function showLightbox(index) {
    if (galleryLinks.length === 0) return; // No images to show

    if (index < 0) {
      currentIndex = galleryLinks.length - 1; // Loop to last image
    } else if (index >= galleryLinks.length) {
      currentIndex = 0; // Loop to first image
    } else {
      currentIndex = index;
    }

    if (galleryLinks[currentIndex]) {
      lightboxImage.src = galleryLinks[currentIndex].href; // Get full image source from href
      lightbox.classList.remove('hidden');
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
  }

  // Function to hide the lightbox
  function hideLightbox() {
    lightbox.classList.add('hidden');
    document.body.style.overflow = 'auto'; // Restore scrolling
  }

  // Add click listeners to all gallery links
  galleryLinks.forEach((link, index) => {
    link.addEventListener('click', (e) => {
      e.preventDefault(); // Prevent default link behavior
      showLightbox(index);
    });
  });

  // Navigation listeners
  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      showLightbox(currentIndex - 1);
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      showLightbox(currentIndex + 1);
    });
  }

  // Close listeners
  if (closeLightbox) {
    closeLightbox.addEventListener('click', hideLightbox);
  }
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      // Close only if clicking the background or the navigation container itself
      if (e.target === lightbox || e.target.classList.contains('lightbox-nav')) {
        hideLightbox();
      }
    });
  }
});