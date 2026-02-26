const express=require('express')
const cookieParser = require('cookie-parser')


const userRoutes=require('./routes/userRoutes')
const voteRoutes=require('./routes/voteRoutes')
const uploadRoutes=require('./routes/uploadRoutes')

const app=express()

app.use(express.json())
app.use(cookieParser())

app.use('/users/', userRoutes)
app.use('/api/votes', voteRoutes)
app.use('/api/',uploadRoutes)

module.exports=app