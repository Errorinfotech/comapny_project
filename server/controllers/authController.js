const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    let { username, password } = req.body;

    try {
        const cleanUsername = username ? username.trim() : '';
        const user = await User.findOne({ 
            username: { $regex: new RegExp(`^${cleanUsername}$`, 'i') } 
        });

        if (user && (await user.comparePassword(password))) {
            res.json({
                _id: user._id,
                username: user.username,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Update user profile (password)
// @route   POST /api/auth/update-password
// @access  Private
const updateProfile = async (req, res) => {
    try {
        console.log('UPDATE PASSWORD REQUEST RECEIVED (POST)');
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const { currentPassword, newPassword } = req.body;

        if (currentPassword && newPassword) {
            const isMatch = await user.comparePassword(currentPassword);
            if (!isMatch) return res.status(401).json({ message: 'Current password is incorrect' });

            user.password = newPassword;
            await user.save();
            res.json({ message: 'Password updated successfully' });
        } else {
            res.status(400).json({ message: 'Both current and new passwords are required' });
        }
    } catch (error) {
        console.error('PASSWORD UPDATE ERROR:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { loginUser, getUserProfile, updateProfile };
