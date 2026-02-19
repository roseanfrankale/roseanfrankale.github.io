// ChronoLens Shared Animations Module
// Used across landing.html and case-study.html

function initHeroAnimation() {
  if (typeof gsap === 'undefined') return;

  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    gsap.to('.hero-content', {
      opacity: 1,
      y: 0,
      duration: 0.85,
      ease: 'power3.out',
      delay: 0.1,
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
  if (typeof gsap === 'undefined') {
    console.warn('GSAP not loaded');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  if (typeof Flip !== 'undefined') {
    gsap.registerPlugin(Flip);
  }
});
