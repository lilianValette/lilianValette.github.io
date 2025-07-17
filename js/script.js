document.addEventListener("DOMContentLoaded", () => {
    // Configuration
    const CONFIG = {
        animationDuration: 800,
        scrollOffset: 100,
        typingSpeed: 80,
        fadeThreshold: 0.1
    };

    // Language Management
    class LanguageManager {
        constructor() {
            this.currentLanguage = localStorage.getItem("language") || "fr";
            this.selector = document.getElementById("language-selector");
            this.init();
        }

        init() {
            if (this.selector) {
                this.selector.value = this.currentLanguage;
                this.updateLanguage(this.currentLanguage);
                this.selector.addEventListener("change", (e) => {
                    this.currentLanguage = e.target.value;
                    localStorage.setItem("language", this.currentLanguage);
                    this.updateLanguage(this.currentLanguage);
                });
            }
        }

        updateLanguage(lang) {
            // Update text content
            document.querySelectorAll("[data-fr][data-en]").forEach(element => {
                if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
                    const placeholderAttr = `data-${lang}-placeholder`;
                    if (element.hasAttribute(placeholderAttr)) {
                        element.placeholder = element.getAttribute(placeholderAttr);
                    }
                } else {
                    element.textContent = element.getAttribute(`data-${lang}`);
                }
            });

            // Update theme toggle button
            this.updateThemeToggleText(lang);

            // Update document attributes
            document.documentElement.lang = lang;

            // Update meta description
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) {
                if (lang === "en") {
                    metaDesc.content = "Personal portfolio of Lilian Valette, computer science student passionate about web development and technological innovation.";
                } else {
                    metaDesc.content = "Portfolio personnel de Lilian Valette, étudiant en informatique passionné par le développement web et l'innovation technologique.";
                }
            }
        }

        updateThemeToggleText(lang) {
            const themeToggle = document.getElementById("theme-toggle");
            if (themeToggle) {
                const isDarkMode = document.body.classList.contains("dark-mode");
                if (lang === "fr") {
                    themeToggle.textContent = isDarkMode ? "Mode Clair" : "Mode Sombre";
                } else {
                    themeToggle.textContent = isDarkMode ? "Light Mode" : "Dark Mode";
                }
            }
        }

        getCurrentLanguage() {
            return this.currentLanguage;
        }
    }

    // Theme Management
    class ThemeManager {
        constructor(languageManager) {
            this.languageManager = languageManager;
            this.toggle = document.getElementById("theme-toggle");
            this.init();
        }
    
        init() {
            if (this.toggle) {
                this.toggle.addEventListener("click", () => this.toggleTheme());
            
                // Load theme: priorité au localStorage, sinon détection système
                this.loadTheme();
                this.updateToggleText();
            }
        }
    
        loadTheme() {
            const savedTheme = localStorage.getItem("darkMode");
            
            if (savedTheme !== null) {
                // Si un thème a été sauvegardé, l'utiliser
                if (savedTheme === "true") {
                    document.body.classList.add("dark-mode");
                }
            } else {
                // Sinon, détecter le thème système
                const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                
                if (prefersDarkMode) {
                    document.body.classList.add("dark-mode");
                }
            }
        }
    
        toggleTheme() {
            document.body.classList.toggle("dark-mode");
            const isDarkMode = document.body.classList.contains("dark-mode");
            localStorage.setItem("darkMode", isDarkMode);
            this.updateToggleText();
        }
    
        updateToggleText() {
            if (this.toggle && this.languageManager) {
                this.languageManager.updateThemeToggleText(this.languageManager.getCurrentLanguage());
            }
        }
    }

    // Smooth Scrolling
    class SmoothScroller {
        constructor() {
            this.init();
        }

        init() {
            document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    e.preventDefault();
                    const target = document.querySelector(anchor.getAttribute('href'));
                    if (target) {
                        const headerHeight = document.querySelector('header').offsetHeight;
                        const targetPosition = target.offsetTop - headerHeight - 20;

                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                });
            });
        }
    }

    // Intersection Observer for Animations
    class AnimationObserver {
        constructor() {
            this.options = {
                threshold: CONFIG.fadeThreshold,
                rootMargin: `0px 0px -${CONFIG.scrollOffset}px 0px`
            };
            this.init();
        }

        init() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("appear");
                        observer.unobserve(entry.target);
                    }
                });
            }, this.options);

            // Observe all sections and cards
            document.querySelectorAll("section, .skill-category, .project-card").forEach(element => {
                element.classList.add("fade-in");
                observer.observe(element);
            });
        }
    }

    // Typing Effect
    class TypingEffect {
        constructor() {
            this.init();
        }

        init() {
            const tagline = document.querySelector('.hero-tagline');
            if (tagline) {
                // Store original text
                const originalText = tagline.textContent;
                tagline.textContent = '';
                tagline.style.opacity = '1';

                // Start typing after a delay
                setTimeout(() => {
                    this.typeText(tagline, originalText);
                }, 1000);
            }
        }

        typeText(element, text) {
            let i = 0;
            const timer = setInterval(() => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(timer);
                }
            }, CONFIG.typingSpeed);
        }
    }

    // Skill Badge Interactions
    class SkillInteractions {
        constructor() {
            this.init();
        }

        init() {
            document.querySelectorAll('.skill-badge').forEach(badge => {
                badge.addEventListener('mouseenter', () => {
                    badge.style.transform = 'translateY(-4px) scale(1.05)';
                });

                badge.addEventListener('mouseleave', () => {
                    badge.style.transform = 'translateY(0) scale(1)';
                });
            });
        }
    }

    // Contact Form Handler
    class ContactForm {
        constructor(languageManager) {
            this.languageManager = languageManager;
            this.form = document.querySelector('.contact-form');
            this.init();
        }

        init() {
            if (this.form) {
                this.form.addEventListener('submit', (e) => this.handleSubmit(e));
            }
        }

        handleSubmit(e) {
            e.preventDefault();

            const formData = new FormData(this.form);
            const data = {
                name: this.form.querySelector('input[type="text"]').value,
                email: this.form.querySelector('input[type="email"]').value,
                subject: this.form.querySelectorAll('input[type="text"]')[1].value,
                message: this.form.querySelector('textarea').value
            };

            // Validate form
            if (this.validateForm(data)) {
                this.showSuccess();
                this.form.reset();
            } else {
                this.showError();
            }
        }

        validateForm(data) {
            return data.name && data.email && data.subject && data.message &&
                   this.isValidEmail(data.email);
        }

        isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }

        showSuccess() {
            const lang = this.languageManager.getCurrentLanguage();
            const message = lang === "fr"
                ? 'Merci pour votre message ! Je vous répondrai dans les plus brefs délais.'
                : 'Thank you for your message! I will reply as soon as possible.';

            this.showNotification(message, 'success');
        }

        showError() {
            const lang = this.languageManager.getCurrentLanguage();
            const message = lang === "fr"
                ? 'Veuillez remplir tous les champs correctement.'
                : 'Please fill in all fields correctly.';

            this.showNotification(message, 'error');
        }

        showNotification(message, type) {
            // Create notification element
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.textContent = message;
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 16px 24px;
                border-radius: 8px;
                color: white;
                font-weight: 600;
                z-index: 10000;
                transform: translateX(100%);
                transition: transform 0.3s ease;
                background: ${type === 'success' ? '#1DB954' : '#E22134'};
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
            `;

            document.body.appendChild(notification);

            // Animate in
            setTimeout(() => {
                notification.style.transform = 'translateX(0)';
            }, 100);

            // Remove after delay
            setTimeout(() => {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, 4000);
        }
    }

    // Parallax Effect for Hero Section
    class ParallaxEffect {
        constructor() {
            this.hero = document.querySelector('.hero-section');
            this.init();
        }

        init() {
            if (this.hero) {
                window.addEventListener('scroll', () => {
                    const scrolled = window.pageYOffset;
                    const rate = scrolled * -0.18;
                    this.hero.style.transform = `translateY(${rate}px)`;
                });
            }
        }
    }

    // Project Card Hover Effects
    class ProjectCardEffects {
        constructor() {
            this.init();
        }

        init() {
            document.querySelectorAll('.project-card').forEach(card => {
                card.addEventListener('mouseenter', () => {
                    card.style.transform = 'translateY(-12px) scale(1.02)';
                });

                card.addEventListener('mouseleave', () => {
                    card.style.transform = 'translateY(0) scale(1)';
                });
            });
        }
    }

    // Initialize all components
    const languageManager = new LanguageManager();
    const themeManager = new ThemeManager(languageManager);
    const smoothScroller = new SmoothScroller();
    const animationObserver = new AnimationObserver();
    const typingEffect = new TypingEffect();
    const skillInteractions = new SkillInteractions();
    const contactForm = new ContactForm(languageManager);
    const parallaxEffect = new ParallaxEffect();
    const projectCardEffects = new ProjectCardEffects();

    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);

    // Performance optimization: Debounce scroll events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Add keyboard navigation support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });

    // ----------- BURGER MENU MOBILE LOGIC -------------
    const burger = document.querySelector('.burger-menu');
    const navMenu = document.querySelector('.nav-menu');
    if (burger && navMenu) {
        burger.addEventListener('click', () => {
            const isOpen = navMenu.classList.contains('active');
            if (isOpen) {
                navMenu.classList.remove('active');
                burger.classList.remove('active');
                burger.blur();
            } else {
                navMenu.classList.add('active');
                burger.classList.add('active');
            }
        });
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                burger.classList.remove('active');
            });
        });
        document.addEventListener('click', (e) => {
            if (
                navMenu.classList.contains('active') &&
                !navMenu.contains(e.target) &&
                !burger.contains(e.target)
            ) {
                navMenu.classList.remove('active');
                burger.classList.remove('active');
            }
        });
    }
});