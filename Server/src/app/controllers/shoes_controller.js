const Shoe = require("../../models/shoes_model");
const Discount = require("../../models/discount_model");
const path = require("path");
const { spawn } = require("child_process");
const fs = require("fs");

class ShoesController {
  // Lấy tất cả các sản phẩm giày
  // async getAllShoes(req, res) {
  //   try {
  //     const shoes = await Shoe.find();
  //     res.status(202).send(shoes);
  //   } catch (err) {
  //     res.status(500).json({ message: err.message });
  //   }
  // }

  async getAllShoes(req, res) {
    try {
      const shoes = await Shoe.find();
      const today = new Date();

      // Thêm logic tính giá giảm
      const shoesWithDiscounts = await Promise.all(
        shoes.map(async (product) => {
          // Duyệt qua từng màu của sản phẩm
          const discountedColors = await Promise.all(
            product.images.map(async (image) => {
              const color = image.color;
              const price = image.price;

              // Tìm giảm giá áp dụng cho từng màu
              const discount = await Discount.findOne({
                productId: product.id,
                color,
                active: true,
                startDate: { $lte: today },
                endDate: { $gte: today },
              });

              if (discount) {
                const finalPrice =
                  price - (price * discount.discountPercentage) / 100;
                return {
                  color,
                  originalPrice: price,
                  finalPrice,
                  discountPercentage: discount.discountPercentage,
                  startDate: discount.startDate,
                  endDate: discount.endDate,
                };
              }
              return null;
            })
          );

          return {
            ...product.toObject(),
            discountedColors: discountedColors.filter((item) => item !== null),
          };
        })
      );

      res.status(200).json(shoesWithDiscounts);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // Thêm sản phẩm giày mới
  async addShoe(req, res) {
    try {
      const {
        name,
        category,
        brand,
        gender,
        description,
        color, // Mảng các màu sắc
        stock, // Mảng chứa { color, size, quantity }
        price, // Mảng giá theo màu
      } = req.body;

      console.log(req.body);

      // Đảm bảo `color` và `price` là mảng, nếu không chuyển đổi thành mảng
      const colors = Array.isArray(color) ? color : [color];
      const prices = Array.isArray(price) ? price : [price];

      if (colors.length !== prices.length) {
        return res.status(400).json({
          message: "The number of colors and prices must match.",
        });
      }

      // Chuyển `stock` từ JSON string sang object
      const stockArray = Array.isArray(stock)
        ? stock.map(JSON.parse)
        : [JSON.parse(stock)];

      // Lấy ID mới cho sản phẩm
      const lastShoe = await Shoe.findOne().sort({ id: -1 });
      const newId = lastShoe
        ? `ID${(parseInt(lastShoe.id.slice(2)) + 1)
            .toString()
            .padStart(2, "0")}`
        : "ID01";

      // Tạo danh sách ảnh theo từng màu
      const images = [];
      if (req.files && req.files.length > 0) {
        const tempDir = path.join(__dirname, `../../../uploads/Shoes/temp`);

        // Kiểm tra số lượng ảnh
        if (req.files.length < colors.length * 6) {
          return res.status(400).json({
            message:
              "Insufficient images for colors. Each color requires 6 images.",
          });
        }

        colors.forEach((c, index) => {
          // Lọc stock tương ứng với màu hiện tại
          const colorStock = stockArray
            .filter((s) => s.color === c)
            .map((s) => ({ size: s.size, quantity: s.quantity }));

          // Lấy giá trị price tương ứng với màu
          const colorPrice = prices[index];

          // Tạo danh sách URL ảnh cho màu hiện tại
          const colorImageUrls = req.files
            .slice(index * 6, (index + 1) * 6)
            .map((file) => {
              const finalDir = path.join(
                __dirname,
                `../../../uploads/Shoes/${newId}/${c}`
              );
              if (!fs.existsSync(finalDir))
                fs.mkdirSync(finalDir, { recursive: true });

              const finalFilePath = path.join(finalDir, file.filename);
              fs.renameSync(path.join(tempDir, file.filename), finalFilePath);

              return `${req.protocol}://${req.get(
                "host"
              )}/shoe/uploads/Shoes/${newId}/${c}/${file.filename}`;
            });

          // Đưa dữ liệu vào danh sách `images`
          images.push({
            imageUrls: colorImageUrls,
            color: c,
            price: colorPrice, // Thêm giá cho từng màu
            stock: colorStock,
          });
        });
      }

      // Tạo sản phẩm mới
      const newShoe = new Shoe({
        id: newId,
        name,
        category,
        brand,
        gender,
        description,
        images,
      });

      await newShoe.save();
      res.status(201).json(newShoe);
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: err.message });
    }
  }

