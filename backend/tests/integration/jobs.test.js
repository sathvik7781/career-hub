const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../../index");
const User = require("../../models/user");
const Company = require("../../models/Company");
const Job = require("../../models/Job");
const RecruiterProfile = require("../../models/RecruiterProfile");
const SeekerProfile = require("../../models/SeekerProfile");

// ─── Helpers ──────────────────────────────────────────────────────────────────

const JWT_SECRET = process.env.JWT_SECRET || "test-secret";

const createToken = (user) =>
  jwt.sign({ id: user._id, role: user.role, email: user.email }, JWT_SECRET, {
    expiresIn: "1h",
  });

const seedRecruiterWithJob = async () => {
  const user = await User.create({
    email: "recruiter@test.com",
    password: "hashedpw",
    role: "recruiter",
  });
  const profile = await RecruiterProfile.create({ user: user._id });
  const company = await Company.create({
    name: "TestCorp",
    owner: profile._id,
    verificationStatus: "approved",
  });
  profile.company = company._id;
  await profile.save();

  const job = await Job.create({
    title: "Node.js Developer",
    description: "Build APIs",
    type: "Full-time",
    location: "Remote",
    experienceLevel: "Mid-Level",
    salary: { min: 50000, max: 100000, currency: "INR" },
    company: company._id,
    recruiter: profile._id,
  });

  const token = createToken(user);
  return { user, profile, company, job, token };
};

const seedSeeker = async () => {
  const user = await User.create({
    email: "seeker@test.com",
    password: "hashedpw",
    role: "seeker",
  });
  const profile = await SeekerProfile.create({ user: user._id });
  const token = createToken(user);
  return { user, profile, token };
};

// ─── Job CRUD Tests ───────────────────────────────────────────────────────────

