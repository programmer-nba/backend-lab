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
        bottle_type: String,
        jobType: String,
        bottle_qr: String,
        bottle_tag: String, // bottle tag or code
        bottle_status: Boolean,
        name: String, // parameter name
        method: String, // parameter method
        unit: String,
        ref: String, // ref of lawyer
        base: {type: Number, default: null}, // base of analysis
        result: {type: Number, default: null}, // result of analysis
        result_status: Boolean,
        status: [
            {
                code: String,
                name: String,
                updatedAt: Date,
                updatedBy: String
            }
        ],
        img_collected: String,
    },
    {
        timestamp : true
    }
)

const LabParam = mongoose.model("LabParam", labParamSchema);
module.exports = LabParam;