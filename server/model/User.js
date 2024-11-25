const mongoose = require("mongoose");
const slugify = require("slugify");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
});

userSchema.pre("save", function (next) {
  if (!this.user) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});
const User = mongoose.model("User", userSchema);

// generate slug
async function generateSlugsForUsers() {
  try {
    const users = await User.find({ slug: { $exists: false } });
    for (const user of users) {
      user.slug = slugify(user.name, { lower: true });
      await user.save();
      console.log(`Generated slug for user: ${user.name} -> ${user.slug}`);
    }
  } catch (error) {
    console.error("Error generating slugs", error);
  }
}

module.exports = { User, generateSlugsForUsers };
