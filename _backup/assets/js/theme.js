// assets/js/theme.js

// --- Part 1: Immediate Theme Application (to prevent FOUC) ---
// This code runs as soon as the script is parsed, before the DOM is fully loaded.
// It sets the data-theme attribute on the <html> element based on localStorage or defaults to "dark".
(function() {
  const savedTheme = localStorage.getItem("theme");
  // Default to "dark" if no theme is saved in localStorage
  const theme = savedTheme || "dark";
  document.documentElement.setAttribute("data-theme", theme);
})();

// --- Part 2: Functions and Event Listeners (after DOM is loaded) ---

// Function to update the toggle icon based on the current theme and replace feather icons
function updateToggleIcon() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const icon = document.querySelector("#theme-toggle i");
  if (icon) {
    icon.setAttribute('data-feather', currentTheme === 'dark' ? 'sun' : 'moon');
    // Ensure feather-icons library is loaded before calling replace
    if (typeof feather !== 'undefined' && feather.replace) {
      feather.replace();
    }
  }
}

// Handles clicking the theme toggle button
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  updateToggleIcon();
}

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Set the initial state of the toggle icon (this will also call feather.replace for the icon)
  updateToggleIcon();
  
  // Add event listener for the theme toggle button
  const themeToggleBtn = document.querySelector("#theme-toggle");
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", toggleTheme);
  }

  // Navbar scroll effect
  window.addEventListener("scroll", function () {
    const navbar = document.querySelector(".navbar");
    if (navbar) { // Check if navbar exists
      if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    }
  });

  // Init feather icons for any other icons on the page that might not be covered by updateToggleIcon
  // This ensures all feather icons are replaced once the DOM is ready.
  if (typeof feather !== 'undefined' && feather.replace) {
    feather.replace();
  }
});
