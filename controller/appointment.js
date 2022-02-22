const _ = require("underscore");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const Appoint = require("../models/Appointment");

function appointment(){

    this.makeAppo = (req,res)=>{
        let bdata = req.body;
        bdata.userid = req.Uid;
        bdata.useremail = req.email;
        bdata.emp_appoint = "62150edfb1f8a683aeae6e87"
        bdata.dateTime = moment().format('lll');
        console.log(bdata);
        Appoint.create(bdata,(err,data)=>{
            if(!err){
                res.send("appointment taken successfully..")
            }else throw err;
        });
    }
}

module.exports = new appointment();