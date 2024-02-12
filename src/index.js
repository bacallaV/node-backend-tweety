const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// ENV
const dotenv = require('dotenv');
dotenv.config();
// My sequelize configuration
const sequelizeConfig = require('./config');
// Middlewares
const { Auth } = require('./middlewares/auth.middleware');
const { User } = require('./models');

// Environment variables
const PORT = process.env.PORT ?? 3001;

const app = express();
app.use(express.json());

app.post("/api/users", async (req, res) => {
  const newUser = req.body;
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
});

app.post("/api/users/login", async(req, res) => {
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
});

app.get("/api/users", Auth, async (req, res) => {
  const users = await User.findAll();

  return res.status(200).json({
    data: users,
  });
});


sequelizeConfig.sync({ alter: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running in port: ${PORT}`)
  })
})
