const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const UserModel = require("./model/User");
const FeedbackModel = require("./model/Feedback");

dotenv.config();
const app = express();
app.use(express.json());

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.log("Failed to connect to MongoDb", err));

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI
    }),
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

app.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({ name, email, password: hashedPassword, role: "user" });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (user) {
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                req.session.user = { id: user._id, name: user.name, email: user.email, role: user.role };
                console.log("Session user:", req.session.user); // Debugging log
                res.json({ message: "Success", role: user.role });
            } else {
                res.status(401).json("Password does not match!");
            }
        } else {
            res.status(401).json("No Records Found");
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/user', (req, res) => {
    if (req.session.user) {
        res.json({ user: req.session.user });
    } else {
        res.status(401).json("Not Authenticated");
    }
});

app.post("/logout", (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                res.status(500).json("Failed to logout");
            } else {
                res.status(200).json("Logged out successfully");
            }
        });
    } else {
        res.status(400).json({ error: "No session found" });
    }
});

// Feedback functionality
app.post("/feedback", async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json("Not Authenticated");
        }

        const { rating, comment } = req.body;
        const feedback = new FeedbackModel({
            name: req.session.user.name,
            rating,
            comment
        });
        const savedFeedback = await feedback.save();
        res.status(201).json(savedFeedback);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/feedback", async (req, res) => {
    try {
        const feedbacks = await FeedbackModel.find();
        res.status(200).json(feedbacks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// New route for fetching all users (for admin)
app.get("/admin/users", async (req, res) => {
    try {
        if (req.session.user && req.session.user.role === "admin") {
            const users = await UserModel.find();
            res.status(200).json(users);
        } else {
            res.status(403).json("Access denied");
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// New route for fetching all feedback (for admin)
app.get("/admin/feedback", async (req, res) => {
    try {
        if (req.session.user && req.session.user.role === "admin") {
            const feedbacks = await FeedbackModel.find();
            res.status(200).json(feedbacks);
        } else {
            res.status(403).json("Access denied");
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/admin/users/:userId', async (req, res) => {
    const { userId } = req.params;  // Get user ID from the URL params
    const { role } = req.body;      // Get the new role from the request body
  
    try {
      // Check if the user exists
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Update the user's role
      user.role = role;
  
      // Save the updated user back to the database
      await user.save();
  
      // Return the updated user
      res.status(200).json({ message: "User role updated successfully", user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "There was an error updating the role" });
    }
  });
