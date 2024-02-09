//index.js
require('dotenv').config({ path: './server/.env' });

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Conversation = require('./Conversation'); // Conversation モデルのインポート
const cors = require('cors'); // CORS ミドルウェアのインポート
const { v4: uuidv4 } = require('uuid');
const app = express();
const PORT = process.env.PORT || 3002;
const webPush = require('web-push');
const schedule = require('node-schedule');
const Subscription = require('./models/Subscription'); // 作成したサブスクリプションモデルをインポート
const path = require('path');


app.use(express.json()); // expressの組み込みbody-parserを使用
app.use(cors()); // すべてのオリジンからのリクエストを許可

// 環境変数からMongoDBのURIを取得
const mongoDBUrl = process.env.MONGODB_URI;

mongoose.connect(mongoDBUrl)
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));
// VAPIDキーを設定
// 環境変数からVAPIDキーを読み込む
const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;

webPush.setVapidDetails(
  'mailto:your-email@example.com',
  publicVapidKey,
  privateVapidKey
);
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// 保存された会話を取得するエンドポイント
app.get('/api/conversations', async (req, res) => {
  const conversations = await Conversation.find().sort('-createdAt');
  res.send(conversations);
});

app.post('/api/conversations', async (req, res) => {
  const { messages, conversationId, startTime } = req.body;
  try {
    let conversation;
    // startTimeが提供された場合、その値を使用して会話の開始時刻を設定
    const startTimestamp = startTime ? new Date(startTime) : new Date();

    if (conversationId) {
      // 既存の会話を更新する場合
      conversation = await Conversation.findOneAndUpdate(
        { conversationId },
        { 
          $set: { messages, createdAt: startTimestamp },
        },
        { new: true }
      );
    } else {
      // 新しい会話を作成する場合
      conversation = new Conversation({
        conversationId: new mongoose.Types.ObjectId(), // 新しいIDを生成
        messages,
        isActive: true,
        createdAt: startTimestamp,
      });
      await conversation.save();
    }
    res.send(conversation);
  } catch (error) {
    console.error('Error saving conversation: ', error);
    res.status(500).send('Error saving conversation');
  }
});



app.delete('/api/conversations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Conversation.findByIdAndDelete(id);
    res.send(`Conversation with id ${id} has been deleted`);
  } catch (error) {
    res.status(500).send('Error deleting conversation: ' + error);
  }
});

// サブスクライブエンドポイント
app.post('/subscribe', async (req, res) => {
  const subscription = new Subscription(req.body);
  try {
    await subscription.save();
    console.log('Subscription saved:', subscription);
    res.status(201).json({ message: 'Subscription saved.' });
  } catch (error) {
    console.error('Error saving subscription:', error);
    res.status(500).json({ message: 'Error saving subscription.' });
  }
});
app.post('/api/conversations/summary', async (req, res) => {
  const { conversationId, summary } = req.body;

  try {
    const updatedConversation = await Conversation.findOneAndUpdate(
      { conversationId: conversationId },
      { $set: { summary: summary } },
      { new: true }
    );
    if(updatedConversation) {
      res.json({ message: 'Summary saved successfully', conversation: updatedConversation });
    } else {
      res.status(404).send('Conversation not found');
    }
  } catch (error) {
    res.status(500).send('Error saving summary: ' + error);
  }
});



app.get('/send-test-notification', async (req, res) => {
  try {
    // 保存されたすべてのサブスクリプションを取得
    const subscriptions = await Subscription.find();

    // 各サブスクリプションに対して通知を送信
    subscriptions.forEach(subscription => {
      webPush.sendNotification(subscription, JSON.stringify({
        title: 'テスト通知',
        message: 'これはテスト通知です'
      })).catch(error => console.error(error));
    });

    res.send('テスト通知を送信しました');
  } catch (error) {
    res.status(500).send('テスト通知の送信に失敗しました: ' + error);
  }
});
async function sendNotifications() {
  const subscriptions = await Subscription.find();

  subscriptions.forEach(subscription => {
    webPush.sendNotification(subscription, JSON.stringify({
      title: '通知のタイトル',
      message: '通知の内容'
    })).catch(error => console.error(error));
  });
}
// VAPIDキーを設定（環境変数から読み込むべき）
webPush.setVapidDetails(
  'mailto:example@yourdomain.org',
  process.env.PUBLIC_VAPID_KEY,
  process.env.PRIVATE_VAPID_KEY
);


// 例: 毎日10時に通知を送信する
schedule.scheduleJob('0 10 * * *', () => {
  sendNotifications();
});

// 通知を送信する関数cd 
function sendNotification(subscription, message) {
  webPush.sendNotification(subscription, JSON.stringify({ title: 'テスト', message }))
      .catch(error => console.error(error));
}

// Reactの静的ファイルを配信
app.use(express.static(path.join(__dirname, '/Users/itounasa/Desktop/卒業制作/react4/my-diary-app/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/Users/itounasa/Desktop/卒業制作/react4/my-diary-app/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



path.join(__dirname, 'build')