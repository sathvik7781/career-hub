require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./utils/db");
const cookieParser = require("cookie-parser");
const { initGridFS } = require("./utils/gridFs");
const authRoutes = require("./routes/authRoutes");
const seekerRoutes = require("./routes/seekerRoutes.js");
const fileRoutes = require("./routes/fileRoutes.js");
const companyRoutes = require("./routes/companyRoutes.js");
const jobRoutes = require("./routes/jobRoutes.js");
const applicationRoutes = require("./routes/applicationRoutes.js");
const errorMiddleware = require("./middleware/errorMiddleware");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
connectDB();
initGridFS();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({ message: "CareerHub Backend is running" });
});
app.use("/api/auth", authRoutes);
app.use("/api", seekerRoutes);
app.use("/api", fileRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
