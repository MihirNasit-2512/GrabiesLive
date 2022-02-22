const mongoose = require("mongoose");

let employeSchema = new mongoose.Schema({
    empName : String,
    email : String,
    phone : String,
    join_Date : String,
    service_Area:String,    
    service_Spec : String,
    password : String
});

module.exports = new mongoose.model("Employee",employeSchema);