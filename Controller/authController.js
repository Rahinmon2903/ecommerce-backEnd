import User from "../Model/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendEmail from "../Utils/sendEmail.js";
import crypto from "crypto";


//Register
export const register = async (req, res) => {
  try {
    // getting the inputs
    const { name, email, password, role } = req.body;

    //finding whether user is already exist
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//login
export const login = async (req, res) => {
  try {
    //getting inputs
    const { email, password } = req.body;
    //finding user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }
    //generating token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//forget password



export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    // Always return same response
    if (!user) {
      return res.status(200).json({
        message: "If the email exists, a reset link has been sent",
      });
    }

    // Generate token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash token before saving
    user.resetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetTokenExpire = Date.now() + 15 * 60 * 1000;

    await user.save();

    //  SAFE URL BUILDING
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const htmlMessage = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6;">
    <h2>Password Reset</h2>
    <p>You requested a password reset.</p>
    <p>
      <a 
        href="${resetUrl}" 
        style="
          display: inline-block;
          padding: 10px 16px;
          background-color: #000;
          color: #fff;
          text-decoration: none;
          border-radius: 6px;
          font-weight: bold;
        "
      >
        Reset Password
      </a>
    </p>
    <p>This link will expire in <strong>15 minutes</strong>.</p>
    <p>If you did not request this, please ignore this email.</p>
  </div>
`;

    await sendEmail(
      user.email,
      "Reset Your Password",
      htmlMessage,
      true
    );




    return res.status(200).json({
      message: "If the email exists, a reset link has been sent",
    });

  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({
      message: "Error sending reset email",
    });
  }
};




//rest password
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    //taking the token from url and hashing it because while storing we hashed it
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    //checking if the token is valid and it is matching  and token is not expired
    const user = await User.findOne({
      resetToken: hashedToken,
      resetTokenExpire: { $gt: Date.now() }
    });
    //checking if the user exists
    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired reset link"
      });
    }
    //setting the new password
    user.password = await bcrypt.hash(password, 10);
    user.resetToken = null;
    user.resetTokenExpire = null;
    //saving
    await user.save();

    return res.status(200).json({
      message: "Password reset successfully"
    });

  } catch (error) {
    return res.status(500).json({ message: "Error resetting password" });
  }
};

