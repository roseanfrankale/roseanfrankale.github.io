
document.addEventListener('DOMContentLoaded', () => {
    
    const grid = document.querySelector('#gallery-grid');
    let iso;

    if (grid) {
        // Initialize Isotope immediately so structure exists
        iso = new Isotope(grid, {
            itemSelector: '.gallery-item',
            layoutMode: 'masonry',
            percentPosition: true,
            masonry: {
                columnWidth: '.grid-sizer',
                gutter: 0 // VITAL: Set gutter to 0. CSS padding handles the gap.
            }
        });

        // Update layout progressively as each image loads
        // This prevents waiting for ALL images before showing ANYTHING
        imagesLoaded(grid).on('progress', function() {
            iso.layout();
        });
    }

    // Filter Logic
    const filterBtns = document.querySelectorAll('.filter-btn');
    const noResultsMsg = document.getElementById('no-results');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');
            iso.arrange({ filter: filterValue });

            // Check if any items are visible
            if (iso.filteredItems.length === 0) {
                noResultsMsg.classList.remove('hidden');
            } else {
                noResultsMsg.classList.add('hidden');
            }
        });
    });

    // Lightbox Logic (Standardized)
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.getElementById('lightbox-close');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');
    
    let currentGalleryImages = [];
    let currentIndex = 0;

    // Build the list of images based on current filter
    const updateGalleryList = () => {
        // Use Isotope's filtered items if available, otherwise all items
        const visibleElements = iso ? iso.getFilteredItemElements() : document.querySelectorAll('.gallery-item');
        
        currentGalleryImages = Array.from(visibleElements).map(item => {
            const link = item.querySelector('a');
            const titleElement = item.querySelector('.gallery-overlay span:first-child');
            const title = titleElement ? titleElement.innerText : "Gallery Item";
            return { src: link.getAttribute('href'), caption: title };
        });
    };

    const showImage = (index) => {
        if (currentGalleryImages.length === 0) return;
        
        // Loop navigation
        if (index < 0) index = currentGalleryImages.length - 1;
        if (index >= currentGalleryImages.length) index = 0;
        
        currentIndex = index;
        const imgData = currentGalleryImages[currentIndex];
        
        // Fade effect
        lightboxImg.style.opacity = 0.5;
        setTimeout(() => {
            lightboxImg.src = imgData.src;
            lightboxCaption.textContent = imgData.caption;
            lightboxImg.style.opacity = 1;
        }, 200);
    };

    const openLightbox = (index) => {
        updateGalleryList();
        showImage(index);
        lightbox.classList.remove('hidden');
        setTimeout(() => lightbox.classList.remove('opacity-0'), 10);
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        lightbox.classList.add('opacity-0');
        setTimeout(() => {
            lightbox.classList.add('hidden');
            document.body.style.overflow = '';
        }, 300);
    };

    // Event Delegation for Grid Items
    grid.addEventListener('click', (e) => {
        const itemLink = e.target.closest('a');
        if (itemLink) {
            e.preventDefault();
            // Find the index relative to the *visible* items
            updateGalleryList(); // Ensure list is fresh
            const src = itemLink.getAttribute('href');
            const index = currentGalleryImages.findIndex(img => img.src === src);
            if (index !== -1) openLightbox(index);
        }
    });

    // Controls
    if(closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if(prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showImage(currentIndex - 1); });
    if(nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showImage(currentIndex + 1); });
    
    // Background Close
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Zoom Toggle
    lightboxImg.addEventListener('click', (e) => {
        e.stopPropagation();
        lightboxImg.classList.toggle('scale-150');
        lightboxImg.classList.toggle('cursor-zoom-out');
        lightboxImg.classList.toggle('cursor-zoom-in');
    });

    // Keyboard
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('hidden')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
            if (e.key === 'ArrowRight') showImage(currentIndex + 1);
        }
    });

    // Filter bar scroll effect
    const filterContainer = document.getElementById('gallery-filters');
    if (filterContainer) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                filterContainer.classList.add('scrolled');
            } else {
                filterContainer.classList.remove('scrolled');
            }
        });
    }

});
