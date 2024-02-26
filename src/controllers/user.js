const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { User } = require('../models');

const UserController = {
  create: async (req, res) => {
    const newUser = req.body;

    const existingUser = await User.findOne({
      where: {
        email: newUser.email,
      }
    });
    if(existingUser) return res.status(400).json({
      message: 'Email already used'
    });

    // Crypting password
    newUser.password = await bcrypt.hash(newUser.password, 10);
    // Creating new user
    const user = await User.create(newUser)
  
    // Handling response
    if(user) return res.status(200).json({
      message: 'User created successfully'
    });
  
    res.status(500).json({
      message: 'Error while creating user'
    });
  },

  findAll: async (req, res) => {
    const users = await User.findAll();
  
    return res.status(200).json({
      data: users,
    });
  },

  login: async(req, res) => {
    const user = req.body;
    // Finding user by email
    const existingUser = await User.findOne({
      where: {
        email: user.email
      }
    });
    
    // If user email does not exist
    if (!existingUser) return res.status(404).json({
      message: 'Invalid credentials'
    });
  
    // Checking password coincidence
    const isValid = await bcrypt.compare(user.password, existingUser.password);
    if(!isValid) return res.status(404).json({
      message: 'Invalid credentials'
    });
  
    // Returning JWT if everything is OK
    return res.status(200).json({
      token: jwt.sign(
        {
          user: user.id
        },
        'my-key',
        {
          expiresIn: '1h'
        },
      ),
    });
  }
};

module.exports = {
  UserController
};
