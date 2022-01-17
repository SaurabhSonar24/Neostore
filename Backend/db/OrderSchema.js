const mongoose = require('mongoose');
const OrderSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    product_purchased: {
        type: Array,
        required: true
    },
    to_address: {
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        pincode: {
            type: Number,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        }

    },

    subtotal: {
        type: Number,
        required: false

    },
    GST: {
        type: Number,
        required: false

    },
    Order_Total: {
        type: Number,
        required: false

    },
    date: {
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model("orders", OrderSchema);