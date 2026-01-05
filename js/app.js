// ============================================
// AyudaVenezuela.org - Main Application Script
// ============================================

// Language Manager
class LanguageManager {
    constructor() {
        this.currentLang = localStorage.getItem('language') || 'es';
        this.init();
    }

    init() {
        this.applyLanguage(this.currentLang);
        this.setupToggle();
    }

    setupToggle() {
        const toggle = document.getElementById('langToggle');
        if (toggle) {
            toggle.addEventListener('click', () => this.toggleLanguage());
        }
    }

    toggleLanguage() {
        this.currentLang = this.currentLang === 'es' ? 'en' : 'es';
        localStorage.setItem('language', this.currentLang);
        this.applyLanguage(this.currentLang);
    }

    applyLanguage(lang) {
        // Update all elements with data-es and data-en attributes
        document.querySelectorAll('[data-es][data-en]').forEach(el => {
            const text = lang === 'es' ? el.getAttribute('data-es') : el.getAttribute('data-en');
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = text;
            } else {
                el.textContent = text;
            }
        });

        // Update placeholders
        document.querySelectorAll('[data-placeholder-es][data-placeholder-en]').forEach(el => {
            const placeholder = lang === 'es'
                ? el.getAttribute('data-placeholder-es')
                : el.getAttribute('data-placeholder-en');
            el.placeholder = placeholder;
        });

        // Update language toggle appearance
        const toggle = document.getElementById('langToggle');
        if (toggle) {
            if (lang === 'es') {
                toggle.innerHTML = '<span class="lang-current">ES</span><span class="lang-divider">|</span><span class="lang-alt">EN</span>';
            } else {
                toggle.innerHTML = '<span class="lang-alt">ES</span><span class="lang-divider">|</span><span class="lang-current">EN</span>';
            }
        }

        // Update HTML lang attribute
        document.documentElement.lang = lang;
    }

    getText(es, en) {
        return this.currentLang === 'es' ? es : en;
    }
}

// Search Functionality
class SearchManager {
    constructor() {
        this.searchInput = document.getElementById('quickSearch');
        this.init();
    }

    init() {
        if (this.searchInput) {
            this.searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch();
                }
            });
        }

        const searchBtn = document.querySelector('.search-btn');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => this.performSearch());
        }
    }

    performSearch() {
        const query = this.searchInput.value.trim().toLowerCase();
        if (!query) return;

        // Filter resources based on search query
        this.filterResources(query);

        // Scroll to map section
        document.getElementById('mapa')?.scrollIntoView({ behavior: 'smooth' });
    }

    filterResources(query) {
        const resourceItems = document.querySelectorAll('.resource-item');
        let visibleCount = 0;

        resourceItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            if (text.includes(query)) {
                item.style.display = 'block';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });

        console.log(`Found ${visibleCount} resources matching "${query}"`);
    }
}

// Alert Banner Manager
class AlertManager {
    constructor() {
        this.banner = document.getElementById('alertBanner');
        this.init();
    }

    init() {
        // Check for alerts in localStorage
        const alerts = this.getAlerts();
        if (alerts.length > 0) {
            this.showAlert(alerts[0]);
        }

        // Setup close button
        const closeBtn = this.banner?.querySelector('.alert-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeAlert());
        }
    }

    showAlert(alert) {
        if (!this.banner) return;

        const alertText = this.banner.querySelector('.alert-text');
        if (alertText) {
            alertText.setAttribute('data-es', alert.es);
            alertText.setAttribute('data-en', alert.en);
            alertText.textContent = alert.es; // Will be updated by language manager
        }

        this.banner.style.display = 'block';
    }

    closeAlert() {
        if (this.banner) {
            this.banner.style.display = 'none';
        }
    }

    getAlerts() {
        // In production, this would fetch from an API
        // For now, return sample data
        return [];
    }
}

// Filter Manager (for map resources)
class FilterManager {
    constructor() {
        this.activeFilter = 'all';
        this.init();
    }

    init() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');
                this.setFilter(filter);
                this.updateUI(btn);
            });
        });
    }

    setFilter(filter) {
        this.activeFilter = filter;
        this.applyFilter();
    }

    updateUI(activeBtn) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        activeBtn.classList.add('active');
    }

    applyFilter() {
        const resourceItems = document.querySelectorAll('.resource-item');

        resourceItems.forEach(item => {
            const type = item.getAttribute('data-type');

            if (this.activeFilter === 'all' || type === this.activeFilter) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });

        // Also update map markers if map is loaded
        if (window.mapManager) {
            window.mapManager.filterMarkers(this.activeFilter);
        }
    }
}

