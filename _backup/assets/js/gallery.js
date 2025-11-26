document.addEventListener("DOMContentLoaded", () => {
  const typeTabs = document.querySelectorAll("#galleryTypeTabs .gallery-filter-btn");
  const galleryGrid = document.querySelector("#gallery-grid");
  let iso;

  let activeTypeFilter = "*";

  // Exit if there's no gallery on the page
  if (!galleryGrid) return;

  // Initialize Isotope after images are loaded
  imagesLoaded(galleryGrid, function () {
    iso = new Isotope(galleryGrid, {
      itemSelector: ".gallery-item",
      layoutMode: "masonry",
      percentPosition: true,
      masonry: {
        columnWidth: ".grid-sizer",
        gutter: 10
      },
      transitionDuration: "0.6s"
    });
  });

  /**
   * Applies filters to the gallery.
   */
  function applyGalleryFilters() {
    if (!iso) return;

    const filterType = activeTypeFilter === "*" ? "*" : `.${activeTypeFilter}`;
    iso.arrange({ filter: filterType });
  }

  // Add click handlers to filter buttons
  if (typeTabs.length > 0) {
    typeTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        typeTabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        activeTypeFilter = tab.dataset.category;
        applyFilters();
      });
    });
  }

  // Lightbox Logic
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const closeBtn = document.getElementById("lightbox-close");
  // Select links from the main gallery AND all relevant sections in case studies
  const galleryLinks = document.querySelectorAll(
    ".gallery-item a, " +
    ".showcase-item a, " +
    ".step-image-wrapper a, " +
    ".hero-mockup a, " + // For the hero image in case studies
    ".visual-comparison a, " + // For before/after images in case studies
    ".process-image-caption a" // For images in the research section of case studies
  );


  let currentIndex = 0;

  /**
   * Shows the lightbox with the image at the specified index.
   * @param {number} index The index of the image to show.
   */
  function showLightbox(index) {
    const totalImages = galleryLinks.length;
    if (totalImages === 0) return;

    currentIndex = (index % totalImages + totalImages) % totalImages;
    const currentLink = galleryLinks[currentIndex];
    const image = currentLink.querySelector("img");
    const caption = image ? image.alt : "";

    lightboxImg.src = currentLink.href;
    lightboxCaption.textContent = caption;
    lightbox.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  if (galleryLinks.length === 0) {
    console.log("No gallery links found for lightbox.");
  }

  function hideLightbox() {
    lightbox.classList.add("hidden");
    document.body.style.overflow = "";
  }

  // Open lightbox on image click
  if (lightbox) { // Removed galleryGrid check
    galleryLinks.forEach((link, index) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        showLightbox(index);
      });
    });

    // Add zoom functionality
    if (lightboxImg) {
      lightboxImg.addEventListener('click', () => {
        // Prevent zoom-out when clicking to zoom-in
        if (!lightboxImg.classList.contains('zoomed')) {
          lightboxImg.classList.add('zoomed');
        }
      });
    }

    // Close button
    if (closeBtn) closeBtn.addEventListener("click", hideLightbox);

    // Close on background click
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) {
        hideLightbox();
        if (lightboxImg.classList.contains('zoomed')) {
          lightboxImg.classList.remove('zoomed');
        } else if (event.target.classList.contains('zoomed')) {
          event.target.classList.remove('zoomed');
        }
      }
    });

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("hidden")) {
        if (e.key === "Escape") hideLightbox();
      }
    });
  }
});