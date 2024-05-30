import { Request, Response } from 'express';
const asyncHandler = require('express-async-handler');
const { User } = require('../models/userModel');
const generateToken = require('../config/generateToken');

const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please Enter all the Feilds');
  }
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(409);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user),
    });
  } else {
    res.status(500);
    throw new Error('Could not create user');
  }
});

const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error('User Does Not Exist');
  }
  if (await user.matchPassword(password)) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user),
    });
  } else {
    res.status(401);
    throw new Error('Invalid Email Password Combination');
  }
});

const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const { updatedName, updatedEmail, updatedPassword } = req.query;
  const { email } = req.body.user.payload;

  if (!updatedName || !updatedEmail) {
    res.send('Name and email are necessary');
    return;
  }

  const user = await User.findOne({ email });
  console.log(user);

  if (!user) {
    res.status(404);
    throw new Error('User Not Found');
  }

  user.name = updatedName || user.name;
  user.email = updatedEmail || user.email;

  if (updatedPassword) {
    user.password = updatedPassword;
  }

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    isAdmin: updatedUser.isAdmin,
    pic: updatedUser.pic,
    token: generateToken(updatedUser),
  });
});

module.exports = { registerUser, loginUser, updateUser };
