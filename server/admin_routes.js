require("dotenv").config();
const router = require("express").Router();
const axios = require("axios");
const userDatabase = require("../db/user");

const reset_votes = async () => {
  const users = await userDatabase.find().exec();
  users.map(async (ele) => {
    ele.needBreakfast = false;
    ele.needSnacks = false;
    ele.decisionMade = false;
    await ele.save();
  });
};

router.post("/send_message", async (req, res) => {
  let header = {
    "Content-Type": "application/json",
    "api-key": process.env.taskapi,
  };
  let data = {
    to: "",
    type: "MKT",
    source: "API",
    body: ``,
    sender: "ABHIRAM",
    template_id: 121234345656
  };
  const users = await userDatabase.find().exec();
  users.map(async (ele, index) => {
    if (index !== 0) {
      data["to"] = eval(ele.phonenumber);
      data["body"] = `Greetings ${
        ele.username
      } from Kalyera. You have opted for ${
        ele.needBreakfast ? "Breakfast" : ""
      } and ${ele.needSnacks ? "Snacks" : ""}`;

      let config = {
        headers: header,
      };

      try {
        const res=await axios.post(
          `https://api.kaleyra.io/v1/${process.env.SID}/messages`,
          data,
          config
        );
        console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    }
  });
  // when sending sms, the votes have to be reset.
  await reset_votes();
  res.send("Done");
});

module.exports = router;
