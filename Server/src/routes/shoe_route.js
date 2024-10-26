const express = require("express");
const router = express.Router();
const ShoesController = require("../app/controllers/shoes_controller");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

// Multer configuration to set the destination folder and file names dynamically
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Upload images to a temporary directory first
    const tempDir = path.join(__dirname, `../../uploads/Shoes/temp`);
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    cb(null, tempDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Limit file size and set storage configuration
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Define routes
router.get("/getShoes", ShoesController.getAllShoes); // Lấy tất cả sản phẩm giày
router.get("/filterproducts", ShoesController.filterProduct);
router.post("/addShoes", upload.array("images"), ShoesController.addShoe); // Thêm sản phẩm giày mới
router.put("/update/:id", upload.array("images"), ShoesController.updateShoe); // Cập nhật sản phẩm giày theo ID
router.get("/shoes/search", ShoesController.searchShoes);
// Serve uploaded files
router.use(
  "/uploads/Shoes",
  express.static(path.join(__dirname, "../../uploads/Shoes/"))
);

module.exports = router;
