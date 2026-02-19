const { path } = require('../app')
const { findByEmail, createUser } = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {config}=require('../config/dotenvConfig')

const cookieOpts = {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    path: '/',
    maxAge: 1000*60*60*24*7

}
//regisztracio
async function register(req, res) {
    try {
        const { username, psw, email } = req.body
        console.log(username,psw,email);

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

        const token=jwt.sign(
            {user_id:userSQL.user_id, email:userSQL.email, username:userSQL.username, role:userSQL.role},
            config.JWT_SECRET,
            {expiresIn:config.JWT_EXPIRES_IN}
        )
        //console.log(token);
        res.cookie(config.COOKIE_NAME, token, cookieOpts)
        return res.status(200).json({message: 'Sikeres bejelentkezés'})


    } catch (err) {
        return res.status(500).json({ error: 'Bejelentkezesi hiba', err })
    }
}

//teszt vegpont
async function whoAmI(req,res) {
    const{user_id,user_name,email,role}=req.user
    try {
        return res.status(200).json({user_id:user_id, username:user_name, email:email,role:role})
    } catch (err) {
        console.log(err);
        return res.status(500).json({error:'whoAmI szerver oldali hiba  '})
    }
}
//kijelentkezes
async function logout(req,res){
    return res.clearCookie(config.COOKIE_NAME, {path:'/'}).status(200).json({message: 'Sikeres kilépés'})
}

module.exports = { register, login , whoAmI, logout}