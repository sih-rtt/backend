import express from "express";
import { conductorRepositiory } from "../../User";
import axios from "axios";
var conductorLogout = express.Router();
conductorLogout.post("/conductor/logout", async (req, res) => {
  let refreshToken = await req.body.refreshToken;
  refreshToken = "Bearer " + refreshToken;
  const conductorId = await req.body.conductorId;
  const accessToken = req.headers.authorization.slice(7);
  let response = await axios
    .post("/conductor/access", {
      conductorId: conductorId,
      accessToken: accessToken,
    })
    .then(async (response) => {
      if (response.status == 200) {
        const data = await conductorRepositiory.fetch(conductorId);
        data.loggedIn = false;
        data.accessTokens = [];
        data.refreshTokens = [];
        await conductorRepositiory.save(conductorId, data);
        res.send("Logged Out");
      } else {
        response = await axios
          .post(
            "/conductor/refresh",
            {
              conductorId: conductorId,
            },
            {
              Authorization: refreshToken,
            }
          )
          .then(async (response) => {
            if (response.status == 200) {
              const data = await conductorRepositiory.fetch(conductorId);
              data.loggedIn = false;
              data.accessTokens = [];
              data.refreshTokens = [];
              await conductorRepositiory.save(conductorId, data);
              res.send("Logged Out");
            } else {
              res.status(response.status).send(response.data);
            }
          });
      }
    });
});
export default conductorLogout;
