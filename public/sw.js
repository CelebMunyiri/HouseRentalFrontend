self.addEventListener('push', (event) => {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icon.png', // optional icon
      badge: '/badge.png' // optional badge
    };
  
    event.waitUntil(self.registration.showNotification(data.title, options));
  });
  
  self.addEventListener('notificationclick', (event) => {
    event.notification.close();
  
    event.waitUntil(
      clients.openWindow('http:/localhost:5173') // URL to navigate when notification is clicked
    );
  });
  