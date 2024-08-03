export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log(
          '[service worker] registration success:',
          registration.scope,
        );
      })
      .catch((err) => {
        console.log('[service worker] registration failed:', err);
      });
  }
};
