const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/connectDB");
const PORT = process.env.PORT || 3000;
const Comment = require("./model/Comment");
const { User, generateSlugsForUsers } = require("./model/User");
const app = express();

app.get("/", async (req, res) => {
  try {
    const result = await mongoose.connection.db.listCollections().toArray();
    // filter approach
    const collections = result.filter(
      (collection) =>
        collection.name === "users" || collection.name === "comments"
    );
    // const collections = result.map((collection) => collection.name);
    res.json(collections);
  } catch (error) {
    console.error("Error fetching collections: ", error);
    res.status(500).json({ message: "Error Fetching collections" });
  }
});
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
  const result = await User.findOne({ slug: req.params.slug });

  res.json({ users: result });
});
// connect to db
connectDB();
mongoose.connection.once("open", () => {
  // generate slugs after your connected
  generateSlugsForUsers();
  console.log("Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`Listening on https://${PORT}`);
  });
});
