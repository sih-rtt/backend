import express from "express";
import jwt from "jsonwebtoken";
import { riderRepositiory } from "../../User.js";
var userRefresh = express.Router();
import "dotenv/config";
userRefresh.post("/user/refresh", async (req, res) => {
  const refreshToken = await req.body.refreshToken;
  const email = await req.body.email;

  try {
    const emailVer = await jwt.verify(refreshToken, process.env.REFRESH_SECRET)
      .email;
    if (email == emailVer) {
      const refreshTokenVer = await riderRepositiory.fetch(email);
      if (refreshTokenVer.refresh == refreshToken) {
        const accesskey = jwt.sign(
          { email: email },
          process.env.ACCESS_SECRET,
          { expiresIn: "20m" }
        );
        const privatekey = jwt.sign(
          { email: email },
          process.env.REFRESH_SECRET,
          { expiresIn: "1d" }
        );
        const response = {
          access: accesskey,
          private: privatekey,
        };
        let redisData = {
          email: email,
          access: accesskey,
          private: privatekey,
        };
        riderRepositiory.remove(email);
        redisData = await riderRepositiory.save(email, redisData);
        res.send(JSON.stringify(response));
        res.json(response);
      } else {
        riderRepositiory.remove(email);
        res.status(400).send("Unauthorized");
      }
    } else {
      res.status(400).send("Details don't match");
    }
  } catch (error) {
    riderRepositiory.remove(email);
    res.status(402).send(error.message);
  }
});
export default userRefresh;
