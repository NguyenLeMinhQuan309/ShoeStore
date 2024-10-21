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
        color,
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
      const parsedCategory = category.split(",").map((cat) => cat.trim());

      let imageUrls = [];
      if (req.files && req.files.length > 0) {
        // Move images from temporary directory to the final directory after saving the shoe
        const tempDir = path.join(__dirname, `../../../uploads/Shoes/temp`);
        const finalDir = path.join(
          __dirname,
          `../../../uploads/Shoes/${newId}/${color}`
        );

        // Create the final directory if it doesn't exist
        if (!fs.existsSync(finalDir)) {
          fs.mkdirSync(finalDir, { recursive: true });
        }

        // Prepare image URLs
        imageUrls = req.files.map((file) => {
          const finalFilePath = path.join(finalDir, file.filename);
          fs.renameSync(path.join(tempDir, file.filename), finalFilePath); // Move file from temp to final directory

          // Construct the URL using forward slashes
          return `${req.protocol}://${req.get(
            "host"
          )}/shoe/uploads/Shoes/${newId}/${color}/${file.filename}`;
        });
      }

      // Create a new shoe document with the parsed data and image URLs
      const newShoe = new Shoe({
        id: newId,
        name,
        category: parsedCategory,
        brand,
        stock,
        description,
        price,
        size: parsedSize,
        images: [{ imageUrls, color }],
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
      const parsedCategory = category.split(",").map((cat) => cat.trim());

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
          category: parsedCategory,
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
}

module.exports = new ShoesController();
