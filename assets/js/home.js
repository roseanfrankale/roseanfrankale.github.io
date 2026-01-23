document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    // Hero Animation
    gsap.to(".hero-content", {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.2
    });

    // Project Cards Animation
    const projects = document.querySelectorAll('.project-item');
    
    projects.forEach((project, index) => {
        gsap.to(project, {
            scrollTrigger: {
                trigger: project,
                start: "top 80%", // Start animation when top of card hits 80% of viewport
                toggleActions: "play none none none"
            },
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out"
        });
    });
});