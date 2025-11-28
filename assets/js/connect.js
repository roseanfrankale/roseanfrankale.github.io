document.addEventListener('DOMContentLoaded', () => {
    // Simple fade in for the connect page elements
    gsap.from(".animate-fade-up", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out"
    });
});