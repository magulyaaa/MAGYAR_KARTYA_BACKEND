const express=require('express')
const {register,login, whoAmI, logout}=require('../controllers/userController')
const {auth}=require('../middleware/userMiddleWare')
const {admin}=require('../middleware/adminMiddleware')
const {allUser,editUser}=require('../controllers/userController')

const router=express.Router()

router.post('/register',register)
router.post('/login', login)
router.get('/whoami',auth, whoAmI)
router.post('/logout', logout)
router.get('/getAllUser',auth, admin,allUser)
router.put('/admin/edit/:user_id', auth, admin, editUser)

module.exports=router