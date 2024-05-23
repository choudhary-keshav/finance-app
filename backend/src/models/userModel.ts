import mongoose from 'mongoose';
const bcrypt = require('bcryptjs');

const userModel = new mongoose.Schema(
  {
    name: { type: 'String', required: true },
    email: { type: 'String', unique: true, required: true },
    password: { type: 'String', required: true },
    pic: {
      type: 'String',
      required: true,
      default:
        'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
    },
  },
  { timestamps: true },
);

userModel.methods.matchPassword = async function (enteredPassword: any) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userModel.pre('save', async function (next) {
  if (!this.isModified) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

export const User = mongoose.model('User', userModel);

