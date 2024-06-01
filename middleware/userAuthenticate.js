const jwt = require('jsonwebtoken');
const User = require('../Models/User');

const userAuthenticate = async (req, res, next) => {
    try {
        const hasAuthorization = req.headers.authorization;
        if (!hasAuthorization) {
            return res.status(400).json({
                message: "Authorization token not found"
            });
        }
        const token = hasAuthorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.TOKEN);

        const user = await User.findById(decodedToken.id);
        if (!user) {
            return res.status(404).json({
                message: "Authorization failed: User not found"
            }); 
         }
         req.user = decodedToken;
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.json({
                message: "Session Timeout"
            });
        }
        res.status(500).json({
            status: "Failed",
            message: error.message
        });
    }
};

module.exports = { userAuthenticate }