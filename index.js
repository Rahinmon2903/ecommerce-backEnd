import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

//config dotenv
dotenv.config();

//config port
const port = process.env.PORT || 5000;

//create app
const app = express();

//middleware
app.use(express.json());
app.use(cors());


//routes
app.get("/", (req, res) => {
    res.status(200).send("Welcome to my API");
});


app.listen(port, () => {
  console.log("server started ");
});

