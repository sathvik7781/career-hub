require("dotenv").config();
const { Worker } = require("bullmq");
const sendEmail = require("../utils/sendEmail"); // Our existing utility, assuming it exists or replacing with generic logic
const redis = require("../utils/cache");

console.log("Starting email worker...");

if (!process.env.REDIS_URL && process.env.NODE_ENV !== "production") {
  console.log("Redis not configured. Worker will shut down as queues are mocked.");
  process.exit(0);
}

const emailWorker = new Worker("emailQueue", async (job) => {
  const { type, payload } = job.data;
  
  console.log(`Processing background job: ${type} [ID: ${job.id}]`);
  
  if (type === "SEND_DIGEST") {
    // Dummy logic for a bulk email digest
    const { emails } = payload;
    for (const email of emails) {
      console.log(`Sending job alert digest to ${email}...`);
      // Here we would call sendEmail(email, "Job Alerts", "Here are your weekly job alerts!");
    }
  } else if (type === "STATUS_NOTIFICATION") {
    const { email, message } = payload;
    console.log(`Sending status notification to ${email}...`);
    // call sendEmail(...)
  }

  return { success: true, processed: new Date() };
}, { connection: redis });

emailWorker.on("completed", (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

emailWorker.on("failed", (job, err) => {
  console.error(`Job ${job.id} failed with error:`, err);
});
