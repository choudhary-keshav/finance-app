import mongoose, { Document, Schema } from "mongoose";
const bcrypt = require("bcryptjs");

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
    pic: string;
  transactions: Schema.Types.ObjectId;
}

const userSchema = new Schema<UserDocument>({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    pic: {
      type: String,
      required: true,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
  transactions: { type: Schema.Types.ObjectId, ref: "Transaction" },
});


userSchema.methods.matchPassword = async function (enteredPassword: any) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

export const UserModel = mongoose.model<UserDocument>("User", userSchema);
