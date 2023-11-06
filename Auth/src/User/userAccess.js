import express from "express";
import jwt from "jsonwebtoken";
import { riderRepositiory } from "../../User.js";
var userAccess = express.Router();
import "dotenv/config";
userAccess.post("/user/access", async (req, res) => {
  const accessToken = await req.body.accessToken;
  const email = await req.body.email;
  try {
    const emailVer = await jwt.verify(accessToken, process.env.ACCESS_SECRET)
      .email;
    if (email == emailVer) {
      const accessTokenVer = await riderRepositiory.fetch(email);
      if (
        accessToken == (accessTokenVer.access ? accessTokenVer.access : null)
      ) {
        res.send(JSON.stringify("Authorized"));
      } else {
        res.status(400).send("Probably a malicious user");
      }
    } else {
      res.status(400).send("unmatched email");
    }
  } catch (error) {
    res.status(401).send(error.message);
  }
});
export default userAccess;
