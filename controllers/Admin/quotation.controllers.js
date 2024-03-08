const bcrypt = require("bcrypt");
const dayjs = require("dayjs");
const Joi = require("joi");
const { google } = require("googleapis");
const { default: axios } = require("axios");
const req = require("express/lib/request.js");
const { Admins, validateAdmin } = require("../../models/Admin/admin.model");
const { Quotation } = require("../../models/sale/quotation.models");
const { Chain } = require("../../models/Chain/chain.models");
const { SubChain } = require("../../models/Chain/subchain.models");
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
    const chackStatus = chain.status.some((item) => item.name === "อนุมัติ");
    if (chackStatus) {
      return res.status(400).send({
        message: "รายการนี้ได้ดำเนินการไปแล้ว",
        status: false,
      });
    }

    chain.status.push({
      name: "อนุมัติ",
      timestamps: dayjs(Date.now()).format(""),
    });
    const job_number = await jobnumber();
    const updatedQuotation = await chain.save();
    const newChain = new Chain({
     
      ...chain.toObject(),
      _id: undefined,
      status: "กำลังดำเนินการ",
      jobnumber: job_number,
      quotation:updatedQuotation?._id,
      
    });
    const savedChain = await newChain.save();

    const mapdetail = updatedQuotation.detail.map((item) => {
      return {
        name_work: item.name_work,
        work_details: [
          {
            project_name: item.work_details[0].project_name,
            project_details: item.work_details[0].project_details.map((item2) => {
              return {
                detail_name: item2.detail_name, 
                sub_detail: item2.sub_detail.map((item3) => {
                  return {
                    sub_name: item3.sub_name,
                    name_analysis: item3.name_analysis, //วิธีการวิเคระห์
                    amount: item3.amount , //จำนวน
                    type_amount: item3.type_amount, //ประเภทของจำนวน
                    frequency: item3.frequency, //ความถี่
                    type_frequency: item3.type_frequency, //ประเภทความถี่
                    count: 0, //จำนวนครั้ง
                    endcount:item3.frequency,//จำนวนรอบ
                  };
                }),
              }
            }),
          },
        ]
      };
    })


    for (const item of mapdetail) {
      let jobsubnumber = await jobsub();
      console.log("jobsubnumber", jobsubnumber);
    
      const maxFrequency = Math.max(
        ...item.work_details[0].project_details.map((item) => {
          return item.sub_detail[0].frequency;
        })
      );
    
      const newSubChain = new SubChain({
        quotation: updatedQuotation?._id,
        jobnumber: jobsubnumber,
        chains_id: savedChain?._id,
        employee_name: chain?.employee_name,
        tax_id_company: chain?.tax_id_company,
        company: chain?.company,
        customer_company: chain?.customer_company,
        customer_detail: chain?.customer_detail,
        detail: item,
        allcount: 0,
        allendcount: maxFrequency,
      });
    
        const newsub = await newSubChain.save();
        console.log("เพิ่มสำเร็จ");
    
        const chainid = await Chain.findById(savedChain?._id);
        chainid?.subchains.push(newsub?._id);
        const updatesubchains = await chainid.save();
    
    }
    
   
   
    
    return res.status(200).send({
      status: true,
      message: "อนุมัติ สำเร็จ",
      data: savedChain,
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
        name: "ไม่อนุมัติ",
        timestamps: dayjs(Date.now()).format(""),
      });
      updateStatus.save();
      return res.status(200).send({
        status: true,
        message: "ไม่อนุมัติ สำเร็จ",
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

async function jobnumber(date) {
  const sal = await Chain.find();
  let jobnumber = null;
  if (sal.length !== 0) {
    let data = "";
    let num = 0;
    let check = null;
    do {
      num = num + 1;
      data = `JOB${dayjs(date).format("YYYYMMDD")}`.padEnd(10, "0") + num;
      check = await Chain.find({ jobnumber: data });
      if (check.length === 0) {
        jobnumber =
          `JOB${dayjs(date).format("YYYYMMDD")}`.padEnd(10, "0") + num;
      }
    } while (check.length !== 0);
  } else {
    jobnumber = `JOB${dayjs(date).format("YYYYMMDD")}`.padEnd(10, "0") + "1";
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
