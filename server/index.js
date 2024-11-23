const path = require("node:path");
const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/connectDB");
const PORT = process.env.PORT || 3000;
const Comment = require("./model/Comment");
const app = express();

app.get("/", async (req, res) => {
  const result = await Comment.find().limit(25);
  res.send({ Comments: result });
});

// connect to db
connectDB();
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`Listening on https://${PORT}`);
  });
});
