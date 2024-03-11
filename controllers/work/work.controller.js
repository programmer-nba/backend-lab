const bcrypt = require("bcrypt");
const dayjs = require("dayjs");
const Joi = require("joi");
const fs = require("fs");
const { google } = require("googleapis");
const { default: axios } = require("axios");
const req = require("express/lib/request.js");
const { Work } = require("../../models/Chain/work.models");

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

exports.getWorkAlls = async (req, res) => {
  try {
    const data = await Work.find().populate("quotation");
    if (!data) {
      return res
        .status(404)
        .send({ status: false, message: "ไม่พบข้อมูล chain ในระบบ" });
    } else {
      return res
        .status(200)
        .send({ status: true, message: "ดึงข้อมูลสำเร็จ", data: data });
    }
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "มีบางอย่างผิดพลาด" });
  }
};


exports.getWorkById = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Work.findById(id).populate("quotation");
    if (!data) {
      return res
        .status(404)
        .send({ status: false, message: "ไม่พบข้อมูล Work ในระบบ" });
    } else {
      return res
        .status(200)
        .send({ status: true, message: "ดึงข้อมูลสำเร็จ", data: data });
    }
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "มีบางอย่างผิดพลาด" });
  }
};


exports.deleteWork = async (req, res) => {
  try {
    const id = req.params.id;
    const work = await Work.findByIdAndDelete(id);
    if (!work) {
      return res
        .status(404)
        .send({ status: false, message: "ไม่พบข้อมูล Work" });
    } else {
      return res
        .status(200)
        .send({ status: true, message: "ลบข้อมุล Work สำเร็จ" });
    }
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "มีบางอย่างผิดพลาด" });
  }
};
