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
router.post("/swap", fajerController.swapCard)
router.post("/pass", fajerController.pass)
router.get("/state", fajerController.finishGame)


module.exports = router;