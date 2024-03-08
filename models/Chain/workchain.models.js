const Joi = require("joi");
const mongoose = require("mongoose");

const WorkChainSchema = new mongoose.Schema({
  quotation:{type: mongoose.Schema.Types.ObjectId,ref:'Quotation',default:null},
  chains_id:{type: mongoose.Schema.Types.ObjectId,ref:'Chain',default:null},
  subchains_id:{type: mongoose.Schema.Types.ObjectId,ref:'SubChain',default:null},
  jobnumber: { type: String, required: false }, //เลข
  employee_name: { type: String, required: false }, //คนทำรายการ หรือผุ้เสนอราคา
  tax_id_company: { type: String, required: false }, //เลขประจำตัวผู้เสียภาษี
  company: {
    taxnumber: { type: String, required: false, default: true }, //เลขที่การเสียภาษี
    company_name: { type: String, required: false, default: "ไม่มี" }, //ชื่อบริษัท
    company_number: { type: String, required: false, default: "ไม่มี" }, //เลขที่บริษัท
    company_address: { type: String, required: false }, //ที่อยู่
    company_subdistrict: { type: String, required: false }, //ที่อยู่ เเขวน ตำบล
    company_district: { type: String, required: false }, //เขต
    company_province: { type: String, required: false }, //จังหวัด
    company_postcode: { type: String, required: false }, //รหัสไปรษณีย์
    company_tel: { type: String, required: false }, //เบอร์โทรศัพท์
    companuy_fax: { type: String, required: false }, //เบอร์โทรสาร
  }, //ข้อมูลบริษัทตัวเอง
  customer_company: {
    company_customer_name: { type: String, required: false, default: "ไม่มี" }, //ชื่อบริษัท
    company_customer_number: {
      type: String,
      required: false,
      default: "ไม่มี",
    }, //เลขที่บริษัท
    company_customer_address: {
      type: String,
      required: false,
      default: "ไม่มี",
    }, //ที่อยู่บริษัท
    company_customer_subdistrict: { type: String, required: false }, //ที่อยู่ เเขวน ตำบล
    company_customer_district: { type: String, required: false }, //เขต
    company_customer_province: { type: String, required: false }, //จังหวัด
    company_customer_postcode: { type: String, required: false }, //รหัสไปรษณีย์
    company_tcompany_customer_telel: { type: String, required: false }, //เบอร์โทรศัพท์
  },
  customer_detail: {
    //ข้อมูลของลูกค้า
    tax_id: { type: String, required: false }, //เลขประจำตัวผู้เสียภาษี
    customer_name: { type: String, required: false },
    customer_lastname: { type: String, required: false },
    customer_phone: { type: String, required: false },
    customer_address: { type: String, required: false }, //ที่อยู่ของลูกค้า
    customer_type: { type: String, required: false }, //ประเภทลุกค้า
    customer_email: { type: String, required: false }, //email ลูกค้า
    customer_contact: { type: String, required: false }, //ข้อมูลติดต่อลูกค้า
  },

  detail: [
    {
      name_work: { type: String, required: false }, //ชื่อหรืองานต่างๆ เเละระยะเวลาที่ทำ
      work_details: [
        {
          project_name: { type: String, required: true },
          project_details: [
            {
              detail_name: { type: String, required: true }, //รายละเอียดโครงการ
              sub_detail: [
                {
                  bottelref: { type: String, required: false ,default:null }, //เลขที่ขวด
                  sub_name: { type: String, required: true },
                  name_analysis: { type: String, required: false }, //วิธีการวิเคระห์
                  amount: { type: Number, required: false }, //จำนวน
                  type_amount: { type: String, required: false }, //ประเภทของจำนวน
                  frequency: { type: Number, required: false }, //ความถี่
                  type_frequency: { type: String, required: false }, //ประเภทความถี่
                  rider:{type: mongoose.Schema.Types.ObjectId,ref:'Employee',default:null}, //ทีม rider
                  evidenceget:{type:String,default:""}, //(หลักฐานที่เก็บตัวอย่างขวด)
	                analysis: {type: mongoose.Schema.Types.ObjectId,ref:'Employee',default:null}, //ทีมวิเคราะห์
	                fillvalues: {type:Number,default:0}, //จำนวนที่ต้องกรอก
                },
              ],
              final_details: [
                {
                  type: String,
                  required: false,
                  default: "",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  date:{type:Date,required:false,default:null}, //วันที่ไปเก็บตัวอย่าง
  count : {type:Number,required:false,default:0}, //ครั้งที่กรอก
  endcount:{type:Number,required:false,default:0}, //จำนวนรอบทั้งหมด
  status: { type: String, required: false },
  bottel:{type: mongoose.Schema.Types.ObjectId,ref:'Employee',default:null}, //id คนเตรียมขวด
  evidencebottel:{type:String,default:""}, //หลักฐานที่เก็บเตรียมขวด
  timestamps: { type: Date, required: false, default: Date.now() }, // วันที่สร้าง
});

const WorkChain = mongoose.model("WorkChain", WorkChainSchema);
module.exports = { WorkChain };


