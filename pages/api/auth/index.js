require("dotenv").config();

const User = require("../../../models/User");

// @route GET api/auth
// @desc Check if user is logged in
// @access Public

export default async function handler(req, res) {
    const { method } = req
    if (method === "GET") {
      try {
        const user = await User.findById(req.userId).select("-password");
        if (!user)
          return res
            .status(400)
            .json({ success: false, message: "User not found" });
        res.json({ success: true, user });
      } catch (error) {
        res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      }

  }
}
