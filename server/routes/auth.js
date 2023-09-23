const express = require('express');
const router = express.Router();
const User = require('../models/user')
const mongoose = require('mongoose');
const cookie = require('cookie')
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const { check, validationResult } = require("express-validator");

router.post('/register',
    [
        check('username', 'Username is required').not().isEmpty(),
        check('email', 'Invalid email').isEmail(),
        check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    ]
    , async (req, res) => {
        // Validate input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { username, email, password } = req.body;

        try {
            // Check if the user already exists
            let user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({ message: "User Already exists" })
            }

            // Create a new user
            user = new User({ username, email, password })

            // Hash the password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            
            // Create and return a JSON Web Token (JWT)
            const payload = {
                user: {
                    id: user._id,
                    name: user.username
                }
            };
            
            jwt.sign(payload, `process.env.JWT_SECRET`, { expiresIn: 3600 }, (err, token) => {
                if (err) throw err;
                res.cookie('token', token)
                res.json({ token })
            });
            
            // Save the user to the database
            await user.save();


        } catch (error) {
            res.status(500).json({ "error": "Internal server error" })
        }
    })

// User Login
router.post(
    '/login',
    [
        check('email', 'Invalid email').isEmail(),
        check('password', 'Password is required').exists(),
    ],
    async (req, res) => {
        // Validate input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            // Check if the user exists
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ msg: 'User does not exist' });
            }

            // Compare the provided password with the hashed password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ msg: 'Invalid credentials' });
            }

            // Create and return a JSON Web Token (JWT)
            const payload = {
                user: {
                    id: user._id,
                    name: user.username
                }
            };

            jwt.sign(
                payload,
                `process.env.JWT_SECRET`,
                { expiresIn: 3600 }, // Token expiration time (1 hour)
                (err, token) => {
                    if (err) throw err;
                    res.cookie('token', token)
                    res.json({ token });
                }
            )

        } catch (err) {
            res.status(500).send('Server Error');
        }
    }
);

// User Logout
router.post('/logout',(req,res)=>{
    try { 
        res.clearCookie("token")
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        res.status(500).json({message: "Internal Server error"})
    }
})

module.exports = router