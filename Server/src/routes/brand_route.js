const express = require("express");
const router = express.Router();

const BrandController = require("../app/controllers/brands_controller");

router.post("/create", BrandController.createBrand);
router.get("/getAll", BrandController.getBrands);
router.delete("/delete/:id", BrandController.deleteBrand);
router.post("/get/:id", BrandController.getBrandById);
router.put("/update/:id", BrandController.updateBrand);
module.exports = router;
