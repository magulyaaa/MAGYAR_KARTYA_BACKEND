const express = require("express");
const router = express.Router();

const gameController = require("../controllers/gameController");

//21 jatek inditasa
router.post("/start", gameController.startGame);
router.post("/hit", gameController.hit);
router.post("/stand", gameController.stand);


module.exports = router;