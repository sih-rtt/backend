import { PrismaClient } from "@prisma/client";
import express from "express";
import bodyParser from "body-parser";
import userSignup from "./User/userSignup.js";
import userLogin from "./User/userLogin.js";
import userAccess from "./User/userAccess.js";
import userRefresh from "./User/userRefresh.js";
import conductorLogin from "./Conductor/conductorLogin.js";
import conductorAccess from "./Conductor/conductorAccess.js";
import conductorRefresh from "./Conductor/conductorRefersh.js";
import conductorLogout from "./Conductor/conductorLogout.js";
import userLogout from "./User/userLogout.js";


const app = express();
const prisma = new PrismaClient();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(userSignup);
app.use(userLogout)
app.use(userLogin);
app.use(userAccess);
app.use(userRefresh);
app.use(conductorLogin);
app.use(conductorAccess);
app.use(conductorRefresh);
app.use(conductorLogout);

app.listen(3000, () => {
  console.log("server has started at port 3000");
});

export default prisma;
