const Joi = require("joi");
const mongoose = require("mongoose");

const QuotationSchema = new mongoose.Schema({
  quotation: { type: String, required: false }, //เลขที่ใบเสนอราคา
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
                  sub_name: { type: String, required: true },
                  name_analysis: { type: String, required: true }, //วิธีการวิเคระห์
                  amount: { type: Number, required: false }, //จำนวน
                  frequency: { type: Number, required: false }, //ความถี่
                  price_umit: { type: Number, required: false }, //ราคาต่อหน่วย
                  price: { type: Number, required: false }, //ราคารวม
                },
              ],
            },
          ],
        },
      ],
      work_total: { type: Number, required: false }, //ราคารวมสินค้นของงานชุดเเรก
      work_discount: { type: Number, required: false }, //ส่วนลด เป็นบาท
      work_net: { type: Number, required: false }, //ราคารวมหลังหักส่วนลด
      work_processing_fee: { type: Number, required: false }, //ค่าดำเนินการ
      work_processing_total: { type: Number, required: false }, //รวมค่าหลังจาก บวกค่าดำเนินการ
      work_vat: { type: Number, required: false }, //vat 7 %
      work_totalvat: { type: Number, required: false }, //ราคารวมหลัง vat
    },
  ],
  total: { type: Number, required: false }, //ราคารวมเป็นเงินทั้งหมด
  discount: { type: Number, required: false }, //ราคารวมส่วนลด ทั้งหมด
  net: { type: Number, required: false }, //ยอดคงเหลือหลังจากลด
  processing_fee: { type: Number, required: false }, //ค่าดำเนินการ
  report_preparation_fee: { type: Number, required: false }, //ค่าจัดทำเล่มรายงาน
  community_economic_survey: { type: Number, required: false }, //ค่าสำรวจสภาพเศรษฐกิจชุมชน
  total_after: { type: Number, required: false }, //รวมเป็นเงินทั้งสิน
  vat: { type: Number, required: false }, //vat 7 %
  totalvat: { type: Number, required: false }, //ราคารวมหลัง vat
  total_detail: [
    {
      name_datail: { type: String, required: false }, //ยอดรวมระยะงาน
      agreement: { type: String, required: false }, //คำขอและข้อตกลงของลูกค้า
      name_agreement: [
        {
          name_test: { type: String, required: false, default: "" }, //หัวข้อที่
          test_one: { type: String, required: false, default: "" }, //1 เช่น ห้องปฏิบัติการ S.P.J.
          test_two: { type: String, required: false, default: "" }, //ลูกค้า
          test_tree: { type: String, required: false, default: "" }, //ไปรษณ์ย
          other: { type: String, required: false, default: "" }, //อื่นๆโปรระบุ
        },
      ],
    },
  ],
  terms_payment: [
    {
      payment_name: { type: String, required: false }, //เงื่อนไขในการชำระเงินต่างๆ
      payment_one: { type: String, required: false }, //เงือนไข 1
      payment_two: { type: String, required: false }, //เงือนไข 2
      payment_tree: { type: String, required: false }, //เงือนไข 3
      payment_four: { type: String, required: false }, //งือนไข 4
      payment_five: { type: String, required: false }, //เงือนไข 5
      payment_six: { type: String, required: false }, //เงือนไข 6
      payment_seven: { type: String, required: false }, //เงือนไข 7
      payment_eigth: { type: String, required: false }, //เงือนไข 8
      payment_nine: { type: String, required: false }, //เงือนไข 9
      approve_details: [
        {
          approve_name: { type: String, required: false }, //ลายเซ็น
          date_time: { type: String, required: false }, //เวลา
          thank: { type: String, required: false },//จึงเรียนมาเพื่อพิจารณาและขอขอบพระคุณมา ณ โอกาสนี้						
          name_manager: { type: String, required: false },//ชื่อผู้จัดการ
        },
      ],
      name_end: { type: String, required: false }, //จึงเรียนมาเพื่อพิจารณาและขอขอบพระคุณมา ณ โอกาสนี้
    },
  ],
  status: { type: Array, required: false },
  start_date: { type: String, required: false }, //วันที่ออกบิล
  end_date: { type: String, required: false }, //วันที่ต้องจ่ายเงิน
  timestamps: { type: Date, required: false, default: Date.now() },
});

const Quotation = mongoose.model("Quotation", QuotationSchema);

module.exports = { Quotation };
