import express from "express";
import jwt from "jsonwebtoken";
import { conductorRepositiory } from "../../User.js";
import "dotenv/config.js";
var conductorRefresh = express.Router();
conductorRefresh.post("/conductor/refresh", async (req, res) => {
  const refreshToken = req.headers.authorization.slice(7);
  const conductorId = await req.body.conductorId;
  try {
    const conductorIdVer = await jwt.verify(
      refreshToken,
      process.env.REFRESH_SECRET
    ).conductorId;
    if (conductorId == conductorIdVer) {
      const refreshTokenVer = await conductorRepositiory.fetch(conductorId);
      if (refreshTokenVer.refresh == refreshToken) {
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
          loggedIn: true,
          access: accesskey,
          refresh: refreshKey,
        };
        conductorRepositiory.remove(conductorId);
        redisData = await conductorRepositiory.save(conductorId, redisData);
        res.json(response);
      } else {
        conductorRepositiory.remove(conductorId);
        res.status(400).send("Unauthorized");
      }
    } else {
      res.status(400).send("Details don't match");
    }
  } catch (error) {
    conductorRepositiory.remove(conductorId);
    res.status(402).send(error.message);
  }
});
export default conductorRefresh;
