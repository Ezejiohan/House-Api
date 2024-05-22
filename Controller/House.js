const House = require('../Models/House');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../Models/Admin');

const house = async (req, res) => {
    try {
        const admin = req.admin;
        const { propertyname,
        address,
        apartmentType,
        availability,
        agent,
        agentnumber } = req.body;

        const id = req.params.id;
        const housePost = await House.findOne({ id });
        if (housePost) {
            return res.status(403).json({
                message: 'House already exist'
            });
        }
        const newHouse = await House.create({ propertyname,
            address,
            apartmentType,
            availability,
            agent,
            agentnumber, admin: admin.id });
        res.status(201).json({
            status: 'Success',
            message: 'House created successfully',
            data: newHouse
        });
    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            message: error.message
        });
    }
};

const houseEdit = async (req, res) => {
    try {
        const { id }  = req.params;
        const house = await House.findById(id);
        if (!house) {
            return res.status(404).json({
                message: 'House not found'
            });
        }
        const admin = req.admin
        if (house.admin === true) {
            return res.status(403).json({
                message: 'Only who created the house post can edit it'
            });
        } else {
            const houseData = { 
                propertyname: req.body.propertyname,
                address: req.body.address,
                apartmentType: req.body.apartmentType,
                availability: req.body.availability,
                agent: req.body.agent,
                agentnumber: req.body.agentnumber
            }
            const editedHouse = await House.findByIdAndUpdate(id, houseData, { new: true});
            res.status(200).json({
                status: 'Success',
                message: 'House edited successfully',
                data: editedHouse
            });    
        }
    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            message: error.message
        });
    }
};

const housePool = async (req, res) => {
    try {
        const housePool = await House.find();
        res.status(200).json({
            status: 'Success',
            numbersOfHouse: housePool.length,
            data: housePool
        });
    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            message: error.message
        });
    }
};

const retrieveHouse = async (req, res) => {
    try {
        const id = req.params.id;
        const house = await House.findById(id);
        if (!house) {
            res.status(404).json({
                message: 'House not found'
            });
        } else {
            res.status(200).json({
                status: 'Success',
                message: 'House retrieved successfully',
                data: house
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            message: error.message
        });
    }
};

const deleteHouse = async (req, res) => {
    try {
        const id = req.params.id;
        const house = await House.findById(id);
        if (!house) {
            res.status(404).json({
                message: 'House not found'
            });
        }
        const admin = req.admin;
        if (house.admin === true) {
            return res.status(403).json({
                message: 'You are not authorised to delete this house'
            });
        } else {
            await House.deleteOne({ id: req.params.id });
            res.status(200).json({
                status: 'Success',
                message: 'House no longer exist'
            });
        }

    } catch (error) {
        res.status(500).json({
            stauts: 'Failed',
            message: error.message
        });
    }
};

module.exports = { 
    house, 
    houseEdit,
    housePool, 
    retrieveHouse, 
    deleteHouse 
}