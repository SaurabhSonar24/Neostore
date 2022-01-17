const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
  product_subImages: {
    type: Array,
    required: false

  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  },
  color_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Color"
  },
  product_id: {
    type: String,
    required: true
  },
  product_name: {
    type: String,
    required: true
  },
  product_image: {
    type: String,
    required: true
  },
  product_desc: {
    type: String,
    required: true
  },
  product_rating: {
    type: Number,
    required: false
  },
  product_producer: {
    type: String,
    required: false
  },
  product_cost: {
    type: Number,
    required: false
  },
  product_stock: {
    type: Number,
    required: false
  },
  product_dimension: {
    type: String,
    required: false
  },
  product_material: {
    type: String,
    required: false
  },
  created_at: {
    type: Date,
    default: Date.now
  }
})
module.exports = mongoose.model('Product', productSchema);