const express = require("express");
const app = express();
const PORT = 3000;
const db_connect = require("./Db_config/connection")
const router = require("./Routes/route")
db_connect();
app.use(express.json());

app.use("/",router);

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
