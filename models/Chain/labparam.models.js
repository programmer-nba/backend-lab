const { Schema } = require('mongoose')
const mongoose = require('mongoose');

const labParamSchema = new Schema (
    {
        subChain: {
            code: String,
            _id: String,
            date: Date,
            date_string: String,
        },
        analysis: {
            code: String,
            name: String
        },
        prepared: {
            code: String,
            name: String
        },
        bottle_type: String,
        bottle_qr: String,
        bottle_tag: String, // bottle tag or code
        name: String, // parameter name
        method: String, // parameter method
        ref: String, // ref of lawyer
        base: {type: Number, default: null}, // base of analysis
        result: {type: Number, default: null}, // result of analysis
        status: [
            {
                code: String,
                name: String,
                updatedAt: Date,
                updatedBy: String
            }
        ]
    },
    {
        timestamp : true
    }
)

const LabParam = mongoose.model("LabParam", labParamSchema);
module.exports = LabParam;