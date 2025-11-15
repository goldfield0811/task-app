// service-worker.js

const CACHE_NAME = "simple-task-app-cache-v1";
const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

// インストール時：キャッシュに必要なファイルを保存
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 有効化時：古いキャッシュがあれば削除
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// フェッチ時：キャッシュ優先（なければネットワークへ）
self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") return;

  event.respondWith(
    caches.match(request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(request).catch(() => {
        // オフラインかつキャッシュもない場合のフォールバックを入れたければここ
      });
    })
  );
});
