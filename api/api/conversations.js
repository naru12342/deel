const mongoose = require('mongoose');
const Conversation = require('../models/Conversation'); // モデルのパスを適切に調整
const { connectToDatabase } = require('../utils/db'); // DB接続用のユーティリティ関数

module.exports = async (req, res) => {
  await connectToDatabase(); // MongoDBへの接続

  if (req.method === 'GET') {
    // GETリクエストの処理: 保存された会話を取得
    const conversations = await Conversation.find().sort('-createdAt');
    return res.json(conversations);
  } else if (req.method === 'POST') {
    // POSTリクエストの処理: 新しい会話を作成または既存の会話を更新
    const { messages, conversationId, startTime } = req.body;
    try {
      let conversation;
      const startTimestamp = startTime ? new Date(startTime) : new Date();

      if (conversationId) {
        // 既存の会話を更新
        conversation = await Conversation.findOneAndUpdate(
          { conversationId },
          { $set: { messages, createdAt: startTimestamp }},
          { new: true, upsert: true } // 存在しない場合は新規作成
        );
      } else {
        // 新しい会話を作成
        conversation = new Conversation({
          conversationId: uuidv4(), // 新しいUUIDを生成
          messages,
          isActive: true,
          createdAt: startTimestamp,
        });
        await conversation.save();
      }
      res.json(conversation);
    } catch (error) {
      console.error('Error saving conversation: ', error);
      res.status(500).send('Error saving conversation');
    }
  } else {
    // 対応していないHTTPメソッドの処理
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

