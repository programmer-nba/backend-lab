const mongoose = require("mongoose");

const QuotationSchema = new mongoose.Schema({
    creator: {
        name: String,
        _id: String,
    },
  subhead:{type:{
      customer_name: {type:String,required:false,default:""},
      customer_email: {type:String},
      customer_company: {type:String,required:false,default:""},
      customer_address: {type:String,required:false,default:""},
      customer_tel: {type:String,required:false,default:""},
      customer_fax: {type:String,required:false,default:""},
      sample_location: {type:String,required:false,default:""},
      document_no: {type:String,required:false,default:""},
      document_date: {type:Date,required:false,default:new Date()},
      offerer: {type:String,required:false,default:""},
      offerer_tax_id: {type:String,required:false,default:""},
  },default:null},
  bodies: {type:[{
      duration: [{type:Date}],
      title: {type:String,required:false,default:""},
      subtitles: {type:[{
            subtitle: {type:String,required:false,default:""},
            analysis: {type:String,required:false,default:""},
            total_amount_points: {type:Number,required:false,default:0},
            details: {type:[{
                points: {type:[String],required:false,default:null},
                frequency: {type:Number,required:false,default:0},
                frequency_text: {type:String,required:false,default:""},
            collect_month: {
                type: [
                    {
                        month: String,
                        amount: Number
                    }
                ],
                required: false,
                default: null
            },
                collect_year: {type:String,required:false,default:""},
                amount_point: {type:Number,required:false,default:0},
                months: [{type:Date}],
                params: {type:[{
                    ref_id: String,
                    ref: String,
                    name: {type:String,required:false,default:""},
                    method: {type:String,required:false,default:""},
                    amount: {type:Number,required:false,default:0},
                    amount_unit: {type:String,required:false,default:""},
                    freq: {type:Number,required:false,default:0},
                    freq_unit: {type:String,required:false,default:""},
                    unit_price: {type:Number,required:false,default:0},
                    unit: {type:String,required:false,default:0},
                    total_price: {type:Number,required:false,default:0},
                    discount: {type:Number,required:false,default:0},
                    cost: {type:Number,required:false,default:0},
                    bottle_type: String,
                }],required:false,default:null},
          }],required:false,default:null},
      }],required:false,default:null},
      isReport: {type:Boolean,required:false,default:false},
      report: {type:{
          freq: {type:Number,required:false,default:0},
          freq_unit: {type:String,required:false,default:""},
          unit_price: {type:Number,required:false,default:0},
          total_price: {type:Number,required:false,default:0},
          detail: {type:[String],required:false,default:null},
          sent: {type:[String],required:false,default:null},
      },default:null},
      
  }],required:false,default:null},
  footer: {type:{
      test_method: {type:String,required:false,default:""},
      report_method: {type:String,required:false,default:""},
      report_detail: {type:String,required:false,default:""},
      report_transfer: {type:String,required:false,default:""},
      hidden: {type:[String],required:false,default:null},
      total_price: {type:Number,required:false,default:0},
      total_discount: {type:Number,required:false,default:0},
      service_price: {type:Number,required:false,default:0},
      report_price: {type:Number,required:false,default:0},
      vat_price: {type:Number,required:false,default:0},
      net_price: {type:Number,required:false,default:0},
  },default:null},  
  payment_term: {type:[String],required:false,default:null},
  signature: {type:{
      name: {type:String,required:false,default:""},
      tel: {type:String,required:false,default:""},
      position: {type:String,required:false,default:""},
  },default:null},
  status: {type:[{
      name: {type:String,required:false,default:""},
      text: {type:String,required:false,default:""},
      sender: {type:{
          name: {type:String,required:false,default:""},
          code: {type:String,required:false,default:""},
      },default:null},
      createdAt: {type:Date,required:false,default:new Date()},
  }],required:false,default:null},
  
});

const Quotation = mongoose.model("Quotation", QuotationSchema);

module.exports = { Quotation };
