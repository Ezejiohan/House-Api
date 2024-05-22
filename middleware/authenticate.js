const jwt = require("jsonwebtoken");
const Admin = require("../Models/Admin");

const authenticate = async (req, res, next) => {
    try {
       const hasAuthorization = req.headers.authorization;
       if (!hasAuthorization) {
        return res.status(400).json({
            message: "Authorization token not found"
        });
       } 
       const token = hasAuthorization.split(' ')[1];
       const decodedToken = jwt.verify(token, process.env.TOKEN);

       const admin = await Admin.findById(decodedToken.id);
       if (!admin) {
        return res.status(404).json({
            message: "Authorization failed: Admin not found"
        })
       }
       req.admin = decodedToken;
       next();       
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.json({
                message: "Session Timeout"
            })
        }
        res.status(500).json({
            status: "Failed",
            message: error.message
        });
    }
};

module.exports = { authenticate } 