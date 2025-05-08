const express = require('express');
const app = express.Router();
const authController = require('../controllers/authController');


app.post('/register', authController.register);
 app.post('/adminlogin', authController.login);
//  app.post('/userregister',authController.userRegister);
 app.post('/userlogin',authController.userLogin);
 app.post('/userData',authController.userData)

 app.post("/forgotPassword",authController.forgotPassword);
 app.post("/resetPassword",authController.resetPassword);
 // app.get('/reset-password/:id/:token', authController.getResetPassword);
// app.post('/reset-password/:id/:token', authController.postResetPassword);

module.exports = app;
