// ============================================
// AyudaVenezuela.org - Interactive Map Component
// Uses Leaflet.js (lightweight, open-source)
// ============================================

class MapManager {
    constructor() {
        this.map = null;
        this.markers = [];
        this.markerLayer = null;
        this.currentFilter = 'all';
        this.init();
    }

    async init() {
        // Load Leaflet.js dynamically
        await this.loadLeaflet();
        this.initializeMap();
        this.addMarkers();
    }

    async loadLeaflet() {
        // Check if already loaded
        if (window.L) return;

        return new Promise((resolve, reject) => {
            // Load CSS
            const css = document.createElement('link');
            css.rel = 'stylesheet';
            css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            css.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
            css.crossOrigin = '';
            document.head.appendChild(css);

            // Load JS
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
            script.crossOrigin = '';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    initializeMap() {
        const container = document.getElementById('mapContainer');
        if (!container) return;

        // Clear placeholder
        container.innerHTML = '<div id="map" style="width: 100%; height: 100%;"></div>';

        // Center on Venezuela
        const venezuelaCenter = [8.0, -66.0];
        const zoomLevel = 6;

        try {
            this.map = L.map('map').setView(venezuelaCenter, zoomLevel);

            // Add tile layer (OpenStreetMap - free, no API key needed)
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 18,
                minZoom: 5
            }).addTo(this.map);

            // Create marker layer group
            this.markerLayer = L.layerGroup().addTo(this.map);

            console.log('Map initialized successfully');
        } catch (error) {
            console.error('Map initialization failed:', error);
            this.showMapError();
        }
    }

    addMarkers() {
        if (!this.map || !window.resourceDataManager) return;

        const resources = window.resourceDataManager.resources;

        resources.forEach(resource => {
            if (resource.coordinates) {
                const marker = this.createMarker(resource);
                this.markers.push({ marker, resource });
            }
        });
    }

    createMarker(resource) {
        const [lat, lng] = resource.coordinates;

        // Custom icon based on type
        const icon = this.getIconForType(resource.type);

        const marker = L.marker([lat, lng], { icon })
            .bindPopup(this.createPopupContent(resource))
            .addTo(this.markerLayer);

        return marker;
    }

    getIconForType(type) {
        const iconColors = {
            food: '#FECB00',      // Venezuelan yellow
            health: '#CF142B',     // Venezuelan red
            water: '#17A2B8',      // Info blue
            shelter: '#28A745'     // Success green
        };

        const color = iconColors[type] || '#00247D';

        const iconHtml = `
            <div style="
                background-color: ${color};
                width: 30px;
                height: 30px;
                border-radius: 50% 50% 50% 0;
                border: 3px solid white;
                transform: rotate(-45deg);
                box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            ">
                <div style="
                    transform: rotate(45deg);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    height: 100%;
                    font-size: 14px;
                ">
                    ${this.getEmojiForType(type)}
                </div>
            </div>
        `;

        return L.divIcon({
            html: iconHtml,
            className: 'custom-marker',
            iconSize: [30, 30],
            iconAnchor: [15, 30],
            popupAnchor: [0, -30]
        });
    }

    getEmojiForType(type) {
        const emojis = {
            food: '🍽️',
            health: '🏥',
            water: '💧',
            shelter: '🏠'
        };
        return emojis[type] || '📍';
    }

    createPopupContent(resource) {
        const lang = window.langManager?.currentLang || 'es';
        const verifiedText = lang === 'es' ? 'Verificado' : 'Verified';
        const pendingText = lang === 'es' ? 'Pendiente' : 'Pending';

        const verifiedBadge = resource.verified
            ? `<span style="background: #28A745; color: white; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">${verifiedText}</span>`
            : `<span style="background: #FFC107; color: #212529; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">${pendingText}</span>`;

        return `
            <div style="min-width: 200px; max-width: 300px;">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                    <strong style="color: #00247D; font-size: 14px; flex: 1;">${resource.title}</strong>
                    ${verifiedBadge}
                </div>
                <p style="margin: 5px 0; font-size: 13px; color: #6C757D;">
                    📍 ${resource.state}
                </p>
                <p style="margin: 5px 0; font-size: 13px; color: #6C757D;">
                    ${resource.location}
                </p>
                <p style="margin: 8px 0 0 0; font-size: 13px; line-height: 1.4;">
                    ${resource.description}
                </p>
                <p style="margin: 8px 0 0 0; font-size: 11px; color: #6C757D;">
                    ${lang === 'es' ? 'Actualizado' : 'Updated'}: ${this.formatDate(resource.lastUpdated)}
                </p>
            </div>
        `;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const lang = window.langManager?.currentLang || 'es';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString(lang === 'es' ? 'es-VE' : 'en-US', options);
    }

    filterMarkers(type) {
        this.currentFilter = type;

        this.markers.forEach(({ marker, resource }) => {
            if (type === 'all' || resource.type === type) {
                this.markerLayer.addLayer(marker);
            } else {
                this.markerLayer.removeLayer(marker);
            }
        });

        // Adjust map bounds to show filtered markers
        if (type !== 'all') {
            this.fitBoundsToVisibleMarkers();
        } else {
            this.map.setView([8.0, -66.0], 6);
        }
    }

    fitBoundsToVisibleMarkers() {
        const visibleMarkers = this.markers
            .filter(({ resource }) => resource.type === this.currentFilter)
            .map(({ marker }) => marker);

        if (visibleMarkers.length > 0) {
            const group = L.featureGroup(visibleMarkers);
            this.map.fitBounds(group.getBounds(), { padding: [50, 50] });
        }
    }

    addUserMarker(lat, lng, title, description) {
        const marker = L.marker([lat, lng])
            .bindPopup(`<strong>${title}</strong><br>${description}`)
            .addTo(this.markerLayer);

        this.markers.push({ marker, resource: { type: 'user', coordinates: [lat, lng] } });
        this.map.setView([lat, lng], 14);
    }

    showMapError() {
        const container = document.getElementById('mapContainer');
        if (container) {
            const lang = window.langManager?.currentLang || 'es';
            const errorMsg = lang === 'es'
                ? 'Error al cargar el mapa. Verifica tu conexión e intenta nuevamente.'
                : 'Error loading map. Check your connection and try again.';

            container.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; height: 100%; flex-direction: column; color: #6C757D;">
                    <p style="font-size: 2rem; margin-bottom: 1rem;">🗺️</p>
                    <p style="text-align: center; padding: 0 1rem;">${errorMsg}</p>
                </div>
            `;
        }
    }

    // Geolocation support
    getUserLocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation not supported'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => {
                    reject(error);
                },
                {
                    enableHighAccuracy: false,
                    timeout: 10000,
                    maximumAge: 300000 // 5 minutes
                }
            );
        });
    }

    async centerOnUser() {
        try {
            const location = await this.getUserLocation();
            this.map.setView([location.lat, location.lng], 12);

            // Add a marker for user location
            L.marker([location.lat, location.lng], {
                icon: L.divIcon({
                    html: '<div style="width: 20px; height: 20px; background: #007bff; border: 3px solid white; border-radius: 50%; box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>',
                    className: 'user-location-marker',
                    iconSize: [20, 20]
                })
            }).bindPopup('Tu ubicación').addTo(this.map);

        } catch (error) {
            console.error('Could not get user location:', error);
        }
    }
}

// Initialize map when resources are loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait for resources to load first
    setTimeout(() => {
        if (document.getElementById('mapContainer')) {
            window.mapManager = new MapManager();
        }
    }, 1000);
});

// Add "Find me" button functionality
function addLocateButton() {
    const mapSection = document.getElementById('mapa');
    if (!mapSection || !window.mapManager) return;

    const lang = window.langManager?.currentLang || 'es';
    const buttonText = lang === 'es' ? '📍 Mi ubicación' : '📍 My location';

    const button = document.createElement('button');
    button.textContent = buttonText;
    button.className = 'filter-btn';
    button.style.cssText = 'margin-top: 1rem; background: #007bff; color: white; border-color: #007bff;';
    button.onclick = () => window.mapManager.centerOnUser();

    const filtersContainer = document.querySelector('.map-filters');
    if (filtersContainer) {
        filtersContainer.appendChild(button);
    }
}

// Add locate button after a delay
setTimeout(addLocateButton, 2000);
