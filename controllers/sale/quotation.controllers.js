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
    const {
      detail,
      customer_detail,
      customer_number,
      employee_name,
      end_date,
      discount = 0,
      work_discount = 0,
      report_preparation_fee = 0,
      community_economic_survey = 0,
      compannyID,
      compannyCustomerID,
      total_detail,
      terms_payment,
    } = req.body;
    let total = 0;
    let discounts = 0;
    let processing_fee = 0;

    const updatedData = detail.map((work) => {
      let workTotal = 0;
      const updatedWork = {
        ...work,
        work_details: work.work_details.map((project) => {
          let projectTotal = 0;
          let work_net = 0;

          const updatedProject = {
            ...project,
            project_details: project.project_details.map((mainDetail) => {
              let mainDetailTotal = 0;

              const updatedMainDetail = {
                ...mainDetail,
                sub_detail: mainDetail.sub_detail.map((subDetail) => {
                  const price = subDetail.frequency * subDetail.price_umit;
                  mainDetailTotal += price;
                  total += price;
                  return {
                    ...subDetail,
                    price,
                  };
                }),
              };
              projectTotal += mainDetailTotal;
              return updatedMainDetail;
            }),
          };
          workTotal += projectTotal;
          return updatedProject;
        }),
        work_total: workTotal.toFixed(2),
        work_discount: work.work_discount,
        work_net: workTotal - work.work_discount.toFixed(2),
        work_processing_total:
          workTotal - work.work_discount + work.work_processing_fee,
        work_vat: (
          (workTotal - work.work_discount + work.work_processing_fee) *
          0.07
        ).toFixed(2),
        work_totalvat: (
          workTotal -
          work.work_discount +
          work.work_processing_fee +
          (workTotal - work.work_discount + work.work_processing_fee) * 0.07
        ).toFixed(2),
      };
      processing_fee += work.work_processing_fee;
      discounts += parseFloat(work.work_discount);
      return updatedWork;
    });
    const net = total - discounts;
    const total_after =
      net + processing_fee + report_preparation_fee + community_economic_survey;

    const status = {
      name: "รออนุมัติ",
      timestamps: dayjs(Date.now()).format(""),
    };

    let compannyData = {};
    let compannyCustomerData = {};
    if (compannyID) {
      compannyData = await Company.findOne({ _id: compannyID });
    }
    if (compannyCustomerID) {
      compannyCustomerData = await CompanyCustomer.findOne({
        _id: compannyCustomerID,
      });
    }

    const quotationNumber = await Quotationnumber();
    const quotation = await new Quotation({
      quotation: quotationNumber,
      company: {
        taxnumber: compannyData.taxnumber,
        company_name: compannyData.company_name,
        company_number: compannyData.company_number,
        company_address: compannyData.company_address,
        company_subdistrict: compannyData.company_subdistrict,
        company_district: compannyData.company_district,
        company_province: compannyData.company_province,
        company_postcode: compannyData.company_postcode,
        company_tel: compannyData.company_tel,
        companuy_fax: compannyData.companuy_fax,
      },
      customer_company: {
        company_customer_name: compannyCustomerData.company_customer_name,
        company_customer_number: compannyCustomerData.company_customer_number,
        company_customer_address: compannyCustomerData.company_customer_address,
        company_customer_subdistrict:
          compannyCustomerData.company_customer_subdistrict,
        company_customer_district:
          compannyCustomerData.company_customer_district,
        company_customer_province:
          compannyCustomerData.company_customer_province,
        company_customer_postcode:
          compannyCustomerData.company_customer_postcode,
        company_tcompany_customer_telel:
          compannyCustomerData.company_tcompany_customer_telel,
      },
      customer_company1:{
        dear_users:req.body.customer_company1.dear_users,
        company_customer_name:req.body.customer_company1.company_customer_name,
        company_customer_address:req.body.customer_company1.company_customer_address,
        company_customer_number:req.body.customer_company1.company_customer_number,
      },
      employee_name,
      detail: updatedData,
      total_detail,
      terms_payment,
      customer_detail,
      customer_number,
      start_date :req.body.start_date,
      end_date:req.body.end_date,
      status: status,
      discount: discounts,
      total,
      net,
      processing_fee,
      report_preparation_fee,
      community_economic_survey,
      total_after: total_after,
      vat: (total_after * 0.07).toFixed(2),
      totalvat: (total_after + total_after * 0.07).toFixed(2),
    }).save();

    if (quotation) {
      return res.status(200).send({
        status: true,
        message: "สร้างใบเสนอราคาสำเร็จ",
        data: quotation,
      });
    } else {
      return res.status(500).send({
        message: "เกิดข้อผิดพลาดในการสร้างใบเสนอราคา",
        status: false,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "มีบางอย่างผิดพลาด",
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
  const number = await Quotation.find();
  let quotation_number = null;
  if (number.length !== 0) {
    let data = "";
    let num = 0;
    let check = null;
    do {
      num = num + 1;
      data = `QT${dayjs(date).format("YYYYMMDD")}`.padEnd(13, "0") + num;
      check = await Quotation.find({ quotation: data });
      if (check.length === 0) {
        quotation_number =
          `QT${dayjs(date).format("YYYYMMDD")}`.padEnd(13, "0") + num;
      }
    } while (check.length !== 0);
  } else {
    quotation_number =
      `QT${dayjs(date).format("YYYYMMDD")}`.padEnd(13, "0") + "1";
  }
  return quotation_number;
}
