require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const connection = require("./config/db");
connection();
const path = require('path');

app.use(bodyParser.json({ limit: "50mb", type: "application/json" }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use(cors());

const prefix = "/LAB";

const fileRoutes = require('./router/file/fileRoutes');
app.use(prefix + '/', fileRoutes);

app.use('/LAB/', express.static(path.join(__dirname, 'uploads')));

app.use(prefix + "/", require("./router/item/tool_router"));

app.use(prefix + "/", require("./router/index"));

//เเอดมิน
app.use(prefix + "/admin", require("./router/admin/index"));
app.use(prefix + "/admin/quotation", require("./router/admin/quotaion"));

//พนักงานเเต่ละเเผนก
app.use(prefix + "/employee", require("./router/employee/index"));

//บริษัทตัวเอง
app.use(prefix + "/companny", require("./router/companny/index")); //เพิ่มข้อมูลบริษัท

// //chain
app.use(prefix + "/work", require("./router/work/index"));
app.use(prefix + "/chain", require("./router/chain/chain")); //เพิ่มข้อมูล chain
app.use(prefix + "/subchain", require("./router/subchain/subchain")); //เพิ่มข้อมูล workchain

//เพิ่มข้อมูลบริษัทลูกค้า
app.use(
  prefix + "/companny_customer",
  require("./router/companny_customer/index")
); //เพิ่มข้อมูลบริษัท

//พนักงาน เซลล์
app.use(prefix + "/sale/maneger", require("./router/admin/saleManager")); //หัวหน้าเซลล์
app.use(prefix + "/sale", require("./router/sale/index")); //เพิ่มลบเเก้ไขข้อมูลของพนักงาน
app.use(prefix + "/fromtDetails", require("./router/customer/index")); //กรอกข้อมูลของลูกค้า
app.use(prefix + "/quotation", require("./router/quotation/index")); //.ใบเสนอราคา
app.use(prefix + "/Base/quotation", require("./router/quotation/base.quotation")); //สร้างใบเสนอราคาหลัก

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

///////////////////////
app.use(prefix + "/type", require("./router/item/index")); //สร้างประเภทของรายละเอียดงาน
app.use(prefix + "/type/Analysis", require("./router/item/AnalysisMethods")); //สร้างวิธีการวิเคราะห์
app.use(prefix + "/type/PaymentTerm", require("./router/item/paymentTerm")); //สร้างวิธีการวิเคราะห์
app.use(prefix + "/type/report", require("./router/item/itemReport")); //สร้าง report แบบ id
app.use(prefix + "/type/Signature", require("./router/item/Signature")); //สร้าง ลายเซ็น

//กรมสรรพากร
app.use(
  prefix + "/RevenueDepartment",
  require("./router/RevenueDepartment/Revenue")
);

const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
  '1015524499302-a0cke74vtkckkisuor47u9hvhm645km9.apps.googleusercontent.com',
  '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',
  'http://localhost/4681/'
);

app.get('/auth/google', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/drive'] // Specify scopes as needed
  });
  res.redirect(url);
});

app.get('/auth/google/callback', async (req, res) => {
  const code = req.query.code;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    console.log('Access token:', tokens.access_token);
    console.log('Refresh token:', tokens.refresh_token);
    console.log('Expires in:', tokens.expires_in); // Expiry time in seconds
    res.send('Authorization code exchanged for tokens successfully!');
  } catch (error) {
    console.error('Error exchanging authorization code for tokens:', error);
    res.status(500).send('Error exchanging authorization code for tokens');
  }
});

const port = process.env.PORT || 4681;
app.listen(port, console.log(`Listening on port ${port}`));
