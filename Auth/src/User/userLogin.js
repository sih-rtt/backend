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
      let accessKey = jwt.sign({ email: email }, process.env.ACCESS_SECRET, {
        expiresIn: "20m",
      });
      let refreshKey = jwt.sign({ email: email }, process.env.REFRESH_SECRET, {
        expiresIn: "1d",
      });
      const response = {
        access: accessKey,
        refresh: refreshKey,
      };
      const data = await riderRepositiory.fetch(email);
      if (!data.accessTokens) {
        accessKey = [accessKey];
        refreshKey = [refreshKey];
      } else {
        data.accessTokens[data.accessTokens.length] = accessKey;
        accessKey = data.accessTokens;
        data.refreshTokens[data.refreshTokens.length] = refreshKey;
        refreshKey = data.refreshTokens;
      }
      let redisData = {
        email: email,
        accessTokens: accessKey,
        refreshTokens: refreshKey,
      };
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
