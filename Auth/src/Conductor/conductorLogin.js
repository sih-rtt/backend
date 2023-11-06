import express from "express";
import jwt from "jsonwebtoken";
import { conductorRepositiory } from "../../User.js";
import prisma from "../index.js";
var conductorLogin = express.Router();
conductorLogin.post("/conductor/login", async (req, res) => {
  const conductorId = await req.body.conductorId;
  const password = await req.body.password;
  const conductor = await prisma.conductor.findFirst({
    where: {
      conductorId: conductorId,
    },
  });
  if (conductor != null) {
    if (conductor.password == password) {
      const accesskey = jwt.sign(
        { conductorId: conductorId },
        process.env.ACCESS_SECRET,
        { expiresIn: "20m" }
      );
      const refreshKey = jwt.sign(
        { conductorId: conductorId },
        process.env.REFRESH_SECRET,
        { expiresIn: "1d" }
      );
      const response = {
        access: accesskey,
        refresh: refreshKey,
      };
      let redisData = {
        conductorId: conductorId,
        access: accesskey,
        refresh: refreshKey,
      };
      if (await conductorRepositiory.fetch(conductorId)) {
        await conductorRepositiory.remove(conductorId);
      }
      redisData = await conductorRepositiory.save(conductorId, redisData);
      res.json(response);
    } else {
      res.status(403).send("Email or password is wrong");
    }
  } else {
    res.status(403).send("Email or password is wrong");
  }
});
export default conductorLogin;
