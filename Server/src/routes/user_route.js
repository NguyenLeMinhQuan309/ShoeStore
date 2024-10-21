const express = require("express");
const router = express.Router();
const path = require("path");
const upload = require("../app/controllers/Usermulter");
const UserController = require("../app/controllers/users_controller");

router.post("/signup", UserController.signup);
router.post("/login", UserController.login);
router.get("/getall", UserController.getall);
router.put("/update/:id", upload.single("image"), UserController.update);
router.post("/upload", upload.single("image", UserController.uploadImage));
router.use(
  "/uploads/userImage",
  express.static(path.join(__dirname, "../../uploads/userImage"))
);

module.exports = router;
