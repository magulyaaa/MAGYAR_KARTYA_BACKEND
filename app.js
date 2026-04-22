const express = require('express')
const cookieParser = require('cookie-parser')
const cors=require('cors')
const path = require('path')


const userRoutes = require('./routes/userRoutes')
const voteRoutes = require('./routes/voteRoutes')
const uploadRoutes = require('./routes/uploadRoutes')
const gameRoutes = require("./routes/gameRoutes")
const adminRoutes=require("./routes/adminRoutes")

const app=express()

app.use('/card_img', express.static(path.join(__dirname, 'card_img')))

app.use(express.json())
app.use(cookieParser())

app.use(cors({
    origin:['http://localhost:5173','https://magyarkartya.netlify.app'],
    credentials: true
}))

app.use('/users', userRoutes)
app.use('/api/votes', voteRoutes)
app.use('/api', uploadRoutes)
app.use('/api/game', gameRoutes)
app.use('/api/deleteUser',adminRoutes)

module.exports = app