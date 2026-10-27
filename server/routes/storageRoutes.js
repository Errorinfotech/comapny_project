const express = require('express');
const router = express.Router();
const r2 = require('../config/r2');

// GET /api/storage/* - stream file from Cloudflare R2
router.get('{/*key}', async (req, res) => {
    try {
        const rawKey = Array.isArray(req.params.key)
            ? req.params.key.join('/')
            : (req.path || '').replace(/^\/+/, '');
        const key = decodeURIComponent(rawKey);

        if (!key) {
            return res.status(400).json({ message: 'Storage key is required' });
        }

        if (!r2.isR2Configured) {
            return res.status(503).json({ message: 'R2 storage is not configured' });
        }

        const data = await r2.getFileStream(key);

        const contentType = data.ContentType || r2.getMimeType(key);
        res.setHeader('Content-Type', contentType);

        if (data.ContentLength) {
            res.setHeader('Content-Length', data.ContentLength);
        }

        if (data.ETag) {
            res.setHeader('ETag', data.ETag);
        }

        // Cache static media efficiently
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');

        data.Body.pipe(res);
    } catch (error) {
        if (error.name === 'NoSuchKey' || error.$metadata?.httpStatusCode === 404) {
            return res.status(404).json({ message: 'File not found in storage' });
        }
        console.error('Storage stream error:', error);
        res.status(500).json({ message: 'Error streaming storage object', error: error.message });
    }
});

module.exports = router;

