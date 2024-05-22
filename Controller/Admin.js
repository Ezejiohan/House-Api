const Admin = require('../Models/Admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../utilies/nodemailer');

const admin = async (req, res) => {
    try {
        const saltPassword = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(req.body.password, saltPassword);

        const adminData = {
            fullname: req.body.fullname,
            username: req.body.username,
            email: req.body.email,
            phoneno: req.body.phoneno,
            address: req.body.address,
            password: hashPassword
        }
        const adminExist = await Admin.findOne({
            email: req.body.email
        });
        if (adminExist) {
            return res.status(403).json({
                message: 'Admin already exist'
            });
        } else {
            const newAdmin = await Admin.create(adminData)
            return res.status(200).json({
                status: "Success",
                message: "Admin created Successfully",
                data: newAdmin
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
        const admin = await Admin.findById(req.params.id);
        if (!admin) {
            return res.status(404).json({
                message: "Admin not found"
            });
        }
        if (admin.verified === true) {
            return res.status(400).json({
                message: "Admin already verified"
            });
        }
        admin.verified = true;
        await admin.save();
        res.status(200).json({
            message: "Admin verification complete",
            data: admin
        })
    } catch (error) {
        res.status(500).json({
            status: "Failed",
            message: error.message
        });
    }
};

const loginAdmin = async (req, res) => {
    try {
       const loginRequest = {
        email: req.body.email,
        password: req.body.password
       }
       const admin = await Admin.findOne({ email: req.body.email });
       if (!admin) {
        return res.status(403).json({
            message: "Admin not found"
        });
       } else {
            const correctPassword = await bcrypt.compare(loginRequest.password, admin.password)
            if (correctPassword == false) {
                return res.status(404).json({
                    message: "Incorrect email or password"
                });
            } else {
                const generatedToken = jwt.sign({
                    id: admin._id,
                    email: admin.email,
                    username: admin.username
                }, process.env.TOKEN, {expiresIn: "45 mins"});

                const result = {
                    id: admin._id,
                    email: admin.email,
                    username: admin.username,
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
        });
    }
};

const updateAdmin = async (req, res) => {
    try {
       const id = req.params.id;
       const admin = await Admin.findById(id);
       if (!admin) {
        return res.status(403).json({
            message: "Admin not found"
        });
       } 
       const adminData = {
        username: req.body.username,
        address: req.body.address
       };
       const updatedAdmin = await Admin.findByIdAndUpdate(id, adminData, { new: true });
       return res.status(200).json({
        message: "Admin updated successfully",
        data: updatedAdmin
       });
    } catch (error) {
        res.status(500).json({
            status: "Failed",
            message: error.message
        });
    }
};

const adminPool = async (req, res) => {
    try {
        const adminPool = await Admin.find();

        res.status(200).json({
            status: "Success",
            numberOfAdmins: adminPool.length,
            data: adminPool
        });
    } catch (error) {
        res.status(500).json({
            status: "Failed",
            message: error.message
        });
    }
};

const deactivateAdmin = async (req, res) => {
    try {
       const admin = await Admin.findOne({ username: req.params.username });
       if (!admin) {
        return res.status(403).json({
            message: "Admin not found"
        });
       } 
       await Admin.deleteOne({ username: req.params.username });
       return res.status(200).json({
        message: "Admin deleted Successful"
       });
    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            message: error.message
        });
    }
};

const changePassword = async (req, res) => {
    try {
       const { oldPassword, newPassword } = req.body;
       const admin = await Admin.findOne({ email: req.admin.email });
       
       const comparePassword = await bcrypt.compare(oldPassword, admin.password);
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
       admin.password = hashPassword;

       sendEmail({
        email: admin.email,
        subject: "Password change alert",
        message: "You have changed your password. If not you alert us"
       });
       const result = {
        fullname: admin.fullname,
        username: admin.username,
        email: admin.email
       }
       await admin.save();

       return res.status(200).json({
        message: "Password changed successful",
        data: result
       });

    } catch (error) {
        res.status(500).json({
            status:  'Failed',
            message: error.message
        });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const admin = await Admin.findOne({ email: req.body.email });
        if (!admin) {
            return res.status(404).json({
                message: 'Admin not found'
            });
        }
        const token = jwt.sign({
            id: admin.Id,
            email: admin.email
        }, process.env.TOKEN)

        const passwordChangeLink = `${req.protocol}://${req.get("host")}/api/admins/change_password/${admin._id}/${token}`;
        const message = `Click this link: ${passwordChangeLink} to set a new password`;

        sendEmail({
            email: admin.email,
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
};

const restPassword = async (req, res) => {
    try {
        const { newPassword, confirmPassword } = req.body;
        const admin = await Admin.findById(req.params.id);
        if (!admin) {
            return res.status(404).json({
                message: 'Admin not found'
            });
        }
        
        if (newPassword !== confirmPassword) {
            return res.status(403).json({
                message: 'There is a difference in both password'
            });
        }
        
        const saltPassword = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(newPassword, saltPassword);

        const updatePassword = await Admin.findByIdAndUpdate(req.params.id, {
            password: hashPassword
        });

        await admin.save();

        res.status(200).json({
            message: 'Password updated successfully',
            data: updatePassword
        });

    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};

module.exports = { admin, 
    verify, 
    loginAdmin, 
    adminPool, 
    updateAdmin, 
    deactivateAdmin, 
    changePassword, 
    forgotPassword, 
    restPassword 
}