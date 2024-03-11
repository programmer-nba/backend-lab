const Joi = require("joi");
const mongoose = require("mongoose");

const subchainSchema = new mongoose.Schema({
  quotation:{type: mongoose.Schema.Types.ObjectId,ref:'Quotation',default:null},
  work_id:{type: mongoose.Schema.Types.ObjectId,ref:'work',default:null},
  chains_id:{type: mongoose.Schema.Types.ObjectId,ref:'chain',default:null},
  subchains_no:{type:String,required:false,default:""},
  subchaindetail:{type:{ // sub chain
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
        cost: {type:Number,required:false,default:0},
        ///
        bottelref:{type:String,default:""},
        bottletype:{type:String,default:""},
	      rider:{type: mongoose.Schema.Types.ObjectId,ref:'Employee',default:null}, //id คนเก็บตัวอย่าง
	      evidenceget:{type:String,default:""},// (หลักฐานที่เก็บตัวอย่างขวด)
	      analysis: {type: mongoose.Schema.Types.ObjectId,ref:'Employee',default:null},
	      fillvalues:{type:Number,required:false,default:0},



    }],required:false,default:null},
},default:null},

  date:{type:Date,required:false,default:null}, //วันที่ไปเก็บตัวอย่าง
  status: { type: String, required: false },
  bottel:{type: mongoose.Schema.Types.ObjectId,ref:'Employee',default:null}, //id คนเตรียมขวด
  evidencebottel:{type:String,default:""}, //หลักฐานที่เก็บเตรียมขวด
  timestamps: { type: Date, required: false, default: Date.now() }, // วันที่สร้าง
});


const SubChain = mongoose.model("subchain", subchainSchema);
module.exports = { SubChain };


