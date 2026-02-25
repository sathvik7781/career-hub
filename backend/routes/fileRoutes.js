const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { getGridFSBucket } = require("../utils/gridFs");

router.get("/files/:id", async (req, res) => {
  try {
    const bucket = getGridFSBucket();
    const fileId = new mongoose.Types.ObjectId(req.params.id);

    const downloadStream = bucket.openDownloadStream(fileId);

    downloadStream.on("error", () => {
      return res.status(404).json({ message: "File not found" });
    });

    downloadStream.pipe(res);
  } catch (err) {
    res.status(500).json({ message: "File retrieval failed" });
  }
});

module.exports = router;
