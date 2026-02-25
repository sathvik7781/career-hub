const multer = require("multer");
const storage = multer.memoryStorage();

const avatarFileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Only JPG, PNG, and WEBP images are allowed"), false);
  }

  cb(null, true);
};

const uploadAvatar = multer({
  storage,
  limits: {
    fileSize: 1 * 1024 * 1024,
  },
  fileFilter: avatarFileFilter,
}).single("avatar");

const resumeFileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Only PDF, DOC, and DOCX files are allowed"), false);
  }

  cb(null, true);
};

const uploadResume = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: resumeFileFilter,
}).single("resume");

module.exports = {
  uploadAvatar,
  uploadResume,
};
