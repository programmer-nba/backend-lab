const express = require('express');
const router = express.Router();
const { uploadFile, handleFileUpload, getFileList  } = require('../../controllers/file/fileController');

// Route to handle file upload
router.post('/upload', uploadFile, handleFileUpload);
router.get('/files', getFileList)

module.exports = router;
