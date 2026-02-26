const db = require("../db/db");


//Lekéri az összes kártyát az adatbázisból
async function getDeckFromDatabase() {
  try {
    const result = await db.query('SELECT card_name, card_value, card_img FROM `cards` INNER JOIN huszonegy_card ON cards.card_id=huszonegy_card.card_id WHERE 1');
    return result[0];
  } catch (error) {
    console.error("Hiba a pakli lekérésénél:", error);
    throw error;
  }
}


// Pakli keverés
function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[randomIndex]] =
      [deck[randomIndex], deck[i]];
  }
  return deck;
}


// Visszaad egy teljesen kész, kevert paklit

async function createShuffledDeck() {
  const deckFromDb = await getDeckFromDatabase();
  return shuffleDeck(deckFromDb);
}


//Kártya húzás

function drawCard(deck) {
  return deck.pop();
}


//Pontszám számítás

function calculateScore(cards) {
  let total = 0;
  let aceCount = 0;

  for (let card of cards) {
    total += card.card_value;

    if (card.card_value === "ász") {
      aceCount++;
    }
  }
  return total;
}

module.exports = {
  createShuffledDeck,
  drawCard,
  calculateScore
};