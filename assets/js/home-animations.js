// Home & Gallery Page Animations
document.addEventListener('DOMContentLoaded', () => {
    if (typeof gsap === 'undefined') {
        console.warn('GSAP not loaded');
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // ===== HOME PAGE ANIMATIONS =====

    // 1. Project Cards - Fade and slide up on scroll
    const projectItems = document.querySelectorAll('.project-item');
    if (projectItems.length > 0) {
        projectItems.forEach((item, index) => {
            gsap.to(item, {
                scrollTrigger: {
                    trigger: item,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                },
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "power3.out"
            });
        });
    }

    // 2. Section Title Animation - Staggered reveal
    const sectionTitles = document.querySelectorAll('.section-title-stacked');
    sectionTitles.forEach((title) => {
        const titleMain = title.querySelector('.title-main');
        const titleSub = title.querySelector('.title-sub');
        
        if (titleMain && titleSub) {
            gsap.to(titleMain, {
                scrollTrigger: {
                    trigger: title,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                },
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: "power3.out"
            });

            gsap.to(titleSub, {
                scrollTrigger: {
                    trigger: title,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                },
                opacity: 1,
                y: 0,
                duration: 0.5,
                delay: 0.1,
                ease: "power3.out"
            });
        }
    });

    // ===== GALLERY PAGE ANIMATIONS =====

    // 3. Gallery Items - Staggered grid reveals
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (galleryItems.length > 0) {
        gsap.to(galleryItems, {
            scrollTrigger: {
                trigger: galleryItems[0],
                start: "top 80%",
                toggleActions: "play none none reverse"
            },
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.08,
            ease: "power3.out"
        });
    }

    // 4. Filter buttons animation
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            // Add ripple or highlight effect on click
            gsap.to(btn, {
                scale: 1.1,
                duration: 0.2,
                yoyo: true,
                repeat: 1,
                ease: "power2.out"
            });
        });
    });

    // ===== ABOUT/MUSIC PAGE ANIMATIONS =====

    // 5. Content Sections fade in on scroll
    const contentSections = document.querySelectorAll('[data-scroll-animation]');
    contentSections.forEach((section) => {
        gsap.to(section, {
            scrollTrigger: {
                trigger: section,
                start: "top 80%",
                toggleActions: "play none none reverse"
            },
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out"
        });
    });

    // 6. Refresh ScrollTrigger after everything loads
    window.addEventListener('load', () => {
        ScrollTrigger.refresh();
    });
});
