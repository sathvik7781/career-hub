const { Queue } = require("bullmq");
const redis = require("./cache"); // We can pass the existing ioredis instance

// Check if we are using the real Redis (mock object wouldn't have .options or .status typically)
// For bullmq, it needs a real connection or it might throw.
let emailQueue;

if (process.env.REDIS_URL || process.env.NODE_ENV === "production") {
  emailQueue = new Queue("emailQueue", { connection: redis });
} else {
  // Mock queue for environments without Redis
  emailQueue = {
    add: async (name, payload) => {
      console.log(`[MOCK QUEUE] Emitting job ${name} with payload`, payload);
      return { id: "mock-" + Date.now() };
    },
  };
}

module.exports = { emailQueue };
