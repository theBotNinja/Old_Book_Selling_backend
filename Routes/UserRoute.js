const bcrypt = require("bcrypt");
const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const express = require('express')
const router = express.Router()
const { auth, isAdmin } = require("../middleware/authMiddleware")

router.get("/:id", auth, isAdmin, async (req, res) => {
    const users = await User.findById(req.params.id)
    res.send(users)
})
router.post("/signup", async (req, res) => {
    const { name, email, password, mobileNumber } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        mobileNumber,
        password: hashedPassword,
    });

    res.json({ message: "User registered" });
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    res.json({ token, user: { _id: user._id, name: user.name, email: user.email, mobileNumber: user.mobileNumber, role: user.role } });
});
module.exports = router