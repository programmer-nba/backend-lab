const Joi = require("joi");
const mongoose = require("mongoose");

const chainSchema = new mongoose.Schema({

  quotation:{type: mongoose.Schema.Types.ObjectId,ref:'Quotation',default:null},
  work_id:{type: mongoose.Schema.Types.ObjectId,ref:'work',default:null},
  subchain:{type:[
    {
      subchain_id:{type: mongoose.Schema.Types.ObjectId,ref:'subchain',default:null}
    }
  ],default:null},
  chain_no: { type: String, required: false,default:""}, //รหัส chain 
  chaindetail:{type:{ //chain
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
  },default:null},
  subwork :{type:Boolean,required:false,default:false}, // ถ้าเป็น false สามารถสร้างได้  
  timestamps: { type: Date, required: false, default: Date.now() }, // วันที่สร้าง
});

const Chain = mongoose.model("chain", chainSchema);
module.exports = { Chain };
