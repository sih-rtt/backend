import express from "express";
import { riderRepo } from "../../../redis/index.js";

var userLogout = express.Router();
userLogout.post("/user/logout", async (req, res) => {

  const refreshToken = await req.body.refreshToken;
  const email = await req.body.email;
  const accessToken = req.headers.authorization.slice(7);
  const data = {
    email
  }
  await fetch("http://localhost:3000/user/access", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`
    },
    body: JSON.stringify(data),
  })
    .then(async (response) => {
      var rider = await riderRepo.fetch(email);
      if (response.status == 200) {
        const index = rider.accessTokens.indexOf(accessToken);
        delete rider.accessTokens[index];
        delete rider.refreshTokens[index];

        await riderRepo.save(rider);

        res.send("Logged Out");
      } else {
        const refreshData = { email };
        await fetch("http://localhost:3000/user/refresh", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${refreshToken}`,
          },
          body: JSON.stringify(refreshData),
        }).then(async (response) => {
          if (response.status == 200) {
            const index = rider.refreshTokens.indexOf(refreshToken);
            console.log()
            delete rider.accessTokens[index];
            delete rider.refreshTokens[index];

            await riderRepo.save(rider);

            res.send("Logged Out");
          } else {
            res.status(response.status).send(response);
          }
        });
      }
    })
    .catch((error) => console.error(error));
});

export default userLogout;