  // Cập nhật sản phẩm giày theo ID
  // async updateShoe(req, res) {
  //   try {
  //     const {
  //       id,
  //       name,
  //       category,
  //       brand,
  //       size,
  //       price,
  //       stock,
  //       description,
  //       color,
  //     } = req.body;

  //     const parsedSize = size
  //       .split(",")
  //       .map(Number)
  //       .sort((a, b) => a - b);

  //     let updatedImageField = {};
  //     if (req.files && req.files.length > 0) {
  //       const newImages = req.files.map((file) => {
  //         // Ensure the directory structure exists for updated images
  //         const dir = path.join(
  //           __dirname,
  //           `../../../uploads/Shoes/${id}/${color}`
  //         );
  //         if (!fs.existsSync(dir)) {
  //           fs.mkdirSync(dir, { recursive: true });
  //         }

  //         // Return the public URL for the uploaded images
  //         return path.join(
  //           `http:///localhost:3000/shoe/uploads/Shoes/${id}/${color}`,
  //           file.filename
  //         );
  //       });

  //       updatedImageField = {
  //         $push: { images: { imageUrls: newImages, color } },
  //       };
  //     }

  //     const updatedShoe = await Shoe.findByIdAndUpdate(
  //       req.params.id,
  //       {
  //         name,
  //         size: parsedSize,
  //         category,
  //         brand,
  //         stock,
  //         description,
  //         price,
  //         ...updatedImageField,
  //       },
  //       { new: true }
  //     );
  //     console.log(req.body);
  //     if (!updatedShoe)
  //       return res.status(404).json({ message: "Shoe not found" });

