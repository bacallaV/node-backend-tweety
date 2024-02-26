// Express
const express = require("express");
const usersRouter = express.Router();

// Controllers
const { UserController } = require('../controllers/user');
// Middlewares
const { Auth } = require('../middlewares/auth');

usersRouter.get("/", Auth, UserController.findAll);
usersRouter.post("/", UserController.create);

usersRouter.post("/login", UserController.login);


module.exports = usersRouter