const Brand = require("../../models/brands_model");

class BrandController {
  // Create a new Brand
  async createBrand(req, res) {
    try {
      const { id, name } = req.body;
      const brand = new Brand({ id, name });
      await brand.save();
      res.status(201).json({ message: "Brand created successfully", brand });
    } catch (error) {
      if (error.code === 11000) {
        res.status(400).json({ message: "Brand ID already exists", error });
      } else {
        res.status(500).json({ message: "Error creating brand", error });
      }
    }
  }

  // Get all categories
  async getBrands(req, res) {
    try {
      const brands = await Brand.find({});
      console.log("All Brand Fetched");
      res.status(200).send(brands);
    } catch (error) {
      res.status(400).json({ message: "Error fetching brands", error });
    }
  }

  // Get a single Brand by ID
  async getBrandById(req, res) {
    try {
      const brand = await Brand.findOne({ id: req.params.id });
      if (!brand) {
        return res.status(404).json({ message: "Brand not found" });
      }
      res.status(200).json(brand);
    } catch (error) {
      res.status(400).json({ message: "Error fetching Brand", error });
    }
  }

  // Update a Brand by ID
  async updateBrand(req, res) {
    try {
      const { name } = req.body;
      const brand = await Brand.findOneAndUpdate(
        { id: req.params.id },
        { name },
        { new: true }
      );
      if (!brand) {
        return res.status(404).json({ message: "Brand not found" });
      }
      res.status(200).json({ message: "Brand updated successfully", Brand });
    } catch (error) {
      res.status(400).json({ message: "Error updating brand", error });
    }
  }

  // Delete a Brand by ID
  async deleteBrand(req, res) {
    try {
      const brand = await Brand.findOneAndDelete({ id: req.params.id });
      if (!brand) {
        return res.status(404).json({ message: "Brand not found" });
      }
      res.status(200).json({ message: "Brand deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: "Error deleting Brand", error });
    }
  }
}

module.exports = new BrandController();
