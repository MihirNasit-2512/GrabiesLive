const express = require("express");
const router = express.Router();
const controllerAuth = require("../controller/Authenticate");
const controllerEmp = require("../controller/Emp");
const controllerAppointment = require("../controller/appointment");
const auth = require("../middleware/Auth");

router.post("/signup", controllerAuth.signup);

router.post("/login", controllerAuth.login);

router.post("/forgetpass", controllerAuth.forgetPassword);

router.post("/changepass", controllerAuth.changePassword);

router.post("/emp/register", controllerEmp.register);

router.post("/emp/login", controllerEmp.login);

router.post("/appointment",auth,controllerAppointment.makeAppo)

module.exports = router;