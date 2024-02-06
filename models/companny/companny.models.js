const mongoose = require("mongoose");
const Joi = require("joi");

const CompanySchema = new mongoose.Schema({
  //เลขที่การเสียภาษี
  taxnumber: { type: String, required: false, default: true }, //เลขที่การเสียภาษี
  company_name: { type: String, required: false, default: "ไม่มี" }, //ชื่อบริษัท
  company_number: { type: String, required: false, default: "ไม่มี" }, //เลขที่บริษัท
  company_address: { type: String, required: false }, //ที่อยู่
  company_subdistrict: { type: String, required: false }, //ที่อยู่ เเขวน ตำบล
  company_district: { type: String, required: false }, //อำเภอ
  company_province: { type: String, required: false }, //จังหวัด
  company_postcode: { type: String, required: false }, //รหัสไปรษณีย์
  company_tel: { type: String, required: false }, //เบอร์โทรศัพท์
  companuy_fax: { type: String, required: false }, //เบอร์โทรสาร
  company_status: { type: Boolean, required: false, default: true }, //สถานะ
  bank: {
    //บัญชีธนาคาร
    name: { type: String, required: false, default: "-" },
    number: { type: String, required: false, default: "-" },
    image: { type: String, required: false, default: "-" },
    status: { type: Boolean, required: false, default: false },
    remark: { type: String, required: false, default: "-" }, //อยู่ระหว่างการตรวจสอบ , ไม่ผ่านการตรวจสอบ ,ตรวจสอบสำเร็จ
  },
});

const Company = mongoose.model("Company", CompanySchema);

module.exports = { Company };
