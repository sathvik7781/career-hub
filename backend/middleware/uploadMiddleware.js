const multer = require("multer");

// All files go to memory — Cloudinary receives the buffer directly
const storage = multer.memoryStorage();

const avatarFileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error("Only JPG, PNG, and WEBP images are allowed"), false);
  }
  cb(null, true);
};

const resumeFileFilter = (req, file, cb) => {
  const allowed = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error("Only PDF, DOC, and DOCX files are allowed"), false);
  }
  cb(null, true);
};

exports.uploadAvatar = multer({
  storage,
  limits: { fileSize: 1 * 1024 * 1024 }, // 1MB
  fileFilter: avatarFileFilter,
}).single("avatar");

exports.uploadResume = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: resumeFileFilter,
}).single("resume");
