const USER_MODEL = require('../models/user_model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// User Registration API
// Endpoint: http://localhost:4001/api/user/register
const user_registration = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const user_email = await USER_MODEL.findOne({ where: { email: email }, raw: true });
    if (user_email) {
      return res.status(400).json({
        success: false,
        message: "Email already exist"
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const user = await USER_MODEL.create({
      name: name,
      email: email,
      password: hashPassword,
      role: role,
    });

    return res.status(200).json({
      success: true,
      message: "User registered successfully",
      data: user
    });
  }
  catch (err) {
    res.status(500).json({
      success: false,
      message: err
    });
  }
};

//User Login API
// Endpoint: http://localhost:4001/api/user/login
const user_login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const user = await USER_MODEL.findOne({ where: { email: email }, raw: true });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Email does not exist"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Password is incorrect"
      });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: {
        token: token,
        user: user
      }
    });
  }
  catch (err) {
    res.status(500).json({
      success: false,
      message: err
    });
  }
};

//User or Admin Can Edit Profile
// Endpoint: http://localhost:4001/api/user/edit_profile
const edit_profile = async (req, res) => {
  try {
    const { name, newEmail, newPassword, oldEmail, oldPassword, role } = req.body;

    if (role) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to change role.",
      });
    }

    const user = await USER_MODEL.findOne({ where: { id: req.id }, raw: true });

    if (name && !newEmail && !newPassword && !oldEmail && !oldPassword) {
      await USER_MODEL.update(
        { name: name },
        {
          where: {
            id: req.id
          },
        });

      return res.status(200).json({
        success: true,
        message: "Name updated successfully",
      });
    }

    if ((newEmail || newPassword) && (!oldEmail || !oldPassword)) {
      return res.status(400).json({
        success: false,
        message: "Old email and old password are required to update email or password",
      });
    }

    if ((newEmail || newPassword) && oldEmail && oldPassword) {
      if (oldEmail !== user.email) {
        return res.status(400).json({
          success: false,
          message: "Old email is incorrect",
        });
      }

      const checkPassword = await bcrypt.compare(oldPassword, user.password);
      if (!checkPassword) {
        return res.status(400).json({
          success: false,
          message: "Old password is incorrect",
        });
      }

      const updatedFields = {};
      if (name) updatedFields.name = name;
      if (newEmail) updatedFields.email = newEmail;
      if (newPassword) updatedFields.password = await bcrypt.hash(newPassword, 10);

      await USER_MODEL.update(updatedFields, { where: { id: req.id } });

      return res.status(201).json({
        success: true,
        message: "Profile Updated.",
      });
    }

  }
  catch (err) {
    res.status(500).json({
      success: false,
      message: err
    });
  }
};

module.exports = { user_registration, user_login, edit_profile };