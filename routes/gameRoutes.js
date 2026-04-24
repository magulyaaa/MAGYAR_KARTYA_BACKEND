const express = require("express");
const router = express.Router();

const gameController = require("../controllers/gameController");
const fajerController=require("../controllers/fajerController")

//21 jatek inditasa
router.post("/start", gameController.startGame);
router.post("/hit", gameController.hit);
router.post("/stand", gameController.stand);

//fajer jatek inditasa
router.post("/fajerStart", fajerController.fajerStart)
router.post("/player-swap", fajerController.playerMove)
router.post("/bot-swap", fajerController.botMove)
router.get("/result", fajerController.getResult)


module.exports = router;