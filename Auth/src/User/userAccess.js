import express from "express";
import jwt from "jsonwebtoken";
import { riderRepo } from "../../../redis/index.js";
import "dotenv/config";

var userAccess = express.Router();
userAccess.post("/user/access", async (req, res) => {
  function incudedInObj(Object, element) {
    for (let i = 0; i < Object.length; i++) {
      if (Object[i] == element) {
        return true;
      }
    }
    return false;
  }
  
  const accessToken = req.headers.authorization.slice(7);
  const email = await req.body.email;
  try {
    const emailVer = await jwt.verify(accessToken, process.env.ACCESS_SECRET).email;
    if (email == emailVer) {
      const accessTokenVer = await riderRepo.fetch(email);
      if (incudedInObj(accessTokenVer.accessTokens, accessToken)) {
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
