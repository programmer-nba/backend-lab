const bcrypt = require("bcrypt");
const dayjs = require("dayjs");
const Joi = require("joi");
const fs = require("fs");
const { google } = require("googleapis");
const { default: axios } = require("axios");
const req = require("express/lib/request.js");
const {
  CompanyCustomer,
} = require("../../models/companny_customer/companny_customer.models");
const multer = require("multer");
const jwt = require("jsonwebtoken");
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

exports.create = async (req, res) => {
  try {
    
    const com = await new CompanyCustomer({
      ...req.body,
    }).save();
    res.status(201).send({ message: "เพิ่มข้อมูลบริษัทสำเร็จ", status: true, data: com });
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "มีบางอย่างผิดพลาด" });
  }
};
exports.EditCompanyCustomer = async (req, res) => {
  try {
    const id = req.params.id;
    if (!req.body) {
      return res
        .status(400)
        .send({ status: false, message: error.details[0].message });
    }
    const new_supplier = await CompanyCustomer.findByIdAndUpdate(id, {
      ...req.body,
    });
    if (new_supplier) {
      return res.send({
        status: true,
        message: "เเก้ไขข้อมูลบริษัทสำเร็จ",
      });
    } else {
      return res.status(400).send({
        status: false,
        message: "เเก้ไขข้อมูลบริษัทไม่สำเร็จ",
      });
    }
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "มีบางอย่างผิดพลาด" });
  }
};
exports.deleteCompanyCustomer = async (req, res) => {
  try {
    const id = req.params.id;
    const company = await CompanyCustomer.findByIdAndDelete(id);
    if (!company) {
      return res
        .status(404)
        .send({ status: false, message: "ไม่พบบริษัทในระบบ" });
    } else {
      return res.status(200).send({ status: true, message: "ลบข้อมูลสำเร็จ" });
    }
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "มีบางอย่างผิดพลาด" });
  }
};
exports.deleteAllCompanyCustomer = async (req, res) => {
  try {
    const result = await CompanyCustomer.deleteMany({});

    if (result.deletedCount > 0) {
      return res
        .status(200)
        .send({ status: true, message: "ลบข้อมูลบริษัททั้งหมดสำเร็จ" });
    } else {
      return res
        .status(404)
        .send({ status: false, message: "ไม่พบข้อมุลสาขา" });
    }
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "มีบางอย่างผิดพลาด" });
  }
};
exports.getCompannyCustomeAllsr = async (req, res) => {
  try {
    const companny = await CompanyCustomer.find();
    if (!companny) {
      return res
        .status(404)
        .send({ status: false, message: "ไม่พบข้อมูลบริษัทในระบบ" });
    } else {
      return res
        .status(200)
        .send({ status: true, message: "ดึงข้อมูลสำเร็จ", data: companny });
    }
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "มีบางอย่างผิดพลาด" });
  }
};
exports.getCompanyCustomerById = async (req, res) => {
  try {
    const id = req.params.id;
    const companny = await CompanyCustomer.findById(id);
    if (!companny) {
      return res
        .status(404)
        .send({ status: false, message: "ไม่พบข้อมูลบริษัทในระบบ" });
    } else {
      return res
        .status(200)
        .send({ status: true, message: "ดึงข้อมูลสำเร็จ", data: companny });
    }
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "มีบางอย่างผิดพลาด" });
  }
};
