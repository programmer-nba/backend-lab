const mongoose = require("mongoose");

const AnalysisItemSchema = new mongoose.Schema({
  name:{
    type: String, 
    required: false
  },
  bottle_type:{
    type: String, 
    required: false
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
