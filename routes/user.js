const express = require('express');
const routes = express.Router();

const userControllers = require("../controllers/user");
const { isLogIn } = require('../middlewares/middlewares');

routes.get("/user:token" ,isLogIn, userControllers.getUser )
.patch('/cart/update/cart_cartDetails:id' ,isLogIn, userControllers.patchCartAndCartDetails )
.put('/cart/update/address_phone:id' ,isLogIn, userControllers.putCheckoutDetails)
.post('/cart/add_to_cart:id' ,isLogIn, userControllers.addProductToCart)
.delete('/cart/delete:id' ,isLogIn , userControllers.deleteCartProduct)
.delete('/cart/clear_cart:id' ,isLogIn ,userControllers.clearCart);

exports.routes = routes;
