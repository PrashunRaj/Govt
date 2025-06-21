import multer from 'multer';
import path from 'path';

// Storage: use disk for temp files (Cloudinary will pick up from here)
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/'); // Make sure this folder exists and is .gitignored
  },
  filename: function(req, file, cb) {
    // Unique filename: fieldname-timestamp.ext
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter for images and documents
const fileFilter = (req, file, cb) => {
  // Allowed types: images and PDFs
  const allowedTypes = [
    'image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'application/pdf'
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF images and PDF documents are allowed.'), false);
  }
};

// Cloudinary free plan: 10MB per file (set 8MB for safety)
const upload2 = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 8 * 1024 * 1024, // 8MB
    files: 1
  }
});

// Error handler for multer2
export const handleMulter2Error = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 8MB.'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Only one file allowed.'
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected file field.'
      });
    }
  }
  if (err && err.message && err.message.includes('Invalid file type')) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  next(err);
};

export default upload2;
