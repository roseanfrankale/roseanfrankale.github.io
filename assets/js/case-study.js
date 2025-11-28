document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    // 1. Hero Animations
    const heroTimeline = gsap.timeline();
    
    heroTimeline
        .to(".hero-content", {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            delay: 0.2
        });

    // 2. Process Section Timeline (Alternating Layouts)
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

    // 4. Gallery Fade In
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
    const triggers = document.querySelectorAll('.lightbox-trigger');

    if (lightbox && lightboxImg && triggers.length > 0) {
        triggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent default if it wraps a link
                const img = trigger.querySelector('img');
                if (img) {
                    lightboxImg.src = img.src;
                    lightbox.classList.remove('hidden');
                    // Small timeout to allow display:flex to apply before opacity transition
                    setTimeout(() => lightbox.classList.remove('opacity-0'), 10);
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        const closeLightbox = () => {
            lightbox.classList.add('opacity-0');
            setTimeout(() => {
                lightbox.classList.add('hidden');
                document.body.style.overflow = '';
            }, 300);
        };

        if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
        
        lightbox.addEventListener('click', (e) => {
            // Close if clicking the background, but not the image itself
            if (e.target === lightbox) closeLightbox();
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !lightbox.classList.contains('hidden')) {
                closeLightbox();
            }
        });
    }
});