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
route.patch("/api/admins", changePassword);
route.post("/api/admins/forgotPassword", forgotPassword);
route.patch("/api/admins/change_password/:id/:token", restPassword);
route.use(authenticate);
route.put("/api/admins/:id", updateAdmin);
route.get("/api/admins",  adminPool);
route.delete("/api/admins/:username", deactivateAdmin);

module.exports = { route }