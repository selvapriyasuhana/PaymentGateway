var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
const path = require('path');

const cors = require("cors");
const dotenv = require("dotenv");
const razorpay = require('razorpay');

var PaymentRoutes = require("./Routes/routes.js");
var mongodb = require("./Config/Mongoconfig.js");
require('dotenv').config();

var app = new express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

const mongo = mongoose.connect(mongodb.url);
mongo.then(
  () => {
    console.log("Mongo_DB Connected Successfully");
  },
  (error) => {
    console.log(
      error,
      "Error, While connecting to Mongo_DB something went wrong"
    );
  }
);
const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});
if (!razorpayInstance) {
    console.error("Failed to initialize Razorpay");
    process.exit(1);
}

app.get("/", (req, res) => res.send("RazorpayPaymentGateway "));

var port = process.env.PORT || 6000;
app.listen(port, () => {
  console.log("Server running on port " + port);
});
app.use("/api", PaymentRoutes(razorpayInstance));


module.exports = {
    app,
    razorpayInstance
};
