const bcrypt = require("bcrypt");
const dayjs = require("dayjs");
const Joi = require("joi");
const qr = require("qrcode");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const querystring = require("querystring");
const { google } = require("googleapis");
const { linenotify } = require("../../lib/line");
const qrcode = require("qrcode");
const nodemailer = require("nodemailer");
const req = require("express/lib/request.js");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const { Sale, validateSale } = require("../../models/sale/sale.models");
const { Employee } = require("../../models/employee/employee.model");
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
    // console.log(file.originalname);
  },
});
const {
  uploadFileCreate,
  deleteFile,
} = require("../../funtions/uploadfilecreate");
const { stack } = require("../../router");

exports.create = async (req, res) => {
  try {
    let upload = multer({ storage: storage }).array("imgCollection", 20);
    upload(req, res, async function (err) {
      const reqFiles = [];
      const result = [];
      if (err) {
        return res.status(500).send(err);
      }
      let profile_image = ""; // ตั้งตัวแปรรูป
      if (req.files) {
        const url = req.protocol + "://" + req.get("host");
        for (var i = 0; i < req.files.length; i++) {
          const src = await uploadFileCreate(req.files, res, { i, reqFiles });
          result.push(src);
          //   reqFiles.push(url + "/public/" + req.files[i].filename);
        }
        profile_image = reqFiles[0];
      }
      const user = await Sale.findOne({
        sale_username: req.body.sale_username,
      });
      if (user) {
        return res
          .status(409)
          .send({ status: false, message: "username นี้มีคนใช้แล้ว" });
      }

      const sale_number = await Salenumber();
      const salt = await bcrypt.genSalt(Number(process.env.SALT));
      const hashPassword = await bcrypt.hash(req.body.sale_password, salt);

      const sale = new Sale({
        sale_number: sale_number,
        profile_image: profile_image,
        card_number: req.body.card_number,
        address: {
          moo_number: req.body.moo_number,
          house_number: req.body.house_number,
          soi: req.body.soi,
          name_road: req.body.name_road,
          tumbol: req.body.tumbol,
          district: req.body.district,
          province: req.body.province,
          zip_code: req.body.zip_code,
        },
        sale_position: req.body.sale_position,
        sale_name: req.body.sale_name,
        sale_tel: req.body.sale_tel,
        sale_username: req.body.sale_username,
        sale_password: hashPassword,
        sale_address: req.body.sale_address,
      });
      const add = await sale.save();
      return res.status(200).send({
        status: true,
        message: "คุณได้สร้างไอดี user เรียบร้อย",
        data: add,
      });
    });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};
exports.EditSale = async (req, res) => {
  try {
    let upload = multer({ storage: storage }).array("imgCollection", 20);
    upload(req, res, async function (err) {
      const reqFiles = [];
      const result = [];
      if (err) {
        return res.status(500).send(err);
      }
      let profile_image = ""; // ตั้งตัวแปรรูป
      if (req.files) {
        const url = req.protocol + "://" + req.get("host");
        for (var i = 0; i < req.files.length; i++) {
          const src = await uploadFileCreate(req.files, res, { i, reqFiles });
          result.push(src);
        }
        profile_image = reqFiles[0];
      }
      const user = await Sale.findOne({
        sale_username: req.body.sale_username,
      });
      if (user) {
        return res
          .status(409)
          .send({ status: false, message: "username นี้มีคนใช้แล้ว" });
      }
      const id = req.params.id;
      if (!req.body.password) {
        const member = await Sale.findByIdAndUpdate(id, {
          profile_image: profile_image,
          "address.moo_number": req.body.moo_number,
          "address.soi": req.body.soi,
          "address.name_road": req.body.name_road,
          "address.tumbol": req.body.tumbol,
          "address.district": req.body.district,
          "address.province": req.body.province,
          "address.zip_code": req.body.zip_code,
        });
      }
      if (!req.body.sale_password) {
        const admin_new = await Sale.findByIdAndUpdate(id, req.body);
      } else {
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.sale_password, salt);
        const new_passwordadmin = await Sale.findByIdAndUpdate(id, {
          ...req.body,
          sale_password: hashPassword,
        });
        return res
          .status(200)
          .send({ message: "แก้ไขผู้ใช้งานนี้เรียบร้อยเเล้ว", status: true });
      }
    });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};
exports.deleteSale = async (req, res) => {
  try {
    const id = req.params.id;
    const employee = await Sale.findByIdAndDelete(id);
    if (!employee) {
      return res
        .status(404)
        .send({ status: false, message: "ไม่พบข้อมูลพนักงาน" });
    } else {
      return res
        .status(200)
        .send({ status: true, message: "ลบข้อมูลพนักงานสำเร็จ" });
    }
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "มีบางอย่างผิดพลาด" });
  }
};
exports.deleteAllSale = async (req, res) => {
  try {
    const sale = await Sale.deleteMany();
    if (!sale) {
      return res
        .status(404)
        .send({ status: false, message: "ไม่พบข้อมูลพนักงาน" });
    } else {
      return res
        .status(200)
        .send({ status: true, message: "ลบข้อมูลพนักงานทั้งหมดสำเร็จ" });
    }
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "มีบางอย่างผิดพลาด" });
  }
};
exports.GetAllSale = async (req, res) => {
  try {
    const sal = await Sale.find();
    if (sal.length > 0) {
      return res.status(200).send({
        status: true,
        message: "ดึงข้อมูลพนักงานสำเร็จ",
        data: sal,
      });
    } else {
      return res
        .status(404)
        .send({ message: "ไม่พบข้อมุลสมาชิก", status: false });
    }
  } catch (error) {
    res.status(500).send({
      message: "มีบางอย่างผิดพลาด",
      status: false,
    });
  }
};
exports.GetSaleByIds = async (req, res) => {
  try {
    const id = req.params.id;
    const sal = await Sale.findById(id);
    if (sal) {
      return res.status(200).send({
        status: true,
        message: "ดึงข้อมูลพนักงานสำเร็จ",
        data: sal,
      });
    } else {
      return res
        .status(404)
        .send({ message: "ไม่พบข้อมูลสมาชิก", status: false });
    }
  } catch (error) {
    res.status(500).send({
      message: "มีบางอย่างผิดพลาด",
      status: false,
    });
  }
};

