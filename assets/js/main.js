document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Logic
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;

    // Check Local Storage
    const savedTheme = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && systemDark)) {
        html.setAttribute('data-theme', 'dark');
        html.classList.add('dark');
        if(themeIcon) themeIcon.setAttribute('data-lucide', 'sun');
    } else {
        html.setAttribute('data-theme', 'light');
        html.classList.remove('dark');
        if(themeIcon) themeIcon.setAttribute('data-lucide', 'moon');
    }

    // Toggle Click Handler
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = html.getAttribute('data-theme') === 'dark';
            if (isDark) {
                html.setAttribute('data-theme', 'light');
                html.classList.remove('dark');
                localStorage.setItem('theme', 'light');
                themeIcon.setAttribute('data-lucide', 'moon');
            } else {
                html.setAttribute('data-theme', 'dark');
                html.classList.add('dark');
                localStorage.setItem('theme', 'dark');
                themeIcon.setAttribute('data-lucide', 'sun');
            }
            lucide.createIcons(); // Re-render icon
        });
    }

    // 2. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('bg-bg/90', 'backdrop-blur-md', 'shadow-sm', 'py-3');
            navbar.classList.remove('py-6', 'bg-transparent');
        } else {
            navbar.classList.add('py-6', 'bg-transparent');
            navbar.classList.remove('bg-bg/90', 'backdrop-blur-md', 'shadow-sm', 'py-3');
        }
    });

    // 3. Mobile Menu (Animated)
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', () => {
            // Toggle Animation Class
            mobileBtn.classList.toggle('open');
            // Toggle Menu Visibility
            mobileMenu.classList.toggle('hidden');
            
            // Re-render icons if needed when opening menu
            if (!mobileMenu.classList.contains('hidden')) {
                lucide.createIcons();
            }
        });
    }

    // 4. Initialize Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});