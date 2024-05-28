const mongoose = require('mongoose');

const houseSchema = new mongoose.Schema({
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        require: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    nameOfOwner: {
        type: String,
        require: true
    },
    address: {
        type: String,
        require: true
    },
    apartmentType: {
        type: String,
        require: true
    },
    availability: {
        type: Boolean,
        default: false
    },
    agent: {
        type: String,
        require: true
    },
    houseAmount: {
        type: String,
        require: true
    }
    
}, { timestamps: true});

const House = mongoose.model('House', houseSchema);
module.exports = House;