  //     res.json(updatedShoe);
  //   } catch (err) {
  //     console.error(err);
  //     res.status(400).json({ message: err.message });
  //   }
  // }
  async updateShoe(req, res) {
    try {
      const {
        name,
        category,
        brand,
        gender,
        description,
        color, // Mảng các màu sắc
        stock, // Mảng chứa { color, size, quantity }
        price, // Mảng giá theo màu
      } = req.body;

      // Tìm sản phẩm theo ID
      const shoe = await Shoe.findOne({ id: req.params.id });
      if (!shoe) {
        return res.status(404).json({ message: "Shoe not found" });
      }

      // Đảm bảo `color` và `price` là mảng, nếu không chuyển đổi thành mảng
      const colors = Array.isArray(color) ? color : [color];
      const prices = Array.isArray(price) ? price : [price];

      if (colors.length !== prices.length) {
        return res.status(400).json({
          message: "The number of colors and prices must match.",
        });
      }

      // Chuyển `stock` từ JSON string sang object
      const stockArray = Array.isArray(stock)
        ? stock.map(JSON.parse)
        : [JSON.parse(stock)];

      // Cập nhật danh sách ảnh nếu có upload mới
      if (req.files && req.files.length > 0) {
        const tempDir = path.join(__dirname, `../../../uploads/Shoes/temp`);

        // Kiểm tra số lượng ảnh
        if (req.files.length < colors.length * 6) {
          return res.status(400).json({
            message:
              "Insufficient images for colors. Each color requires 6 images.",
          });
        }

        const images = [];
        colors.forEach((c, index) => {
          // Lọc stock tương ứng với màu hiện tại
          const colorStock = stockArray
            .filter((s) => s.color === c)
            .map((s) => ({ size: s.size, quantity: s.quantity }));

          // Lấy giá trị price tương ứng với màu
          const colorPrice = prices[index];

          // Tạo danh sách URL ảnh cho màu hiện tại
          const colorImageUrls = req.files
            .slice(index * 6, (index + 1) * 6)
            .map((file) => {
              const finalDir = path.join(
                __dirname,
                `../../../uploads/Shoes/${id}/${c}`
              );
              if (!fs.existsSync(finalDir))
                fs.mkdirSync(finalDir, { recursive: true });

              const finalFilePath = path.join(finalDir, file.filename);
              fs.renameSync(path.join(tempDir, file.filename), finalFilePath);

              return `${req.protocol}://${req.get(
                "host"
              )}/shoe/uploads/Shoes/${id}/${c}/${file.filename}`;
            });

          // Đưa dữ liệu vào danh sách `images`
          images.push({
            imageUrls: colorImageUrls,
            color: c,
            price: colorPrice, // Thêm giá cho từng màu
            stock: colorStock,
          });
        });

        // Cập nhật `images` trong sản phẩm
        shoe.images = images;
      } else {
        // Nếu không có file, chỉ cập nhật giá
        shoe.images.forEach((image, index) => {
          // Lấy giá trị price mới từ danh sách `prices`
          const newPrice = prices[index];

          // Cập nhật giá trị trong ảnh hiện có
          if (newPrice !== undefined) {
            image.price = newPrice;
          }
        });

        // Kiểm tra và xóa bỏ hình ảnh của màu không có trong danh sách `colors`
        shoe.images = shoe.images.filter((image) =>
          colors.includes(image.color)
        );
      }

      // Cập nhật các trường khác
      shoe.name = name || shoe.name;
      shoe.category = category || shoe.category;
      shoe.brand = brand || shoe.brand;
      shoe.gender = gender || shoe.gender;
      shoe.description = description || shoe.description;

      await shoe.save();

      res.status(200).json(shoe);
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: err.message });
    }
  }

  // Tìm kiếm sản phẩm giày theo tên hoặc mô tả
  async filterProduct(req, res) {
    try {
      const { category, brand, color, size, gender } = req.query;

      let filters = {};

      // Filter by category
      if (category) {
        filters.category = { $in: category.split(",") };
      }

      // Filter by brand
      if (brand) {
        filters.brand = { $in: brand.split(",") };
      }

      // Filter by color
      if (color) {
        filters["images.color"] = { $in: color.split(",") };
      }

      // Filter by size
      if (size) {
        const sizeArray = size.split(",");
        filters["images.stock.size"] = {
          $in: sizeArray.filter((s) => parseInt(s, 10) > 0), // Only sizes > 0
        };
      }

      // Filter by gender
      if (gender) {
        const gen = parseInt(gender, 10); // Parse as integer
        if (gen === 1 || gen === 2) {
          filters.gender = gen; // Only accept 1 (male) or 2 (female)
        }
      }

      // Fetch products based on filters
      const products = await Shoe.find(filters);

      // Process discount prices for each product
      const today = new Date();
      const productsWithDiscount = await Promise.all(
        products.map(async (product) => {
          const discountedColors = await Promise.all(
            product.images.map(async (image) => {
              const color = image.color;
              const price = image.price;
              const discount = await Discount.findOne({
                productId: product.id,
                color,
                active: true,
                startDate: { $lte: today },
                endDate: { $gte: today },
              });

              if (discount) {
                const finalPrice =
                  price - (price * discount.discountPercentage) / 100;
                return {
                  color,
                  originalPrice: price,
                  finalPrice,
                  discountPercentage: discount.discountPercentage,
                  startDate: discount.startDate,
                  endDate: discount.endDate,
                };
              }
              return null;
            })
          );

          const colorsWithDiscount = discountedColors.filter(
            (item) => item !== null
          );

          return {
            ...product.toObject(),
            discountedColors: colorsWithDiscount,
            originalPrice: product.images[0]?.price || 0, // Default to first image's price
          };
        })
      );

      // Return the filtered products with discount information
      res.status(200).json(productsWithDiscount);
    } catch (error) {
      res
        .status(400)
        .json({ message: "Error fetching filtered products", error });
    }
  }

  async searchShoes(req, res) {
    try {
      const { query } = req.query; // Expecting a query string for the search

      // Build a dynamic search query using regular expressions for case-insensitive matching
      const searchCriteria = query
        ? {
            $or: [
              { name: { $regex: query, $options: "i" } }, // Case-insensitive search for name
              { description: { $regex: query, $options: "i" } }, // Case-insensitive search for description
            ],
          }
        : {};

      // Find products that match the search criteria
      const products = await Shoe.find(searchCriteria);

      // Return the matching products
      res.status(200).json(products);
    } catch (error) {
      res.status(400).json({ message: "Error searching for products", error });
    }
  }
  async updateStock(req, res) {
    const { id, stock } = req.body;
    const { color, size, quantity } = stock;

    // Validate input data
    if (!id || !color || !size || typeof quantity !== "number") {
      return res
        .status(400)
        .json({ message: "Missing required fields or invalid data" });
    }

    try {
      const product = await Shoe.findOne({ id: id });

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Locate the color entry in the images array
      const colorEntry = product.images.find((image) => image.color === color);
      if (!colorEntry) {
        return res.status(404).json({ message: "Color not found" });
      }

      // Locate the size entry in the stock array
      const sizeEntry = colorEntry.stock.find(
        (stockItem) => stockItem.size === size
      );
      if (!sizeEntry) {
        return res.status(404).json({ message: "Size not found" });
      }

      // Update the quantity
      sizeEntry.quantity = quantity;

      // Save the updated product
      await product.save();
      return res
        .status(200)
        .json({ message: "Stock updated successfully", product });
    } catch (error) {
      console.error("Error updating stock:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  async getRecommendations(req, res) {
    const { email } = req.params; // Nhận email từ query parameter

    // Gọi script Python và truyền email làm tham số
    const pythonProcess = spawn("python3", [
      "../Recommend/recommend.py",
      email,
    ]);

    let data = "";

    pythonProcess.stdout.on("data", (chunk) => {
      data += chunk.toString();
      console.log("Data received from Python script:", data); // Thêm log này để kiểm tra
    });

    pythonProcess.stderr.on("data", (chunk) => {
      console.error("Python error:", chunk.toString());
    });

    pythonProcess.on("close", async (code) => {
      if (code === 0) {
        try {
          // Loại bỏ dấu nháy đơn và thay bằng dấu nháy kép để tạo chuỗi JSON hợp lệ
          let cleanedData = data.trim().replace(/'/g, '"');

          // Phân tích chuỗi thành mảng JSON
          const recommendedProductIDs = JSON.parse(cleanedData);

          // Truy vấn MongoDB để lấy chi tiết các sản phẩm
          const recommendedProducts = await Shoe.find({
            id: { $in: recommendedProductIDs },
          });

          res.status(200).json({ recommendedProducts });
        } catch (error) {
          console.error("Error fetching product details:", error);
          res
            .status(500)
            .json({ message: "Failed to retrieve product details" });
        }
      } else {
        res.status(500).json({ message: "Recommendation failed" });
      }
    });
  }
  async getRecommendationsByItem(req, res) {
    const { id } = req.params; // Receive id from query parameter

    // Call Python script and pass id as argument
    const pythonProcess = spawn("python3", [
      "../Recommend/itemrecommend.py",
      id,
    ]);

    let data = "";

    pythonProcess.stdout.on("data", (chunk) => {
      data += chunk.toString();
    });

    pythonProcess.stderr.on("data", (chunk) => {
      console.error("Python error:", chunk.toString());
    });

    pythonProcess.on("close", async (code) => {
      if (code === 0) {
        try {
          // Log the complete data from Python after closing to ensure full data capture
          console.log("Data received from Python script:", data.trim());

          // Clean single quotes and prepare JSON-compatible string
          let cleanedData = data.trim().replace(/'/g, '"');

          // Parse string to JSON array
          const recommendedProductIDs = JSON.parse(cleanedData);

          // Fetch product details from MongoDB
          const recommendedProducts = await Shoe.find({
            id: { $in: recommendedProductIDs },
          });

          res.status(200).json({ recommendedProducts });
        } catch (error) {
          console.error("Error fetching product details:", error);
          res
            .status(500)
            .json({ message: "Failed to retrieve product details" });
        }
      } else {
        res.status(500).json({ message: "Recommendation failed" });
      }
    });
  }
  async totalProducts(req, res) {
    try {
      // Đếm tổng số tài liệu (sản phẩm) trong collection
      const total = await Shoe.countDocuments({});

      // Trả về kết quả
      res.status(200).json({ total });
    } catch (error) {
      // Xử lý lỗi nếu có
      console.error("Error fetching total products:", error);
      res.status(500).json({ error: "Failed to fetch total products" });
    }
  }
  async getQuantity(req, res) {
    try {
      const { id, color, size } = req.body; // Lấy dữ liệu từ request body
      // Tìm sản phẩm theo ID và màu sắc
      const shoe = await Shoe.findOne(
        { id: id, "images.color": color },
        { "images.$": 1 } // Chỉ lấy mảng 'images' tương ứng với màu đã chỉ định
      );

      if (!shoe) {
        return res.status(404).json({ message: "Shoe or color not found" });
      }

      // Lấy mảng 'stock' từ hình ảnh của màu sắc đã chỉ định
      const stock = shoe.images[0].stock.find((s) => s.size === size);

      if (!stock) {
        return res.status(404).json({ message: "Size not found in stock" });
      }

      return res.status(200).json({ quantity: stock.quantity });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  async updateQuantity(req, res) {
    try {
      const { productId, color, size, quantity, action } = req.body;
      // Kiểm tra thông tin đầu vào
      if (!productId || !color || !size || quantity === undefined) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const product = await Shoe.findOne({ id: productId });
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const image = product.images.find((img) => img.color === color);
      if (!image) {
        return res.status(400).json({ message: "Color not found" });
      }

      const stockItem = image.stock.find((item) => item.size === size);
      if (!stockItem) {
        return res.status(400).json({ message: "Size not found" });
      }

      // Kiểm tra số lượng hàng
      if (!action && stockItem.quantity < quantity) {
        return res.status(400).json({ message: "Not enough stock" });
      }

      // Cập nhật số lượng
      stockItem.quantity += action ? quantity : -quantity;

      await product.save();
      return res.status(200).json({ message: "Stock updated successfully" });
    } catch (error) {
      console.error("Error updating quantity:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async deleteShoe(req, res) {
    try {
      const { id } = req.params;

      // Tìm sản phẩm trong cơ sở dữ liệu
      const shoe = await Shoe.findOne({ id });
      if (!shoe) {
        return res.status(404).json({ message: "Shoe not found" });
      }

      // Xóa khuyến mãi liên quan đến sản phẩm
      await Discount.deleteMany({ productId: id });

      // Xóa các tệp hình ảnh liên quan
      const productDir = path.join(__dirname, `../../../uploads/Shoes/${id}`);
      if (fs.existsSync(productDir)) {
        fs.rmSync(productDir, { recursive: true, force: true });
      }

      // Xóa sản phẩm khỏi cơ sở dữ liệu
      await Shoe.deleteOne({ id });

      res
        .status(200)
        .json({ message: "Shoe and related discounts deleted successfully" });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "Error deleting shoe", error: err.message });
    }
  }
}

module.exports = new ShoesController();
