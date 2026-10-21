const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

dotenv.config();

const checkUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const users = await User.find({});
        console.log("Users:", users.map(u => ({ username: u.username, role: u.role })));
        
        const admin = await User.findOne({ username: 'admin' });
        if (admin) {
            const isMatch = await bcrypt.compare('adminpassword', admin.password);
            console.log("Password matches 'adminpassword':", isMatch);

            // Let's force reset it just in case
            admin.password = 'adminpassword';
            await admin.save();
            console.log("Forced reset of admin password to 'adminpassword'");
        }
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

checkUsers();
