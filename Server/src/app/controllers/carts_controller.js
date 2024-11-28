const Cart = require("../../models/carts_model");
const Discount = require("../../models/discount_model");

class cartController {
  async checkout_cart(req, res, next) {
    try {
      const cartItems = await Cart.find({});
      let totalQuantity = 0;
      let totalPrice = 0;

      // Tính tổng số sản phẩm và tổng số tiền
      cartItems.forEach((item) => {
        totalQuantity += item.quantity;
        totalPrice += item.price * item.quantity;
      });

      res.status(200).json({ items: cartItems, totalQuantity, totalPrice });
    } catch (error) {
      next(error);
    }
  }
  // async getall(req, res) {
  //   try {
  //     const cart = await Cart.find({ email: req.body.email });
  //     // console.log("All Cart Fetched");
  //     res.send(cart);
  //   } catch (error) {
  //     res.status(500).send(error);
  //   }
  // }
  async getall(req, res) {
    try {
      const email = req.body.email;
      const cart = await Cart.find({ email });

      // Lấy ngày hiện tại
      const today = new Date();

      // Cập nhật giá chiết khấu cho từng sản phẩm trong giỏ hàng
      const updatedCart = await Promise.all(
        cart.map(async (item) => {
          // const product = await Shoes.findOne({ id: item.id });

          // // Kiểm tra nếu sản phẩm không tồn tại
          // if (!product) {
          //   console.warn(`Sản phẩm với id ${item.id} không tồn tại`);
          //   return item; // Giữ nguyên thông tin sản phẩm
          // }

          // Tìm thông tin chiết khấu của màu cụ thể
          const discount = await Discount.findOne({
            productId: item.id,
            color: item.color,
            active: true, // Chỉ lấy chiết khấu đang hoạt động
            startDate: { $lte: today },
            endDate: { $gte: today },
          });

          // Nếu có chiết khấu, tính toán lại giá
          if (discount) {
            const finalPrice =
              item.price - (item.price * discount.discountPercentage) / 100;
            return {
              ...item._doc, // Giữ nguyên thông tin ban đầu
              originalPrice: item.price,
              finalPrice,
              discountPercentage: discount.discountPercentage,
            };
          }

          // Nếu không có chiết khấu, giữ nguyên giá
          return {
            ...item._doc, // Giữ nguyên thông tin ban đầu
            originalPrice: item.price,
            finalPrice: item.price,
            discountPercentage: 0,
          };
        })
      );

      res.status(200).json(updatedCart);
    } catch (error) {
      console.error("Lỗi khi lấy giỏ hàng:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  }

  async addToCart(req, res, next) {
    try {
      const { email, id, name, price, color, size, quantity, total, image } =
        req.body;

      // Kiểm tra xem sản phẩm với cùng id, size, và color đã có trong giỏ hàng chưa
      const existingCartItem = await Cart.findOne({ email, id, size, color });

      if (existingCartItem) {
        // Nếu sản phẩm đã có trong giỏ, cộng dồn số lượng và tổng giá
        existingCartItem.quantity += parseInt(quantity);
        existingCartItem.total += parseFloat(total);
        await existingCartItem.save();
      } else {
        // Nếu chưa có, thêm sản phẩm mới
        await Cart.create({
          email,
          id,
          name,
          price,
          color,
          size,
          quantity,
          total,
          image,
        });
      }

      res.status(201).json({ message: "Item added to cart successfully" });
    } catch (error) {
      next(error);
    }
  }

  async getTotalCartItems(req, res) {
    try {
      const cartItems = await Cart.find({ email: req.body.email });
      let totalItems = 0;
      for (const item of cartItems) {
        totalItems += item.quantity;
      }
      res.json({ totalItems });
    } catch (error) {
      next(error);
    }
  }
  async updateQuantity(req, res) {
    const { id, color, size, quantity } = req.body; // Get id and quantity from the request body
    try {
      // Find the cart item by id (ensure that id corresponds to the correct field in your schema)
      let item = await Cart.findOne({ id, color, size });
      if (item) {
        item.quantity = quantity; // Update the quantity
        await item.save(); // Save the changes
        res.status(200).send("Số lượng đã được cập nhật");
      } else {
        res.status(404).send("Sản phẩm không tìm thấy trong giỏ hàng");
      }
    } catch (error) {
      res.status(500).send("Có lỗi xảy ra");
    }
  }

  async remove(req, res) {
    const { email } = req.body;
    try {
      await Cart.deleteMany({ email });
      res.status(200).send("Sản phẩm đã được xóa");
    } catch (error) {
      res.status(500).send("Có lỗi xảy ra");
    }
  }
  async removeItem(req, res) {
    const { id, color, size } = req.body;
    try {
      await Cart.deleteOne({ id, color, size });
      res.status(200).send("Sản phẩm đã được xóa");
    } catch (error) {
      res.status(500).send("Có lỗi xảy ra");
    }
  }
}

module.exports = new cartController();
