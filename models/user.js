const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const { Schema } = mongoose;

const userSchema = new Schema({
  username: String,
  password: String,
  firstName: String,
  lastName: String,
  email: String,
  birthday: String,
  address: String,
  active: { type: Boolean, default: true },
  role: { type: String, default: "User" },
});

userSchema.methods.checkCorrectness = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  if (!this.salt) {
    const salt = await bcrypt.genSalt(10);

    this.salt = salt;
  }
  this.password = await bcrypt.hash(this.password, this.salt);

  next();
});

const User = mongoose.model("user", userSchema);

module.exports = User;
