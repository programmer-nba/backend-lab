const bcrypt = require("bcrypt");
const dayjs = require("dayjs");
const Joi = require("joi");
const { google } = require("googleapis");
const { default: axios } = require("axios");
const req = require("express/lib/request.js");
const { Admins, validateAdmin } = require("../../models/Admin/admin.model");
const { Quotation } = require("../../models/sale/quotation.models");
const { Chain } = require("../../models/Chain/chain.models");
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
const { admin } = require("googleapis/build/src/apis/admin");

exports.ApproveQuotation = async (req, res) => {
  try {
    const id = req.params.id;
    const chain = await Quotation.findById(id);
    const chackStatus = chain.status.some((item) => item.name === "Approved");
        if (chackStatus) {
          return res.status(400).send({
            message: "รายการนี้ได้ดำเนินการไปแล้ว",
            status: false,
          });
            }
        chain.status.push({
          name: "Approved",
          timestamps: dayjs(Date.now()).format(""),
        });
    const updatedQuotation = await chain.save();
    const newChain = new Chain({
      ...chain.toObject(),
      status: [
        ...chain.status,
        {
          name: "Approved",
          timestamps: dayjs(Date.now()).format(""),
        },
      ],
    });
    const savedChain = await newChain.save();
      return res.status(200).send({
        status: true,
        message: "Approved Successful",
        data: savedChain,
      });
  } catch (error) {
      return res
        .status(500)
        .send({ message: "มีบางอย่างผิดพลาด", status: false });
  }
};
exports.RejectQuotation = async (req, res) => {
  try {
    const id = req.params.id;
    const updateStatus = await Quotation.findOne({ _id: id });

    if (updateStatus) {
      updateStatus.status.push({
        name: "Reject",
        timestamps: dayjs(Date.now()).format(""),
      });
      updateStatus.save();
      return res.status(200).send({
        status: true,
        message: "Reject Successful",
        data: updateStatus,
      });
    } else {
      return res.status(500).send({
        message: "มีบางอย่างผิดพลาด",
        status: false,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .send({ message: "มีบางอย่างผิดพลาด", status: false });
  }
};
exports.getQuotationAll = async (req, res) => {
  try {
    const qt = await Quotation.find();
    if (!qt) {
      return res
        .status(404)
        .send({ status: false, message: "ไม่พบใบเสนอราคา" });
    } else {
      return res
        .status(200)
        .send({ status: true, message: "ดึงข้อมูลสำเร็จ", data: qt });
    }
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "มีบางอย่างผิดพลาด" });
  }
};
exports.getQuotationById = async (req, res) => {
  try {
    const id = req.params.id;
    const qt = await Quotation.findById(id);
    if (!qt) {
      return res
        .status(404)
        .send({ status: false, message: "ไม่พบใบเสนอราคา" });
    } else {
      return res
        .status(200)
        .send({ status: true, message: "ดึงข้อมูลสำเร็จ", data: qt });
    }
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "มีบางอย่างผิดพลาด" });
  }
};
exports.deleteQT = async (req, res) => {
  try {
    const id = req.params.id;
    const qt = await Quotation.findByIdAndDelete(id);
    if (!qt) {
      return res
        .status(404)
        .send({ status: false, message: "ไม่พบข้อมูลใบเสนอราคา" });
    } else {
      return res
        .status(200)
        .send({ status: true, message: "ลบข้อมูลใบเสนอราคาสำเร็จ" });
    }
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "มีบางอย่างผิดพลาด" });
  }
};
