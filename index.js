require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const connection = require("./config/db");
connection();

app.use(bodyParser.json({ limit: "50mb", type: "application/json" }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use(cors());

const prefix = "/LAB";

app.use(prefix + "/", require("./router/index"));
app.use(prefix + "/admin", require("./router/admin/index"));
app.use(prefix + "/employee", require("./router/employee/index")); //พนักงานเเต่ละเเผนก

//บริษัทตัวเอง
app.use(prefix + "/companny", require("./router/companny/index")); //เพิ่มข้อมูลบริษัท

//เพิ่มข้อมูลบริษัทลูกค้า
app.use(
  prefix + "/companny_customer",
  require("./router/companny_customer/index")
); //เพิ่มข้อมูลบริษัท

//พนักงาน เซลล์
app.use(prefix + "/sale", require("./router/sale/index")); //เพิ่มลบเเก้ไขข้อมูลของพนักงาน
app.use(prefix + "/fromtDetails", require("./router/customer/index")); //กรอกข้อมูลของลูกค้า
app.use(prefix + "/quotation", require("./router/quotation/index")); //.ใบเสนอราคา

//พนักงานห้องปฏิบัติการ เเผนกจัดเก็บตัวอย่าง ไรเดอร์
app.use(
  prefix + "/EmployeeRaider",
  require("./router/employee/employee.raider")
);

//พนักงานห้องปฏิบัติการ เเผนกขวด
app.use(
  prefix + "/EmployeeBottle",
  require("./router/employee/employee.bottle")
);

//พนักงานห้องปฏิบัติการ เเผนกเก็บตัวอย่าง
app.use(
  prefix + "/EmployeeSamples",
  require("./router/employee/employee.samples")
);

//พนักงานห้องปฏิบัติการ เเผนกตรวจสอบ
app.use(prefix + "/EmployeeCheck", require("./router/employee/employee.check"));

//พนักงานห้องปฏิบัติการ เเผนกจัดส่งเอกสาร
app.use(
  prefix + "/EmployeeDocument",
  require("./router/employee/employee.documents")
);

const port = process.env.PORT || 4681;
app.listen(port, console.log(`Listening on port ${port}`));