const express = require("express");
const router = express.Router();

const { requestOtp, register } = require("../controllers/authController");

router.post("/request-otp", requestOtp);
router.post("/register", register);

module.exports = router;
