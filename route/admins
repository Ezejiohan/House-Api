const express = require('express');
const {
    admin,
    verify, 
    updateAdmin, 
    adminPool, 
    deactivateAdmin, 
    loginAdmin,
    changePassword,
    forgotPassword,
    restPassword
} = require("../Controller/Admin");
const { authenticate } = require("../middleware/authenticate")

const route = express.Router();
route.get("/", (req, res) => {
    res.send("House Api")
});

route.post("/api/admins", admin);
route.post("/api/loginadmins", loginAdmin);
route.get("/api/admins/:id", verify);
route.put("/api/admins/:id", authenticate, updateAdmin);
route.get("/api/admins", authenticate, adminPool);
route.delete("/api/admins/:username", authenticate, deactivateAdmin);
route.patch("/api/admins", authenticate, changePassword);
route.post("/api/admins/forgotPassword", forgotPassword);
route.patch("/api/admins/change_password/:id/:token", restPassword)

module.exports = { route }