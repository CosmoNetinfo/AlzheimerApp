import { Geolocation } from '@capacitor/geolocation';

/**
 * Recupera la posizione attuale dell'utente.
 * @returns {Promise<{latitude: number, longitude: number}>}
 */
export const getCurrentPosition = async () => {
    try {
        const permissions = await Geolocation.checkPermissions();
        
        if (permissions.location !== 'granted') {
            const request = await Geolocation.requestPermissions();
            if (request.location !== 'granted') {
                throw new Error('Permessi di geolocalizzazione negati');
            }
        }

        const coordinates = await Geolocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 10000
        });

        return {
            latitude: coordinates.coords.latitude,
            longitude: coordinates.coords.longitude
        };
    } catch (error) {
        console.error('Errore durante l\'acquisizione della posizione:', error);
        throw error;
    }
};

/**
 * Esegue il reverse geocoding di base via Nominatim (OpenStreetMap).
 * Nota: In produzione sarebbe meglio usare un servizio a pagamento come Google Maps o Mapbox.
 * @param {number} lat 
 * @param {number} lng 
 * @returns {Promise<string>}
 */
export const getAddressFromCoords = async (lat, lng) => {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
            {
                headers: {
                    'Accept-Language': 'it-IT,it;q=0.9'
                }
            }
        );
        const data = await response.json();
        return data.display_name || 'Posizione ignota';
    } catch (error) {
        console.error('Errore durante il reverse geocoding:', error);
        return 'Indirizzo non disponibile';
    }
};
