const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const User = require('./models/User');
const Testimonial = require('./models/Testimonial');
const Order = require('./models/Order');
const ErrorLog = require('./models/ErrorLog');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../Frontend')));

mongoose.connect('mongodb://localhost:27017/eCycle', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB', err);
    logError(err);
});

async function logError(err) {
    try {
        const errorLog = new ErrorLog({ message: err.message, stack: err.stack });
        await errorLog.save();
    } catch (logErr) {
        console.error('Error logging to MongoDB', logErr);
    }
}

function generateOrderId() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    let orderId = '#';
    for (let i = 0; i < 4; i++) {
        orderId += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    for (let i = 0; i < 4; i++) {
        orderId += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    return orderId;
}

app.post('/api/users/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const user = new User({ name, email, password });
        await user.save();
        console.log('User registered:', user);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Error registering user', err);
        logError(err);
        res.status(500).json({ error: 'Error registering user', details: err.message });
    }
});

app.post('/api/users/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email, password });
        if (user) {
            console.log('User logged in:', user);
            res.status(200).json({ message: 'Login successful', userName: user.name });
        } else {
            res.status(400).json({ error: 'Invalid email or password' });
        }
    } catch (err) {
        console.error('Error logging in', err);
        logError(err);
        res.status(500).json({ error: 'Error logging in', details: err.message });
    }
});

app.post('/api/users/logout', async (req, res) => {
    try {
        // Perform any necessary logout operations here
        console.log('User logged out');
        res.status(200).json({ message: 'Logout successful' });
    } catch (err) {
        console.error('Error logging out:', err.message);
        console.error('Stack trace:', err.stack);
        logError(err);
        res.status(500).json({ error: 'Error logging out', details: err.message });
    }
});

app.post('/api/testimonials', async (req, res) => {
    const { userName, message } = req.body;
    try {
        const testimonial = new Testimonial({ userName, message });
        await testimonial.save();
        console.log('Testimonial added:', testimonial);
        res.status(201).json({ message: 'Testimonial added successfully' });
    } catch (err) {
        console.error('Error adding testimonial', err);
        logError(err);
        res.status(500).json({ error: 'Error adding testimonial', details: err.message });
    }
});

// Endpoint to create an order
app.post('/api/orders/create', async (req, res) => {
    const orderData = req.body;
    try {
        orderData.orderId = generateOrderId();
        const order = new Order(orderData);
        await order.save();
        console.log('Order created:', order);
        res.status(201).json({ message: 'Order created successfully', orderId: order.orderId });
    } catch (err) {
        console.error('Error creating order', err);
        logError(err);
        res.status(500).json({ error: 'Error creating order', details: err.message });
    }
});

// Endpoint to confirm an order
app.post('/api/orders/confirm', async (req, res) => {
    const { orderId } = req.body;
    try {
        const order = await Order.findOne({ orderId });
        if (order) {
            console.log('Order confirmed:', orderId);
            res.status(200).json({ message: 'Order confirmed successfully' });
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (err) {
        console.error('Error confirming order', err);
        logError(err);
        res.status(500).json({ error: 'Error confirming order', details: err.message });
    }
});

// Endpoint to get all orders (for testing purposes)
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find();
        console.log('Orders fetched:', orders);
        res.status(200).json(orders);
    } catch (err) {
        console.error('Error fetching orders', err);
        logError(err);
        res.status(500).json({ error: 'Error fetching orders', details: err.message });
    }
});

// Serve the index.html file for any other requests
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
