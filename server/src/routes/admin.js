const app = require("../app");
const models = require("../models/schema");


// Add a product
app.post('/api/admin/add-product', async (req, res) => {
    try {
        // Destructuring product details from request body
        const { productname, description, price, brand, image, category, countInStock, rating } = req.body;

        // Check for missing required fields
        if (!productname || !description || !price || !brand || !image || !category || !countInStock || !rating) {
            return res.status(400).send({ message: 'Missing required fields' });
        }

        // Check if category exists in the database
        const foundCategory = await models.Category.findOne({ category });
        if (!foundCategory) {
            return res.status(404).send({ message: 'Category not found' });
        }

        // Create a new product document
        const product = new models.Product({
            productname,
            description,
            price,
            brand,
            image,
            category: foundCategory._id, // Reference to the Category model
            countInStock,
            rating,
            dateCreated: new Date()
        });

        // Save the product in the database
        await product.save();

        // Return success response with created product
        res.status(201).send({ message: 'Product added successfully', product });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal server error' });
    }
});

// Edit a product
app.put('/api/admin/edit-product/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { productname, description, price, brand, image, category, countInStock, rating } = req.body;

        // Check if product exists
        const foundProduct = await models.Product.findById(id);
        if (!foundProduct) {
            return res.status(404).send({ message: 'Product not found' });
        }

        // Check if category exists
        const foundCategory = await models.Category.findOne({ category });
        if (!foundCategory) {
            return res.status(404).send({ message: 'Category not found' });
        }

        // Update product details
        foundProduct.productname = productname || foundProduct.productname;
        foundProduct.description = description || foundProduct.description;
        foundProduct.price = price || foundProduct.price;
        foundProduct.brand = brand || foundProduct.brand;
        foundProduct.image = image || foundProduct.image;
        foundProduct.category = foundCategory._id || foundProduct.category;
        foundProduct.countInStock = countInStock || foundProduct.countInStock;
        foundProduct.rating = rating || foundProduct.rating;

        // Save the updated product
        await foundProduct.save();

        // Return success response
        res.status(200).send({ message: 'Product updated successfully', product: foundProduct });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal server error' });
    }
});

// Delete a product
app.delete('/api/admin/delete-product/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Find the product to delete
        const foundProduct = await models.Product.findById(id);
        if (!foundProduct) {
            return res.status(404).send({ message: 'Product not found' });
        }

        // Delete the product
        await foundProduct.remove();

        // Return success response
        res.status(200).send({ message: 'Product deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal server error' });
    }
});

// Get all products
app.get('/api/admin/get-products', async (req, res) => {
    try {
        const products = await models.Product.find().populate('category', 'category'); // Populate category for better response
        res.status(200).send(products);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal server error' });
    }
});
