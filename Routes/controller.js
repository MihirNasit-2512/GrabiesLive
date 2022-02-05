const _ = require("underscore");
const bcrypt = require("bcrypt");
const user = require("../models/UserModel");
const OTP = require("../models/otp");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.email,
    pass: process.env.password
  }
})
function controller() {

  this.login = async (req, res) => {
    const { email, password } = req.body;
    if (_.isEmpty(email)) {
      res.send({ status: false, message: "Plz,Enter E-mail" });
    } else if (_.isEmpty(password)) {
      res.send({ status: false, message: "Plz,Enter Password" });
    } else {
      await user.find({ email: email }, (err, userdata) => {
        if (userdata.length <= 0) return res.json("please sign up");
        bcrypt.compare(password, userdata[0].password, function (err, result) {
          if (result) {
            let Token = jwt.sign({ email: email }, process.env.SECRET_KEY, { expiresIn: "10m" });
            return res.send({ status: true, Data: userdata[0], token: Token });
          }
          else return res.json("please enter correct password");
        });
      });
    }
  };

  this.signup = async (req, res) => {
    const { email, password } = req.body;
    if (_.isEmpty(email) || _.isEmpty(password)) {
      res.send({ status: false, message: "Plz,Enter Details.." });
    } else {
      const emailsearch = await user.exists({ email: email });
      if (emailsearch) {
        return res.json("This Email already Registered");
      }
      bcrypt.hash(password, 10, async function (err, hash) {
        let myDetail = new user({ password: hash, email });
        await myDetail.save().then(() => {
          return res.json("Thanks for signning up");
        })
          .catch((err) => {
            return err;
          });
      });
    }
  };

  this.forgetPassword = async (req, res) => {
    const { email } = req.body;
    if (!_.isEmpty(email)) {
      user.findOne({ email: email }, (err, result) => {
        if (!err) {
          if (result) {
            let otpcode = Math.floor((Math.random() * 10000) + 1);
            let time = new Date().getTime() + 180 * 1000;
            var mailOptions = {
              from: process.env.email,
              to: email,
              subject: 'OTP',
              text: `You Need An OTP For Login.OTP Expires In 3 Minutes.Your OTP Is ${otpcode}.`
            }
            transporter.sendMail(mailOptions, async (err, info) => {
              if (!err) {
                await OTP.findOne({ email: email }, async (err, otpdata) => {
                  if (!err) {
                    if (otpdata) {
                      await OTP.updateOne({ email: email }, { code: otpcode, expiresIn: time }, (err, updata) => {
                        if (!err) {
                          res.send({ status: true, message: "E-mail Sent Successfully" });
                        } else throw err;
                      });
                    } else {
                      let otpdata = {
                        email: email,
                        code: otpcode,
                        expiresIn: time
                      }
                      await OTP.create(otpdata, (err, resu) => {
                        if (!err) {
                          console.log(resu);
                          res.send({ status: true, message: "E-mail Sent Successfully" });
                        } else throw err;
                      });
                    }
                  } else throw err;
                });
              } else throw err;
            });
          } else res.send({ status: false, message: "Email Not Found" });
        } else throw err;
      });
    } else {
      res.send({ status: false, message: "Plz,Enter E-mail.." });
    }
  }

  this.changePassword = async (req, res) => {
    let { email, Otp, new_pass } = req.body;
    if (!email) {
      res.send({ status: false, message: "plz,enter email" });
    }
    else if (!Otp) {
      res.send({ status: false, message: "plz,enter OTP" });
    }
    else if (!new_pass) {
      res.send({ status: false, message: "plz,enter New Password" });
    }
    else {
      await OTP.findOne({ email: email, code: Otp }, (err, data) => {
        if (!err) {
          if (data) {
            let currTime = new Date().getTime();
            console.log(data.expiresIn - currTime);
            if (currTime < data.expiresIn) {
              bcrypt.hash(new_pass, 10, (err, hash) => {
                if (!err) {
                  user.updateOne({ email: email }, { password: hash });
                  res.send({ status: true, message: "Password Changed Successfully" })
                } else {
                  throw err;
                }
              });
            } else {
              res.send({ status: false, message: "OTP Expired.." });
            }
          } else {
            res.send({ status: false, message: "Invalid Otp.." });
          }
        } else {
          throw err;
        }
      });
    }
  }

}

module.exports = new controller();
