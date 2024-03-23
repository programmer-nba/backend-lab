const mongoose = require("mongoose");

const subchainSchema = new mongoose.Schema({
  code: String,
  chain: {
    code: String,
    _id: String
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
  ]
});

const SubChain = mongoose.model("subchain", subchainSchema);
module.exports = { SubChain };


