const jwt = require("jsonwebtoken");
const logger = require("../config/loggerApi.js");

verifyToken = (req, res, next) => {
  try {
    let token = req.headers["authorization"];
    if (token && token.startsWith("Bearer ")) {
      token = token.slice(7); // removes "Bearer " (including the space)
    }

    if (!token) {
      return res.status(403).send({
        message: "No token provided!",
      });
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).send({
          message: "Unauthorized!",
        });
      }
      req.userId = decoded.id;
      next();
    });
  } catch (error) {
    logger.error("Error in authJwt - verifyToken:", error);
  }
};

const authJwt = {
  verifyToken: verifyToken,
};

module.exports = authJwt;
