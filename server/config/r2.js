const {
    S3Client,
    PutObjectCommand,
    DeleteObjectCommand,
    GetObjectCommand,
    HeadObjectCommand
} = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const fs = require('fs');
const path = require('path');

const getMimeType = (filename) => {
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes = {
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
        '.svg': 'image/svg+xml',
        '.pdf': 'application/pdf',
        '.zip': 'application/zip',
        '.json': 'application/json',
        '.js': 'application/javascript',
        '.css': 'text/css',
        '.html': 'text/html',
        '.txt': 'text/plain',
        '.mp4': 'video/mp4',
        '.mp3': 'audio/mpeg'
    };
    return mimeTypes[ext] || 'application/octet-stream';
};

const endpoint = (process.env.STORAGE_ENDPOINT || '').trim();
const bucket = (process.env.STORAGE_BUCKET || '').trim();
const accessKeyId = (process.env.STORAGE_ACCESS_KEY_ID || '').trim();
const secretAccessKey = (process.env.STORAGE_SECRET_ACCESS_KEY || '').trim();
const region = (process.env.STORAGE_REGION || 'auto').trim();
const publicUrl = (process.env.STORAGE_PUBLIC_URL || '').trim().replace(/\/+$/, '');

const isR2Configured = Boolean(endpoint && bucket && accessKeyId && secretAccessKey);

let s3Client = null;
if (isR2Configured) {
    s3Client = new S3Client({
        region,
        endpoint,
        forcePathStyle: true,
        credentials: {
            accessKeyId,
            secretAccessKey
        }
    });
}

const getPublicOrStorageUrl = (key) => {
    if (!key) return '';
    const cleanKey = key.replace(/^\/+/, '');
    if (publicUrl) {
        return `${publicUrl}/${cleanKey}`;
    }
    return `/api/storage/${cleanKey}`;
};

const uploadFile = async (filePath, key, contentType) => {
    if (!isR2Configured) throw new Error('R2 storage is not configured');
    const cleanKey = key.replace(/^\/+/, '');
    const fileStream = fs.createReadStream(filePath);
    const mime = contentType || getMimeType(filePath);

    const parallelUpload = new Upload({
        client: s3Client,
        params: {
            Bucket: bucket,
            Key: cleanKey,
            Body: fileStream,
            ContentType: mime
        }
    });

    await parallelUpload.done();
    return {
        key: cleanKey,
        url: getPublicOrStorageUrl(cleanKey)
    };
};

const uploadBuffer = async (buffer, key, contentType) => {
    if (!isR2Configured) throw new Error('R2 storage is not configured');
    const cleanKey = key.replace(/^\/+/, '');
    const mime = contentType || getMimeType(key);

    const command = new PutObjectCommand({
        Bucket: bucket,
        Key: cleanKey,
        Body: buffer,
        ContentType: mime
    });

    await s3Client.send(command);
    return {
        key: cleanKey,
        url: getPublicOrStorageUrl(cleanKey)
    };
};

const deleteFile = async (keyOrUrl) => {
    if (!isR2Configured || !keyOrUrl) return;

    let cleanKey = keyOrUrl;
    if (cleanKey.startsWith('http://') || cleanKey.startsWith('https://')) {
        try {
            const parsed = new URL(cleanKey);
            cleanKey = decodeURIComponent(parsed.pathname.replace(/^\/+/, ''));
        } catch (e) {
            // fallback
        }
    } else if (cleanKey.startsWith('/api/storage/')) {
        cleanKey = decodeURIComponent(cleanKey.replace('/api/storage/', ''));
    }

    cleanKey = cleanKey.replace(/^\/+/, '');

    try {
        await s3Client.send(new DeleteObjectCommand({
            Bucket: bucket,
            Key: cleanKey
        }));
    } catch (err) {
        console.warn(`[R2] Delete failed for ${cleanKey}:`, err.message);
    }
};

const getFileStream = async (key) => {
    if (!isR2Configured) throw new Error('R2 storage is not configured');
    const cleanKey = key.replace(/^\/+/, '');
    const command = new GetObjectCommand({
        Bucket: bucket,
        Key: cleanKey
    });
    return await s3Client.send(command);
};

const objectExists = async (key) => {
    if (!isR2Configured) return false;
    const cleanKey = key.replace(/^\/+/, '');
    try {
        await s3Client.send(new HeadObjectCommand({
            Bucket: bucket,
            Key: cleanKey
        }));
        return true;
    } catch (err) {
        return false;
    }
};

module.exports = {
    isR2Configured,
    s3Client,
    bucket,
    uploadFile,
    uploadBuffer,
    deleteFile,
    getFileStream,
    objectExists,
    getPublicOrStorageUrl,
    getMimeType
};

