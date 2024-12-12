const app = require("../app");
const models = require("../models/schema");

// Add a new category
app.post('/api/admin/add-category', async (req, res) => {
    try {
        const { category, description } = req.body;

        // Check for missing required fields
        if (!category) {
            return res.status(400).send({ message: 'Category name is required' });
        }

        // Check if category already exists
        const foundCategory = await models.Category.findOne({ category });
        if (foundCategory) {
            return res.status(409).send({ message: 'Category already exists' });
        }

        // Create a new category
        const newCategory = new models.Category({
            category,
            description: description || ''  // description is optional
        });

        // Save the category
        await newCategory.save();

        // Return success response
        res.status(201).send({ message: 'Category added successfully', category: newCategory });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal server error' });
    }
});

// Edit a category
app.put('/api/admin/edit-category/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { category, description } = req.body;

        // Check if category exists
        const foundCategory = await models.Category.findById(id);
        if (!foundCategory) {
            return res.status(404).send({ message: 'Category not found' });
        }

        // Update category fields
        foundCategory.category = category || foundCategory.category;
        foundCategory.description = description || foundCategory.description;

        // Save the updated category
        await foundCategory.save();

        // Return success response
        res.status(200).send({ message: 'Category updated successfully', category: foundCategory });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal server error' });
    }
});

// Delete a category
app.delete('/api/admin/delete-category/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Find the category to delete
        const foundCategory = await models.Category.findById(id);
        if (!foundCategory) {
            return res.status(404).send({ message: 'Category not found' });
        }

        // Check if there are any products associated with the category
        const productsInCategory = await models.Product.find({ category: foundCategory._id });
        if (productsInCategory.length > 0) {
            return res.status(400).send({ message: 'Cannot delete category because products are associated with it' });
        }

        // Delete the category
        await foundCategory.remove();

        // Return success response
        res.status(200).send({ message: 'Category deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal server error' });
    }
});

// Get all categories
app.get('/api/admin/get-categories', async (req, res) => {
    try {
        const categories = await models.Category.find();
        res.status(200).send(categories);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal server error' });
    }
});
