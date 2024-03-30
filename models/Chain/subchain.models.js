const mongoose = require("mongoose");

const subchainSchema = new mongoose.Schema({
  code: String,
  chain: {
    code: String,
    _id: String
  },
  location: String,
  map: String,
  point: String,
  rider: {
    code: String,
    name: String
  },
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
  date_string: String,
  status: [
    {
      code: String,
      name: String,
      updatedAt: Date,
      updatedBy: String
    }
  ],
  
  img_prepareds: String,
  img_getbottles: String,
  img_collecteds: String,
  img_sents: String,
  
});

const SubChain = mongoose.model("subchain", subchainSchema);
module.exports = { SubChain };


