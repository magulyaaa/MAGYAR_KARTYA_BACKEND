const express=require('express')
const {register,login, whoAmI, logout}=require('../controllers/userController')
const {auth}=require('../middleware/userMiddleWare')

const router=express.Router()

router.post('/register',register)
router.post('/login', login)
router.get('/whoami',auth, whoAmI)
router.post('/logout', logout)
router.get('/getAllUser',auth, admin,allUser)

module.exports=router