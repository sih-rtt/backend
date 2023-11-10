import express from "express";
import { conductorRepositiory } from "../../User.js";
var conductorLogout = express.Router();
conductorLogout.post("/conductor/logout", async (req, res) => {
  let refreshToken = await req.body.refreshToken;
  refreshToken = "Bearer " + refreshToken;
  const conductorId = await req.body.conductorId;
  const accessToken = req.headers.authorization.slice(7);
  const formData = new FormData();
  formData.append("conductorId", conductorId);
  formData.append("accessToken", accessToken);
  await fetch("http://localhost:3000/conductor/access", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(formData),
  })
    .then(async (response) => {
      if (response.status == 200) {
        await conductorRepositiory.remove(conductorId);
        res.send("Logged Out");
      } else {
        const refreshData = new FormData();
        refreshData.append("conductorId", conductorId);
        await fetch("http://localhost:3000/conductor/refresh", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: refreshToken,
          },
          body: new URLSearchParams(refreshData),
        }).then(async (response) => {
          if (response.status == 200) {
            await conductorRepositiory.remove(conductorId);
            res.send("Logged Out");
          } else {
            res.status(response.status).send(response.formData);
          }
        });
      }
    })
    .catch((error) => console.error(error));
});
export default conductorLogout;
