const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");

let gridfsBucket;

const initGridFS = () => {
  const conn = mongoose.connection;

  conn.once("open", () => {
    gridfsBucket = new GridFSBucket(conn.db, {
      bucketName: "uploads",
    });
    console.log("GridFS bucket initialized");
  });
};

const getGridFSBucket = () => {
  if (!gridfsBucket) {
    throw new Error("GridFSBucket not initialized");
  }
  return gridfsBucket;
};

module.exports = { initGridFS, getGridFSBucket };