// Form Handler
class FormManager {
    constructor() {
        this.form = document.getElementById('reportForm');
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }

    async handleSubmit(e) {
        e.preventDefault();

        const formData = {
            type: document.getElementById('resourceType').value,
            state: document.getElementById('state').value,
            location: document.getElementById('location').value,
            description: document.getElementById('description').value,
            contact: document.getElementById('contact').value,
            timestamp: new Date().toISOString()
        };

        // In production, send to backend API
        console.log('Form submitted:', formData);

        // For now, save to localStorage
        this.saveToLocalStorage(formData);

        // Show success message
        this.showSuccessMessage();

        // Reset form
        this.form.reset();
    }

    saveToLocalStorage(data) {
        const submissions = JSON.parse(localStorage.getItem('submissions') || '[]');
        submissions.push(data);
        localStorage.setItem('submissions', JSON.stringify(submissions));
    }

    showSuccessMessage() {
        const lang = window.langManager?.currentLang || 'es';
        const message = lang === 'es'
            ? '¡Gracias! Tu reporte será revisado dentro de 24 horas.'
            : 'Thank you! Your report will be reviewed within 24 hours.';

        alert(message);
    }
}

// Resource Data Manager
class ResourceDataManager {
    constructor() {
        this.resources = [];
        this.init();
    }

    async init() {
        await this.loadResources();
        this.renderResources();
    }

    async loadResources() {
        // In production, fetch from API
        // For now, use sample data
        this.resources = this.getSampleData();
    }

    getSampleData() {
        return [
            {
                id: 1,
                type: 'food',
                title: 'CLAP - Distribución de Alimentos',
                state: 'Distrito Capital',
                location: 'Parroquia La Candelaria, Plaza Bolívar',
                description: 'Distribución de cajas CLAP todos los lunes y jueves de 8am a 12pm. Traer cédula.',
                verified: true,
                lastUpdated: '2026-01-03',
                coordinates: [10.5061, -66.9146]
            },
            {
                id: 2,
                type: 'health',
                title: 'Centro de Salud Santa Rosa',
                state: 'Miranda',
                location: 'Los Teques, Av. Bolívar',
                description: 'Consultas gratuitas de lunes a viernes, 7am-2pm. Disponibilidad limitada de medicamentos.',
                verified: true,
                lastUpdated: '2026-01-02',
                coordinates: [10.3447, -67.0433]
            },
            {
                id: 3,
                type: 'water',
                title: 'Punto de Agua Potable',
                state: 'Zulia',
                location: 'Maracaibo, Sector Los Haticos',
                description: 'Camión cisterna con agua potable todos los días. Traer recipientes.',
                verified: false,
                lastUpdated: '2026-01-04',
                coordinates: [10.6666, -71.6123]
            },
            {
                id: 4,
                type: 'health',
                title: 'Farmacia Comunitaria Cruz Roja',
                state: 'Carabobo',
                location: 'Valencia, Av. Bolívar Norte',
                description: 'Medicamentos a precios solidarios. Atención lunes a sábado 8am-5pm.',
                verified: true,
                lastUpdated: '2026-01-03',
                coordinates: [10.1621, -68.0077]
            },
            {
                id: 5,
                type: 'food',
                title: 'Comedor Comunitario Cáritas',
                state: 'Lara',
                location: 'Barquisimeto, Parroquia Concepción',
                description: 'Almuerzo gratuito para familias de bajos recursos. Lunes a viernes 12pm-2pm.',
                verified: true,
                lastUpdated: '2026-01-04',
                coordinates: [10.0647, -69.3570]
            }
        ];
    }

    renderResources() {
        const container = document.getElementById('resourceList');
        if (!container) return;

        container.innerHTML = '';

        this.resources.forEach(resource => {
            const item = this.createResourceElement(resource);
            container.appendChild(item);
        });
    }

