import express from "express";
import jwt from "jsonwebtoken";
import { riderRepo } from "../../../redis/index.js";
var userRefresh = express.Router();
import "dotenv/config";
userRefresh.post("/user/refresh", async (req, res) => {
  const refreshToken = req.headers.authorization.slice(7);
  const email = await req.body.email;
  function incudedInObj(Object, element) {
    for (let i = 0; i < Object.length; i++) {
      if (Object[i] == element) {
        return i + 1;
      }
    }
    return false;
  }
  try {
    const emailVer = await jwt.verify(refreshToken, process.env.REFRESH_SECRET)
      .email;
    if (email == emailVer) {
      const refreshTokenVer = await riderRepo.fetch(email);
      let condition = incudedInObj(refreshTokenVer.refreshTokens, refreshToken);
      if (condition) {
        condition = condition - 1;
        let accesskey = jwt.sign({ email: email }, process.env.ACCESS_SECRET, {
          expiresIn: "20m",
        });
        let privatekey = jwt.sign(
          { email: email },
          process.env.REFRESH_SECRET,
          { expiresIn: "1d" }
        );
        const response = {
          access: accesskey,
          private: privatekey,
        };
        refreshTokenVer.refreshTokens[condition] = privatekey;
        refreshTokenVer.accessTokens[condition] = accesskey;
        accesskey = refreshTokenVer.accessTokens;
        privatekey = refreshTokenVer.refreshTokens;
        let redisData = {
          email: email,
          accessTokens: accesskey,
          refreshTokens: privatekey,
        };
        redisData = await riderRepo.save(email, redisData);
        res.json(response);
      } else {
        riderRepo.remove(email);
        res.status(400).send("Unauthorized");
      }
    } else {
      res.status(400).send("Details don't match");
    }
  } catch (error) {
    riderRepo.remove(email);
    res.status(401).send(error.message);
  }
});
export default userRefresh;