describe("Jobs API", () => {
  describe("GET /api/jobs", () => {
    it("should return an empty list when no jobs exist", async () => {
      const res = await request(app).get("/api/jobs");
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toEqual([]);
      expect(res.body.pagination.total).toBe(0);
    });

    it("should return jobs from approved companies", async () => {
      await seedRecruiterWithJob();
      const res = await request(app).get("/api/jobs");
      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].title).toBe("Node.js Developer");
    });

    it("should NOT return jobs from non-approved companies", async () => {
      const user = await User.create({ email: "r2@test.com", password: "pw", role: "recruiter" });
      const profile = await RecruiterProfile.create({ user: user._id });
      const company = await Company.create({ name: "PendingCo", owner: profile._id, verificationStatus: "pending" });
      profile.company = company._id;
      await profile.save();
      await Job.create({
        title: "Hidden Job",
        description: "desc",
        type: "Full-time",
        location: "NYC",
        company: company._id,
        recruiter: profile._id,
      });

      const res = await request(app).get("/api/jobs");
      expect(res.body.data.length).toBe(0);
    });

    it("should filter by type", async () => {
      await seedRecruiterWithJob();
      const res = await request(app).get("/api/jobs?type=Part-time");
      expect(res.body.data.length).toBe(0);
    });

    it("should filter by experienceLevel", async () => {
      await seedRecruiterWithJob();
      const res = await request(app).get("/api/jobs?experienceLevel=Mid-Level");
      expect(res.body.data.length).toBe(1);
    });

    it("should filter by minSalary", async () => {
      await seedRecruiterWithJob();
      const res = await request(app).get("/api/jobs?minSalary=200000");
      expect(res.body.data.length).toBe(0);
    });
  });

  describe("GET /api/jobs/:id", () => {
    it("should return a single job by ID", async () => {
      const { job } = await seedRecruiterWithJob();
      const res = await request(app).get(`/api/jobs/${job._id}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.data.title).toBe("Node.js Developer");
    });

    it("should return 404 for a nonexistent job", async () => {
      const res = await request(app).get("/api/jobs/507f1f77bcf86cd799439011");
      expect(res.statusCode).toBe(404);
    });
  });

  describe("POST /api/jobs (recruiter)", () => {
    it("should post a new job", async () => {
      const { token, company, profile } = await seedRecruiterWithJob();
      const res = await request(app)
        .post("/api/jobs")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "React Developer",
          description: "Build UIs",
          type: "Full-time",
          location: "Bangalore",
          experienceLevel: "Junior",
        });
      expect(res.statusCode).toBe(201);
      expect(res.body.data.title).toBe("React Developer");
      expect(res.body.data.experienceLevel).toBe("Junior");
    });
  });

  describe("PUT /api/jobs/:jobId (recruiter)", () => {
    it("should update an existing job", async () => {
      const { token, job } = await seedRecruiterWithJob();
      const res = await request(app)
        .put(`/api/jobs/${job._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "Senior Node.js Developer" });
      expect(res.statusCode).toBe(200);
      expect(res.body.data.title).toBe("Senior Node.js Developer");
    });
  });

  describe("DELETE /api/jobs/:jobId (recruiter)", () => {
    it("should soft-delete a job", async () => {
      const { token, job } = await seedRecruiterWithJob();
      const res = await request(app)
        .delete(`/api/jobs/${job._id}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.statusCode).toBe(200);

      // Verify it no longer shows up in public listings
      const listing = await request(app).get("/api/jobs");
      expect(listing.body.data.length).toBe(0);
    });
  });
});

// ─── Saved Jobs Tests ─────────────────────────────────────────────────────────

describe("Saved Jobs API", () => {
  let seekerToken, seekerUser, job;

  beforeEach(async () => {
    const recruiterData = await seedRecruiterWithJob();
    job = recruiterData.job;
    const seekerData = await seedSeeker();
    seekerToken = seekerData.token;
    seekerUser = seekerData.user;
  });

  describe("POST /api/profile/saved-jobs/:jobId", () => {
    it("should save a job", async () => {
      const res = await request(app)
        .post(`/api/profile/saved-jobs/${job._id}`)
        .set("Authorization", `Bearer ${seekerToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain("saved");
    });

    it("should not duplicate when saving same job twice", async () => {
      await request(app)
        .post(`/api/profile/saved-jobs/${job._id}`)
        .set("Authorization", `Bearer ${seekerToken}`);
      await request(app)
        .post(`/api/profile/saved-jobs/${job._id}`)
        .set("Authorization", `Bearer ${seekerToken}`);

      const profile = await SeekerProfile.findOne({ user: seekerUser._id });
      expect(profile.savedJobs.length).toBe(1);
    });
  });

  describe("GET /api/profile/saved-jobs", () => {
    it("should return saved jobs list", async () => {
      await request(app)
        .post(`/api/profile/saved-jobs/${job._id}`)
        .set("Authorization", `Bearer ${seekerToken}`);

      const res = await request(app)
        .get("/api/profile/saved-jobs")
        .set("Authorization", `Bearer ${seekerToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].title).toBe("Node.js Developer");
    });

    it("should return empty array when nothing is saved", async () => {
      const res = await request(app)
        .get("/api/profile/saved-jobs")
        .set("Authorization", `Bearer ${seekerToken}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.data).toEqual([]);
    });
  });

  describe("DELETE /api/profile/saved-jobs/:jobId", () => {
    it("should remove a saved job", async () => {
      // Save first
      await request(app)
        .post(`/api/profile/saved-jobs/${job._id}`)
        .set("Authorization", `Bearer ${seekerToken}`);

      // Unsave
      const res = await request(app)
        .delete(`/api/profile/saved-jobs/${job._id}`)
        .set("Authorization", `Bearer ${seekerToken}`);
      expect(res.statusCode).toBe(200);

      // Verify it's gone
      const listing = await request(app)
        .get("/api/profile/saved-jobs")
        .set("Authorization", `Bearer ${seekerToken}`);
      expect(listing.body.data.length).toBe(0);
    });
  });

  describe("Role guard", () => {
    it("should reject saved-jobs access from a recruiter account", async () => {
      // recruiter@test.com already created by beforeEach, use a different email
      const recruiterUser = await User.create({
        email: "recruiter2@test.com",
        password: "pw",
        role: "recruiter",
      });
      const recruiterToken = createToken(recruiterUser);

      const res = await request(app)
        .get("/api/profile/saved-jobs")
        .set("Authorization", `Bearer ${recruiterToken}`);
      expect(res.statusCode).toBe(403);
    });
  });
});
