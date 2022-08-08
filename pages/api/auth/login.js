require("dotenv").config();

const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

import User from "../../../models/User";

// @route POST api/auth/login
// @desc login user
//  @access Public
export default async function handler(req, res) {
  const { method } = req;
  const { email, password } = req.body;
  if (method === "POST") {
    // Simple validation
    if (!email || !password)
      return res
        .status(400)
        .json({ success: false, message: "Missing email or password" });

    try {
      // Check for existing user
      const user = await User.findOne({ email });
      if (!user)
        return res
          .status(400)
          .json({ success: false, message: "Invalid email or password" });

      // email found
      const passwordValid = await argon2.verify(user.password, password);
      if (!passwordValid)
        return res
          .status(400)
          .json({ success: false, message: "Invalid email or password" });

      // All good
      // Return token
      const accessToken = jwt.sign(
        { userId: user._id },
        process.env.ACCESS_TOKEN_SECRET
      );

      res.json({
        success: true,
        message: " User logged in successfully",
        accessToken,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Internal sever error" });
    }
  }
}
