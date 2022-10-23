require("dotenv").config();
const userDatabase = require("../db/user");
const jwt = require("jsonwebtoken");
const router = require("express").Router();
const client_home = process.env.FRONT_END_URL;

router.post("/login-user", async (req, res) => {
  let user;
  try {
    user = await userDatabase.findOne({ username: req.body.name }).exec();
    if (user === null) {
      throw new Error("Cannot find user.");
    }
    try {
      const password = req.body.password;
      if (password !== user.password) {
        throw new Error("Password didnt matched");
      } else {
        // set cookies.
        const token = jwt.sign(req.body, process.env.secret);
        res.cookie("username", user.username).status(200).redirect(client_home);
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/register-user", async (req, res) => {
  const phone_number = req.body.phone_number;
  try {
    // verify phone_number using OTP
    const resp = await userDatabase.findOne({ username: req.body.name });
    if (resp) {
      throw new Error("User already existing");
    }
    const user = new userDatabase({
      username: req.body.name,
      password: req.body.password,
      phonenumber: phone_number,
      isadmin: false,
      needBreakfast: false,
      needSnacks: false,
      decisionMade: false,
    });
    await user.save();
    res.status(200).redirect(client_home);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/logout", (req, res) => {
  try {
    const cookie_array = req.headers.cookie.split("; ");
    cookie_array.forEach((element) => {
      if (element.split("=")[0] === "username") {
        res.clearCookie("username").status(200).redirect(client_home);
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


router.get("/get-all-details", async (req, res) => {
  const resp = await userDatabase.find();
  const obj_dict = { breakfast: 0, snacks: 0 };
  resp.forEach((ele) => {
    if (ele.needBreakfast === true) {
      obj_dict.breakfast += 1;
    }
    if (ele.needSnacks === true) {
      obj_dict.snacks += 1;
    }
  });
  console.log(obj_dict);
  res.status(200).json(obj_dict);
});

router.get("/check-user/:username", async (req, res) => {
  const username = decodeURIComponent(req.params.username);
  const user = await userDatabase.findOne({ username: username }).exec();
  
  res.status(200).json({ decisionMade: user.decisionMade, isadmin: user.isadmin });
});

router.post("/submit-vote", async (req, res) => {
  const response = req.body.opt;
  console.log(response);
  try {
    const cookie_array = req.headers.cookie.split("; ");
    console.log(cookie_array);
    let user;
    cookie_array.forEach(async (element) => {
      if (element.split("=")[0] === "username") {
        let setb = false,
          setc = false;
        if (req.body.opt === undefined) {
          res.redirect(client_home);
        } else if (req.body.opt === "breakfast") setb = true;
        else if (req.body.opt === "snacks") setc = true;
        else if (req.body.opt.length == 2) {
          setb = true;
          setc = true;
        }

        userDatabase.update({ username: decodeURIComponent(element.split("=")[1]) },
          {'$set':{
            needBreakfast: setb,
            needSnacks: setc,
            decisionMade: true
          }},
          function(err){
            if(err)res.json({"error":err.message});
            res.status(200).redirect(client_home)
          }
        );
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
