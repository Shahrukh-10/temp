const mongoose = require("mongoose");
require("dotenv").config();
const uri = process.env.ATLAS_URI;

const connectToMongo = () => {
  mongoose.connect(uri, () => {
    console.log("Connected to mongo successfully .");
  });
};

module.exports = connectToMongo;
