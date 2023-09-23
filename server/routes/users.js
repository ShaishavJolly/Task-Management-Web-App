const express = require('express');
const router = express.Router();
const User = require("../models/user");
const auth = require('../middleware/auth');
const bcrypt = require("bcrypt")
const { check, validationResult } = require("express-validator");

router.get('/', auth, async (req, res) => {
    try {
        const userData = await User.findById({ _id: req.user.id })
        if (!userData) {
            throw new Error("failed to fetch user data")
        }
        res.status(200).json(userData)

    } catch (error) {
        res.status(500).json(error.message)
    }
})
router.put('/', auth,
    [
        check('username', 'Username is required').not().isEmpty(),
        check('email', 'Invalid email').isEmail(),
        check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    ]
    , async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const userData = req.body;
        try {
            // Hash the password
            const salt = await bcrypt.genSalt(10);
            userData.password = await bcrypt.hash(userData.password, salt);

            const updatedUser = await User.findOneAndUpdate(
                { _id: req.user.id },
                userData,
                { new: true }
            )

            if (!updatedUser) {
                res.status(404).json({ error: "User not found" })
            }
            res.status(200).json({ message: "User details updated succesfully", user: updatedUser })
        } catch (error) {
            res.status(500).json({ "error": "Internal Server error" })
        }
    })

module.exports = router