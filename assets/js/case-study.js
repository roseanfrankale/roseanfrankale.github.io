// Initialize hero animation immediately (before DOMContentLoaded)
function initHeroAnimation() {
    if (typeof gsap === 'undefined') return;
    
    // Metadata items - animate left to right quickly
    const metadataItems = document.querySelectorAll('.hero-content > .grid > div');
    if (metadataItems.length > 0) {
        metadataItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('animate');
            }, index * 80); // Stagger by 80ms
        });
    }
}

// Fire immediately when DOM is interactive
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroAnimation);
} else {
    initHeroAnimation();
}

document.addEventListener('DOMContentLoaded', () => {
    // Wait for GSAP to be available
    if (typeof gsap === 'undefined') {
        console.warn('GSAP not loaded');
        return;
    }

    gsap.registerPlugin(ScrollTrigger);
    
    // Register Flip if available
    if (typeof Flip !== 'undefined') {
        gsap.registerPlugin(Flip);
    }

    // 1b. Flip Tags (Reorder on Click)
    const flipGroups = document.querySelectorAll('.flip-tags');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    flipGroups.forEach((group) => {
        const tags = Array.from(group.querySelectorAll('.flip-tag'));
        if (tags.length < 2) return;

        tags.forEach((tag) => {
            tag.addEventListener('click', () => {
                // Fallback if Flip not loaded
                if (typeof Flip === 'undefined' || prefersReducedMotion) {
                    group.insertBefore(tag, group.firstChild);
                    tags.forEach(t => t.classList.remove('is-active'));
                    tag.classList.add('is-active');
                    return;
                }

                try {
                    const state = Flip.getState(tags);
                    group.insertBefore(tag, group.firstChild);
                    tags.forEach(t => t.classList.remove('is-active'));
                    tag.classList.add('is-active');

                    Flip.from(state, {
                        duration: 0.6,
                        ease: 'power3.inOut',
                        absolute: true,
                        stagger: 0.02
                    });
                } catch (err) {
                    console.error('Flip animation error:', err);
                    group.insertBefore(tag, group.firstChild);
                    tags.forEach(t => t.classList.remove('is-active'));
                    tag.classList.add('is-active');
                }
            });
        });
    });

    // 2. Quote Callout Animation on Scroll
    const quoteCallout = document.querySelector('.quote-callout');
    if (quoteCallout) {
        gsap.to(quoteCallout, {
            scrollTrigger: {
                trigger: quoteCallout,
                start: "top 75%",
                toggleActions: "play none none reverse"
            },
            onEnter: () => quoteCallout.classList.add('animate')
        });
    }

    // 2b. Vision Image with Parallax & Scroll Reveal
    const visionImage = document.querySelector('.vision-image');
    if (visionImage) {
        // Initial reveal animation
        gsap.to(visionImage, {
            scrollTrigger: {
                trigger: visionImage,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            onEnter: () => visionImage.classList.add('animate')
        });

        // Parallax effect on scroll
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.to(".vision-image-img", {
                scrollTrigger: {
                    trigger: ".vision-image",
                    start: "top center",
                    end: "bottom center",
                    scrub: 1,
                    markers: false
                },
                y: -40,
                ease: "none"
            });
        }
    }

    // 2c. Process Section Timeline (Alternating Layouts)
    const steps = document.querySelectorAll('.process-step');
    steps.forEach((step, index) => {
        gsap.from(step, {
            scrollTrigger: {
                trigger: step,
                start: "top 80%",
                toggleActions: "play none none reverse"
            },
            opacity: 0,
            y: 50,
            duration: 0.8,
            ease: "power3.out"
        });
    });

    // 3. Results / Impact Grid Stagger
    const resultItems = document.querySelectorAll('.result-item');
    if (resultItems.length > 0) {
        gsap.from(resultItems, {
            scrollTrigger: {
                trigger: ".results-grid",
                start: "top 85%",
            },
            opacity: 0,
            y: 30,
            duration: 0.6,
            stagger: 0.2,
            ease: "back.out(1.7)"
        });
    }

    // 4. Case Study Gallery - Staggered Image Reveals
    const caseImages = document.querySelectorAll('.case-image');
    if (caseImages.length > 0) {
        gsap.from(caseImages, {
            scrollTrigger: {
                trigger: ".case-image:first-of-type",
                start: "top 80%"
            },
            opacity: 0,
            scale: 0.95,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out"
        });
    }

    // 5. Project Gallery Fade In (Alternative gallery)
    const galleryImages = document.querySelectorAll('.project-gallery img');
    if (galleryImages.length > 0) {
        gsap.from(galleryImages, {
            scrollTrigger: {
                trigger: ".project-gallery",
                start: "top 80%"
            },
            opacity: 0,
            scale: 0.9,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out"
        });
    }

    // 5. Initialize Lucide Icons if not already done
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 6. Lightbox Logic (Case Study Specific)
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.getElementById('lightbox-close');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');
    const counterCurrent = document.getElementById('lightbox-current');
    const counterTotal = document.getElementById('lightbox-total');
    const triggers = document.querySelectorAll('.lightbox-trigger');

    if (lightbox && lightboxImg && triggers.length > 0) {
        let currentImageIndex = 0;
        let galleryImages = [];

        triggers.forEach((trigger, index) => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const img = trigger.querySelector('img');
                if (img) {
                    // Get all lightbox triggers and their images
                    galleryImages = Array.from(triggers).map(t => t.querySelector('img'));
                    currentImageIndex = galleryImages.indexOf(img);
                    
                    // Update counter total
                    if (counterTotal) counterTotal.textContent = galleryImages.length;
                    
                    displayImage(currentImageIndex);
                    lightbox.classList.remove('hidden');
                    setTimeout(() => lightbox.classList.remove('opacity-0'), 10);
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        const displayImage = (index) => {
            if (index >= 0 && index < galleryImages.length) {
                currentImageIndex = index;
                lightboxImg.src = galleryImages[index].src;
                
                // Update counter
                if (counterCurrent) counterCurrent.textContent = index + 1;
            }
        };

        const nextImage = () => {
            displayImage((currentImageIndex + 1) % galleryImages.length);
        };

        const prevImage = () => {
            displayImage((currentImageIndex - 1 + galleryImages.length) % galleryImages.length);
        };

        const closeLightbox = () => {
            lightbox.classList.add('opacity-0');
            setTimeout(() => {
                lightbox.classList.add('hidden');
                document.body.style.overflow = '';
            }, 300);
        };

        if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
        if (prevBtn) prevBtn.addEventListener('click', prevImage);
        if (nextBtn) nextBtn.addEventListener('click', nextImage);
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('hidden')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') prevImage();
            if (e.key === 'ArrowRight') nextImage();
        });
    }
});