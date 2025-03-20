const jwt = require("jsonwebtoken");
require("dotenv").config();

/**
 *  Verify json web token signature
 * @param {String} OAuthToken OAuth token
 * @param {express.res} res (optional)
 * @returns
 */
var jwtSignCheck = (OAuthToken, res) => {
  try {
    jwt.verify(OAuthToken, process.env.JWT_SECRET); // Throw error if invalid token (mismatch or outdated)
    return true;
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

module.exports = jwtSignCheck;
