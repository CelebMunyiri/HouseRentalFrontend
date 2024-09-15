self.addEventListener('push', (event) => {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: 'https://svgcuts.com/images/maple-manor-house.jpg', // optional icon
      badge: '/badge.png' // optional badge
    };
  
    event.waitUntil(self.registration.showNotification(data.title, options));
  });
  
  self.addEventListener('notificationclick', (event) => {
    event.notification.close();
  
    event.waitUntil(
      clients.openWindow('http:/localhost:5173/houses') // URL to navigate when notification is clicked
    );
  });
  