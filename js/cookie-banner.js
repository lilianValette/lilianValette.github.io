/**
 * GDPR Cookie Consent Banner
 * Manages cookie consent for Google Analytics compliance
 */

class CookieBanner {
    constructor(languageManager) {
        this.languageManager = languageManager;
        this.STORAGE_KEY = 'cookie-consent';
        this.GA_ID = 'G-VYRLRXVWTC';
        this.bannerElement = null;
        
        // Translations
        this.translations = {
            fr: {
                title: "Utilisation des cookies",
                message: "Ce site utilise des cookies pour analyser le trafic via Google Analytics. Ces données nous aident à améliorer l'expérience utilisateur.",
                acceptButton: "Accepter",
                rejectButton: "Refuser",
                learnMore: "En savoir plus"
            },
            en: {
                title: "Cookie Usage",
                message: "This site uses cookies to analyze traffic via Google Analytics. This data helps us improve the user experience.",
                acceptButton: "Accept",
                rejectButton: "Reject", 
                learnMore: "Learn more"
            }
        };
        
        this.init();
    }
    
    init() {
        // Check if consent has already been given
        const consent = this.getConsent();
        
        if (consent === null) {
            // No consent stored, show banner
            this.showBanner();
        } else if (consent === true) {
            // Consent was given, load analytics
            this.loadGoogleAnalytics();
        }
        // If consent === false, do nothing (no analytics)
    }
    
    getConsent() {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored === null) return null;
        return stored === 'true';
    }
    
    setConsent(consent) {
        localStorage.setItem(this.STORAGE_KEY, consent.toString());
    }
    
    getCurrentLanguage() {
        return this.languageManager ? this.languageManager.getCurrentLanguage() : 'fr';
    }
    
    getTranslation(key) {
        const lang = this.getCurrentLanguage();
        return this.translations[lang][key] || this.translations.fr[key];
    }
    
    createBannerHTML() {
        return `
            <div class="cookie-banner" id="cookie-banner">
                <div class="cookie-banner-content">
                    <div class="cookie-banner-text">
                        <h3 class="cookie-banner-title">${this.getTranslation('title')}</h3>
                        <p class="cookie-banner-message">${this.getTranslation('message')}</p>
                    </div>
                    <div class="cookie-banner-actions">
                        <button class="cookie-btn cookie-btn-accept" id="cookie-accept">
                            ${this.getTranslation('acceptButton')}
                        </button>
                        <button class="cookie-btn cookie-btn-reject" id="cookie-reject">
                            ${this.getTranslation('rejectButton')}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    showBanner() {
        // Create banner element
        const bannerHTML = this.createBannerHTML();
        document.body.insertAdjacentHTML('beforeend', bannerHTML);
        
        this.bannerElement = document.getElementById('cookie-banner');
        
        // Add event listeners
        document.getElementById('cookie-accept').addEventListener('click', () => {
            this.acceptCookies();
        });
        
        document.getElementById('cookie-reject').addEventListener('click', () => {
            this.rejectCookies();
        });
        
        // Show banner with animation
        setTimeout(() => {
            this.bannerElement.classList.add('cookie-banner-visible');
        }, 100);
    }
    
    hideBanner() {
        if (this.bannerElement) {
            this.bannerElement.classList.remove('cookie-banner-visible');
            setTimeout(() => {
                if (this.bannerElement) {
                    this.bannerElement.remove();
                    this.bannerElement = null;
                }
            }, 300);
        }
    }
    
    acceptCookies() {
        this.setConsent(true);
        this.hideBanner();
        this.loadGoogleAnalytics();
    }
    
    rejectCookies() {
        this.setConsent(false);
        this.hideBanner();
        // Don't load Google Analytics
    }
    
    loadGoogleAnalytics() {
        // Check if already loaded
        if (window.gtag) {
            return;
        }
        
        // Load Google Analytics script
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${this.GA_ID}`;
        document.head.appendChild(script);
        
        // Initialize gtag
        script.onload = () => {
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', this.GA_ID);
        };
    }
    
    // Method to update banner language when site language changes
    updateLanguage() {
        if (this.bannerElement) {
            // Update banner text
            const title = this.bannerElement.querySelector('.cookie-banner-title');
            const message = this.bannerElement.querySelector('.cookie-banner-message');
            const acceptBtn = this.bannerElement.querySelector('#cookie-accept');
            const rejectBtn = this.bannerElement.querySelector('#cookie-reject');
            
            if (title) title.textContent = this.getTranslation('title');
            if (message) message.textContent = this.getTranslation('message');
            if (acceptBtn) acceptBtn.textContent = this.getTranslation('acceptButton');
            if (rejectBtn) rejectBtn.textContent = this.getTranslation('rejectButton');
        }
    }
}

// Export for use in main script
window.CookieBanner = CookieBanner;