const mongoose = require('mongoose');
const adminSchema = new mongoose.Schema({
    fullname: {
        type: String,
        require: true
    },
    username: {
        type: String,
        require: true,
        unique: true
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
    phoneno: {
        type: Number,
        require: true
    },
    address: {
        type: String,
        require: true
    },
    verified: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

const Admin= mongoose.model('Admin', adminSchema);
module.exports = Admin;