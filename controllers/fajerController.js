let game = {
    player: { hand: [] },
    bot: { hand: [] },
    table: [],
    deck: [],
    phase: "idle", // idle | playing | lastRound | finished
    turn: "player",
    result: null
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))

        const temp = array[i]
        array[i] = array[j]
        array[j] = temp
    }
    return array
}

function createDeck() {
    const suits = ["hearts", "diamonds", "clubs", "spades"]
    const values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"]

    const deck = []

    for (let suit of suits) {
        for (let value of values) {
            deck.push({
                suit: suit,
                value: value
            })
        }
    }

    return deck
}


async function fajerStart(req, res) {
    game.deck = await shuffle(createDeck())

    game.player.hand = game.deck.splice(0, 3)
    game.bot.hand = game.deck.splice(0, 3)
    game.table = game.deck.splice(0, 3)

    game.phase = "playing"
    game.turn = "player"

    res.json(game)
}

async function swapCard(req, res) {
    const { handIndex, tableIndex } = req.body

    const temp = game.player.hand[handIndex]
    game.player.hand[handIndex] = game.table[tableIndex]
    game.table[tableIndex] = temp

    res.json(game)
}

async function botMove() {
    const hi = Math.floor(Math.random() * 3)
    const ti = Math.floor(Math.random() * 3)

    const temp = game.bot.hand[hi]
    game.bot.hand[hi] = game.table[ti]
    game.table[ti] = temp
}

async function pass(req, res) {
    game.phase = "finished"
    finishGame()

    res.json(game)
}

async function finishGame() {
    const playerScore = evaluateHand(game.player.hand)
    const botScore = evaluateHand(game.bot.hand)

    if (playerScore > botScore) game.result = "player"
    else if (botScore > playerScore) game.result = "bot"
    else game.result = "draw"
}

module.exports = { fajerStart, swapCard, botMove, pass, finishGame }