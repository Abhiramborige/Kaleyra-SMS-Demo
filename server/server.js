require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const userDatabase = require("../db/user");
const cors = require('cors')

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(`mongodb+srv://${process.env.USERNAME_APP}:${process.env.PASSWORD_APP}@cluster0.cffbkgw.mongodb.net/?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to database"));

const client_home = process.env.FRONT_END_URL;
const admin_routes = require("./admin_routes");
const user_routes = require("./user_routes");

app.use("/user", user_routes);
app.use("/admin", admin_routes);

// add admin
(async()=>{
  try {
    const resp=await userDatabase.findOne({ username: "admin@app.com" });
    if (resp){
      throw new Error("User already existing");
    }
    const user = new userDatabase({
      username: "admin@app.com",
      password: "admin",
      phonenumber : "9999999999",
      isadmin: true, 
    });
    await user.save();
  } catch (err) {
    console.log(err)
  }
})();

app.listen(3000, () => {
  console.log("Running");
});

module.exports={client_home}
