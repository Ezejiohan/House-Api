const User = require("../Models/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const user = async (req, res) => {
    try {
        const saltPassword = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(req.body.password, saltPassword);

        const userData = {
           fullname: req.body.password,
           email: req.body.email,
           username: req.body.username,
           phoneno: req.body.phoneno,
           password: hashPassword            
        }
        const userExist = await User.findOne({email: req.body.password});
        if (userExist) {
            return res.status(404).json({
               message: "User already Exist" 
            });
        } else {
            const newUser = await User.create(userData);
            return res.status(200).json({
                status: 'Success',
                message: 'User created Successfully',
                data: newUser
            });
        }
        
    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            message: error.message
        });
    }
};

const verify = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(403).json({
                message: "User not found"
            });
        }
        if (user.verified === true) {
            return res.status(400).json({
                message: "User already verified"
            });
        }
        user.verified = true;
        await user.save();
        res.status(200).json({
            message: "User verification complete",
            data: user
        });
    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            message: error.message
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const loginRequest = {
            email: req.body.email,
            password: req.body.password
        }
        const user = await User.findOne({email: req.body.email});
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        } else {
           const correctPassword = await bcrypt.compare(loginRequest.password, user.password);
           if (correctPassword == false) {
            return res.status(404).json({
                message: "Incorrect password or email"
            });
           } else {
                const generatedToken = jwt.sign({
                    id: user._id,
                    email: user.email,
                    username: user.username
                }, secretKey, {expiresIn: "45 mins"});

                const result = {
                    id: user._id,
                    email: user.email,
                    username: user.username,
                    token: generatedToken
                }                
                return res.status(200).json({
                    message: "Login Successful",
                    data: result
                });
           }
        }
    } catch (error) {
       res.status(500).json({
        status: 'Failed',
        message: error.message
       }) 
    }
};

const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await User.findOne({ email: req.user.email });
       
        const comparePassword = await bcrypt.compare(oldPassword, user.password);
        if (comparePassword !== true) {
         return res.status(404).json({
             message: 'Password Incorrect'
         });
        }
        const saltPassword = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(newPassword, saltPassword);
 
        if (newPassword === oldPassword) {
         return res.status(404).json({
             message: "Unauthorized"
         });
        }
        user.password = hashPassword;
 
        sendEmail({
         email: user.email,
         subject: "Password change alert",
         message: "You have changed your password. If not you alert us"
        });
        const result = {
         fullname: user.fullname,
         username: user.username,
         email: user.email
        }
        await user.save();
 
        return res.status(200).json({
         message: "Password changed successful",
         data: result
        });
    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            message: error.message
           });  
    }
};

const forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }
        const token = jwt.sign({
            id: user._id,
            email: user.email
        }, secretKey)

        const passwordChangeLink = `${req.protocol}://${req.get("host")}/api/user/change_password/${user._id}/${token}`;
        const message = `Click this link: ${passwordChangeLink} to set a new password`;

        sendEmail({
            email: user.email,
            subject: 'Forget password link',
            message: message
        });

        res.status(200).json({
            message: "Email has sent"
        });
    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            message: error.message
           });  
    }
}
module.exports = { user, verify, loginUser, changePassword, forgotPassword }