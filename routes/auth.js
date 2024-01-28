const authController = require("../controllers/auth");
const express = require('express');
const routes = express.Router();

routes.post("/signup" , authController.createUser)
.patch("/login" , authController.login)

exports.routes = routes;