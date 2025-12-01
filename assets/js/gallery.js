
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Initialize Isotope
    const grid = document.querySelector('#gallery-grid');
    let iso;

    if (grid) {
        // Wait for images to load before initializing layout
        imagesLoaded(grid, function() {
            iso = new Isotope(grid, {
                itemSelector: '.gallery-item',
                layoutMode: 'masonry',
                percentPosition: true,
                masonry: {
                    columnWidth: '.grid-sizer',
                    gutter: 0 // CRITICAL FIX: Set to 0. We handle gaps via CSS padding in .gallery-item
                }
            });
            
            // Trigger layout once to fix any initial overlaps
            iso.layout();
        });
    }

    // 2. Filter Logic
    const filterBtns = document.querySelectorAll('.filter-btn');
    const noResultsMsg = document.getElementById('no-results');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Active Class Logic
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filter Isotope
            const filterValue = btn.getAttribute('data-filter');
            iso.arrange({ filter: filterValue });

            // Show/Hide "No Results" message
            const filteredItems = iso.getFilteredItemElements();
            if (filteredItems.length === 0) {
                noResultsMsg.classList.remove('hidden');
            } else {
                noResultsMsg.classList.add('hidden');
            }
        });
    });

    // 3. Lightbox Logic
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.getElementById('lightbox-close');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');
    
    // Collect all current visible images for navigation
    let currentGalleryImages = [];
    let currentIndex = 0;

    // Open Lightbox
    const openLightbox = (imgSrc, caption, index) => {
        lightboxImg.src = imgSrc;
        lightboxCaption.textContent = caption;
        currentIndex = index;
        
        lightbox.classList.remove('hidden');
        setTimeout(() => lightbox.classList.remove('opacity-0'), 10);
        document.body.style.overflow = 'hidden';
    };

    // Close Lightbox
    const closeLightbox = () => {
        lightbox.classList.add('opacity-0');
        setTimeout(() => {
            lightbox.classList.add('hidden');
            document.body.style.overflow = '';
        }, 300);
    };

    // Update Gallery List based on current filter
    const updateGalleryList = () => {
        // Get only currently visible items from Isotope
        const visibleItems = iso ? iso.getFilteredItemElements() : document.querySelectorAll('.gallery-item');
        currentGalleryImages = Array.from(visibleItems).map(item => {
            const img = item.querySelector('img');
            const title = item.querySelector('.gallery-overlay span:first-child').textContent;
            return { src: img.src, caption: title };
        });
    };

    // Attach Click Listeners to Items using Event Delegation
    grid.addEventListener('click', (e) => {
        const itemLink = e.target.closest('a');
        if (itemLink) {
            e.preventDefault();
            updateGalleryList(); // Refresh list in case filters changed
            
            const imgSrc = itemLink.querySelector('img').src;
            // Find index in the current list
            const index = currentGalleryImages.findIndex(img => img.src === imgSrc);
            const caption = currentGalleryImages[index] ? currentGalleryImages[index].caption : "";

            openLightbox(imgSrc, caption, index);
        }
    });

    // Navigation Logic
    const showImage = (index) => {
        if (currentGalleryImages.length === 0) return;
        if (index < 0) index = currentGalleryImages.length - 1;
        if (index >= currentGalleryImages.length) index = 0;
        
        currentIndex = index;
        const imgData = currentGalleryImages[currentIndex];
        
        // Fade out slightly
        lightboxImg.style.opacity = 0.5;
        
        setTimeout(() => {
            lightboxImg.src = imgData.src;
            lightboxCaption.textContent = imgData.caption;
            lightboxImg.style.opacity = 1;
        }, 200);
    };

    // Event Listeners for Lightbox
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showImage(currentIndex - 1); });
    if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showImage(currentIndex + 1); });
    
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.closest('#lightbox-img')) return;
        });
    }

    // Keyboard Nav
    document.addEventListener('keydown', (e) => {
        if (lightbox && lightbox.classList.contains('hidden')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
        if (e.key === 'ArrowRight') showImage(currentIndex + 1);
    });

});