const { createClient } = require("redis");

const redisUrl =
  process.env.NODE_ENV === "production"
    ? process.env.REDIS
    : "redis://localhost:6379";

const redisClient = createClient({
  url: redisUrl,
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));

(async () => {
  await redisClient.connect();
})();

module.exports = redisClient;
