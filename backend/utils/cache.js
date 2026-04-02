const Redis = require("ioredis");

let redis;

if (process.env.REDIS_URL || process.env.NODE_ENV === "production") {
  redis = new Redis(process.env.REDIS_URL);
} else {
  // Graceful fallback for local development without Redis
  console.warn("WARNING: Redis not configured. Caching and queues will use mock/fallback behavior.");
  redis = {
    get: async () => null,
    set: async () => null,
    del: async () => null,
    on: () => {},
    // Mock enough for basic ioredis use
  };
}

module.exports = redis;
