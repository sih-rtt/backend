import express from "express";
import jwt from "jsonwebtoken";
import { conductorRepositiory } from "../../User.js";
import "dotenv/config.js";
var conductorAccess = express.Router();
conductorAccess.post("/conductor/access", async (req, res) => {
  const accessToken = await req.body.accessToken;
  const conductorId = await req.body.conductorId;
  try {
    const conductorIdVer = await jwt.verify(
      accessToken,
      process.env.ACCESS_SECRET
    ).conductorId;
    if (conductorId == conductorIdVer) {
      const accessTokenVer = await conductorRepositiory.fetch(conductorId);
      if (accessToken == accessTokenVer.access) {
        res.send(JSON.stringify("Authorized"));
      } else {
        res.status(400).send("malicious user");
      }
    } else {
      res.status(400).send("unmatched ConductorId");
    }
  } catch (error) {
    res.status(401).send(error.message);
  }
});
export default conductorAccess;
