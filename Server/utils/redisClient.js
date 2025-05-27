const { createClient } = require("redis");

const redisClient = createClient({
  url: "redis://localhost:6379", // اگر Redis روی پورت و لوکال پیش‌فرض است
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));

(async () => {
  await redisClient.connect();
})();

module.exports = redisClient;
