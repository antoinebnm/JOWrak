/**
 * Variable Definition
 */
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const morgan = require("morgan");
const fs = require("fs");
const compression = require("compression");
const session = require("express-session");
const cors = require("cors");

require("dotenv").config();

const app = express();

/**
 * Middleware Setup
 */
app.use(compression()); // Compress all routes

app.use(morgan("dev")); // console log
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    name: "sid",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 72 * 60 * 60 * 1000, // 72 hours aka 3 days
      httpOnly: false,
      secure: false, // mettre à `true` en production si HTTPS est utilisé
    }, // miliseconds * seconds * minutes * hour
  })
);

// Set up rate limiter: max requests per windowMs
const RateLimit = require("express-rate-limit");
const limiter = RateLimit({
  windowMs: 1000, // 1 second
  max: 128,
});
// Apply rate limiter to all requests
app.use(limiter);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "../public/dist")));

// Catch-all handler to serve index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/dist", "index.html"));
});

const allowedOrigins = [
  "http://localhost:3000", // Local frontend
  "", // Production frontend
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/**
 *
 * TODO Create logger mw
 *
 */
// Set up a write stream for logging to a file
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "logs", "access.log"),
  { flags: "a" }
);

const latestLogStream = fs.createWriteStream(
  path.join(__dirname, "logs", "latest.log"),
  { flags: "w" }
);

// Use morgan middleware for HTTP request logging
app.use(morgan("common", { stream: accessLogStream }));
app.use(morgan("combined", { stream: latestLogStream }));

// Custom middleware for user activity logging
app.use((req, res, next) => {
  // Log user activity
  console.log(
    `[${new Date().toISOString()}] User '${req.session.user?.displayName}' accessed ${req.method} ${req.originalUrl}`
  );

  // Continue with the request processing
  next();
});

/**
 * Router Setup
 */
const router = require("./router/routes");
app.use("/", router);

app.disable("x-powered-by");
// Add helmet to the middleware chain.
const helmet = require("helmet");
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: false,
      directives: {
        defaultSrc: ["'self'"],
      },
    },
    strictTransportSecurity: {
      maxAge: 31536000,
    },
  })
);

const isAuthorized = require("./middlewares/isAuthorized");
const apiUsers = require("./api/users");
app.use("/api/users", isAuthorized, apiUsers);

const apiGames = require("./api/games");
app.use("/api/games", isAuthorized, apiGames);

const apiAuth = require("./api/auth");
app.use("/api/auth", apiAuth);

// DB connection
const connectDB = require("./middlewares/connectDB");
connectDB();

/**
 * Error Handler
 */

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  //res.send(`<h1>Error ${err.status} - ${err.message}</h1>`);
  res.sendFile("../public/static/notfound.html", { root: __dirname });
});

/**
 * Port Listen
 */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
