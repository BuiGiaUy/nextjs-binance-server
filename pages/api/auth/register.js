require("dotenv").config();

const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

import User from "../../../models/User";

export default async function handler(req, res) {
  const { method } = req;
  const { email, password } = req.body;
if ( method === "POST" ) {
  
  // Simple validation
  if (!email || !password)
    return res
      .status(400)
      .json({ success: false, message: "Missing email and/or password" });

  try {
    // check for existing user
    const user = await User.findOne({ email });

    if (user)
      return res
        .status(400)
        .json({ success: false, message: "email already taken" });

    // All good
    const hashedPassword = await argon2.hash(password);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    // Return token
    const accessToken = jwt.sign(
      { userId: newUser._id },
      process.env.ACCESS_TOKEN_SECRET
    );

    res.json({
      success: true,
      message: " email created successfully",
      accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal sever error" });
  }
}
};

