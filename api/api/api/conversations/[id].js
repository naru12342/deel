const mongoose = require('mongoose');
const Conversation = require('../server/Conversation'); // モデルのパスを適切に調整
const { connectToDatabase } = require('../utils/db'); // DB接続用のユーティリティ関数（後述）

module.exports = async (req, res) => {
  await connectToDatabase(); // MongoDBへの接続

  if (req.method === 'DELETE') {
    const { id } = req.query;
    await Conversation.findByIdAndDelete(id);
    return res.json({ message: `Conversation with id ${id} has been deleted` });
  }
};
