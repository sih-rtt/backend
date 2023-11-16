import express from "express";
import prisma from "./../index.js";
var userSignup = express.Router();

userSignup.post("/user/signup", async (req, res) => {
  const data = {
    email: req.body.email,
    password: req.body.password,
    fullName: req.body.fullName
  };

  if (
    !(/^\d+$/.test(req.body.phoneNumber) && req.body.phoneNumber.length == 10)
  ) {
    res.status(422).send("Phone number provided is in wrong fromat");
  } else if (req.body.fullName.length == 0) {
    res.status(422).send("Full name cannot be Empty");
  } else if (req.body.password.length < 8) {
    res.status(422).send("Password cannot be less than 8 characters.");
  } else {
    var user;
    try {
      user = await prisma.user.create({ data: data });
    } catch (error) {
      res.status(422).send(error.message);
    }
    res.json(user);
  }
});
export default userSignup;
