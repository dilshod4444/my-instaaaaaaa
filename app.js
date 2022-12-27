const express = require("express");
const cors = require("cors");
const connect = require("./src/config/connectMongoDb");
const router = require("./src/router");
const morgan = require("morgan");
const app = express();
const path = require('path')
require("dotenv").config();
const port = process.env.PORT || 5000;

connect();

app.use(cors({
    origin: "*s",
    credentials: true
}))
app.use(express.json());
app.use(morgan("dev"));

app.use("/api", router);

app.listen(port, () => console.log("> Server is up and running on port : " + port));
