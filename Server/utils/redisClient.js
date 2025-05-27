const { createClient } = require("redis");

const redisClient =
  process.env.NODE_ENV === "production"
    ? process.env.REDIS
    : "redis://localhost:6379";

redisClient.on("error", (err) => console.error("Redis Client Error", err));

(async () => {
  await redisClient.connect();
})();

module.exports = redisClient;
