// script.js - Complete Dark/Light Mode Toggle Functionality

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

// Create and add professional toggle button to navbar
function addDarkModeToggle() {
    const navbarUl = document.querySelector('.navbar ul');
    if (!navbarUl) return;
    
    // Create list item for toggle
    const toggleLi = document.createElement('li');
    toggleLi.className = 'theme-toggle-container';
    
    // Create toggle wrapper
    const toggleWrapper = document.createElement('div');
    toggleWrapper.className = 'theme-toggle-wrapper';
    
    // Create the toggle button
    const toggleButton = document.createElement('button');
    toggleButton.id = 'darkModeToggle';
    toggleButton.setAttribute('aria-label', 'Toggle dark mode');
    
    // Add sun and moon icons
    const sunIcon = document.createElement('i');
    sunIcon.className = 'fas fa-sun';
    const moonIcon = document.createElement('i');
    moonIcon.className = 'fas fa-moon';
    
    toggleButton.appendChild(sunIcon);
    toggleButton.appendChild(moonIcon);
    
    // Add text label
    const toggleText = document.createElement('span');
    toggleText.className = 'toggle-text';
    toggleWrapper.appendChild(toggleButton);
    toggleWrapper.appendChild(toggleText);
    toggleLi.appendChild(toggleWrapper);
    
    // Add to navbar
    navbarUl.appendChild(toggleLi);
    
    // Function to update toggle appearance based on theme
    function updateToggleAppearance() {
        const isLightMode = document.body.classList.contains('light-mode');
        
        if (isLightMode) {
            toggleButton.classList.add('light-active');
            toggleButton.classList.remove('dark-active');
            toggleText.textContent = 'Light Mode';
            toggleButton.style.background = '#FFC107';
            toggleButton.style.borderColor = '#F59E0B';
            toggleButton.style.boxShadow = '0 2px 8px rgba(255, 193, 7, 0.3)';
        } else {
            toggleButton.classList.add('dark-active');
            toggleButton.classList.remove('light-active');
            toggleText.textContent = 'Dark Mode';
            toggleButton.style.background = '#2C7A4B';
            toggleButton.style.borderColor = '#3CAA6F';
            toggleButton.style.boxShadow = '0 2px 8px rgba(60, 170, 111, 0.3)';
        }
    }
    
    // Function to switch themes
    function toggleTheme() {
        if (document.body.classList.contains('light-mode')) {
            // Switch to dark mode
            document.body.classList.remove('light-mode');
            document.body.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'dark');
        } else {
            // Switch to light mode
            document.body.classList.add('light-mode');
            document.body.classList.remove('dark-mode');
            localStorage.setItem('darkMode', 'light');
        }
        updateToggleAppearance();
    }
    
    // Add click event to toggle button
    toggleButton.addEventListener('click', toggleTheme);
    
    // Initial update
    updateToggleAppearance();
}

// Add CSS for the toggle button and light mode improvements
function addToggleStyles() {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        /* Theme Toggle Button Styles */
        .theme-toggle-container {
            margin-left: 0.5rem;
        }
        
        .theme-toggle-wrapper {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        #darkModeToggle {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 18px;
            border-radius: 40px;
            cursor: pointer;
            font-size: 0.95rem;
            font-weight: 600;
            transition: all 0.3s ease;
            border: 1px solid;
            background: transparent;
        }
        
        #darkModeToggle i {
            font-size: 1rem;
            transition: all 0.2s ease;
        }
        
        #darkModeToggle .fa-sun {
            margin-right: 4px;
        }
        
        #darkModeToggle .fa-moon {
            margin-left: 4px;
        }
        
        #darkModeToggle:hover {
            transform: translateY(-1px);
            filter: brightness(1.05);
        }
        
        .toggle-text {
            font-size: 0.85rem;
            font-weight: 500;
            margin-left: 4px;
        }
        
        /* Light mode specific overrides for better visibility */
        body.light-mode .toggle-text {
            color: #1F2937;
        }
        
        body:not(.light-mode) .toggle-text {
            color: #EFF3F8;
        }
        
        /* Additional light mode text contrast improvements */
        body.light-mode .intro-text p {
            color: #374151;
        }
        
        body.light-mode .benefit-text {
            color: #4B5563;
        }
        
        body.light-mode .benefit-text strong {
            color: #059669;
        }
        
        body.light-mode .learn-content p {
            color: #4B5563;
        }
        
        body.light-mode .learn-badge {
            color: #059669;
            background: #F3F4F6;
        }
        
        body.light-mode .ballot-icon p {
            color: #059669;
        }
        
        body.light-mode .navbar li a {
            color: #1F2937;
        }
        
        body.light-mode .navbar li a:hover {
            color: #059669;
        }
        
        body.light-mode .footer ul li a {
            color: #6B7280;
        }
        
        body.light-mode .footer ul li a:hover {
            color: #059669;
        }
        
        body.light-mode .footer p {
            color: #9CA3AF;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
            .theme-toggle-container {
                margin-left: 0;
            }
            
            #darkModeToggle {
                padding: 6px 12px;
                font-size: 0.85rem;
            }
            
            .toggle-text {
                display: none;
            }
            
            #darkModeToggle i {
                font-size: 1rem;
            }
        }
        
        /* Smooth transitions for all themed elements */
        body, .navbar, .benefit-card, .learn-more, .footer, 
        #darkModeToggle, .intro-text p, .benefit-text, 
        .learn-content p, .navbar li a, .footer ul li a {
            transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }
    `;
    document.head.appendChild(styleSheet);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    addToggleStyles();
    initTheme();
    addDarkModeToggle();
});