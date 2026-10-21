const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    scope: {
        type: String,
        enum: ['workspace', 'office'],
        default: 'workspace'
    },
    title: { type: String, required: true },
    description: { type: String },
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: false },
    files: [{
        name: { type: String },
        path: { type: String },
        size: { type: Number },
        type: { type: String },
        relativePath: { type: String }
    }],
    folders: [{ type: String }], // Relative paths for folder structure
    liveUrl: { type: String },
    githubUrl: { type: String },
    thumbnail: { type: String },
    activityLog: [{
        action: { type: String },
        timestamp: { type: Date, default: Date.now }
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', projectSchema);
