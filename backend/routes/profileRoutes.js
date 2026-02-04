const express = require("express");
const router = express.Router();

const { authRequired } = require("../utils/auth");
const {
  completeProfile,
  getMyProfile,
} = require("../controllers/profileController");

router.post("/complete", authRequired, completeProfile);
router.get("/me", authRequired, getMyProfile);

module.exports = router;
