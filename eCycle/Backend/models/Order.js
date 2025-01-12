const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderId: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    cardNumber: { type: String, required: true },
    cardName: { type: String, required: true },
    expiryDate: { type: String, required: true },
    cvv: { type: String, required: true },
    cartItems: { type: Array, required: true },
    totalPrice: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
