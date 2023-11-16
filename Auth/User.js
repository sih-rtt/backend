import { Repository, Schema } from "redis-om";
import redis from "./Client.js";

const user = new Schema('User', {
  email: { type: 'string' },
  accessTokens: { type: 'string[]' },
  refreshTokens: { type: 'string[]' },
});

const conductor = new Schema('Concductor', {
  conductorid: { type: 'string' },
  loggedIn: { type: 'boolean' },
  access: { type: 'string' },
  refresh: { type: 'string' },
});

export const riderRepositiory = new Repository(user, redis);
export const conductorRepositiory = new Repository(conductor, redis);
