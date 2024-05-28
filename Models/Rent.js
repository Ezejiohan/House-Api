const mongoose = require("mongoose");
const rentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    house: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'House',
        require: true
    },
    {
        rentedStatus: {
            type: Boolean,
            default: false
        }
    }
    ],

}, { timestamps: true });

const Rent = mongoose.model('Rent', rentSchema);
module.exports = Rent;