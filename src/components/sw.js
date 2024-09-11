// service-worker.js

self.addEventListener('push', event => {
    const data = event.data.json();
    console.log('Push received:', data);
  
    const options = {
      body: data.body,
      icon: '/path-to-your-icon/icon.png', // Replace with your icon path
      badge: '/path-to-your-badge/badge.png' // Replace with your badge path
    };
  
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  });
  
  self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
      clients.openWindow('https://your-frontend-url.com') // Replace with the URL you want to open on click
    );
  });
  