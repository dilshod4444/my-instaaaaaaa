const express = require("express");
const cors = require("cors");
const connect = require("./src/config/connectMongoDb");
const router = require("./src/router");
const morgan = require("morgan");
const app = express();
const path = require("path");
require("dotenv").config();

const port = process.env.PORT || 5000;

connect();

app.use(
    cors({
        origin: "https://my-insta-haydarbek.netlify.app",
        credentials: true,
    })
);
app.use(express.json());
app.use(morgan("dev"));

app.use("/api", router);
app.use(express.static("./public"));
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "public", "build", "index.html"));
});

app.listen(port, () => console.log("> Server is up and running on port : " + port));
