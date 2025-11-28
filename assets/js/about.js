document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Initial Animations (Header elements)
    gsap.from(".animate-fade-up", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out"
    });

    // 2. Tab Switching Logic
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    function switchTab(targetId) {
        // Hide all contents
        tabContents.forEach(content => {
            if (!content.classList.contains('hidden')) {
                // Fade out animation
                gsap.to(content, {
                    opacity: 0,
                    y: -10,
                    duration: 0.2,
                    onComplete: () => {
                        content.classList.add('hidden');
                        // Show new content after hide is done
                        showNewContent(targetId);
                    }
                });
            }
        });

        // Update buttons state
        tabBtns.forEach(btn => {
            if (btn.dataset.target === targetId) {
                // Active Styling
                btn.classList.remove('bg-transparent', 'text-text-muted');
                btn.classList.add('bg-accent', 'text-white', 'border-accent', 'shadow-lg', 'scale-105');
            } else {
                // Inactive Styling
                btn.classList.add('bg-transparent', 'text-text-muted');
                btn.classList.remove('bg-accent', 'text-white', 'border-accent', 'shadow-lg', 'scale-105');
            }
        });
    }

    function showNewContent(targetId) {
        const targetContent = document.getElementById(targetId);
        if (targetContent) {
            targetContent.classList.remove('hidden');
            gsap.fromTo(targetContent, 
                { opacity: 0, y: 10 }, 
                { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
            );
        }
    }

    // Attach Click Listeners
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.target;
            // Only switch if not already active (logic simplified here for clarity)
            switchTab(target);
        });
    });

    // 3. Lightbox Logic for Profile Image
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.getElementById('lightbox-close');
    const trigger = document.querySelector('.lightbox-trigger');

    if (trigger && lightbox && lightboxImg) {
        trigger.addEventListener('click', () => {
            const imgSource = trigger.querySelector('img').src;
            lightboxImg.src = imgSource;
            lightbox.classList.remove('hidden');
            // Small timeout to allow display:block to apply before opacity transition
            setTimeout(() => lightbox.classList.remove('opacity-0'), 10);
            document.body.style.overflow = 'hidden';
        });

        const closeLightbox = () => {
            lightbox.classList.add('opacity-0');
            setTimeout(() => {
                lightbox.classList.add('hidden');
                document.body.style.overflow = '';
            }, 300);
        };

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }
});