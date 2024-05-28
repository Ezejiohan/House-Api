const express = require("express");
const { house, houseEdit, housePool, retrieveHouse, deleteHouse } = require ("../Controller/House");
const { authenticate } = require('../middleware/authenticate');

const House = express.Router();
House.get("/", (req, res) => {
    res.send("HouseApi Database")
});

House.post("/api/houses", authenticate, house);
House.put('/api/houses/:id', authenticate, houseEdit);
House.get('/api/houses', authenticate, housePool);
House.get('/api/houses/:id', authenticate, retrieveHouse);
House.delete('/api/houses/:id', authenticate, deleteHouse);

module.exports = { House }