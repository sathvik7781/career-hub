require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

const User = require("./models/user");
const SeekerProfile = require("./models/SeekerProfile");
const RecruiterProfile = require("./models/RecruiterProfile");
const Company = require("./models/Company");
const Job = require("./models/Job");
const Application = require("./models/Application");
const Otp = require("./models/Otp");

// ── Credentials ───────────────────────────────────────────────────────────────

const admins = [
  { email: "admin1@careerhub.dev", password: "Admin@1234" },
  { email: "admin2@careerhub.dev", password: "Admin@5678" },
  { email: "admin3@careerhub.dev", password: "Admin@9012" },
  { email: "admin4@careerhub.dev", password: "Admin@3456" },
  { email: "admin5@careerhub.dev", password: "Admin@7890" },
];

const recruiters = [
  {
    email: "recruiter1@techcorp.com",
    password: "Recruiter@1234",
    company: {
      name: "TechCorp Solutions",
      description: "A leading software solutions company building enterprise-grade products.",
      website: "https://techcorp.example.com",
      location: "Bangalore, India",
    },
    designation: "Senior Talent Acquisition",
  },
  {
    email: "recruiter2@innovate.io",
    password: "Recruiter@5678",
    company: {
      name: "Innovate.io",
      description: "Fast-growing startup disrupting the fintech space with AI-powered tools.",
      website: "https://innovate.example.io",
      location: "Mumbai, India",
    },
    designation: "HR Manager",
  },
  {
    email: "recruiter3@globaltech.com",
    password: "Recruiter@9012",
    company: {
      name: "GlobalTech Inc.",
      description: "Multinational technology company with offices across 30 countries.",
      website: "https://globaltech.example.com",
      location: "Hyderabad, India",
    },
    designation: "Talent Partner",
  },
];

const seeker = {
  email: "seeker@test.com",
  password: "Seeker@1234",
  basicInfo: {
    firstName: "Alex",
    lastName: "Johnson",
    phone: "9876543210",
    city: "Pune",
    state: "Maharashtra",
    country: "India",
    gender: "Male",
    age: 24,
  },
};

// ── Jobs per company ──────────────────────────────────────────────────────────

const jobTemplates = [
  {
    title: "Senior React Developer",
    description: "We are looking for an experienced React developer to join our frontend team. You will be responsible for building scalable UI components and collaborating with backend engineers.",
    type: "Full-time",
    location: "Bangalore, India",
    salary: { min: 1200000, max: 1800000, currency: "INR" },
    requirements: ["3+ years React experience", "TypeScript proficiency", "REST API integration", "Git workflow"],
    responsibilities: ["Build reusable UI components", "Optimize app performance", "Code reviews", "Collaborate with design team"],
  },
  {
    title: "Node.js Backend Engineer",
    description: "Join our backend team to build robust APIs and microservices. You will work on high-traffic systems serving millions of users.",
    type: "Full-time",
    location: "Remote",
    salary: { min: 1000000, max: 1600000, currency: "INR" },
    requirements: ["3+ years Node.js", "MongoDB/PostgreSQL", "REST & GraphQL APIs", "Docker basics"],
    responsibilities: ["Design and build APIs", "Database schema design", "Performance optimization", "Write unit tests"],
  },
  {
    title: "UI/UX Designer",
    description: "We need a creative designer to craft beautiful and intuitive user experiences for our web and mobile products.",
    type: "Full-time",
    location: "Mumbai, India",
    salary: { min: 800000, max: 1200000, currency: "INR" },
    requirements: ["Figma expertise", "3+ years UX design", "Design systems experience", "User research skills"],
    responsibilities: ["Create wireframes and prototypes", "Conduct user research", "Maintain design system", "Collaborate with developers"],
  },
  {
    title: "DevOps Engineer",
    description: "Looking for a DevOps engineer to manage our cloud infrastructure and CI/CD pipelines on AWS.",
    type: "Full-time",
    location: "Hyderabad, India",
    salary: { min: 1400000, max: 2000000, currency: "INR" },
    requirements: ["AWS certification preferred", "Kubernetes & Docker", "CI/CD pipelines", "Terraform/IaC"],
    responsibilities: ["Manage cloud infrastructure", "Build CI/CD pipelines", "Monitor system health", "Security hardening"],
  },
  {
    title: "Frontend Intern",
    description: "Great opportunity for fresh graduates to kickstart their career in frontend development. You will work on real features under senior mentorship.",
    type: "Internship",
    location: "Bangalore, India",
    salary: { min: 20000, max: 30000, currency: "INR" },
    requirements: ["HTML/CSS/JavaScript basics", "React fundamentals", "Eager to learn"],
    responsibilities: ["Build UI features", "Fix bugs", "Write documentation", "Participate in code reviews"],
  },
  {
    title: "Product Manager",
    description: "Drive product strategy and roadmap for our core platform. Work closely with engineering, design, and business teams.",
    type: "Full-time",
    location: "Remote",
    salary: { min: 1600000, max: 2400000, currency: "INR" },
    requirements: ["5+ years PM experience", "Agile/Scrum", "Data-driven mindset", "Strong communication"],
    responsibilities: ["Define product roadmap", "Write PRDs", "Prioritize backlog", "Stakeholder management"],
  },
  {
    title: "Data Analyst",
    description: "Analyze large datasets to derive actionable insights that drive business decisions across the organization.",
    type: "Full-time",
    location: "Mumbai, India",
    salary: { min: 700000, max: 1100000, currency: "INR" },
    requirements: ["SQL proficiency", "Python/R", "Tableau or Power BI", "Statistics fundamentals"],
    responsibilities: ["Build dashboards", "Write SQL queries", "Present insights to stakeholders", "Data cleaning and transformation"],
  },
  {
    title: "QA Engineer",
    description: "Ensure product quality through manual and automated testing across web and mobile platforms.",
    type: "Contract",
    location: "Hyderabad, India",
    salary: { min: 600000, max: 900000, currency: "INR" },
    requirements: ["Selenium/Cypress", "API testing (Postman)", "Test case writing", "Bug tracking tools"],
    responsibilities: ["Write and execute test cases", "Automate regression tests", "Report and track bugs", "Collaborate with developers"],
  },
  {
    title: "Freelance Content Writer",
    description: "Create engaging technical and marketing content for our blog, documentation, and social media channels.",
    type: "Freelance",
    location: "Remote",
    salary: { min: 30000, max: 60000, currency: "INR" },
    requirements: ["Excellent English writing", "Technical writing experience", "SEO knowledge"],
    responsibilities: ["Write blog posts", "Create documentation", "Social media content", "Edit and proofread"],
  },
];