//สร้างurl เพื่อเป็น qrCode ในการเเสดงข้อมูล โดยจะส่งรหัสลูกค้า
exports.GenQrCode = async (req, res) => {
  try {
    const sale_number = req.params.id;
    const url = `https://www.example.com/qr-code?data=${encodeURIComponent(
      sale_number
    )}`;
    const qrCodeImageUrl = await generateQrCodeUrl(url);
    return res.status(200).send({
      status: true,
      qrCodeImageUrl,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send({ status: false, error: error.message });
  }
};
const generateQrCodeUrl = async (url) => {
  try {
    const qrCodeDataUrl = await qr.toDataURL(url);
    return qrCodeDataUrl;
  } catch (error) {
    console.error("Error generating QR Code URL:", error);
    throw error;
  }
};
exports.GetEmployee = async (req, res) => {
  try {
    const nuumber = req.params.nuumber;
    console.log(nuumber);
    const emp = await Employee.findOne({ employee_number: nuumber });

    if (emp) {
      res.status(200).send({
        status: true,
        message: "ดึงข้อมูลพนักงานสำเร็จ",
        data: emp,
      });
      const lineNotifyMessage = `ดึงข้อมูลพนักงานสำเร็จ - รหัสพนักงาน: ${emp.employee_number}, ชื่อ: ${emp.name} , เบอร์โทร: ${emp.tel}`;
      await linenotify(lineNotifyMessage);
    } else {
      return res
        .status(404)
        .send({ message: "ไม่พบข้อมูลพนักงาน", status: false });
    }
  } catch (error) {
    res.status(500).send({
      message: "มีบางอย่างผิดพลาด",
      status: false,
    });
  }
};
//----------------------------------------------------//

//ส่งเเจ้งเตือนผ่าน gmail  user:"ใส่ gmail" pass:"ต้องใส่ passkeys"
exports.SendGmail = async (req, res) => {
  const myStorage = multer.memoryStorage();
  const upload = multer({ storage: myStorage }).array("imgCollection", 20);
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "warunyoo084@gmail.com",
        pass: "obgi ehtx humt gpgm",
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    upload(req, res, async function (err) {
      if (err) {
        return res.status(500).send(err);
      }

      const reqFiles = req.files;
      if (!reqFiles || reqFiles.length === 0) {
        return res
          .status(400)
          .send({ status: false, message: "ไม่มีไฟล์รูปภาพที่อัปโหลด" });
      }
      const { to, subject, text } = req.body;
      if (!to) {
        return res
          .status(400)
          .send({ status: false, message: "ไม่ได้กำหนดผู้รับอีเมล" });
      }

      const attachments = reqFiles.map((file) => {
        if (!file.buffer || !file.mimetype) {
          return res.status(400).send({
            status: false,
            message: "Invalid file format or buffer is undefined",
          });
        }
        return {
          filename: file.originalname,
          content: file.buffer.toString("base64"),
          encoding: "base64",
        };
      });
      const mailOptions = {
        from: "warunyoo084@gmail.com",
        to,
        subject,
        text,
        attachments,
      };
      const info = await transporter.sendMail(mailOptions);
      console.log("ส่งอีเมลสำเร็จ: " + info.response);

      res.status(200).send({ status: true, message: "ส่งอีเมล์สำเร็จ" });
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: "ไม่สามารถส่งได้: " + error.message, status: false });
  }
};
//------------------------------------------------------//

async function Salenumber(date) {
  const sal = await Sale.find();
  let sale_number = null;
  if (sal.length !== 0) {
    let data = "";
    let num = 0;
    let check = null;
    do {
      num = num + 1;
      data = `EMP${dayjs(date).format("YYYYMMDD")}`.padEnd(10, "0") + num;
      check = await Sale.find({ sale_number: data });
      if (check.length === 0) {
        sale_number =
          `EMP${dayjs(date).format("YYYYMMDD")}`.padEnd(10, "0") + num;
      }
    } while (check.length !== 0);
  } else {
    sale_number = `EMP${dayjs(date).format("YYYYMMDD")}`.padEnd(10, "0") + "1";
  }
  return sale_number;
}
async function generateQrCode(data, outputPath) {
  const imageUrl = `${outputPath || "uploads"}/${Date.now()}.png`;
  await qrcode.toFile(imageUrl, JSON.stringify(data));
  return imageUrl;
}
