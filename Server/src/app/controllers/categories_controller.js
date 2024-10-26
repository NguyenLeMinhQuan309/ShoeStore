const Category = require("../../models/categories_model");

class CategoryController {
  // Create a new category
  async createCategory(req, res) {
    try {
      const { id, name } = req.body;
      const category = new Category({ id, name });
      await category.save();
      res
        .status(201)
        .json({ message: "Category created successfully", category });
    } catch (error) {
      res.status(400).json({ message: "Error creating category", error });
    }
  }

  // Get all categories
  async getCategories(req, res) {
    try {
      const categories = await Category.find({});
      // console.log("All Category Fetched");
      res.status(200).send(categories);
    } catch (error) {
      res.status(400).json({ message: "Error fetching categories", error });
    }
  }

  // Get a single category by ID
  async getCategoryById(req, res) {
    try {
      const category = await Category.findOne({ id: req.params.id });
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.status(200).json(category);
    } catch (error) {
      res.status(400).json({ message: "Error fetching category", error });
    }
  }

  // Update a category by ID
  async updateCategory(req, res) {
    try {
      const { name, description } = req.body;
      const category = await Category.findOneAndUpdate(
        { id: req.params.id },
        { name },
        { new: true }
      );
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res
        .status(200)
        .json({ message: "Category updated successfully", category });
    } catch (error) {
      res.status(400).json({ message: "Error updating category", error });
    }
  }

  // Delete a category by ID
  async deleteCategory(req, res) {
    try {
      const category = await Category.findOneAndDelete({ id: req.params.id });
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: "Error deleting category", error });
    }
  }
}

module.exports = new CategoryController();
