import { handleMessageFromClient } from './Utilities/messageHandler';
import setupWorkbox from './setupWorkbox';
import registerRoutes from './registerRoutes';
import registerMessageHandlers from './registerMessageHandlers';

const cacheName = 'b2bstore-v1';
const appShellFiles = [
    '@magento/venia-ui/lib/RootComponents/Category/category.js',
    '@magento/venia-ui/lib/components/App/app.js',
    '@magento/venia-ui/lib/components/ProductFullDetail/productFullDetail.js',
    '@magento/venia-concept/custom-static/favicon.icon',
    '@magento/peregrine/lib/talons/RootComponents/Category/useCategoryContent.js',
    '@magento/peregrine/lib/talons/CartPage/useCartPage.js',
    '@magento/peregrine/lib/talons/ProductFullDetail/useProductFullDetail.js',
    '@magento/venia-concept/@orienteed/reorder/components/OrderHistoryPage/orderHistoryPage.js',
    '@magento/venia-ui/lib/components/WishlistPage/wishlistPage.js',
    '@magento/venia-ui/lib/components/Gallery/item.js'
];

setupWorkbox();

registerRoutes();

registerMessageHandlers();
// const gamesImages = [];
// for (let i = 0; i < games.length; i++) {
//     gamesImages.push(`data/img/${games[i].slug}.jpg`);
// }
const contentToCache = appShellFiles.concat([]);

self.addEventListener('install', e => {
    console.log('[Service Worker] Install');
    e.waitUntil(
        (async () => {
            const cache = await caches.open(cacheName);
            console.log('[Service Worker] Caching all: app shell and content');
            await cache?.addAll(contentToCache);
        })()
    );
});

self.addEventListener('fetch', e => {
    console.log(`[Service Worker] Fetched resource ${e.request.url}`);
    e.respondWith(
        (async () => {
            const r = await caches.match(e.request);
            console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
            if (r) {
                return r;
            }
            const response = await fetch(e.request);
            const cache = await caches.open(cacheName);
            console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
            cache.put(e.request, response.clone());
            return response;
        })()
    );
});

self.addEventListener('activate', (e) => {
    e.waitUntil(caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key === cacheName) { return; }
        return caches.delete(key);
      }))
    }));
  });

self.addEventListener('message', e => {
    const { type, payload } = e.data;

    handleMessageFromClient(type, payload, e);
});
