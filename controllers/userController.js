const { path } = require('../app')
const { findByEmail, createUser, getAllUser,userEdit ,userDelete} = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { config } = require('../config/dotenvConfig')

const cookieOpts = {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    path: '/',
    maxAge: 1000 * 60 * 60 * 24 * 7

}
//regisztracio
async function register(req, res) {
    try {
        const { username, psw, email } = req.body
        console.log(username, psw, email);

        if (!username || !psw || !email) {
            return res.status(400).json({ error: 'Minden mezőt ki kell tölteni!' })
        }

        const exist = await findByEmail(email)
        console.log(exist);
        if (exist) {
            return res.status(400).json({ error: 'Ez az email mar foglalt' })
        }


        const hash = await bcrypt.hash(psw, 10)
        console.log(hash);
        const { insertId } = await createUser(username, email, hash)
        console.log(insertId);
        return res.status(201).json({ message: 'Sikeres regisztráció', insertId })

    } catch (err) {
        return res.status(500).json({ error: 'Szerver hiba', err })
    }
}
//bejelentkezes
async function login(req, res) {
    try {
        const { email, psw } = req.body
        //console.log(email,body);
        if (!email || !psw) {
            return res.status(400).json({ error: 'Email és a jelszó kötelező' })
        }

        const userSQL = await findByEmail(email)

        if (!userSQL) {
            return res.status(401).json({ error: 'Hibás email!' })
        }

        const ok = await bcrypt.compare(psw, userSQL.psw)
        //onsole.log(ok)
        if (!ok) {
            return res.status(401).json({ error: 'Hibás jelszó' })
        }
        console.log(userSQL);
        const token = jwt.sign(
            { user_id: userSQL.user_id, email: userSQL.email, username: userSQL.user_name, role: userSQL.role },
            config.JWT_SECRET,
            { expiresIn: config.JWT_EXPIRES_IN }
        )
        console.log(token);
        res.cookie(config.COOKIE_NAME, token, cookieOpts)
        return res.status(200).json({ message: 'Sikeres bejelentkezés' })


    } catch (err) {
        return res.status(500).json({ error: 'Bejelentkezesi hiba', err })
    }
}

//teszt vegpont
async function whoAmI(req, res) {
    const { user_id, username, email, role } = req.user
    console.log(`req.user: ${req.user.username}`);
    
    try {
        return res.status(200).json({ user_id: user_id, username: username, email: email, role: role })
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'whoAmI szerver oldali hiba  ' })
    }
}
//kijelentkezes
async function logout(req, res) {
    return res.clearCookie(config.COOKIE_NAME, { path: '/' }).status(200).json({ message: 'Sikeres kilépés' })
}
//osszes user lekerese
async function allUser(req,res){
    try {
        const result=await getAllUser()

        return res.status(200).json(result)
    } catch (error) {
        return res.status(500).json({error:'összes user lekerese szerver oldali hiba!'})
    }
}

//user valtoztatasa
async function editUser(req,res){
    try {
        const { user_id } = req.params
        const { username, email, role } = req.body
        //console.log(user_id, username, email, role)

        const result = await userEdit(user_id, username, email, role)

        if (result.length === 0) {
            return res.status(404).json({ error: 'A felhasználó nem található' })
        }

        return res.status(201).json({ message: 'Sikeres módosítás' })
        
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: 'felhasználó módosítása server oldali hiba' })
    }
}

async function deleteUser(req, res) {
    try {
        const { user_id } = req.params
        //console.log(user_id)

        const result = await userDelete(user_id)

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'A felhasználó nem található' })
        }

        return res.status(200).json({ message: 'Sikeres törlés' })
        
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: 'felhasználó törlése server oldali hiba' })
    }
}

module.exports = { register, login, whoAmI, logout ,allUser,editUser,deleteUser}