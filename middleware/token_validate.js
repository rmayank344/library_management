const jwt = require("jsonwebtoken");

const token_validate = async (req, res, next) => {
  try {
    const auth_token = req.header('x-auth-key');

    if (!auth_token) {
      return res.status(400).json({
        success: false,
        message: "Token not found"
      });
    }

    let verified_auth_token;

    try {
      verified_auth_token = jwt.verify(auth_token, process.env.JWT_SECRET_KEY);
    }
    catch (err) {
      return res.status(401).json({
        success: false,
        message: "Token is invalid or expired",
      });
    }

    req.id = verified_auth_token.id;
    req.role = verified_auth_token.role;
    next();
  }
  catch (err) {
    res.status(500).json({
      success: false,
      message: err
    });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    if (req.role !== 'admin') {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next();
  }
  catch (err) {
    res.status(500).json({
      success: false,
      message: err
    });
  }
};

module.exports = { token_validate, isAdmin };