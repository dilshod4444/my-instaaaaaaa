const dotenv = require("dotenv");
const user = require("../modules/user");
const bcrypt = require("bcrypt");
const router = require("express").Router();
const jwt = require("jsonwebtoken");
dotenv.config();

router.get("/", (req, res) => {
    try {
        const users = user.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});

router.post("/signup", async (req, res) => {
    console.log(1);
    try {
        console.log(req.body);
        const { firstName, lastName, password, email, photo } = req.body;
        if (!(firstName && email && password))
            return res.status(400).json({ message: "Please fill all the fields" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new user({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            photo,
        });
        const savedUser = await newUser.save();

        const token = await jwt.sign(savedUser.toJSON(), process.env.JWT_SECRET_KEY);

        res.status(201).json({ message: "successfully signed up", user: savedUser, token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!(email && password)) return res.status(400).json({ message: "Please fill all the fields" });

        const item = await user.findOne({ email });

        if (!item) return res.status(404).json({ message: "User not found" });

        const validPassword = await bcrypt.compare(password, item.password);
        if (!validPassword) return res.status(403).json({ message: "Invalid password" });

        const token = await jwt.sign(item.toJSON(), process.env.JWT_SECRET_KEY);

        res.status(201).json({ message: "successfully logged in", user: item, token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router
    .route("/:id")
    .get(async (req, res) => {
        try {
            const item = await user.findById(req.params.id);
            res.json(item);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    })
    .patch(async (req, res) => {
        try {
            if (req.body.password) {
                const hashedPassword = await bcrypt.hash(req.body.password, 10);
                req.body.password = hashedPassword;
            }
            const item = await user.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                omitUndefined: true,
            });
            res.json({ message: "successfully updated", item });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    })
    .delete(async (req, res) => {
        try {
            const item = await user.findByIdAndDelete(req.params.id);
            res.json({ message: "successfully deleted", item });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

module.exports = router;
