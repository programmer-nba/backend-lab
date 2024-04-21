const mongoose = require("mongoose");

const subchainSchema = new mongoose.Schema({
  code: String,
  chain: {
    code: String,
    _id: String
  },
  jobType: String,
  jobSubType: String,
  jobCode: String,
  period: Number,
  location: String,
  map: String,
  point: String,
  prepared: {
    code: String,
    name: String
  },
  rider: {
    code: String,
    name: String
  },
  customer: {
    name: String,
    contract_name: String,
    contract_tel: String,
    secret: String,
    email: String,
    tel: String
  },
  date: Date,
  day: Number,
  month: String,
  year: String,
  date_string: String,
  status: [
    {
      code: String,
      name: String,
      updatedAt: Date,
      updatedBy: String
    }
  ],
  
  img_1: String,
  img_2: String,
  img_3: String,
  img_4: String,
  img_5: String,
  img_6: String
  
});

const SubChain = mongoose.model("subchain", subchainSchema);
module.exports = { SubChain };


