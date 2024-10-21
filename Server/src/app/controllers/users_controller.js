const User = require("../../models/users_model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const path = require("path");
const fs = require("fs");
const secretKey = crypto.randomBytes(32).toString("hex");

class UserController {
  async getall(req, res, next) {
    try {
      const users = await User.find({});
      // const books = await Book.find({ category: req.params.category });
      console.log("All User Fetched");

      res.send(users);
    } catch (error) {
      res.status(500).send(error);
    }
  }
  async uploadImage(req, res) {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ message: "Không có tệp nào được tải lên." });
      }

      const imagePath = `/assets/userImage/${req.file.filename}`; // Đường dẫn lưu hình ảnh

      // Bạn có thể lưu đường dẫn này vào cơ sở dữ liệu nếu cần
      const user = await User.findById(userId);
      user.image = imagePath;
      await user.save();

      res.status(200).json({
        message: "Tải lên thành công!",
        imagePath,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Tải lên thất bại." });
    }
  }

  async signup(req, res) {
    try {
      const { name, email, password } = req.body;
      console.log("req.body");
      // Kiểm tra xem email đã được đăng ký hay chưa
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email tồn tại" });
      }

      // Mã hóa mật khẩu
      const hashedPass = await bcrypt.hash(password, 10);

      // Tạo người dùng mới
      const newUser = new User({
        name,
        role: "customer",
        email,
        password: hashedPass,
      });

      await newUser.save();
      res.status(201).json({
        message: "Đăng ký thành công",
        redirectTo: "/user/login",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Thất bại" });

      console.error(error);
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res
          .status(401)
          .json({ message: "Email hoặc mật khẩu không hợp lệ" });
      }

      // Tạo token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        "secretKey", // Thay bằng secret key thực tế và không nên chia sẻ
        { expiresIn: "1h" } // Thời gian hết hạn của token
      );

      // Kiểm tra nếu địa chỉ email có chứa "@admin"
      if (user.email.includes("@admin")) {
        // Chuyển hướng đến trang admin
        res.status(200).json({
          message: "Đăng nhập thành công - Chuyển hướng đến trang admin",
          token,
          redirectTo: "/admin",
        });
        // res.render('admin');
      } else {
        // Chuyển hướng đến trang chủ bình thường
        res.status(200).json({
          message: "Đăng nhập thành công - Chuyển hướng đến trang chủ",
          token,
          redirectTo: "/",
          user,
        });
        // res.render('user');
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "That bai" });
    }
  }
  async update(req, res) {
    const userId = req.params.id;
    const { name, email, phone, gender, password } = req.body;

    try {
      if (!userId) {
        return res
          .status(400)
          .json({ message: "Vui lòng cung cấp thông tin hợp lệ." });
      }

      // Tìm kiếm người dùng
      const user = await User.findById(userId);
      if (!user) {
        return res
          .status(404)
          .json({ message: "Người dùng không được tìm thấy." });
      }

      // Xóa ảnh cũ (nếu có)
      if (req.file) {
        if (user.image) {
          const oldImageFileName = user.image.split("/").pop();
          const oldImagePath = path.join(
            __dirname,
            "../../../uploads/userImage",
            oldImageFileName
          );
          if (fs.existsSync(oldImagePath)) {
            fs.unlink(oldImagePath, (err) => {
              if (err) console.error("Lỗi khi xóa ảnh cũ:", err);
            });
          }

          // Cập nhật hình ảnh mới
          user.image = `${req.protocol}://${req.get(
            "host"
          )}/user/uploads/userImage/${req.file.filename}`;
        } else {
          user.image = `${req.protocol}://${req.get(
            "host"
          )}/user/uploads/userImage/${req.file.filename}`;
        }
      }

      // Cập nhật thông tin người dùng
      user.name = name !== undefined ? name : user.name;
      user.email = email !== undefined ? email : user.email;
      user.phone = phone !== undefined ? phone : user.phone;
      user.gender = gender !== undefined ? gender : user.gender;

      // Nếu có mật khẩu mới, mã hóa nó và cập nhật
      if (password) {
        user.password = await bcrypt.hash(password, 10);
      }

      // Lưu thay đổi
      await user.save();
      res.status(200).json({ message: "Cập nhật thành công.", user });
    } catch (error) {
      console.error("Error during user update:", error);
      res
        .status(500)
        .json({ message: "Cập nhật thất bại.", error: error.message });
    }
  }
}

module.exports = new UserController();
