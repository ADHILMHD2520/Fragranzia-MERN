const mongoose = require("mongoose");


const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    isActive: { type: Boolean, required: true ,default:true},
}, { timestamps: true });


module.exports = mongoose.model("Category", categorySchema);
