const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Testimonial', testimonialSchema);
