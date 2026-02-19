const db = require('../db/db')

async function findByEmail(email) {
    const sql = 'SELECT * FROM user WHERE email=?'
    const [result] = await db.query(sql, [email])

    return result[0] || null
}

async function createUser(username, email, hash) {
    const sql = 'INSERT INTO `user` (`user_id`, `user_name`, `email`, `psw`, `role`) VALUES (NULL, ?, ?, ?, "user")'

    const [result] = await db.query(sql, [username, email, hash])
    //console.log(result);
    return {insertId: result.insertId}

    
}

module.exports = { findByEmail, createUser }