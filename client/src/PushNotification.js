// src/PushNotification.js
import React, { useEffect } from 'react';

const PushNotification = () => {
  const checkPermission = () => {
    if (!('serviceWorker' in navigator)) {
      throw new Error("No support for service worker!");
    }

    if (!('Notification' in window)) {
      throw new Error("No support for notification API");
    }

    if (!('PushManager' in window)) {
      throw new Error("No support for Push API");
    }
  };

  const registerSW = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      return registration;
    } catch (error) {
      console.error("Service worker registration failed:", error);
    }
  };

  const requestNotificationPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        throw new Error("Notification permission not granted");
      }
    } catch (error) {
      console.error("Request notification permission failed:", error);
    }
  };

  useEffect(() => {
    const init = async () => {
      checkPermission();
      await requestNotificationPermission();
      await registerSW();
    };
    init();
  }, []);

  return (
    <div>
      <h1>Push Notifications with React</h1>
      <p>Push notifications are set up and ready to go!</p>
    </div>
  );
};

export default PushNotification;
