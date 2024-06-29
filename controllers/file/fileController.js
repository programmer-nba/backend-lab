const path = require('path');
const fs = require('fs');
const multer = require('multer');

// Set up multer for file uploads
const upload = multer({
    dest: path.join(__dirname, '../' + '../uploads') // Set the destination folder for uploads
});

// Middleware to handle file upload
const uploadFile = upload.single('file');

const handleFileUpload = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const tempPath = req.file.path;
    const targetPath = path.join(__dirname, '../' + '../uploads', req.body.label + '&ref=' + req.body.ref_id + '&time=' + Date.now() + '.' + req.file.mimetype.split('/')[1]);

    fs.rename(tempPath, targetPath, err => {
        if (err) return res.status(500).json({ message: 'File move failed', error: err });

        res.status(200).json({ message: 'File uploaded successfully', file: req.file });
    });
};

const getFileList = (req, res) => {
    const uploadsDir = path.join(__dirname, '../' + '../uploads');

    fs.readdir(uploadsDir, (err, files) => {
        if (err) return res.status(500).json({ message: 'Unable to read files', error: err });

        res.status(200).json({ files });
    });
};

module.exports = {
    uploadFile,
    handleFileUpload,
    getFileList
};
