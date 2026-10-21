const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'uploads/';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage,
    limits: { 
        fileSize: 2 * 1024 * 1024 * 1024, // 2GB limit
        fields: 50000,                  // Allow up to 50,000 form fields
        fieldSize: 100 * 1024 * 1024    // 100MB for text field content (to handle giant JSON paths)
    },
});

module.exports = upload;
