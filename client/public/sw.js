// // public/sw.js
// const urlBase64ToUint8Array = (base64String) => {
//     const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
//     const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  
//     const rawData = atob(base64);
//     const outputArray = new Uint8Array(rawData.length);
  
//     for (let i = 0; i < rawData.length; ++i) {
//       outputArray[i] = rawData.charCodeAt(i);
//     }
  
//     return outputArray;
//   };
  
//   const saveSubscription = async (subscription) => {
//     const response = await fetch('http://localhost:8000/save-subscription', {
//       method: 'POST',
//       headers: { 'Content-type': "application/json" },
//       body: JSON.stringify(subscription),
//     });
  
//     return response.json();
//   };
  

// self.addEventListener('activate', async (event) => {
//     console.log('Service Worker activating...');
//     const subscription = await self.registration.pushManager.subscribe({
//         userVisibleOnly: true,
//         applicationServerKey: urlBase64ToUint8Array("BG9-8C1zWZsckfSiajxjnxEizoiMiNP5H3sKfE4YnofMyo3keiJ1Jt4lKMr8udUrEoMv7J1YanVi93TZkOokSQM")
//     });
//     console.log('Subscription:', subscription);
//     await saveSubscription(subscription);
// });

// self.addEventListener('push', (event) => {
//     console.log('Push event received:', event);
//     if (event.data) {
//         console.log('Push event data:', event.data.text());
//         self.registration.showNotification('Notification Title', {
//             body: event.data.text(),
//             icon: '/path-to-your-icon.png' // Ensure this path is correct
//         });
//     } else {
//         console.log('Push event but no data');
//     }
// });

// sw.js

self.addEventListener('push', function(event) {
    const data = event.data.json();
    console.log('Push received:', data);

    const options = {
        body: data.body,
         // Optional: Vibration pattern
        data: {
            dateOfArrival: Date.now(),
            primaryKey: '2'
        }
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('https://your-website-url.com') // URL to open when clicking the notification
    );
});
