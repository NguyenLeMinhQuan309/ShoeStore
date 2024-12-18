const express = require("express");
const axios = require("axios");
const CryptoJS = require("crypto-js"); // npm install crypto-js
const qs = require("qs");
// APP INFO
const config = {
  app_id: "2553",
  key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
  key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
  endpoint: "https://sb-openapi.zalopay.vn/v2/create",
};
const moment = require("moment"); // npm install moment
class PaymentController {
  async payment(req, res) {
    const embed_data = {
      redirecturl: "http://localhost:5173",
    };

    const items = [{}];
    const transID = Math.floor(Math.random() * 1000000);
    const app_trans_id = `${moment().format("YYMMDD")}_${transID}`;
    const order = {
      app_id: config.app_id,
      app_trans_id: app_trans_id, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
      app_user: "NguyenLeMinhQuan",
      app_time: Date.now(), // miliseconds
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embed_data),
      amount: Math.round(req.body.amount / 1000 / 1000) * 1000,
      description: `Thanh toan cho don hang #${req.body.order_id}`,
      bank_code: "zalopayapp",
      callback_url:
        "https://f9fb-14-226-183-38.ngrok-free.app/payment/callback",
    };

    // appid|app_trans_id|appuser|amount|apptime|embeddata|item
    const data =
      config.app_id +
      "|" +
      order.app_trans_id +
      "|" +
      order.app_user +
      "|" +
      order.amount +
      "|" +
      order.app_time +
      "|" +
      order.embed_data +
      "|" +
      order.item;
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();
    try {
      const result = await axios.post(config.endpoint, null, { params: order });
      console.log(result.data);

      // Include app_trans_id in the response
      return res.status(200).json({
        ...result.data,
        app_trans_id: order.app_trans_id, // Assuming app_trans_id is part of the `order` object
      });
    } catch (error) {
      console.error("Error processing request:", error.message);
      return res.status(500).json({ error: "Failed to process order request" });
    }
  }
  async callback(req, res) {
    let result = {};

    try {
      let dataStr = req.body.data;
      let reqMac = req.body.mac;

      let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
      console.log("mac =", mac);

      // kiểm tra callback hợp lệ (đến từ ZaloPay server)
      if (reqMac !== mac) {
        // callback không hợp lệ
        result.return_code = -1;
        result.return_message = "mac not equal";
      } else {
        // thanh toán thành công
        // merchant cập nhật trạng thái cho đơn hàng
        let dataJson = JSON.parse(dataStr, config.key2);
        console.log(
          "update order's status = success where app_trans_id =",
          dataJson["app_trans_id"]
        );

        result.return_code = 1;
        result.return_message = "success";
      }
    } catch (ex) {
      result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
      result.return_message = ex.message;
    }

    // thông báo kết quả cho ZaloPay server
    res.json(result);
  }
  async orderStatus(req, res) {
    const app_trans_id = req.params.app_trans_id;
    let postData = {
      app_id: config.app_id,
      app_trans_id: app_trans_id, // Input your app_trans_id
    };

    let data =
      postData.app_id + "|" + postData.app_trans_id + "|" + config.key1; // appid|app_trans_id|key1
    postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    let postConfig = {
      method: "post",
      url: "https://sb-openapi.zalopay.vn/v2/query",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: qs.stringify(postData),
    };
    try {
      let result = await axios(postConfig);
      return res.status(200).json(result.data);
    } catch (error) {
      console.log(error.message);
    }
  }
}
module.exports = new PaymentController();
