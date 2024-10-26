const express = require("express");
const router = express.Router();

const CategoryController = require("../app/controllers/categories_controller");

router.post("/create", CategoryController.createCategory);
router.get("/getAll", CategoryController.getCategories);
router.delete("/delete/:id", CategoryController.deleteCategory);
router.post("/get/:id", CategoryController.getCategoryById);
router.put("/update/:id", CategoryController.updateCategory);
module.exports = router;
