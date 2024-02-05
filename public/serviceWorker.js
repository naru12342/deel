// serviceWorker.js
self.addEventListener('push', event => {
    const data = event.data.json();
    self.registration.showNotification(data.title, {
      body: data.message,
      icon: '' // 通知に表示するアイコン
    });
  });
//このコードは、プッシュイベントを受け取ったときにブラウザに通知を表示するためのものです。


  