const registerService = require("../services/registerService.js");
const loginService = require("../services/loginService.js");
const resetPasswordService = require("../services/resetPasswordService.js");
const tokenService = require("../utils/tokenService");
const User = require("../models/user");
const { logAction } = require("../utils/auditLogger");

const COOKIE_OPTIONS = {
  httpOnly: true,
  path: "/",
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
};

exports.requestRegisterOtp = async (req, res, next) => {
  try {
    const result = await registerService.requestRegisterOtp(req.body.email);
    return res.status(200).json({ success: true, message: result });
  } catch (err) {
    next(err);
  }
};

exports.verifyRegisterOtp = async (req, res, next) => {
  try {
    const result = await registerService.verifyRegisterOtp(req.body.email, req.body.otp);
    return res.status(200).json({ success: true, message: result });
  } catch (err) {
    next(err);
  }
};

exports.register = async (req, res, next) => {
  try {
    const user = await registerService.register(req.body.email, req.body.password, req.body.role);
    const { accessToken, refreshToken } = tokenService.generateTokens(user);

    // Store refresh token
    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);

    await logAction({
      userId: user._id,
      action: "USER_REGISTERED",
      entityType: "Auth",
      entityId: user._id,
      details: { role: user.role },
      req,
    });

    return res.status(201).json({
      success: true,
      data: {
        accessToken,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          isProfileComplete: user.isProfileComplete,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const result = await loginService.login(req.body.email, req.body.password);

    res.cookie("refreshToken", result.refreshToken, COOKIE_OPTIONS);

    await logAction({
      userId: result.id,
      action: "USER_LOGIN",
      entityType: "Auth",
      entityId: result.id,
      req,
    });

    return res.status(200).json({
      success: true,
      data: {
        accessToken: result.accessToken,
        user: {
          id: result.id,
          email: result.email,
          role: result.role,
          isProfileComplete: result.isProfileComplete,
          profileImageUrl: result.profileImageUrl ?? null,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const result = await loginService.refreshToken(req.cookies.refreshToken);

    // Set the new rotated refresh token
    res.cookie("refreshToken", result.refreshToken, COOKIE_OPTIONS);

    return res.status(200).json({
      success: true,
      data: {
        accessToken: result.accessToken,
        user: {
          id: result.id,
          email: result.email,
          role: result.role,
          isProfileComplete: result.isProfileComplete,
          profileImageUrl: result.profileImageUrl ?? null,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (token) {
      const user = await User.findOne({ refreshToken: token });
      if (user) {
        await logAction({
          userId: user._id,
          action: "USER_LOGOUT",
          entityType: "Auth",
          entityId: user._id,
          req,
        });
        user.refreshToken = null;
        await user.save();
      }
    }

    res.clearCookie("refreshToken", COOKIE_OPTIONS);
    return res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
};

exports.requestResetOtp = async (req, res, next) => {
  try {
    const result = await resetPasswordService.requestResetOtp(req.body.email);
    return res.status(200).json({ success: true, message: result });
  } catch (err) {
    next(err);
  }
};

exports.verifyResetOtp = async (req, res, next) => {
  try {
    const result = await resetPasswordService.verifyResetOtp(req.body.email, req.body.otp);
    return res.status(200).json({ success: true, data: { resetToken: result } });
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const result = await resetPasswordService.resetPassword(
      req.body.email,
      req.body.newPassword,
      req.body.resetToken,
    );
    return res.status(200).json({ success: true, message: result });
  } catch (err) {
    next(err);
  }
};
