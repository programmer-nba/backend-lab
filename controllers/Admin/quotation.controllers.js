const bcrypt = require("bcrypt");
const dayjs = require("dayjs");
const Joi = require("joi");

const { google } = require("googleapis");
const { default: axios } = require("axios");
const req = require("express/lib/request.js");
const { Admins, validateAdmin } = require("../../models/Admin/admin.model");
const { Quotation } = require("../../models/sale/quotation.models");
const { Work } = require("../../models/Chain/work.models");
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

const QRCode = require('qrcode');

exports.ApproveQuotation = async (req, res) => {
  try {
    const id = req.params.id;

    const quotation = await Quotation.findById(id);

    let token = req.headers["auth-token"];
    token = token.replace(/^Bearer\s+/, "");
    const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY)
    
    if(!decoded){
      return res.status(400).send({
        message: "ไม่มี token",
        status: false,
      });
    }

    quotation.status.push({
      name: "confirm" ,
      text: "ลูกค้ายืนยัน",
      sender:{
        name:decoded.name,
        code:decoded._id
      },
      createdAt: dayjs(Date.now()).format(""),
    });
    //อัพเดทสถานะ
    const updatedQuotation = await quotation.save();

    // สร้าง งาน
    const secret = randomSecret()
    for (const item of updatedQuotation.bodies) {
      const job_number = await jobnumber();
      const newWork = new Work({
        quotation:updatedQuotation?._id,
        customer: {
          name: updatedQuotation?.subhead?.customer_company,
          contract_name: updatedQuotation?.subhead?.contract_name,
          contract_tel: updatedQuotation?.subhead?.contract_tel || updatedQuotation?.subhead?.customer_tel,
          secret: secret,
          email: updatedQuotation?.subhead?.customer_email
        },
        location: updatedQuotation?.subhead?.sample_location,
        work_no: job_number,
        workdetail:item,
        status: "กำลังดำเนินการ",
        chain:[],
      });
      await newWork.save();
    }

    return res.status(200).send({
      status: true,
      message: "ยืนยันสำเร็จ",
      data: updatedQuotation,
    });

  } catch (error) {
    return res.status(500).send({ message: error.message, status: false });
  }
};

exports.RejectQuotation = async (req, res) => {
  try {
    const id = req.params.id;
    const updateStatus = await Quotation.findOne({ _id: id });

    if (updateStatus) {
      updateStatus.status.push({
        name: "cancle",
        text: "ลูกค้ายกเลิก",
        createdAt: new Date(),
      });
      updateStatus.save();
      return res.status(200).send({
        status: true,
        message: "success!",
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
      .send({ message: error.message, status: false });
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

async function jobnumber(date) {
  const sal = await Work.find();
  let jobnumber = null;

  const currentYear = new Date().getFullYear();
  const yearOffset = currentYear - 1957;

  let num = sal.length + 1; // Increment based on the number of existing quotations

  // Format the date as YYMM
  const formattedDate = dayjs(date).year(yearOffset).format("YYMM");
  
  // Pad the number with leading zeros if necessary
  const paddedNum = String(num).padStart(4, "0");

  jobnumber = `JOB${formattedDate}${paddedNum}`;

  return jobnumber;
}

async function jobChain(date) {
  const sal = await Chain.find();
  let jobnumber = null;
  if (sal.length !== 0) {
    let data = "";
    let num = 0;
    let check = null;
    do {
      num = num + 1;
      data = `CHAIN-${dayjs(date).format("YYYYMMDD")}`.padEnd(10, "0") + num;
      check = await Chain.find({ chain_no: data });
      if (check.length === 0) {
        jobnumber =
          `CHAIN-${dayjs(date).format("YYYYMMDD")}`.padEnd(10, "0") + num;
      }
    } while (check.length !== 0);
  } else {
    jobnumber = `CHAIN-${dayjs(date).format("YYYYMMDD")}`.padEnd(10, "0") + "1";
  }
  return jobnumber;
}

async function jobsub(date) {
  const sal = await SubChain.find();
  let jobnumber = null;
  if (sal.length !== 0) {
    let data = "";
    let num = 0;
    let check = null;
    do {
      num = num + 1;
      data = `SUB${dayjs(date).format("YYYYMMDD")}`.padEnd(10, "0") + num;
      check = await SubChain.find({ jobnumber: data });
      if (check.length === 0) {
        jobnumber =`SUB${dayjs(date).format("YYYYMMDD")}`.padEnd(10, "0") + num;
      }
    } while (check.length !== 0);
  } else {
    jobnumber = `SUB${dayjs(date).format("YYYYMMDD")}`.padEnd(10, "0") + "1";
  }
  return jobnumber;
}

function randomSecret() {
  // Generate a random number between 0 and 9999
  let randomNumber = Math.floor(Math.random() * 10000);

  // If the number is less than 1000, pad it with zeros to ensure it's 4 digits
  if (randomNumber < 1000) {
    randomNumber = randomNumber.toString().padStart(4, '0');
  }

  return randomNumber;
}
