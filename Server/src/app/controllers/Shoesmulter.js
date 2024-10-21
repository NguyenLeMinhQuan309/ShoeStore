const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Cấu hình Multer để lưu ảnh vào thư mục uploads/userImage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "uploads/userImage";

    // Kiểm tra và tạo thư mục nếu chưa tồn tại
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir); // Thư mục lưu trữ ảnh
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Đặt tên file ảnh
  },
});

// Cấu hình multer với giới hạn kích thước và định dạng ảnh
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn kích thước tệp: 5MB
  fileFilter: function (req, file, cb) {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = fileTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Chỉ cho phép định dạng ảnh (jpeg, jpg, png, gif)"));
    }
  },
});

module.exports = upload;
