import { createClient } from "redis";

const redis = createClient({ host: "localhost", port: 6379 });
redis.on("error", (err) => console.log("Redis Client Error", err));
await redis.connect();
export default redis;
