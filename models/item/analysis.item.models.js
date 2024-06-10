const mongoose = require("mongoose");

const AnalysisItemSchema = new mongoose.Schema({
  name:{
    type: String, 
    default: ""
  },
  tag: String,
  bottle_type:{
    type: String,
    default: 'ขวดพลาสติก ขวดแก้ว',
    enum: ["ขวดแก้ว", "ขวดพลาสติก", "ขวดพลาสติก ขวดแก้ว"]
  },
  active: { type: Boolean, default: true },
  jobType: String,
  employee: {
    name: String,
    code: String,
    _id: String,
    username: String
  },
  analysis_by: {
    type: String,
    default: "SPJ",
    enum: ["SPJ", "Outsource"]
  },
  method: {
    type: String,
    default: ""
  },
  unit: {
    type: String,
    default: ""
  },
  methods:{
    type:[
      {
        method:{
          type: String, 
          required: false
        },
        cost:{
          type: Number, 
          required: false
        },
        unit:{
          type: String, 
          required: false
        },
        base:{
          type: Number, 
          required: false
        },
        ref:{
          type: String, 
          required: false
        }
      }
    ],
  },
});

const ItemAnalysis = mongoose.model("ItemAnalysis", AnalysisItemSchema);

module.exports = { ItemAnalysis };
