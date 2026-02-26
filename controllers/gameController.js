const deckService = require("../services/deckService");
let currentGame = null;

//jatek inditasa
async function startGame(req, res) {

  try {

    // pakli lekérése adatbázisból
    let deck = await deckService.createShuffledDeck();

    // lapok kiosztása
    const playerCards = [
      deckService.drawCard(deck)
    ];

    const dealerCards = [
      deckService.drawCard(deck)
    ];

    currentGame = {
        deck,
        playerCards,
        dealerCards
      };

    // pontszám
    res.json({
      message: "Játék elindult",
      playerCards,
      dealerCards,
      playerScore: deckService.calculateScore(playerCards),
      dealerScore: deckService.calculateScore(dealerCards)
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Hiba történt",
      error: error.message
    });

  }
}
//lapkeres
async function hit(req, res) {
    if (!currentGame) {
      return res.status(400).json({ message: "Nincs aktív játék" });
    }
  
    const newCard = deckService.drawCard(currentGame.deck);
    currentGame.playerCards.push(newCard);
  
    const playerScore = deckService.calculateScore(currentGame.playerCards);
  
    // ellenőrzés: bust
    let status = "continue"; // játék folytatódik
    let result = "Még húzhatsz lapot ha kérsz!";
  
    if (playerScore > 21) {
      status = "bust";
      result = "Player bust! Dealer nyert";
      // a játékot itt véget lehet vetni
      currentGame = null; 
    }
  
    res.json({
      newCard,
      playerCards: currentGame ? currentGame.playerCards : null,
      playerScore,
      status,
      result
    });
}
//a gép 17nél megáll
async function stand(req, res) {

    if (!currentGame) {
      return res.status(400).json({ message: "Nincs aktív játék" });
    }
  
    // Dealer húz 17-ig
    let dealerScore = deckService.calculateScore(currentGame.dealerCards);
  
    while (dealerScore < 17) {
      const newCard = deckService.drawCard(currentGame.deck);
      currentGame.dealerCards.push(newCard);
      dealerScore = deckService.calculateScore(currentGame.dealerCards);
    }
  
    const playerScore = deckService.calculateScore(currentGame.playerCards);
  
    // Eredmény meghatározása
    let result = "";
  
    if (playerScore > 21) {
      result = "Player bust! Dealer nyert";
    } else if (dealerScore > 21) {
      result = "Dealer bust! Player nyert";
    } else if (playerScore > dealerScore) {
      result = "Player nyert";
    } else if (playerScore < dealerScore) {
      result = "Dealer nyert";
    } else {
      result = "Döntetlen";
    }
  
    // JSON válasz
    res.json({
      playerCards: currentGame.playerCards,
      dealerCards: currentGame.dealerCards,
      playerScore,
      dealerScore,
      result
    });
  
    // Játék vége – memóriából törölheted, vagy hagyhatod statisztikának
    currentGame = null;
}
module.exports = {
  startGame,
  hit,
  stand,
};