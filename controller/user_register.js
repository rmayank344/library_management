const USER_MODEL = require('../models/user_model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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

module.exports = {user_registration};