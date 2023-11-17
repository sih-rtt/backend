import express from "express";
import { conductorRepo } from "../../../redis/index.js";

var conductorLogout = express.Router();
conductorLogout.post("/conductor/logout", async (req, res) => {
  let refreshToken = await req.body.refreshToken;
  refreshToken = "Bearer " + refreshToken;
  const conductorId = await req.body.conductorId;
  const accessToken = req.headers.authorization.slice(7);
  const data = {
    conductorId
  }
  await fetch("http://localhost:3000/conductor/access", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`
    },
    body: JSON.stringify(data),
  })
    .then(async (response) => {
      if (response.status == 200) {
        await conductorRepo.remove(conductorId);
        res.send("Logged Out");
      } else {
        const refreshData = { conductorId };
        await fetch("http://localhost:3000/conductor/refresh", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: refreshToken,
          },
          body: JSON.stringify(refreshData),
        }).then(async (response) => {
          if (response.status == 200) {
            await conductorRepo.remove(conductorId);
            res.send("Logged Out");
          } else {
            res.status(response.status).send(response);
          }
        });
      }
    })
    .catch((error) => console.error(error));
});

export default conductorLogout;
