const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    username:{
        type: String,
        require: true,
        unique: true
    },
    phoneno: {
        type: String,
        require: true
    },
    verified: {
        type: Boolean,
        default: false
    }
}, {timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;