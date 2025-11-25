document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Video Modal Logic ---
    const modal = document.getElementById('videoModal');
    const iframe = document.getElementById('videoFrame');
    const triggers = document.querySelectorAll('.video-card-trigger');
    const closeBtn = document.querySelector('.close-modal');

    // Open Modal
    triggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const videoId = trigger.getAttribute('data-video-id');
            if (videoId) {
                const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
                iframe.src = embedUrl;
                modal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
            }
        });
    });

    const closeModal = () => {
        if (modal && modal.classList.contains('active')) {
            modal.classList.remove('active');
            iframe.src = ''; // Stop video
            document.body.style.overflow = '';
        }
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    
    // Close on clicking outside video
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });


    // --- 2. Mobile Navigation ---
    const toggleBtn = document.querySelector('.mobile-nav-toggle');
    const sidebar = document.querySelector('.sidebar-nav');
    const navLinks = document.querySelectorAll('.sidebar-menu .nav-link');

    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            // Toggle icon
            const icon = sidebar.classList.contains('open') ? 'x' : 'menu';
            toggleBtn.innerHTML = `<i data-feather="${icon}"></i>`;
            if (typeof feather !== 'undefined') feather.replace();
        });
    }

    // Close sidebar when a link is clicked (mobile)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 992 && sidebar) {
                sidebar.classList.remove('open');
                if (toggleBtn) {
                    toggleBtn.innerHTML = `<i data-feather="menu"></i>`;
                    if (typeof feather !== 'undefined') feather.replace();
                }
            }
        });
    });


    // --- 3. ScrollSpy for Sidebar ---
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.sidebar-menu .nav-link');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2 // Trigger when 20% of section is visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                // Remove active class from all
                navItems.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));


    // --- 4. GSAP Parallax & Animations ---
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        
        gsap.registerPlugin(ScrollTrigger);

        // Hero Fade In
        gsap.from(".hero-content", {
            duration: 1.5,
            y: 50,
            opacity: 0,
            ease: "power3.out",
            delay: 0.2
        });

        // Fade In Glass Panels
        gsap.utils.toArray('.glass-panel').forEach(panel => {
            gsap.from(panel, {
                scrollTrigger: {
                    trigger: panel,
                    start: "top 85%", // Start when top of element hits 85% of viewport
                    toggleActions: "play none none reverse"
                },
                y: 50,
                opacity: 0,
                duration: 1,
                ease: "power3.out"
            });
        });

        // Fade In Video Cards
        gsap.utils.toArray('.video-card-trigger, .image-only-card').forEach(card => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                },
                y: 50,
                opacity: 0,
                duration: 1,
                delay: 0.2, // Slight delay after text
                ease: "power3.out"
            });
        });

        // Parallax Background Effect
        if (window.innerWidth > 992) { // Only on desktop to save mobile battery
            gsap.utils.toArray('.parallax-section').forEach(section => {
                const bg = section.querySelector('.parallax-bg');
                if (bg) {
                    gsap.to(bg, {
                        yPercent: 30, // Move background down slower than scroll
                        ease: "none",
                        scrollTrigger: {
                            trigger: section,
                            start: "top bottom", 
                            end: "bottom top",
                            scrub: true
                        }
                    });
                }
            });
        }
    }
});