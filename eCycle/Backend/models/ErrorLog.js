const mongoose = require('mongoose');

const errorLogSchema = new mongoose.Schema({
    message: { type: String, required: true },
    stack: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ErrorLog', errorLogSchema);
