const Subscription = require('../server/models/Subscription'); // モデルのパスを適切に調整
const { connectToDatabase } = require('../utils/db'); // DB接続用のユーティリティ関数（後述）

module.exports = async (req, res) => {
  await connectToDatabase(); // MongoDBへの接続

  const subscription = new Subscription(req.body);
  await subscription.save();
  res.status(201).json({ message: 'Subscription saved.' });
};
