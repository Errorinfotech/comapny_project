const express = require('express');
const router = express.Router();
const {
    createProject,
    getMyProjects,
    getAllProjects,
    searchProjects,
    deleteProject,
    updateProject
} = require('../controllers/projectController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.use(protect);

router.get('/', adminOnly, getAllProjects);
router.get('/my', getMyProjects);
router.get('/search', searchProjects);
router.post('/', (req, res, next) => {
    upload.fields([{ name: 'files', maxCount: 50000 }, { name: 'thumbnail', maxCount: 1 }])(req, res, (err) => {
        if (err instanceof require('multer').MulterError) {
            if (err.code === 'LIMIT_FILE_COUNT') {
                return res.status(400).json({ message: 'Folder too large (max 50,000 files).' });
            }
            return res.status(400).json({ message: err.message });
        } else if (err) {
            return res.status(500).json({ message: err.message });
        }
        next();
    });
}, createProject);

router.delete('/:id', deleteProject);
router.put('/:id', (req, res, next) => {
    upload.fields([{ name: 'thumbnail', maxCount: 1 }])(req, res, (err) => {
        if (err) return res.status(400).json({ message: err.message });
        next();
    });
}, updateProject);

module.exports = router;
