const express = require("express");
const app = express();
const PORT = 3000;
const controller = require("./Routes/controller");
const auth = require("./middleware/Auth");

app.use(express.json());

app.post("/signup", controller.signup);

app.post("/login", controller.login);

app.post("/forgetpass" , controller.forgetPassword);

app.post("/changepass",controller.changePassword);

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
