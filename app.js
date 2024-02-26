const express = require('express');
// ENV
const dotenv = require('dotenv');
dotenv.config();
// My sequelize configuration
const sequelizeConfig = require('./src/config');
// Routes
const router = require('./src/routes');

// Environment variables
const PORT = process.env.PORT ?? 3001;

const app = express();
app.use(express.json());

app.use('/api', router);

sequelizeConfig.sync({ alter: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running in port: ${PORT}`)
  })
})
