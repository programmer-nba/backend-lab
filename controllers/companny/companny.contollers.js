const bcrypt = require("bcrypt");
const dayjs = require("dayjs");
const Joi = require("joi");
const fs = require("fs");
const { google } = require("googleapis");
const { default: axios } = require("axios");
const req = require("express/lib/request.js");
const { Company } = require("../../models/companny/companny.models");
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
    const company = await Company.findOne({
      company_name: req.body.company_name,
    });
    if (company)
      return res.status(409).send({
        status: false,
        message: "มีชื่อบริษัทนี้อยู่ในระบบเเล้ว",
      });
    await new Company({
      ...req.body,
    }).save();
    res.status(201).send({ message: "เพิ่มข้อมูลบริษัทสำเร็จ", status: true });
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "มีบางอย่างผิดพลาด" });
  }
};
exports.EditCompany = async (req, res) => {
  try {
    const id = req.params.id;
    if (!req.body) {
      return res
        .status(400)
        .send({ status: false, message: error.details[0].message });
    }
    const new_supplier = await Company.findByIdAndUpdate(id, {
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
exports.deleteCompany = async (req, res) => {
  try {
    const id = req.params.id;
    const company = await Company.findByIdAndDelete(id);
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
exports.deleteAllCompany = async (req, res) => {
  try {
    const result = await Company.deleteMany({});

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
exports.getCompannyAlls = async (req, res) => {
  try {
    const companny = await Company.find();
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
exports.getCompanyById = async (req, res) => {
  try {
    const id = req.params.id;
    const companny = await Company.findById(id);
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
