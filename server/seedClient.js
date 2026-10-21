const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('MongoDB Connected');

        // Check if user exists
        const userExists = await User.findOne({ username: 'testclient' });

        if (userExists) {
            console.log('Test client already exists');
        } else {
            const client = await User.create({
                username: 'testclient',
                password: 'clientpassword',
                role: 'client',
                clientSubtype: 'CA'
            });
            console.log('Test Client created:');
            console.log('Username: testclient');
            console.log('Password: clientpassword');
            console.log('Assigned Subtype: CA');
        }

        process.exit();
    })
    .catch(err => {
        console.log('MongoDB Connection Error:', err);
        process.exit(1);
    });
