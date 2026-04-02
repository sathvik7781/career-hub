require("dotenv").config();
const mongoose = require("mongoose");

const User = require("./models/user");
const SeekerProfile = require("./models/SeekerProfile");
const Job = require("./models/Job");
const Application = require("./models/Application");

const STATUSES = ["applied", "screening", "interview", "offer", "hired", "rejected"];

async function seedApplications() {
  await mongoose.connect(process.env.MONGODB_URL);
  console.log("Connected to DB");

  // Find seeker
  const seekerUser = await User.findOne({ email: "seeker@test.com" });
  if (!seekerUser) { console.error("Seeker not found. Run seed.js first."); process.exit(1); }

  const seeker = await SeekerProfile.findOne({ user: seekerUser._id });
  if (!seeker) { console.error("SeekerProfile not found."); process.exit(1); }

  if (!seeker.resumeUrl) {
    // Set a dummy resume so applications can be created
    seeker.resumeUrl = "https://example.com/dummy-resume.pdf";
    await seeker.save();
    console.log("Set dummy resumeUrl on seeker profile");
  }

  // Get 6 jobs
  const jobs = await Job.find({ status: "active" }).limit(6);
  if (jobs.length < 6) { console.error(`Only ${jobs.length} jobs found. Need at least 6.`); process.exit(1); }

  // Clear existing applications for this seeker
  await Application.deleteMany({ applicant: seeker._id });
  console.log("Cleared existing applications");

  // Create one application per status
  for (let i = 0; i < STATUSES.length; i++) {
    await Application.create({
      job:       jobs[i]._id,
      applicant: seeker._id,
      resume:    seeker.resumeUrl,
      status:    STATUSES[i],
    });
    console.log(`  Created application for "${jobs[i].title}" → status: ${STATUSES[i]}`);
  }

  await mongoose.disconnect();
  console.log("\nDone! Login as seeker@test.com and go to My Applications to see all 6 flip cards.");
}

seedApplications().catch((err) => { console.error(err); process.exit(1); });
