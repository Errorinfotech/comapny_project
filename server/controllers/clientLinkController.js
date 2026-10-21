const ClientLink = require('../models/ClientLink');

// @desc    Get all client links
// @route   GET /api/client-links
// @access  Public
const getClientLinks = async (req, res) => {
    try {
        const links = await ClientLink.find();
        res.json(links);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update or create a client link
// @route   POST /api/client-links
// @access  Private/Admin
const updateClientLink = async (req, res) => {
    try {
        const { type, subtype, clients } = req.body;
        
        // Find existing or create new
        let clientLink = await ClientLink.findOne({ subtype });
        
        if (clientLink) {
            clientLink.type = type;
            clientLink.clients = clients;
            await clientLink.save();
        } else {
            clientLink = await ClientLink.create({ type, subtype, clients });
        }
        
        res.status(200).json(clientLink);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get logged-in client's specific links
// @route   GET /api/client-links/me
// @access  Private/Client
const getMyLinks = async (req, res) => {
    try {
        if (req.user.role !== 'client') {
            return res.status(403).json({ message: 'Not authorized as client' });
        }
        
        const clientLink = await ClientLink.findOne({ subtype: req.user.clientSubtype });
        if (clientLink) {
            // Filter clients array to ONLY include links assigned to this specific user
            const mySpecificLinks = clientLink.clients.filter(c => c.userId && c.userId.toString() === req.user._id.toString());
            res.json({ ...clientLink._doc, clients: mySpecificLinks });
        } else {
            res.json({ clients: [] });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    getClientLinks,
    updateClientLink,
    getMyLinks
};
