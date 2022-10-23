const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phonenumber:{
    type: String,
    required: true,
  },
  isadmin:{
    type: Boolean,
    required: true
  },
  needBreakfast:{
    type: Boolean,
    required: true,
  },
  needSnacks:{
    type: Boolean,
    required: true,
  },
  decisionMade:{
    type: Boolean,
    required: true
  }
});

// name of model and schema.
module.exports = mongoose.model("userDatabase", userSchema);
