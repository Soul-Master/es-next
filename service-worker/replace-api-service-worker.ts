const sw = self as ServiceWorkerGlobalScope & typeof globalThis;
const targetFile = 'externalLib.js';

function onInstall(e: ExtendableEvent) {
    e.waitUntil(sw.skipWaiting());
}

function onActivate(e: ExtendableEvent) {
    return sw.clients.claim();
}

function onFetch(e: FetchEvent) {
    if (!e.request.url.includes(targetFile)) return;

    const response = fetch(e.request)
        .then(response => response.text())
        .then(text => {
            text = text.replace('return false;', 'return true;');

            return new Response(text, {
                status: 200,
                headers: { 'Content-Type': 'application/javascript' }
            });
        });

    e.respondWith(response);
}

sw.addEventListener('install', onInstall);
sw.addEventListener('activate', onActivate);
sw.addEventListener('fetch', onFetch);