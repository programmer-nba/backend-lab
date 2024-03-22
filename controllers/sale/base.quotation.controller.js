const bcrypt = require("bcrypt");
const dayjs = require("dayjs");
const Joi = require("joi");
const { google } = require("googleapis");
const { default: axios } = require("axios");
const req = require("express/lib/request.js");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const { BaseQuotation } = require("../../models/sale/base.quotation.models");
const { Sale, validateSale } = require("../../models/sale/sale.models");
const {
  CompanyCustomer,
} = require("../../models/companny_customer/companny_customer.models");
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

exports.BaseQuotation = async (req, res) => {
  try {
    const data = new BaseQuotation({
      title: req.body.title,
      creator: {
        name: req.body.creator.name,
        _id: req.body.creator._id
      },
      subhead: {
        customer_name: req.body.subhead.customer_name,
        customer_company: req.body.subhead.customer_company,
        customer_address: req.body.subhead.customer_address,
        customer_tel: req.body.subhead.customer_tel,
        customer_fax: req.body.subhead.customer_fax,
        customer_email: re.body.subhead.customer_email,
        sample_lacation: req.body.subhead.sample_lacation,
        document_no: await Quotationnumber(),
        document_date: req.body.subhead.document_date,
        offerer: req.body.subhead.offerer,
        offerer_tax_id: req.body.subhead.offerer_tax_id,
      },
      bodies: req.body.bodies,
      footer: req.body.footer,
      payment_term: req.body.payment_term,
      signature: req.body.signature,
    });
    const add = await data.save();
    if (add) {
      return res.status(200).send({
        status: true,
        message: "เพิ่มข้อมูลใบเสนอราคาสำเร็จ",
        data: add,
      });
    } else {
      return res
        .status(404)
        .send({ message: "เพิ่มข้อมูลใบเสนอราคาไม่สำเร็จ", status: false });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: error.message,
      status: false,
      error: error.message,
    });
  }
};

exports.GetAllQuotation = async (req, res) => {
  try {
    const qt = await BaseQuotation.find();
    if (qt.length > 0) {
      return res.status(200).send({
        status: true,
        message: "ดึงข้อมูลใบเสนอราคา",
        data: qt,
      });
    } else {
      return res
        .status(404)
        .send({ message: "ไม่พบข้อมูลใบเสนอราคา", status: false });
    }
  } catch (error) {
    res.status(500).send({
      message: "มีบางอย่างผิดพลาด",
      status: false,
    });
  }
};

exports.GetBaseQuotationById = async (req, res) => {
  try {
    const id = req.params.id;
    const qt = await BaseQuotation.findById(id);
    if (qt) {
      return res.status(200).send({
        status: true,
        message: "ดึงข้อมูลใบเสนอราคา",
        data: qt,
      });
    } else {
      return res
        .status(404)
        .send({ message: "ไม่พบข้อมูลใบเสนอราคา", status: false });
    }
  } catch (error) {
    res.status(500).send({
      message: "มีบางอย่างผิดพลาด",
      status: false,
    });
  }
};
exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const quotation = await BaseQuotation.findById(id);
    if (!quotation) {
      return res
        .status(404)
        .send({ status: false, message: "ไม่พบข้อมูลใบเสนอราคา" });
    }
    const result = await BaseQuotation.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );
    if (result) {
      return res.status(200).send({
        status: true,
        message: "แก้ไขข้อมูลใบเสนอราคาสำเร็จ",
        data: result,
      });
    } else {
      return res
        .status(404)
        .send({ status: false, message: "แก้ไขข้อมูลใบเสนอราคาไม่สำเร็จ" });
    }
  } catch (error) {
    res.status(500).send({
      message: error.message,
      status: false,
    });
  }
};

exports.deleteQtByid = async (req, res) => {
  try {
    const id = req.params.id;
    const qt = await BaseQuotation.findByIdAndDelete(id);
    if (!qt) {
      return res
        .status(404)
        .send({ status: false, message: "ไม่พบใบเสนอราคา" });
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
exports.deleteAllQt = async (req, res) => {
  try {
    const result = await BaseQuotation.deleteMany({});

    if (result.deletedCount > 0) {
      return res
        .status(200)
        .send({ status: true, message: "ลบข้อมูลใบเสนอราคาทั้งหมดสำเร็จ" });
    } else {
      return res
        .status(404)
        .send({ status: false, message: "ไม่พบข้อมูลใบเสนอราคา" });
    }
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "มีบางอย่างผิดพลาด" });
  }
};

async function Quotationnumber(date) {
  const number = await BaseQuotation.find();
  let quotation_number = null;
  if (number.length !== 0) {
    let data = "";
    let num = 0;
    let check = null;
    do {
      num = num + 1;
      data =
        `QT-${dayjs(date).format("YYYYMM")}` + String(num).padStart(4, "0");
      check = await Quotation.find({ quotation: data });
      if (check.length === 0) {
        quotation_number =
          `QT-${dayjs(date).format("YYYYMM")}` + String(num).padStart(4, "0");
      }
    } while (check.length !== 0);
  } else {
    quotation_number =
      `QT-${dayjs(date).format("YYYYMM")}` +
      String(number.length).padStart(4, "0");
  }
  return quotation_number;
}
