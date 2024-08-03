const CACHE_NAME = 'v1';
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000;

const installEvent = () => {
  self.addEventListener('install', () => {
    console.log('service worker installed');
  });
};
installEvent();

const activateEvent = (e) => {
  self.addEventListener('activate', () => {
    console.log('service worker activated');
  });
};
activateEvent();

const fetchEvent = () => {
  const cacheClone = async (e) => {
    const res = await fetch(e.request);
    const resClone = res.clone();

    const cache = await caches.open(CACHE_NAME);
    await cache.put(e.request, resClone);
    return res;
  };

  self.addEventListener('fetch', (e) => {
    e.respondWith(
      cacheClone(e)
        .catch(() => caches.match(e.request))
        .then((res) => res),
    );
  });
};
fetchEvent();
