const userRouter = require("./user_route");
const categoryRouter = require("./categories_route");
const shoeRouter = require("./shoe_route");
const reviewRouter = require("./review_route");
const cartRouter = require("./cart_route");
const orderRouter = require("./order_route");
const addressRouter = require("./address_route");
const statisticRouter = require("./statistic_route");
const brandRouter = require("./brand_route");
const paymentRouter = require("./payment_route");
const viewHistoryRouter = require("./viewHistory_route");
const discountRouter = require("./discount_route");
//const detailRouter = require('./detail_route');
function route(app) {
  app.use("/user", userRouter);
  app.use("/shoe", shoeRouter);
  app.use("/category", categoryRouter);
  app.use("/review", reviewRouter);
  app.use("/cart", cartRouter);
  app.use("/order", orderRouter);
  app.use("/address", addressRouter);
  app.use("/statistics", statisticRouter);
  app.use("/brand", brandRouter);
  app.use("/payment", paymentRouter);
  app.use("/viewHistory", viewHistoryRouter);
  app.use("/discount", discountRouter);
}
module.exports = route;
