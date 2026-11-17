const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  category: {
    type: String,
    required: true,
    enum: ['Electronics', 'Books', 'Clothing', 'ID Card', 'Keys', 'Bag', 'Other']
  },
  description: { type: String, required: true },
  location: { type: String, required: true, trim: true },
  date: { type: Date, required: true },
  type: { type: String, enum: ['lost', 'found'], required: true },
  imageUrl: { type: String, default: '' },
  status: { type: String, enum: ['open', 'claimed', 'resolved'], default: 'open' },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

itemSchema.index({ title: 'text', description: 'text', location: 'text' });

module.exports = mongoose.model('Item', itemSchema);
