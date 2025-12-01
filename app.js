/**
 * Entry point for node application.
 * Runs the Express web server on 8080 PORT
 * Interacts with routes directory.
 */
const express = require("express");
const app = express();
require("dotenv/config");
const logger = require("./config/loggerApi");
const cors = require("cors");


logger.silly("enter to server");

const corsOpts = {
  origin: "*",
  methods: ["GET", "POST", "PUT"],
  allowedHeaders: [
    "Accept",
    "Content-Type",
    "Authorization",
    "X-Requested-With",
  ],
};

// Body parser middleware
app.use(cors(corsOpts));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text());

// Import routes

const claimsSubmissionRoute=require("./v1/routes/claimsSubmissionRoute.js");
// Routes

app.use("/api/v1/claimsSubmission",claimsSubmissionRoute);

//port
const PORT = process.env.PORT;

//server
app.listen(PORT, (error) => {
  if (!error) {
    console.log(
      "Server is Successfully Running,and App is listening on port " + PORT
    );
  } else {
    console.log("Error occurred, server can't start", error);
  }
});

module.exports = app;