    createResourceElement(resource) {
        const div = document.createElement('div');
        div.className = 'resource-item';
        div.setAttribute('data-type', resource.type);
        div.setAttribute('data-id', resource.id);

        const typeIcons = {
            food: '🍽️',
            health: '🏥',
            water: '💧',
            shelter: '🏠'
        };

        const verifiedBadge = resource.verified
            ? '<span class="resource-badge badge-verified">Verificado</span>'
            : '<span class="resource-badge badge-pending">Pendiente</span>';

        div.innerHTML = `
            <div class="resource-header">
                <h4 class="resource-title">${typeIcons[resource.type]} ${resource.title}</h4>
                ${verifiedBadge}
            </div>
            <p class="resource-location">📍 ${resource.state} - ${resource.location}</p>
            <p class="resource-description">${resource.description}</p>
            <div class="resource-meta">
                <span>Actualizado: ${this.formatDate(resource.lastUpdated)}</span>
            </div>
        `;

        return div;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const lang = window.langManager?.currentLang || 'es';

        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString(lang === 'es' ? 'es-VE' : 'en-US', options);
    }

    getResourcesByType(type) {
        if (type === 'all') return this.resources;
        return this.resources.filter(r => r.type === type);
    }
}

// Offline Support Manager
class OfflineManager {
    constructor() {
        this.init();
    }

    init() {
        window.addEventListener('online', () => this.updateOnlineStatus(true));
        window.addEventListener('offline', () => this.updateOnlineStatus(false));

        // Check initial status
        this.updateOnlineStatus(navigator.onLine);
    }

    updateOnlineStatus(isOnline) {
        if (!isOnline) {
            this.showOfflineNotice();
        } else {
            this.hideOfflineNotice();
            this.syncPendingData();
        }
    }

    showOfflineNotice() {
        const lang = window.langManager?.currentLang || 'es';
        const message = lang === 'es'
            ? 'Sin conexión - Mostrando datos guardados'
            : 'Offline - Showing cached data';

        const banner = document.getElementById('alertBanner');
        if (banner) {
            const alertText = banner.querySelector('.alert-text');
            if (alertText) {
                alertText.textContent = '📱 ' + message;
            }
            banner.style.display = 'block';
            banner.style.background = '#6C757D';
        }
    }

    hideOfflineNotice() {
        const banner = document.getElementById('alertBanner');
        if (banner && banner.querySelector('.alert-text')?.textContent.includes('📱')) {
            banner.style.display = 'none';
        }
    }

    async syncPendingData() {
        // In production, sync pending form submissions to server
        console.log('Syncing pending data...');
    }
}

// Donation Handler
class DonationManager {
    constructor() {
        this.init();
    }

    init() {
        const donateBtn = document.querySelector('.btn-donate');
        if (donateBtn) {
            donateBtn.addEventListener('click', () => this.showDonationModal());
        }
    }

    showDonationModal() {
        const lang = window.langManager?.currentLang || 'es';
        const message = lang === 'es'
            ? 'Función de donación próximamente. Por favor contacta a info@ayudavenezuela.org'
            : 'Donation feature coming soon. Please contact info@ayudavenezuela.org';

        alert(message);
    }
}

// Analytics (Privacy-focused)
class AnalyticsManager {
    constructor() {
        this.sessionStart = Date.now();
        this.init();
    }

    init() {
        this.trackPageView();
        this.setupEventTracking();
    }

    trackPageView() {
        // In production, send to privacy-focused analytics (e.g., Matomo)
        console.log('Page view tracked');
    }

    setupEventTracking() {
        // Track important interactions
        document.querySelectorAll('.dashboard-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const title = card.querySelector('.card-title')?.textContent;
                this.trackEvent('dashboard_click', { card: title });
            });
        });
    }

    trackEvent(eventName, data = {}) {
        // In production, send to analytics
        console.log('Event tracked:', eventName, data);
    }
}

// Initialize all managers when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize language manager first
    window.langManager = new LanguageManager();

    // Initialize other managers
    window.searchManager = new SearchManager();
    window.alertManager = new AlertManager();
    window.filterManager = new FilterManager();
    window.formManager = new FormManager();
    window.resourceDataManager = new ResourceDataManager();
    window.offlineManager = new OfflineManager();
    window.donationManager = new DonationManager();
    window.analyticsManager = new AnalyticsManager();

    console.log('AyudaVenezuela.org initialized successfully');
});

// Utility Functions
const Utils = {
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    formatNumber(num) {
        return new Intl.NumberFormat('es-VE').format(num);
    },

    sanitizeHTML(str) {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    }
};

// Export for use in other scripts
window.Utils = Utils;
