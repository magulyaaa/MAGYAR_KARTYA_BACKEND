const express = require("express");
const router = express.Router();

const gameController = require("../controllers/gameController");

// új játék indítása
router.post("/start", gameController.startGame);
router.post("/hit", gameController.hit);
router.post("/stand", gameController.stand);

module.exports = router;