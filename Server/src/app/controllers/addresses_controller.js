// controllers/addressController.js
const Address = require("../../models/addresses");
class AddressController {
  // Lấy tất cả địa chỉ
  // Correct implementation
  async getAddress(req, res) {
    try {
      const address = await Address.findOne({ email: req.params.email }); // Make sure you're using { email: req.params.email }
      res.status(200).json(address);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Thêm một địa chỉ mới
  async createAddress(req, res) {
    const address = new Address(req.body);
    try {
      const savedAddress = await address.save();
      res.status(201).json(savedAddress);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Cập nhật địa chỉ theo ID
  async updateAddress(req, res) {
    try {
      const updatedAddress = await Address.findOneAndUpdate(
        { email: req.params.email }, // Use findOneAndUpdate with email as filter
        req.body, // Update the address fields
        { new: true } // Return the updated document
      );
      if (!updatedAddress) {
        return res.status(404).json({ message: "Address not found" });
      }
      res.status(200).json(updatedAddress);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Xóa địa chỉ theo ID
  async deleteAddress(req, res) {
    try {
      const deletedAddress = await Address.findByIdAndDelete(req.params.email);
      if (!deletedAddress) {
        return res.status(404).json({ message: "Address not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
module.exports = new AddressController();
