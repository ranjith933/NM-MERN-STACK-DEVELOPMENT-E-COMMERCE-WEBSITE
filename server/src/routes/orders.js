const app = require("../app");
const models = require("../models/schema");

// Create an order
app.post('/api/admin/create-order', async (req, res) => {
    try {
        const { userId, productId, productName, quantity, price, paymentMethod, address, phone } = req.body;

        // Check for missing required fields
        if (!userId || !productId || !productName || !quantity || !price || !paymentMethod || !address || !phone) {
            return res.status(400).send({ message: 'Missing required fields' });
        }

        // Check if product exists
        const foundProduct = await models.Product.findById(productId);
        if (!foundProduct) {
            return res.status(404).send({ message: 'Product not found' });
        }

        // Create a new order
        const order = new models.Order({
            user: userId,
            productId,
            productName,
            quantity,
            price,
            paymentMethod,
            address,
            phone,
            status: 'Pending', // Initial status is 'Pending'
        });

        // Save the order to the database
        await order.save();

        // Return success response with the created order
        res.status(201).send({ message: 'Order created successfully', order });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal server error' });
    }
});

// Get all orders
app.get('/api/admin/get-orders', async (req, res) => {
    try {
        // Get all orders from the database
        const orders = await models.Order.find().populate('user', 'firstname lastname email'); // Optionally populate user details
        res.status(200).send(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal server error' });
    }
});

// Get order details by ID
app.get('/api/admin/get-order/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Find order by ID
        const order = await models.Order.findById(id).populate('user', 'firstname lastname email').populate('productId', 'productname price');
        if (!order) {
            return res.status(404).send({ message: 'Order not found' });
        }

        res.status(200).send(order);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal server error' });
    }
});

// Update an order (e.g., status change)
app.put('/api/admin/update-order/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, paymentMethod, address, phone } = req.body;

        // Find the order to update
        const order = await models.Order.findById(id);
        if (!order) {
            return res.status(404).send({ message: 'Order not found' });
        }

        // Update the order fields
        if (status) order.status = status;
        if (paymentMethod) order.paymentMethod = paymentMethod;
        if (address) order.address = address;
        if (phone) order.phone = phone;

        // Save the updated order
        await order.save();

        // Return success response
        res.status(200).send({ message: 'Order updated successfully', order });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal server error' });
    }
});

// Delete an order
app.delete('/api/admin/delete-order/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Find the order to delete
        const order = await models.Order.findById(id);
        if (!order) {
            return res.status(404).send({ message: 'Order not found' });
        }

        // Delete the order
        await order.remove();

        // Return success response
        res.status(200).send({ message: 'Order deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal server error' });
    }
});

// Get orders by status
app.get('/api/admin/get-orders-by-status/:status', async (req, res) => {
    try {
        const { status } = req.params;

        // Find orders with a specific status
        const orders = await models.Order.find({ status }).populate('user', 'firstname lastname email');
        res.status(200).send(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal server error' });
    }
});
