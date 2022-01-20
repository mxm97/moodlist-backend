//////// Dependencies ////////

// get .env variables
require("dotenv").config();

// pull the PORT & DATABASE_URL from .env and assign PORT a default value of 3001
const { PORT = 3001, DATABASE_URL } = process.env;

// import express
const express = require("express");

// create application object
const app = express();

// import mongoose
const mongoose = require("mongoose");

// import middleware
const cors = require("cors");
const morgan = require("morgan");

//////// Database Connection ////////

// establish connection
mongoose.connect(DATABASE_URL);

// connection events
mongoose.connection
    .on("open", () => console.log("App connected to MongoDB"))
    .on("close", () => console.log("App disconnected from MongoDB"))
    .on("error", (error) => console.log(error))

//////// Models ////////
const SongSchema = new mongoose.Schema({
    title: String,
    artist: String,
    url: String,
},
    {
        timestamps: true
    })

const Song = mongoose.model("Song", SongSchema);

const MoodSchema = new mongoose.Schema({
    name: String,
    background: String,
    songs: [SongSchema]
},
    {
        timestamps: true
    })

const Mood = mongoose.model("Mood", MoodSchema);

//////// Middleware ////////
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

//////// Routes ////////

// Test route
app.get("/", (req, res) => {
    res.send("Hello world");
});

// Index route
app.get("/moods", async (req, res) => {
    try {
        res.json(await Mood.find({})) // send all Moods
    } catch (error) {
        res.status(400).json(error) // send error
    }
});

// Mood Create route
app.post("/moods", async (req, res) => {
    try {
        res.json(await Mood.create(req.body)) // send all Moods
    } catch (error) {
        res.status(400).json.apply(error) // send error
    }
});

// Mood Delete route
app.delete("/moods/:id", async (req, res) => {
    try {
        res.json(await Mood.findByIdAndDelete(req.params.id))
    } catch (error) {
        res.status(400).json(error)
    }
});

// Mood Update route
app.put("/moods/:id", async (req, res) => {
    try {
        res.json(await Mood.findByIdAndUpdate(req.params.id, req.body, { new: true }))
    } catch (error) {
        res.status(400).json(error)
    }
});

//////// Listener ////////
app.listen(PORT, () => console.log(`App is listening on PORT ${PORT}`));