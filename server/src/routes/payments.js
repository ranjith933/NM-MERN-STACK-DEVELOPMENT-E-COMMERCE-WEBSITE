const app = require("../app");
const models = require("../models/schema");

// Create a payment
app.post('/api/admin/create-payment', async (req, res) => {
    try {
        const { userId, orderId, amount, paymentMethod, deliveryStatus } = req.body;

        // Check for missing required fields
        if (!userId || !orderId || !amount || !paymentMethod || !deliveryStatus) {
            return res.status(400).send({ message: 'Missing required fields' });
        }

        // Check if the order exists
        const foundOrder = await models.Order.findById(orderId);
        if (!foundOrder) {
            return res.status(404).send({ message: 'Order not found' });
        }

        // Create a new payment record
        const payment = new models.Payment({
            user: userId,
            order: orderId,
            amount,
            paymentMethod,
            deliveryStatus,
            status: 'Pending', // Default status is 'Pending'
        });

        // Save the payment to the database
        await payment.save();

        // Update the order status if payment is successful
        foundOrder.status = 'Confirmed'; // Optionally change order status after successful payment
        await foundOrder.save();

        // Return success response with the created payment
        res.status(201).send({ message: 'Payment created successfully', payment });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal server error' });
    }
});

// Get all payments
app.get('/api/admin/get-payments', async (req, res) => {
    try {
        // Get all payments from the database
        const payments = await models.Payment.find().populate('user', 'firstname lastname email').populate('order', 'productName price');
        res.status(200).send(payments);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal server error' });
    }
});

// Get payment by ID
app.get('/api/admin/get-payment/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Find payment by ID
        const payment = await models.Payment.findById(id)
            .populate('user', 'firstname lastname email')
            .populate('order', 'productName price');
        if (!payment) {
            return res.status(404).send({ message: 'Payment not found' });
        }

        res.status(200).send(payment);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal server error' });
    }
});

// Update payment status
app.put('/api/admin/update-payment/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, deliveryStatus } = req.body;

        // Find the payment to update
        const payment = await models.Payment.findById(id);
        if (!payment) {
            return res.status(404).send({ message: 'Payment not found' });
        }

        // Update payment fields
        if (status) payment.status = status; // 'Pending', 'Success', or 'Failed'
        if (deliveryStatus) payment.deliveryStatus = deliveryStatus; // 'Pending', 'Shipped', 'Delivered', etc.

        // Save the updated payment
        await payment.save();

        // Return success response
        res.status(200).send({ message: 'Payment updated successfully', payment });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal server error' });
    }
});

// Delete payment
app.delete('/api/admin/delete-payment/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Find the payment to delete
        const payment = await models.Payment.findById(id);
        if (!payment) {
            return res.status(404).send({ message: 'Payment not found' });
        }

        // Delete the payment record
        await payment.remove();

        // Return success response
        res.status(200).send({ message: 'Payment deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal server error' });
    }
});

// Get payments by status
app.get('/api/admin/get-payments-by-status/:status', async (req, res) => {
    try {
        const { status } = req.params;

        // Find payments with a specific status
        const payments = await models.Payment.find({ status }).populate('user', 'firstname lastname email').populate('order', 'productName price');
        res.status(200).send(payments);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal server error' });
    }
});
