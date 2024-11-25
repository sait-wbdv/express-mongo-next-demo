const express = require("express");
const mongoose = require("mongoose");
const slugify = require("slugify");
const connectDB = require("./config/connectDB");
const PORT = process.env.PORT || 3000;
const Comment = require("./model/Comment");
const { User, generateSlugsForUsers } = require("./model/User");
const app = express();

generateSlugsForUsers();

app.get("/comments", async (req, res) => {
  const result = await Comment.find().limit(25);
  res.send({ comments: result });
});

app.get("/comments/:id", async (req, res) => {
  try {
    const result = await Comment.findOne({ _id: req.params.id });
    if (!result) {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.json({ comment: result });
  } catch (error) {
    console.error("Error", error);
  }
});

app.get("/users", async (req, res) => {
  const result = await User.find().limit(25);
  res.json({ users: result });
});

app.get("/users/user/:slug", async (req, res) => {
  const result = await User.findOne();

  res.json({ users: result });
});
// connect to db
connectDB();
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`Listening on https://${PORT}`);
  });
});
