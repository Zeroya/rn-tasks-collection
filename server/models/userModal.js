import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    userName: { type: String, required: true, unique: true },
    password: { type: String, required: false, minlength: 5 },
  },
  { timestamps: true }
);

const User = mongoose.model("rnuser", userSchema);

export default User;
