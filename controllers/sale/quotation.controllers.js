const bcrypt = require("bcrypt");
const dayjs = require("dayjs");

const Joi = require("joi");
const { google } = require("googleapis");
const { default: axios } = require("axios");
const req = require("express/lib/request.js");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const { Sale, validateSale } = require("../../models/sale/sale.models");
const { Quotation } = require("../../models/sale/quotation.models");
const { Company } = require("../../models/companny/companny.models");
const { Chain } = require("../../models/Chain/chain.models");
const { Item } = require("../../models/item/item.models");
const { ItemAnalysis } = require("../../models/item/analysis.item.models");
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

exports.Quotation = async (req, res) => {
  try {
    const data = new Quotation({
      creator: {
        name: req.body.creator.name,
        _id: req.body.creator._id
      },
      base: req.body.base,
      subhead: {
        contract_name: req.body.subhead.contract_name,
        contract_tel: req.body.subhead.contract_tel,
        customer_name: req.body.subhead.customer_name,
        customer_company: req.body.subhead.customer_company,
        customer_address: req.body.subhead.customer_address,
        customer_tel: req.body.subhead.customer_tel,
        customer_fax: req.body.subhead.customer_fax,
        customer_tax_id: req.body.subhead.customer_tax_id,
        sample_location: req.body.subhead.sample_location,
        document_no: await Quotationnumber(),
        document_date: req.body.subhead.document_date,
        offerer: req.body.subhead.offerer,
        offerer_tax_id: req.body.subhead.offerer_tax_id,
        customer_email: req.body.subhead.customer_email
      },
      bodies: req.body.bodies,
      footer: req.body.footer,
      payment_term: req.body.payment_term,
      signature: req.body.signature,
      status: {
        name: "draft",
        text: "แบบร่าง",
        sender: req.body.creator._id,
        createdAt: new Date()
      },
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

exports.updateQuotationStatus = async (req, res) => {
  const { id } = req.params
  const { status_name, status_text, sender } = req.body
  try {
    const quotation = await Quotation.findByIdAndUpdate(id, 
    {
      $push: {
        status: {
          name: status_name,
          text: status_text,
          sender: sender,
          createdAt: new Date()
        }
      }
    }, { new : true })
    if (!quotation) {
      return res.status(404).json({
        message: "not found"
      })
    }

    return res.status(201).json({
      message: "success",
      status: true,
      data: quotation
    })
  }
  catch(err) {
    console.log(err)
    return res.status(500).json({
      message: err.message
    })
  }
}

exports.QuotationById = async (req, res) => {
  try {
    const id = req.params.id;
    const quotation = await Quotation.findById(id);

    if (quotation) {
      const newDocumentDate = new Date();
      const quotationNumber = await Quotationnumber();
      const newQuotationData = {
        creator: {
          name: quotation.creator.name,
          _id: quotation.creator._id
        },
        subhead: {
          customer_name: quotation.subhead.customer_name,
          customer_company: quotation.subhead.customer_company,
          customer_address: quotation.subhead.customer_address,
          customer_tel: quotation.subhead.customer_tel,
          customer_fax: quotation.subhead.customer_fax,
          sample_location: quotation.subhead.sample_location,
          document_no: quotationNumber,
          customer_email: quotation.subhead.customer_email,
          document_date: newDocumentDate,
          offerer: quotation.subhead.offerer,
          offerer_tax_id: quotation.subhead.offerer_tax_id,
        },
        bodies: quotation.bodies,
        footer: quotation.footer,
        payment_term: quotation.payment_term,
        signature: quotation.signature,
        status: [quotation.status[0]],
      };

      const newQuotation = new Quotation(newQuotationData);
      const savedQuotation = await newQuotation.save();

      return res.status(200).send({
        status: true,
        message: "เพิ่มข้อมูลใบเสนอราคาสำเร็จ",
        data: savedQuotation,
      });
    } else {
      return res.status(404).send({
        message: "ไม่พบข้อมูลใบเสนอราคา",
        status: false,
      });
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
    const qt = await Quotation.find();
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

exports.GetSaleByIds = async (req, res) => {
  try {
    const id = req.params.id;
    const qt = await Quotation.findById(id);
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
    const quotation = await Quotation.findById(id);
    if (!quotation) {
      return res
        .status(404)
        .send({ status: false, message: "ไม่พบข้อมูลใบเสนอราคา" });
    }
    req.body.status = null
    const result = await Quotation.findByIdAndUpdate(
      id,
      { 
        $set: {
          ...req.body,
          status: quotation.status && quotation.status.length ? [...quotation.status] 
            : [
              {
                name: "draft",
                text: "แบบร่าง",
                sender: req.body.sender,
                createdAt: new Date()
              }
            ]
        }
      },
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
    const qt = await Quotation.findByIdAndDelete(id);
    if (!qt) {
      return res
        .status(404)
        .send({ status: false, message: "ไม่พบใยเสนอราคา" });
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
    const result = await Quotation.deleteMany({});

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
  const sal = await Quotation.find();
  let jobnumber = null;

  const currentYear = new Date().getFullYear();
  const yearOffset = currentYear - 1957;

  let num = sal.length + 1; // Increment based on the number of existing quotations

  // Format the date as YYMM
  const formattedDate = dayjs(date).year(yearOffset).format("YYMM");
  
  // Pad the number with leading zeros if necessary
  const paddedNum = String(num).padStart(4, "0");

  jobnumber = `QT${formattedDate}${paddedNum}`;

  return jobnumber;
}
