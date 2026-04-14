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

async function deleteUserById(user_id) {
    const sql = 'DELETE FROM user WHERE user_id = ?';
    const [result] = await db.query(sql, [user_id]);
  
    return result;
}

async function getAllUser(){
    const sql='SELECT * FROM user'
    const [result]=await db.query(sql)
  
    return result
}

async function userEdit(user_id, username, email, role) {
    const sql = 'UPDATE user SET user_name = ?, email = ?, role = ? WHERE user_id = ?'
    const [result] = await db.query(sql, [username, email, role, user_id])
    
    return result
}

async function userDelete(user_id) {
    const sql = 'DELETE FROM user WHERE user_id = ?'
    const [result] = await db.query(sql, [user_id])

    return result
}

module.exports = { findByEmail, createUser,deleteUserById,getAllUser,userEdit,userDelete }