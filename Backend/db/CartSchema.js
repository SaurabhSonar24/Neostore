const mongoose = require('mongoose');
const CartSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    product_details: {

        product_name: {
            type: String,
            required: true
        },
        product_image: {
            type: String,
            required: true
        },
        product_cost: {
            type: Number,
            required: true
        },
        product_producer: {
            type: String,
            required: true
        }


    },
    product_id: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true

    },
    total_product_cost: {
        type: Number,
        required: false

    },
    date: {
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model("cart", CartSchema);