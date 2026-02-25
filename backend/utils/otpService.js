const otpGenerator = require("otp-generator");
const Otp = require("../models/Otp");
const crypto = require("crypto");
const { sendOtpEmail } = require("./mail");
const AppError = require("../utils/appError");

exports.sendOtp = async (email, purpose) => {
  const otp = otpGenerator.generate(6, {
    digits: true,
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });

  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
  await Otp.findOneAndUpdate(
    { email, purpose },
    {
      otp: hashedOtp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      attempts: 0,
    },
    { upsert: true, new: true },
  );

  await sendOtpEmail(
    email,
    `Your OTP for ${purpose} is ${otp}. It expires in 5 minutes.`,
  );
};

exports.verifyOtp = async (email, otp, purpose) => {
  const record = await Otp.findOne({ email, purpose });

  if (!record) {
    throw new AppError("Invalid or expired OTP", 400);
  }

  if (record.expiresAt < new Date()) {
    await Otp.deleteMany({ email, purpose });
    throw new AppError("OTP expired", 400);
  }

  if (record.attempts >= 5) {
    await Otp.deleteMany({ email, purpose });
    throw new AppError("Too many attempts. Request new OTP.", 400);
  }

  const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

  if (record.otp !== hashedOtp) {
    await Otp.updateOne({ _id: record._id }, { $inc: { attempts: 1 } });
    throw new AppError("Invalid OTP", 400);
  }

  await Otp.deleteMany({ email, purpose });
};
