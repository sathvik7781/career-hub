const registerService = require("../services/registerService.js");
const loginService = require("../services/loginService.js");
const resetPasswordService = require("../services/resetPasswordService.js");

exports.requestRegisterOtp = async (req, res, next) => {
  try {
    const result = await registerService.requestRegisterOtp(req.body.email);
    return res.status(200).json({ message: result });
  } catch (err) {
    next(err);
  }
};

exports.verifyRegisterOtp = async (req, res, next) => {
  try {
    const result = await registerService.verifyRegisterOtp(
      req.body.email,
      req.body.otp,
    );
    return res.status(200).json({ message: result });
  } catch (err) {
    next(err);
  }
};

exports.register = async (req, res, next) => {
  try {
    const result = await registerService.register(
      req.body.email,
      req.body.password,
      req.body.role,
    );
    return res.status(201).json({ message: result });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const result = await loginService.login(req.body.email, req.body.password);
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      path: "/",
      secure: false,
      sameSite: "lax",
    });
    return res.status(200).json({
      token: result.accessToken,
      role: result.role,
      id: result.id,
      isProfileComplete: result.isProfileComplete,
    });
  } catch (err) {
    next(err);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const result = await loginService.refreshToken(req.cookies.refreshToken);
    return res.status(200).json({
      token: result.accessToken,
      role: result.role,
      id: result.id,
      isProfileComplete: result.isProfileComplete,
    });
  } catch (err) {
    next(err);
  }
};

exports.logout = (req, res, next) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      path: "/",
      secure: false,
      sameSite: "lax",
    });

    return res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (err) {
    next(err);
  }
};

exports.requestResetOtp = async (req, res, next) => {
  try {
    const result = await resetPasswordService.requestResetOtp(req.body.email);
    return res.status(200).json({ message: result });
  } catch (err) {
    next(err);
  }
};

exports.verifyResetOtp = async (req, res, next) => {
  try {
    const result = await resetPasswordService.verifyResetOtp(
      req.body.email,
      req.body.otp,
    );
    return res.status(200).json({ message: result });
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
    return res.status(200).json({ message: result });
  } catch (err) {
    next(err);
  }
};
