const { path } = require('../app')
const { findByEmail, createUser } = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { config } = require('../config/dotenvConfig')
const { deleteUserById } = require('../models/userModel')

async function deleteUser(req, res) {
    try {
        const {user_id} = req.params
        const result = await deleteUserById(user_id);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Felhasználó nem található'
            });
        }

        res.json({
            message: 'Felhasználó törölve'
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            message: 'Szerver hiba',
            error: err.message
        });
    }
}

module.exports = { deleteUser }