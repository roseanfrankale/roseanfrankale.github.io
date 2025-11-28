document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Hero Animation
    gsap.from(".hero-content", {
        duration: 1.5,
        y: 100,
        opacity: 0,
        ease: "power4.out",
        delay: 0.2
    });

    // Reveal Text Animation
    gsap.from(".reveal-text", {
        scrollTrigger: {
            trigger: ".reveal-text",
            start: "top 80%",
        },
        duration: 1,
        y: 30,
        opacity: 0,
        ease: "power3.out"
    });

    // Band Section Animations
    const sections = document.querySelectorAll('.project-section');
    sections.forEach((section, index) => {
        // Fade Up content
        gsap.from(section.children, {
            scrollTrigger: {
                trigger: section,
                start: "top 75%",
            },
            duration: 1,
            y: 50,
            opacity: 0,
            stagger: 0.2,
            ease: "power3.out"
        });

        // Parallax effect on the huge number
        const number = section.querySelector('.text-\\[15rem\\]');
        if (number) {
            gsap.to(number, {
                scrollTrigger: {
                    trigger: section,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1
                },
                y: 100,
                ease: "none"
            });
        }
    });

    // 2. Video Modal Logic
    const modal = document.getElementById('video-modal');
    const player = document.getElementById('youtube-player');
    const closeBtn = document.getElementById('close-modal');
    const triggers = document.querySelectorAll('.video-trigger');

    // Function to open modal
    const openModal = (videoId) => {
        // Update iframe source with autoplay
        player.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock scroll
    };

    // Function to close modal
    const closeModal = () => {
        modal.classList.remove('active');
        player.src = ""; // Stop video
        document.body.style.overflow = ''; // Unlock scroll
    };

    // Attach Click Listeners to Images
    triggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const videoId = trigger.getAttribute('data-video-id');
            if (videoId) openModal(videoId);
        });
    });

    // Close listeners
    closeBtn.addEventListener('click', closeModal);
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
});