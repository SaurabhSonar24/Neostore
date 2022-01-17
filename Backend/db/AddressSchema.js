const mongoose = require('mongoose');
const AddressSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true

    },
    city: {
        type: String,
        required: true

    },
    country: {
        type: String,
        required: false

    },
    pincode: {
        type: Number,
        required: false

    },
    state: {
        type: String,
        required: true

    },
    date: {
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model("address", AddressSchema);