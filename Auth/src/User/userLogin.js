import express from "express";
import prisma from "../index.js";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { riderRepositiory } from "../../User.js";
var userLogin = express.Router();
userLogin.post("/user/login", async (req, res) => {
  const email = await req.body.email;
  const password = await req.body.password;
  const rider = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });
  if (rider != null) {
    if (rider.password == password) {
      const accessKey = jwt.sign({ email: email }, process.env.ACCESS_SECRET, {
        expiresIn: "20m",
      });
      const refreshKey = jwt.sign(
        { email: email },
        process.env.REFRESH_SECRET,
        { expiresIn: "1d" }
      );
      const response = {
        access: accessKey,
        refresh: refreshKey,
      };
      let redisData = {
        email: email,
        access: accessKey,
        refresh: refreshKey,
      };
      if (riderRepositiory.fetch(email)) {
        riderRepositiory.remove(email);
      }
      redisData = await riderRepositiory.save(email, redisData);
      res.json(response);
    } else {
      res.status(403).send("Email or password is wrong");
    }
  } else {
    res.status(403).send("Email or password is wrong");
  }
});
export default userLogin;
