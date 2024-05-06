const mongoose = require("mongoose");

const AnalysisItemSchema = new mongoose.Schema({
  name:{
    type: String, 
    required: false
  },
  tag: String,
  bottle_type:{
    type: String, 
    required: false
  },
  jobType: String,
  employee: {
    name: String,
    code: String,
    _id: String,
    username: String
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
