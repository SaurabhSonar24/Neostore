const mongoose = require('mongoose');
const colSchema = new mongoose.Schema({
  color_name: {
    type: String,
    required: true,
    unique: true
  },
  color_code: {
    type: String,
    required: true
  },
  color_id: {
    type: String,
    required: false
  },
})
module.exports = mongoose.model('Color', colSchema);