const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// MongoDB connection string
const MONGODB_URL = "mongodb+srv://sathvik:sathvik@cluster0.hnhqd4h.mongodb.net/careerhub?appName=Cluster0";

// User Schema (inline to avoid import issues)
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "recruiter", "seeker"], required: true },
    isProfileComplete: { type: Boolean, default: false },
    roleProfile: { type: String, enum: ["SeekerProfile", "RecruiterProfile"], default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

async function createAdmin() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URL);
    console.log("✅ Connected to MongoDB\n");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@careerhub.com" });

    if (existingAdmin) {
      console.log("⚠️  Admin user already exists!");
      console.log("📧 Email: admin@careerhub.com");
      console.log("🔑 Password: Admin@123");
      console.log("\n✨ You can login with these credentials now.");
      await mongoose.connection.close();
      process.exit(0);
    }

    // Create admin user
    console.log("🔐 Hashing password...");
    const hashedPassword = await bcrypt.hash("Admin@123", 10);
    
    console.log("👤 Creating admin user...");
    const admin = new User({
      email: "admin@careerhub.com",
      password: hashedPassword,
      role: "admin",
      isActive: true,
      isProfileComplete: true,
    });

    await admin.save();
    
    console.log("\n✅ Admin user created successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📧 Email:    admin@careerhub.com");
    console.log("🔑 Password: Admin@123");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("\n✨ You can now login at: http://localhost:5173/login");
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error creating admin:", error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
}

createAdmin();
