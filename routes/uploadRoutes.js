const express=require('express')
const{getAllpictures, postPicture}=require('../controllers/cardImgController')

const upload=require('../middleware/uploadMiddleware')

const router=express.Router()


router.get('/getPicture',getAllpictures)
router.post('/postPicture/:card_id', upload.single('pic'), postPicture)

module.exports=router