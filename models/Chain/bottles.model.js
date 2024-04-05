const { Schema } = require('mongoose')
const mongoose = require('mongoose');

const bottlesSchema = new Schema (
    {
        subChain: {
            code: String,
            _id: String
        },
        bottle_tag: String,
        bottle_status: Boolean,
        bottle_type: String,
        bottle_qr: String,
        params: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'LabParam'
            }
        ]
    },
    {
        timestamp : true
    }
)

const Bottles = mongoose.model("Bottles", bottlesSchema);
module.exports = Bottles;