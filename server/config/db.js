const mongoose=require("mongoose");
require("dotenv").config();

const connectionDb=async()=>{
    try {
        const connection=await mongoose.connect(process.env.mongo_url);
        console.log("database connected");
    } catch (error) {
        console.log(`connection error===== ${error}`);
    }
}
module.exports=connectionDb;