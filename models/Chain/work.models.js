const Joi = require("joi");
const mongoose = require("mongoose");

const WorkSchema = new mongoose.Schema({

  quotation:{type: mongoose.Schema.Types.ObjectId,ref:'Quotation',default:null},
  work_no: { type: String, required: false,default:""}, //รหัสงาน 
  location: String,
  customer: {
    name: String,
    contract_name: String,
    contract_tel: String,
    secret: String,
    email: String
  },
  workdetail:{type:{
    duration: {
      start_month: Number,
      start_year: Number,
      end_month: Number,
      end_year: Number
    },
    title: {type:String,required:false,default:""},
    subtitles: {type:[{ //chain
        subtitle: {type:String,required:false,default:""},
        analysis: {type:String,required:false,default:""},
        total_amount_points: {type:Number,required:false,default:0},
        details: {type:[{ // sub chain
            points: {type:[String],required:false,default:null},
            //จำนวนรอบ
            chaincount: {type:Number,required:false,default:0},

            frequency: {type:Number,required:false,default:0},
            frequency_text: {type:String,required:false,default:""},
            collect_month: {type:[String],required:false,default:null},
            collect_year: {type:String,required:false,default:""},
            amount_point: {type:Number,required:false,default:0},
            params: {type:[{ //ขวด
                name: {type:String,required:false,default:""},
                method: {type:String,required:false,default:""},
                amount: {type:Number,required:false,default:0},
                amount_unit: {type:String,required:false,default:""},
                freq: {type:Number,required:false,default:0},
                freq_unit: {type:String,required:false,default:""},
                unit_price: {type:Number,required:false,default:0},
                total_price: {type:Number,required:false,default:0},
                discount: {type:Number,required:false,default:0},
                cost: {type:Number,required:false,default:0}
            }],required:false,default:null},
        }],required:false,default:null},
    }],required:false,default:null},
  },required:false,default:null},
  status: { type: String, required: false,default:"" },
  chain :{type:[{
    chain_id:{type: mongoose.Schema.Types.ObjectId,ref:'chain',default:null},
  }],required:false,default:null},
  timestamps: { type: Date, required: false, default: Date.now() }, // วันที่สร้าง
});

const Work = mongoose.model("work", WorkSchema);

module.exports = { Work };
