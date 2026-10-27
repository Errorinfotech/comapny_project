const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '2000mb' }));
app.use(express.urlencoded({ limit: '2000mb', extended: true }));


// Static Files - serve from local /uploads and Cloudflare R2
const r2 = require('./config/r2');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'uploads')));

// Fallback to Cloudflare R2 for /uploads if not found locally
app.use('/uploads/:key(*)', async (req, res, next) => {
    if (!r2.isR2Configured) return next();
    try {
        const key = req.params.key;
        let streamData = null;
        try {
            streamData = await r2.getFileStream(key);
        } catch (e) {
            try {
                streamData = await r2.getFileStream(`Thumbnails/${key}`);
            } catch (e2) {
                return next();
            }
        }
        if (streamData) {
            res.setHeader('Content-Type', streamData.ContentType || r2.getMimeType(key));
            if (streamData.ContentLength) res.setHeader('Content-Length', streamData.ContentLength);
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
            return streamData.Body.pipe(res);
        }
    } catch (err) {
        return next();
    }
});

// Routes
app.get('/ping', (req, res) => res.send('pong'));
app.get('/api/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

app.use('/api/storage', require('./routes/storageRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/office', require('./routes/officeRoutes'));
app.use('/api/client-links', require('./routes/clientLinkRoutes'));

app.get('/', (req, res) => res.json({ message: 'DevVault API is active', status: 'ready' }));

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('MongoDB Connected');

        // One-time migration for thumbnail paths
        try {
            const Project = require('./models/Project');
            const projects = await Project.find({ thumbnail: { $exists: true, $ne: '' } });
            console.log(`[MIGRATION] Checking ${projects.length} projects for path fix...`);
            for (const project of projects) {
                if (
                    project.thumbnail &&
                    !project.thumbnail.startsWith('http://') &&
                    !project.thumbnail.startsWith('https://') &&
                    !project.thumbnail.startsWith('Thumbnails/') &&
                    (project.thumbnail.includes('/') || project.thumbnail.includes('\\'))
                ) {
                    const filename = path.basename(project.thumbnail);
                    if (project.thumbnail !== filename) {
                        project.thumbnail = filename;
                        await project.save();
                    }
                }
            }
            console.log(`[MIGRATION] Completed.`);
        } catch (err) {
            console.error('Migration error:', err);
        }
    })
    .catch(err => console.log('MongoDB Connection Error:', err));

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 5005;
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
server.timeout = 1200000; // 20 minutes timeout for massive project processing
