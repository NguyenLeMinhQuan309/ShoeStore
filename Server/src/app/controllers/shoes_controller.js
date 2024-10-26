const Shoe = require("../../models/shoes_model");
const path = require("path");
const fs = require("fs");

class ShoesController {
  // Lấy tất cả các sản phẩm giày
  async getAllShoes(req, res) {
    try {
      const shoes = await Shoe.find();
      res.status(202).send(shoes);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // Thêm sản phẩm giày mới
  async addShoe(req, res) {
    try {
      const {
        name,
        size, // Expecting this to be a string like "1,2,3"
        price,
        category, // Expecting this to be a string like "sports,casual"
        brand,
        stock,
        description,
        color, // This should be an array now
      } = req.body;

      // Fetch the latest shoe to get the last ID
      const lastShoe = await Shoe.findOne().sort({ id: -1 });

      let newId;
      if (lastShoe) {
        // Extract the number part, increment it, and format back to "IDxx"
        const lastIdNumber = parseInt(lastShoe.id.slice(2)); // Remove "ID" and parse the number
        newId = `ID${(lastIdNumber + 1).toString().padStart(2, "0")}`;
      } else {
        // If no products exist, set the id to "ID01"
        newId = "ID01";
      }

      // Convert size string to an array of numbers and sort in ascending order
      const parsedSize = size
        .split(",")
        .map(Number)
        .sort((a, b) => a - b);

      // Convert category string to an array of strings, trimming extra spaces

      const images = [];
      if (req.files && req.files.length > 0) {
        const tempDir = path.join(__dirname, `../../../uploads/Shoes/temp`);
        // Ensure there are enough files to cover both colors
        if (req.files.length < 6) {
          return res.status(400).json({
            message: "At least 12 images are required for two colors.",
          });
        }

        // Create directories and populate image URLs for each color
        color.forEach((c, index) => {
          const finalDir = path.join(
            __dirname,
            `../../../uploads/Shoes/${newId}/${c}`
          );

          // Create the final directory if it doesn't exist
          if (!fs.existsSync(finalDir)) {
            fs.mkdirSync(finalDir, { recursive: true });
          }

          // Prepare image URLs for the specific color
          const colorImageUrls = req.files
            .slice(index * 6, (index + 1) * 6)
            .map((file) => {
              const finalFilePath = path.join(finalDir, file.filename);
              fs.renameSync(path.join(tempDir, file.filename), finalFilePath); // Move file from temp to final directory

              // Construct the URL using forward slashes
              return `${req.protocol}://${req.get(
                "host"
              )}/shoe/uploads/Shoes/${newId}/${c}/${file.filename}`;
            });

          images.push({ imageUrls: colorImageUrls, color: c });
        });
      }

      // Create a new shoe document with the parsed data and image URLs
      const newShoe = new Shoe({
        id: newId,
        name,
        category,
        brand,
        stock,
        description,
        price,
        size: parsedSize,
        images: images,
      });

      await newShoe.save();
      res.status(201).json(newShoe);
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: err.message });
    }
  }

  // Cập nhật sản phẩm giày theo ID
  async updateShoe(req, res) {
    try {
      const {
        id,
        name,
        category,
        brand,
        size,
        price,
        stock,
        description,
        color,
      } = req.body;

      const parsedSize = size
        .split(",")
        .map(Number)
        .sort((a, b) => a - b);

      let updatedImageField = {};
      if (req.files && req.files.length > 0) {
        const newImages = req.files.map((file) => {
          // Ensure the directory structure exists for updated images
          const dir = path.join(
            __dirname,
            `../../../uploads/Shoes/${id}/${color}`
          );
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }

          // Return the public URL for the uploaded images
          return path.join(
            `http:///localhost:3000/shoe/uploads/Shoes/${id}/${color}`,
            file.filename
          );
        });

        updatedImageField = {
          $push: { images: { imageUrls: newImages, color } },
        };
      }

      const updatedShoe = await Shoe.findByIdAndUpdate(
        req.params.id,
        {
          name,
          size: parsedSize,
          category,
          brand,
          stock,
          description,
          price,
          ...updatedImageField,
        },
        { new: true }
      );
      console.log(req.body);
      if (!updatedShoe)
        return res.status(404).json({ message: "Shoe not found" });

      res.json(updatedShoe);
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: err.message });
    }
  }
  // async filterProducts(req, res) {
  //   try {
  //     const { category, brand, color, size } = req.query;

  //     // Step 1: Build the query object dynamically
  //     let query = {};

  //     if (category) {
  //       // If category is a string (single category), convert it into an array
  //       const categories = Array.isArray(category) ? category : [category];
  //       query.category = { $in: categories }; // Use $in to match any category in the array
  //     }

  //     if (brand) {
  //       query.brand = brand;
  //     }

  //     if (color) {
  //       // Filter by the color field inside the images array
  //       query["image.color"] = color; // Match color in the images array
  //     }

  //     if (size) {
  //       query.size = size;
  //     }

  //     // Step 2: Find products based on the query
  //     const products = await Product.find(query);

  //     // Step 3: Return the filtered products
  //     res.status(200).json(products);
  //   } catch (error) {
  //     res.status(400).json({ message: "Error filtering products", error });
  //   }
  // }
  async filterProduct(req, res) {
    try {
      const { category, brand, color, size } = req.query;

      let filters = {};

      if (category) {
        filters.category = { $in: category.split(",") };
      }

      if (brand) {
        filters.brand = { $in: brand.split(",") };
      }

      if (color) {
        filters["images.color"] = { $in: color.split(",") };
      }
      if (size) {
        filters.size = { $in: size.split(",") };
      }
      console.log(filters);
      const products = await Shoe.find(filters);
      // console.log(products);
      res.status(200).json(products);
    } catch (error) {
      res
        .status(400)
        .json({ message: "Error fetching filtered products", error });
    }
  }
  // Tìm kiếm sản phẩm giày theo tên hoặc mô tả
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
}

module.exports = new ShoesController();
