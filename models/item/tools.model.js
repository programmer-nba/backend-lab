const mongoose = require("mongoose");

const toolSchema = new mongoose.Schema(
    {
        name: String,
        code: String,
        tool_type: String,
        available: {
            type: Boolean,
            default: true
        },
        status: [
            {
                name: String,
                code: String,
                holder: String,
                createdAt: {
                    type: Date,
                    default: new Date()
                }
            }
        ]
    },
    {
        timestamps: true
    }
)

const Tool = mongoose.model("Tool", toolSchema);

module.exports = Tool;