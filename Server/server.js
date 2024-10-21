const port = 3000;
const express = require("express");
const app = express();
const route = require("./src/routes/index_route");
const db = require("./src/config/db/index");
const cors = require("cors");

// Cấu hình các middleware trước khi định nghĩa route
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Kết nối cơ sở dữ liệu
db.connect();

// Định nghĩa route sau khi middleware đã được thiết lập
route(app);

app.listen(port, () => console.log(`http://localhost:${port}`));
