import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";
const usersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A user must have a name"],
    maxlength: [20, "a user name must be less or equal to 40 charecters"],
    minlength: [3, "a user name must be more or equal to 10 charecters"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "A user must have an Email ID"],
    unique: [true, "this email id is already registerd"],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    minlength: [8, "password can not be less than 8 charecter"],
    maxlength: [30, "password can not be more than 30 charecter"],
    required: [true, "please Enter a valid passowrd"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "please Confirm your password"],

    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not equal",
    },
    select: false,
  },
  role: {
    type: String,
    enum: ["admin", "user", "employee"],
    default: "user",
  },
  active: { type: Boolean, select: false, default: true },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});
usersSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

usersSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) {
    return next();
  }
  this.passwordChangedAt = Date.now() - 1000;
  next();
});
usersSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});
usersSchema.methods.correctPassword = async function (
  loginPassword,
  userPassword,
) {
  return await bcrypt.compare(loginPassword, userPassword);
};
usersSchema.methods.changedPasswordAfter = function (jwtTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    return jwtTimeStamp < changedTimeStamp;
  }

  return false;
};
usersSchema.methods.createResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model("User", usersSchema);

export default User;
