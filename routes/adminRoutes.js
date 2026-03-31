const express = require("express");
const router = express.Router();
const {deleteUser}=require('../controllers/adminController');
const { admin } = require("../middleware/adminMiddleware");
const {auth}=require("../middleware/userMiddleWare")

router.delete("/users/:user_id",auth,admin, deleteUser)


module.exports = router;