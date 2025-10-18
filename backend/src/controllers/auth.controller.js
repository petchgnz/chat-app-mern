import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"

const authController = {
  signup: async (req, res) => {
    // destructure from body
    const { email, fullName, password } = req.body
    try {
      // check if there are empty field
      if (!email || !fullName || !password) return res.status(400).json({ message: "All fields are required" })

      // check if password is less than 6 characters
      if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" })
      }

      // find if it's already exists
      const user = await User.findOne({ email })
      if (user) return res.status(409).json({ message: "Email already exists" });

      // hashed password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Created new 
      const newUser = new User({
        email,
        fullName,
        password: hashedPassword
      })

      if (newUser) {
        //generated JWT token
        generateToken(newUser._id, res)
        await newUser.save()

        res.status(201).json({
          _id: newUser._id,
          fullName: newUser.fullName,
          email: newUser.email,
          profilePic: newUser.profilePic
        })
      }
    } catch (err) {
      console.log(`Error in signup controller: ${err}`)
      res.status(500).json({ message: "Internal Server Error" })
    }
  },
  login: async (req, res) => {
    const { email, password } = req.body
    try {
      const user = await User.findOne({ email })
      if (!user) {
        return res.status(404).json({ message: "Invalid credentials" })
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password)
      if (!isPasswordCorrect) {
        return res.status(404).json({ message: "Wrong password" })
      }

      generateToken(user._id, res)
      res.status(200).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic
      })

    } catch (err) {
      console.log("Error in login controller: ${err}")
      res.status(500).json({ message: "Internal Server Error" })
    }
  },
  logout: (req, res) => {
    try {
      res.cookie('jwt', '', { maxAge: 0 })
      res.status(200).json({ message: "Logged out successfully"})

    } catch (err) {
      console.log("Error in logout controller: ${err}")
      res.status(500).json({ message: "Internal Server Error" })
    }
  },
  updateProfile: (req, res) => {

  }
};

export default authController;