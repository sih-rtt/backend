import { Repository, Schema } from "redis-om";
import redis from "./Client.js";
const riderSchema = new Schema("rider", {
  email: { type: "string" },
  access: { type: "string" },
  refresh: { type: "string" },
});
const conductorSchema = new Schema("conductor", {
  conductorid: { type: "string" },
  access: { type: "string" },
  refresh: { type: "string" },
});
export const riderRepositiory = new Repository(riderSchema, redis);
export const conductorRepositiory = new Repository(conductorSchema, redis);
