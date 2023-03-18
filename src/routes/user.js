import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import dbConnect from "../config/mongodbConfig.js";
import { UserModel } from "../models/users.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  await dbConnect();
  const { username, password } = req.body;
  const user = await UserModel.findOne({ username });

  if (user) {
    return res.status(400).json({ message: "Username already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new UserModel({ username, password: hashedPassword });
  await newUser.save();

  res.json({ message: "User registered successfully" });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  await dbConnect();

  const user = await UserModel.findOne({ username });

  if (!user) {
    return res
      .status(400)
      .json({ message: "Username or password is incorrect" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res
      .status(400)
      .json({ message: "Username or password is incorrect" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWTKEY);

  res.json({ token, userID: user._id });
});

export { router as userRouter };


