require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const connection = require("./config/db");
connection();

app.use(express.json());
app.use(cors());

const prefix = "/LAB";

app.use(prefix + "/", require("./router/index"));
app.use(prefix + "/admin", require("./router/admin/index"));
app.use(prefix + "/employee", require("./router/employee/index")); //พนักงานเเต่ละเเผนก

//บริษัทตัวเอง
app.use(prefix + "/companny", require("./router/companny/index"));//เพิ่มข้อมูลบริษัท

//เพิ่มข้อมูลบริษัทลูกค้า
app.use(prefix + "/companny_customer", require("./router/companny_customer/index"));//เพิ่มข้อมูลบริษัท

//พนักงาน เซลล์
app.use(prefix + "/sale", require("./router/sale/index")); //เพิ่มลบเเก้ไขข้อมูลของพนักงาน
app.use(prefix + "/fromtDetails", require("./router/customer/index")); //กรอกข้อมูลของลูกค้า
app.use(prefix + "/quotation", require("./router/quotation/index")); //.ใบเสนอราคา

const port = process.env.PORT || 4681;
app.listen(port, console.log(`Listening on port ${port}`));
