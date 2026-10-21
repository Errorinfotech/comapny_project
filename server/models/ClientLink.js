const mongoose = require('mongoose');

const clientLinkSchema = new mongoose.Schema({
    type: { type: String, required: true },
    subtype: { type: String, required: true, unique: true },
    clients: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
        businessName: { type: String, required: true },
        link: { type: String, required: true }
    }]
}, { timestamps: true });

module.exports = mongoose.model('ClientLink', clientLinkSchema);
