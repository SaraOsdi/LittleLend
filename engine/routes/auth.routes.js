const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { phone, password, userId } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      phone,
      password: hashedPassword,
      userId,
    });

    await user.save();
    res.json(true);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { userId, password } = req.body;
    const user = await User.findOne({ userId });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        {
          userId: user._id,
          userId: user.userId,
          role: user.role,
          phone: user.phone,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_TIME }
      );

      res.json({ token, userId: user._id });
    } else {
      res.status(401).send("userId or password is incorrect");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post("/reset", async (req, res) => {
  try {
    const { userId, password } = req.body;
    let user = await User.findOne({ userId });
    if (user) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      User.findByIdAndUpdate({ userId }, user, { new: true });
      res.json(true);
    } else {
      res.status(401).send("userId is incorrect");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/role", (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    res.json(decodedToken.role);
  } catch (error) {
    return res.status(401).json({
      message: "Authentication failed",
    });
  }
});

router.get("/details", (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    res.json(decodedToken);
  } catch (error) {
    return res.status(401).json({
      message: "Authentication failed",
    });
  }
});

module.exports = router;
