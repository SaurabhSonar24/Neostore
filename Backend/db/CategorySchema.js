const mongoose = require('mongoose');
const catSchema = new mongoose.Schema({
  category_name: {
    type: String,
    required: true,
    unique: true
  },
  product_image: {
    type: String,
    required: false
  },
  category_id: {
    type: String,
    required: false
  },
  created_at: {
    type: Date,
    default: Date.now
  }
})
module.exports = mongoose.model('Category', catSchema);