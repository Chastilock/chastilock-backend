const express = require('express');
const router = express.Router();

//These are our DB models. They are exposed from models/index.js
const {} = require('../models');

function asyncHandler(cb){
    try {
        return async(req, res, next) => {
            await cb(req, res, next);
        }
    } catch(error) {
        throw error;
    }
}

//Episode Routes

/* router.get('/episodes', asyncHandler(async (req, res) => {

    const allEpisodes = await Episode.findAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] }
    });
    res.json(allEpisodes);
})); */

module.exports = router