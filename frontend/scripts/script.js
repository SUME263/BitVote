// script.js - Complete Dark/Light Mode Toggle with Hamburger Menu

// Initialize theme based on saved preference or system preference
function initTheme() {
    const darkModePreference = localStorage.getItem('darkMode');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (darkModePreference === 'light') {
        document.body.classList.add('light-mode');
        document.body.classList.remove('dark-mode');
    } else if (darkModePreference === 'dark') {
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
    } else if (systemPrefersDark) {
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
    } else {
        document.body.classList.add('light-mode');
        document.body.classList.remove('dark-mode');
    }
}

// Create and add toggle button to navbar
function addDarkModeToggle() {
    const themeContainer = document.getElementById('theme-toggle-container');
    if (!themeContainer) return;
    
    // Clear container first
    themeContainer.innerHTML = '';
    
    // Create the toggle button
    const toggleButton = document.createElement('button');
    toggleButton.id = 'darkModeToggle';
    toggleButton.setAttribute('aria-label', 'Toggle dark mode');
    toggleButton.className = 'nav-link';
    
    // Create icon elements
    const sunIcon = document.createElement('i');
    sunIcon.className = 'fas fa-sun sun-icon';
    const moonIcon = document.createElement('i');
    moonIcon.className = 'fas fa-moon moon-icon';
    
    toggleButton.appendChild(sunIcon);
    toggleButton.appendChild(moonIcon);
    
    themeContainer.appendChild(toggleButton);
    
    // Function to update toggle appearance based on theme
    function updateToggleAppearance() {
        const isLightMode = document.body.classList.contains('light-mode');
        
        if (isLightMode) {
            sunIcon.style.opacity = '1';
            sunIcon.style.transform = 'scale(1)';
            moonIcon.style.opacity = '0.4';
            moonIcon.style.transform = 'scale(0.8)';
            toggleButton.style.color = '#FFC107';
        } else {
            sunIcon.style.opacity = '0.4';
            sunIcon.style.transform = 'scale(0.8)';
            moonIcon.style.opacity = '1';
            moonIcon.style.transform = 'scale(1)';
            toggleButton.style.color = '#6FCF97';
        }
    }
    
    // Function to switch themes
    function toggleTheme(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (document.body.classList.contains('light-mode')) {
            document.body.classList.remove('light-mode');
            document.body.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'dark');
        } else {
            document.body.classList.add('light-mode');
            document.body.classList.remove('dark-mode');
            localStorage.setItem('darkMode', 'light');
        }
        updateToggleAppearance();
    }
    
    // Add click event to toggle button
    toggleButton.addEventListener('click', toggleTheme);
    
    // Style the toggle button
    toggleButton.style.cssText = `
        display: flex;
        align-items: center;
        gap: 8px;
        background: transparent;
        border: none;
        cursor: pointer;
        font-size: 1.1rem;
        transition: all 0.3s ease;
        padding: 0.5rem 0;
        width: auto;
    `;
    
    // Initial update
    updateToggleAppearance();
}

// Hamburger menu functionality - IMPROVED
function initHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const body = document.body;
    
    if (!hamburger || !navMenu) {
        console.log('Hamburger or nav menu not found');
        return;
    }
    
    // Function to open menu
    function openMenu() {
        hamburger.classList.add('active');
        navMenu.classList.add('active');
        body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
    }
    
    // Function to close menu
    function closeMenu() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        body.style.overflow = ''; // Restore scrolling
    }
    
    // Toggle menu on hamburger click
    hamburger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (navMenu.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });
    
    // Close menu when clicking on a nav link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Don't close if it's the theme toggle (it has its own handler)
            if (link.id !== 'darkModeToggle') {
                closeMenu();
            }
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
        if (navMenu.classList.contains('active')) {
            // Check if click is outside hamburger and outside nav menu
            if (!hamburger.contains(event.target) && !navMenu.contains(event.target)) {
                closeMenu();
            }
        }
    });
    
    // Close menu on window resize (if switching from mobile to desktop)
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });
    
    // Prevent clicks inside menu from closing it (except on links)
    navMenu.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

// Add CSS for toggle button and mobile improvements
function addToggleStyles() {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        #darkModeToggle {
            display: flex !important;
            align-items: center;
            gap: 8px;
            background: transparent;
            border: none;
            cursor: pointer;
            font-size: 1.1rem;
            transition: all 0.3s ease;
            padding: 0.5rem 0;
        }
        
        #darkModeToggle i {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            font-size: 1.1rem;
        }
        
        #darkModeToggle:hover {
            transform: scale(1.05);
        }
        
        /* Ensure proper stacking */
        .nav-menu {
            z-index: 999;
        }
        
        .hamburger {
            z-index: 1001;
        }
        
        /* Smooth body scroll lock */
        body.menu-open {
            overflow: hidden;
        }
        
        @media (max-width: 768px) {
            #darkModeToggle {
                justify-content: center;
                width: 100%;
                padding: 0.75rem 0;
            }
        }
    `;
    document.head.appendChild(styleSheet);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded - initializing...');
    addToggleStyles();
    initTheme();
    addDarkModeToggle();
    initHamburgerMenu();
});