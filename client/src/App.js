import React, { useEffect } from 'react';
import AnnouncementForm from './AnnouncementForm';

const App = () => {
  useEffect(() => {
    const registerServiceWorkerAndSubscribe = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered:', registration);

        let subscription = await registration.pushManager.getSubscription();

        if (!subscription) {
          const vapidPublicKey = 'BG9-8C1zWZsckfSiajxjnxEizoiMiNP5H3sKfE4YnofMyo3keiJ1Jt4lKMr8udUrEoMv7J1YanVi93TZkOokSQM';
          const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

          subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: convertedVapidKey
          });
        }

        await fetch('http://localhost:8000/save-subscription', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(subscription),
        });

        console.log('Subscription saved successfully');
      } catch (error) {
        console.error('Error registering service worker or subscribing:', error);
      }
    };

    registerServiceWorkerAndSubscribe();
  }, []);

  return (
    <div className="App">
      <h1>Push Notification Demo</h1>
      <AnnouncementForm />
    </div>
  );
};

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default App;
