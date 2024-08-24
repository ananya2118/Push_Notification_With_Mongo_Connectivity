// This file handles service worker registration
export function register() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            const swUrl = '/sw.js';

            navigator.serviceWorker
                .register(swUrl)
                .then((registration) => {
                    console.log('Service Worker registered:', registration);
                })
                .catch((error) => {
                    console.error('Error registering Service Worker:', error);
                });
        });
    }
}
