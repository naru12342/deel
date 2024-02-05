
// conversation.js

const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  conversationId: { type: String, required: true, unique: true },
  messages: [{
    type: { type: String, required: true },  // 'user' または 'bot'
    text: { type: String, required: true }
  }],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  dateLabel: { type: String }, // デフォルト値を削除
  summary: { type: String, default: '' } // 要約を保存するためのフィールドを追加
});

const Conversation = mongoose.model('Conversation', conversationSchema);
module.exports = Conversation;
