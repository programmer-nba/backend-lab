const mongoose = require("mongoose");
const Joi = require("joi");

const CompanyCustomerSchema = new mongoose.Schema({
  //เลขที่การเสียภาษี
  taxnumber: { type: String, required: false, default: "-" }, //เลขที่การเสียภาษี
  company_customer_name: { type: String, required: false, default: "ไม่มี" }, //ชื่อบริษัท
  company_customer_number: { type: String, required: false, default: "ไม่มี" }, //เลขที่บริษัท
  company_customer_address: { type: String, required: false }, //ที่อยู่
  company_customer_subdistrict: { type: String, required: false }, //ที่อยู่ เเขวน ตำบล
  company_customer_district: { type: String, required: false }, //เขต
  company_customer_province: { type: String, required: false }, //จังหวัด
  company_customer_postcode: { type: String, required: false }, //รหัสไปรษณีย์
  company_customer_tel: { type: String, required: false }, //เบอร์โทรศัพท์
  company_customer_contract: { type: String, required: false },
  company_customer_contract_tel: { type: String, required: false },
  company_customer_fax: { type: String, required: false }, //เบอร์โทรสาร
  company_customer_status: { type: Boolean, required: false, default: true }, //สถานะ
  company_customer_email: { type: String, required: false }, //email
  company_customer_map: String,
  bank: {
    //บัญชีธนาคาร
    name: { type: String, required: false, default: "-" },
    number: { type: String, required: false, default: "-" },
    image: { type: String, required: false, default: "-" },
    status: { type: Boolean, required: false, default: false },
    remark: { type: String, required: false, default: "-" }, //อยู่ระหว่างการตรวจสอบ , ไม่ผ่านการตรวจสอบ ,ตรวจสอบสำเร็จ
  },
});

const CompanyCustomer = mongoose.model("CompanyCustomer", CompanyCustomerSchema);

module.exports = { CompanyCustomer };
