const express = require("express");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")
const validateToken = require("../validateToken")
const router = express.Router();

//user register
router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            res.status(400);
            throw new Error("All fields are mandatory");
        }
        const userAvailable = await User.findOne({ email });
        if (userAvailable) {
            res.status(400);
            throw new Error('Email already in use');
        }
        // Hash the password
        const hashedPass = await bcrypt.hash(password, 10);
        console.log("Hashed password:", hashedPass);
        // Create user
        const user = await User.create({
            username,
            email,
            password: hashedPass
        });
        console.log(`User created: ${user}`);
        if (user) {
            res.status(201).json({ _id: user.id, email: user.email });
        } else {
            res.status(400);
            throw new Error("Creating a user failed!");
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//user login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Please enter all fields" });
        }
        
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: "Invalid email/password" });
        }

        const accessToken = jwt.sign({
            user: {
                username: user.username,
                email: user.email,
                id: user.id
            }
        }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });

        res.status(200).json({ accessToken });
    } catch (error) {
        console.error("An error occurred:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//current user info
router.get("/current", validateToken, async (req, res) => {
    res.json(req.user)
});

module.exports = router;

