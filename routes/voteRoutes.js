const express=require('express')
const {vote, unvote, getVotes}=require('../controllers/voteController')
const {auth}=require('../middleware/userMiddleWare')

const router=express.Router()

router.post('/:game_id',auth,vote)
router.delete('/:game_id',auth,unvote)
router.get('/results',getVotes)

module.exports=router