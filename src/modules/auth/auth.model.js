import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: string,
      trim: true,
      minlength: 2,
      maxlength: 50,
      required: [true, "Name is required!"],
    },
    email: {
      type: string,
      trim: true,
      required: [true, "Email is required!"],
      unique: true,
      select: false,
      lowercase: true
    },
    password: {
      type: string,
      trim: true,
      minlength: 8,
      required: [true, "Password is required!"],
    },
    role: {
      type: string,
      enum: ["custom", "seller", "admin"],
      default: "customer",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationtoken: {
      type: string,
      select: false,
    },
    refreshtoken: {
      type: string,
      select: false,
    },
    resetpasswordtoken: {
      type: string,
      select: false,
    },
    resetpasswordexpire: {
      type: Date,
      select: false,
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);
export default User;
