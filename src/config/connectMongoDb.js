const dotenv = require("dotenv").config();
const mongoose = require("mongoose");

function connect() {
    mongoose
        .connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then((res) => console.log("> Connected..."))
        .catch((err) =>
            console.log(`> Error while connecting to mongoDB : ${err.message}`)
        );
}

module.exports = connect;
