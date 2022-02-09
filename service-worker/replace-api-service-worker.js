"use strict";
const sw = self;
const targetFile = 'externalLib.js';
function onInstall(e) {
    e.waitUntil(sw.skipWaiting());
}
function onFetch(e) {
    if (!e.request.url.includes(targetFile))
        return;
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
sw.addEventListener('fetch', onFetch);