// ── Seed ──────────────────────────────────────────────────────────────────────

async function seed() {
  await mongoose.connect(process.env.MONGODB_URL);
  console.log("Connected to DB");

  await Promise.all([
    User.deleteMany({}),
    SeekerProfile.deleteMany({}),
    RecruiterProfile.deleteMany({}),
    Company.deleteMany({}),
    Job.deleteMany({}),
    Application.deleteMany({}),
    Otp.deleteMany({}),
  ]);
  console.log("All collections cleared");

  // ── Admins ──
  for (const admin of admins) {
    const hashed = await bcrypt.hash(admin.password, 10);
    await User.create({ email: admin.email, password: hashed, role: "admin", isActive: true, isProfileComplete: true });
  }
  console.log("5 admin users created");

  // ── Recruiters + Companies + Jobs ──
  const createdCompanies = [];

  for (let i = 0; i < recruiters.length; i++) {
    const r = recruiters[i];
    const hashed = await bcrypt.hash(r.password, 10);

    const user = await User.create({
      email: r.email,
      password: hashed,
      role: "recruiter",
      isActive: true,
      isProfileComplete: true,
      roleProfile: "RecruiterProfile",
    });

    const recruiterProfile = await RecruiterProfile.create({
      user: user._id,
      designation: r.designation,
      roleInCompany: "Owner",
    });

    const company = await Company.create({
      ...r.company,
      owner: recruiterProfile._id,
      verificationStatus: "approved",
    });

    // Link recruiter profile to company
    recruiterProfile.company = company._id;
    await recruiterProfile.save();

    createdCompanies.push({ company, recruiterProfile });

    // Assign 3 jobs per company (round-robin from jobTemplates)
    const jobsForCompany = jobTemplates.slice(i * 3, i * 3 + 3);
    for (const jobData of jobsForCompany) {
      await Job.create({
        ...jobData,
        company: company._id,
        recruiter: recruiterProfile._id,
        status: "active",
      });
    }

    console.log(`Recruiter ${r.email} + company "${r.company.name}" + 3 jobs created`);
  }

  // ── Seeker ──
  const seekerHashed = await bcrypt.hash(seeker.password, 10);
  const seekerUser = await User.create({
    email: seeker.email,
    password: seekerHashed,
    role: "seeker",
    isActive: true,
    isProfileComplete: false,
    roleProfile: "SeekerProfile",
  });

  await SeekerProfile.create({
    user: seekerUser._id,
    basicInfo: seeker.basicInfo,
  });

  console.log(`Seeker ${seeker.email} created`);

  // ── Write credentials file ──
  const lines = [
    "CAREERHUB SEED CREDENTIALS",
    "==========================",
    "",
    "── ADMINS ──",
    ...admins.map((a, i) => `Admin ${i + 1}\n  Email:    ${a.email}\n  Password: ${a.password}`),
    "",
    "── RECRUITERS ──",
    ...recruiters.map((r, i) => `Recruiter ${i + 1}\n  Email:    ${r.email}\n  Password: ${r.password}\n  Company:  ${r.company.name}`),
    "",
    "── SEEKER ──",
    `Email:    ${seeker.email}\nPassword: ${seeker.password}`,
    "",
    "DO NOT COMMIT THIS FILE",
  ];

  fs.writeFileSync(path.join(__dirname, "admin-credentials.txt"), lines.join("\n"));
  console.log("Credentials written to admin-credentials.txt");

  await mongoose.disconnect();
  console.log("\nSeed complete. Summary:");
  console.log("  - 5 admins");
  console.log("  - 3 recruiters with approved companies");
  console.log("  - 9 active jobs (3 per company)");
  console.log("  - 1 seeker (profile incomplete — ready to fill in)");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
