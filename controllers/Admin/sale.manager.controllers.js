const bcrypt = require("bcrypt");
const dayjs = require("dayjs");
const Joi = require("joi");
const axios = require("axios");
const querystring = require("querystring");
const { google } = require("googleapis");
const qrcode = require("qrcode");
const nodemailer = require("nodemailer");
const req = require("express/lib/request.js");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const {
  SaleLeader,
  validateSaleLeader,
} = require("../../models/sale/sale.Leader.models");
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
      const user = await SaleLeader.findOne({
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

      const sale = new SaleLeader({
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
exports.getSaleLeaderAll = async (req, res) => {
  try {
    const sl = await SaleLeader.find();
    if (!sl) {
      return res
        .status(404)
        .send({ status: false, message: "ไม่พบข้อมูลหัวหน้าเซลล์" });
    } else {
      return res
        .status(200)
        .send({ status: true, message: "ดึงข้อมูลสำเร็จ", data: sl });
    }
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "มีบางอย่างผิดพลาด" });
  }
};
exports.getSaleLeaderBY = async (req, res) => {
  try {
    const id = req.params.id;
    const sl = await SaleLeader.findById(id);
    if (!sl) {
      return res
        .status(404)
        .send({ status: false, message: "ไม่พบข้อมูลหัวหน้าเซลล์" });
    } else {
      return res
        .status(200)
        .send({ status: true, message: "ดึงข้อมูลสำเร็จ", data: sl });
    }
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "มีบางอย่างผิดพลาด" });
  }
};
exports.EditSaleLeader = async (req, res) => {
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
      const user = await SaleLeader.findOne({
        sale_username: req.body.sale_username,
      });
      if (user) {
        return res
          .status(409)
          .send({ status: false, message: "username นี้มีคนใช้แล้ว" });
      }
      const id = req.params.id;
      if (!req.body.password) {
        await SaleLeader.findByIdAndUpdate(id, {
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
        await SaleLeader.findByIdAndUpdate(id, req.body);
      } else {
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.sale_password, salt);
        await SaleLeader.findByIdAndUpdate(id, {
          ...req.body,
          sale_password: hashPassword,
        });
      }

      return res
        .status(200)
        .send({ message: "แก้ไขผู้ใช้งานนี้เรียบร้อยแล้ว", status: true });
    });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};
exports.deleteSaleLeader = async (req, res) => {
  try {
    const id = req.params.id;
    const qt = await SaleLeader.findByIdAndDelete(id);
    if (!qt) {
      return res
        .status(404)
        .send({ status: false, message: "ไม่พบข้อมูลพนักงานเซลล์" });
    } else {
      return res
        .status(200)
        .send({ status: true, message: "ลบข้อมูลพนักงานเซลล์สำเร็จ" });
    }
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "มีบางอย่างผิดพลาด" });
  }
};

async function Salenumber(date) {
  const sal = await SaleLeader.find();
  let sale_number = null;
  if (sal.length !== 0) {
    let data = "";
    let num = 0;
    let check = null;
    do {
      num = num + 1;
      data = `EMP${dayjs(date).format("YYYYMMDD")}`.padEnd(10, "0") + num;
      check = await SaleLeader.find({ sale_number: data });
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
