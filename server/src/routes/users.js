const app = require("../app");
const models = require("../models/schema");

// Create a new user
app.post('/api/admin/create-user', async (req, res) => {
    try {
        const { firstname, lastname, username, email, password } = req.body;

        // Check for missing required fields
        if (!firstname || !lastname || !username || !email || !password) {
            return res.status(400).send({ message: 'Missing required fields' });
        }

        // Check if the user already exists by username or email
        const existingUser = await models.Users.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).send({ message: 'User with this username or email already exists' });
        }

        // Create a new user
        const user = new models.Users({
            firstname,
            lastname,
            username,
            email,
            password, // In production, ensure the password is hashed before storing
        });

        // Save the new user to the database
        await user.save();

        // Return success response with the created user
        res.status(201).send({ message: 'User created successfully', user });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal server error' });
    }
});

// Get all users
app.get('/api/admin/get-users', async (req, res) => {
    try {
        // Retrieve all users from the database
        const users = await models.Users.find();
        res.status(200).send(users);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal server error' });
    }
});

// Get a user by ID
app.get('/api/admin/get-user/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Find the user by ID
        const user = await models.Users.findById(id);
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        // Return the user details
        res.status(200).send(user);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal server error' });
    }
});

// Update a user
app.put('/api/admin/update-user/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { firstname, lastname, username, email, password } = req.body;

        // Find the user to update
        const user = await models.Users.findById(id);
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        // Update the user fields
        if (firstname) user.firstname = firstname;
        if (lastname) user.lastname = lastname;
        if (username) user.username = username;
        if (email) user.email = email;
        if (password) user.password = password; // In production, hash the password before saving

        // Save the updated user
        await user.save();

        // Return success response
        res.status(200).send({ message: 'User updated successfully', user });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal server error' });
    }
});

// Delete a user
app.delete('/api/admin/delete-user/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Find the user to delete
        const user = await models.Users.findById(id);
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        // Delete the user
        await user.remove();

        // Return success response
        res.status(200).send({ message: 'User deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal server error' });
    }
});

// Get users by search criteria (e.g., by email, username)
app.get('/api/admin/search-users', async (req, res) => {
    try {
        const { username, email } = req.query;

        // Build search query
        let query = {};
        if (username) query.username = new RegExp(username, 'i'); // Case-insensitive search
        if (email) query.email = new RegExp(email, 'i');

        // Find users matching the search criteria
        const users = await models.Users.find(query);

        res.status(200).send(users);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal server error' });
    }
});
