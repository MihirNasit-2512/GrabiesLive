const Emp = require("../models/Employee");
const _ = require("underscore");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

function empController() {


    this.register = async (req, res) => {
        const { name, email, phone, join_date, area, spec, password } = req.body;
        if (_.isEmpty(name) || _.isEmpty(email) || _.isEmpty(phone) || _.isEmpty(join_date) || _.isEmpty(area) || _.isEmpty(spec) || _.isEmpty(password)) {
            res.send({ status: false, message: "Plz,Enter Details.." });
        } else {
            const emailsearch = await Emp.exists({ email: email })
            if (emailsearch) {
                return res.json("This Email already Registered");
            }
            bcrypt.hash(password, 10, async function (err, hash) {
                if (!err) {
                    let empObj = {
                        empName: name,
                        email: email,
                        phone: phone,
                        join_Date: join_date,
                        service_Area: area,
                        service_Spec: spec,
                        password: hash
                    }
                    console.log(empObj);
                    Emp.create(empObj, (err, data) => {
                        if (!err) {
                            res.send("Thanks For Signing Up..");
                        } else throw err;
                    });
                } else throw err;

            });
        }
    }

    this.login = async (req, res) => {
        const { email, password } = req.body;
        if (_.isEmpty(email)) {
            res.send({ status: false, message: "Plz,Enter E-mail" });
        } else if (_.isEmpty(password)) {
            res.send({ status: false, message: "Plz,Enter Password" });
        } else {
            await Emp.findOne({ email: email }, (err, userdata) => {
                if (!err) {
                    if (userdata.length <= 0) return res.json("please sign up");
                    bcrypt.compare(password, userdata.password, function (err, result) {
                        if (result) {
                            let Token = jwt.sign({ email: email }, process.env.SECRET_KEY, { expiresIn: "10m" });
                            return res.send({ status: true, Data: userdata, token: Token });
                        }
                        else return res.json("please enter correct password");
                    });
                } else throw err;
            }).clone();
        }
    };
}

module.exports = new empController();