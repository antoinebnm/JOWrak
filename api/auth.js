const express = require("express");
const auth = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSignCheck = require("../middlewares/jwtsigncheck");
const requireAuth = require("../middlewares/requireAuth");
const fetchData = require("../middlewares/fetchData");
require("dotenv").config();

// User registration
auth.post("/register", async (req, res) => {
  try {
    let user = await fetchData(
      req,
      "/api/users",
      {
        credentials: {
          Login: req.headers.login,
          Password: req.headers.password,
          DisplayName: req.headers.displayname,
        },
      },
      "POST",
      undefined
    );

    //userId => Payload res
    const OAuthToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    /**
     * Generate session id
     * Add data into session
     * Save session with data
     */
    req.session.regenerate(function (err) {
      if (err) next(err);

      // store user information in session, typically a user id
      req.session.user = {
        userId: user._id,
        OAuthToken: OAuthToken,
        displayName: user.displayName,
      };

      // save the session before redirection to ensure page
      // load does not happen before session is saved
      req.session.save(function (err) {
        if (err) return next(err);
        res.status(201).json({
          userInfo: req.session.user,
          message: "User registered successfully",
        });
      });
    });
  } catch (error) {
    console.error("Error in /register:", error.message);
    res.status(500).json({ error: "Registration failed" });
  }
});

// User login
auth.post("/login", async (req, res, next) => {
  try {
    // if user exist, check if token expired
    if (req?.session?.user?.OAuthToken) {
      const verifyToken = jwtSignCheck(req.session.user.OAuthToken, res);
      if (verifyToken) {
        // token not expired
        throw new Error("User already logged in!");
      }
      // else, continue with basic login
    }

    if (!req.headers.login || !req.headers.password) {
      throw new Error("No Authenticate Header");
    }
    const login = req.headers.login; // Retreive info on login
    const password = req.headers.password; // Retreive info on password

    // connect using login/password verification
    const user = await User.findOne({ "credentials.login": login });
    if (!user) {
      return res.status(401).json({
        error: "Authentication failed, invalid credentials.",
      });
    }
    const passwordMatch = await bcrypt.compare(
      password,
      user.credentials.password
    );
    if (!passwordMatch) {
      return res.status(401).json({
        error: "Authentication failed, invalid credentials.",
      });
    }

    //userId => Payload res
    const OAuthToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    /**
     * Generate session id
     * Add data into session
     * Save session with data
     */
    req.session.regenerate(function (err) {
      if (err) next(err);

      // store user information in session, typically a user id
      req.session.user = {
        userId: user._id,
        OAuthToken: OAuthToken,
        displayName: user.displayName,
      };

      // save the session before redirection to ensure page
      // load does not happen before session is saved
      req.session.save(function (err) {
        if (err) return next(err);
        res.status(200).json({ userInfo: req.session.user });
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User logout
auth.post("/logout", requireAuth, async (req, res) => {
  /**
   * Clear session data
   * Save cleared session
   * Regenerate session id
   */

  res.clearCookie("sid");
  req.session.destroy(function (err) {
    if (err) next(err);
    res.status(200).json(req.session);
  });
});

auth.post("/log", async (req, res) => {
  const getHeader = require("../middlewares/getHeader"); // sole call of getHeader -> should delete ?
  res.status(200).json({
    sessionId: req.session.id,
    session: req.session,
    cookies: getHeader(req, res),
  });
});

auth.post("/session", requireAuth, async (req, res) => {
  const user = req.session.user;
  res.status(200).json(user);
});

module.exports = auth;
