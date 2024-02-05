// NotificationSubscription.js
import React, { useEffect } from 'react';

const NotificationSubscription = () => {
  useEffect(() => {
    // Service Workerが登録されていることを確認
    if ('serviceWorker' in navigator) {
      // ユーザーに通知の許可を求める
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('Notification permission granted.');

          // Service Workerと通信してサブスクリプションを作成
          navigator.serviceWorker.ready.then(registration => {
            registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array('BC88z6rjQLGaCkKXaK01nLGfCdwivLajsPFLCvTEZum96R9NFTRy6lOK51umJcvSnWP_gxGd7ieyBLVK7GyOmwk')
            }).then(subscription => {
              console.log('Push subscription:', subscription);
              // ここでサブスクリプションをサーバーに送信する
              sendSubscriptionToServer(subscription);
            }).catch(err => {
              console.log('Failed to subscribe', err);
            });
          });
        }
      });
    }
  }, []);

  return <div></div>;
};

// VAPID公開キーをUint8Arrayに変換するヘルパー関数
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
}
return outputArray;
}

// サブスクリプションをサーバーに送信する関数（例）
function sendSubscriptionToServer(subscription) {
// fetch APIを使用してサーバーに送信
fetch('/subscribe', {
method: 'POST',
headers: {
'Content-Type': 'application/json',
},
body: JSON.stringify(subscription),
})
.then(response => response.json())
.then(data => {
console.log('Subscription sent to server:', data);
})
.catch((error) => {
console.error('Error sending subscription:', error);
});
}

export default NotificationSubscription;
