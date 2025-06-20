const USER_MODEL = require('../models/user_model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// User Registration API
const user_registration = async (req,res) => {
  try{
    const {name, email, password, role} = req.body;

    if(!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const user_email = await USER_MODEL.findOne({where:{email:email}, raw: true});
    if(user_email){
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
  catch(err){
    res.status(500).json({
      success: false,
      message: err
    });
  }
};

//User Login API
const user_login = async (req, res) => {
  try{
    const {email, password} = req.body;

    if(!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const user = await USER_MODEL.findOne({where:{email:email}, raw: true});
    if(!user){
      return res.status(400).json({
        success: false,
        message: "Email does not exist"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
      return res.status(400).json({
        success: false,
        message: "Password is incorrect"
      });
    }

    const token = jwt.sign({id: user.id}, process.env.JWT_SECRET_KEY, {expiresIn: '1d'});
    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: {
        token: token,
        user: user
      }
    });
  }
    catch(err){
    res.status(500).json({
      success: false,
      message: err
    });
  }
};

module.exports = {user_registration, user_login};