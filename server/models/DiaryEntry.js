const mongoose = require('mongoose');

const diaryEntrySchema = new mongoose.Schema({
  title: String,
  content: String,
  date: {
    type: Date,
    default: Date.now
  }
});

const DiaryEntry = mongoose.model('DiaryEntry', diaryEntrySchema);

module.exports = DiaryEntry;

