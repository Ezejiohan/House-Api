const express = require('express');
const { user, 
    loginUser, 
    verify, 
    changePassword, 
    forgotPassword, 
    resetPassword 
} = require('../Controller/User');

const { userAuthenticate } = require('../middleware/userAuthenticate');

const userRoute = express.Router();
userRoute.get("/", (req, res) => {
    res.send('House Api')
});

userRoute.post("/api/users", user);
userRoute.post("/api/loginUser", loginUser);
userRoute.get("/api/users/:id", verify);
userRoute.patch("/api/users", userAuthenticate, changePassword);
userRoute.post("/api/users/forgotPassword", forgotPassword);
userRoute.patch("/api/users/change_password/:id/:token", resetPassword)
module.exports = { userRoute }