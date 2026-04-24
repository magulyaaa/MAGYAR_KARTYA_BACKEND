let game = {
    player: { hand: [] },
    bot: { hand: [] },
    table: [],
    deck: [],
    turn: "player",
    gameOver: false,
    result: null,
    playerScore: 0,
    botScore: 0
}

const valuePoints = {
    "also": 2,
    "felso": 3,
    "kiraly": 4,
    "asz": 11
}


function createDeck() {
    const suits = ["makk", "tok", "zold", "piros"]
    const values = ["also", "felso", "kiraly", "asz"]

    const deck = []

    for (let s of suits) {
        for (let v of values) {
            deck.push({
                suit: s,
                value: v,
                id: `${s}_${v}`
            })
        }
    }

    return deck
}

function shuffle(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
            ;[deck[i], deck[j]] = [deck[j], deck[i]]
    }
}
function fajerStart(req, res) {
    const deck = createDeck()
    shuffle(deck)

    game.deck = deck

    game.player.hand = deck.splice(0, 3)
    game.bot.hand = deck.splice(0, 3)
    game.table = deck.splice(0, 4)

    game.turn = "player"
    game.gameOver = false
    game.result = null

    console.log("GAME STARTED")

    return res.json(game)
}

function playerMove(req, res) {
    if (game.turn !== "player") {
        return res.json({ error: "Not player turn" })
    }

    const { handIndex, tableIndex } = req.body

    if (
        game.player.hand[handIndex] == null ||
        game.table[tableIndex] == null
    ) {
        return res.json({ error: "Invalid move" })
    }

    const temp = game.player.hand[handIndex]
    game.player.hand[handIndex] = game.table[tableIndex]
    game.table[tableIndex] = temp

    game.turn = "bot"

    res.json(game)
}

function botMove(req, res) {
    if (game.turn !== "bot") {
        return res.json({ error: "Not bot turn" })
    }

    if (!game.bot.hand.length || !game.table.length) {
        return res.json({ error: "Invalid state" })
    }

    const handIndex = Math.floor(Math.random() * game.bot.hand.length)
    const tableIndex = Math.floor(Math.random() * game.table.length)

    if (
        game.bot.hand[handIndex] == null ||
        game.table[tableIndex] == null
    ) {
        return res.json({ error: "Invalid card" })
    }

    const temp = game.bot.hand[handIndex]
    game.bot.hand[handIndex] = game.table[tableIndex]
    game.table[tableIndex] = temp

    game.turn = "player"

    res.json(game)
}
function getHandValue(hand) {
    let sum = 0
    let hasAce = false

    for (let card of hand) {
        if (!card) continue
        sum += valuePoints[card.value]
        if (card.value === "asz") hasAce = true
    }

    return { sum, hasAce }
}

function evaluateHand(hand) {
    const { sum, hasAce } = getHandValue(hand)

    const values = hand.map(c => c.value)
    const suits = hand.map(c => c.suit)

    const allSameSuit = suits.every(s => s === suits[0])
    const allSameValue = values.every(v => v === values[0])

    const aceCount = values.filter(v => v === "asz").length
    const tenValueCards = values.filter(v =>
        ["kiraly", "felso"].includes(v)
    ).length

    // 🔥 31 (fájer): ász + két 10-es értékű kártya azonos színből
    if (
        aceCount === 1 &&
        tenValueCards === 2 &&
        allSameSuit
    ) {
        return { score: 31, type: "faier" }
    }

    // 🔥 3 ász
    if (aceCount === 3) {
        return { score: 33, type: "three_aces" }
    }

    // 🔥 2 ász
    if (aceCount === 2) {
        return { score: 22, type: "two_aces" }
    }

    // 🔥 3 egyforma figura
    if (allSameValue) {
        return { score: 30 + sum, type: "three_of_kind" }
    }

    // 🔥 3 azonos szín
    if (allSameSuit) {
        return { score: sum, type: "same_suit" }
    }

    // default
    return { score: sum, type: "normal" }
}

function getResult(req, res) {
    const player = evaluateHand(game.player.hand)
    const bot = evaluateHand(game.bot.hand)

    let result = "draw"

    if (player.score > bot.score) {
        result = "player wins"
    } else if (bot.score > player.score) {
        result = "bot wins"
    } else {
        // 🔥 döntetlen esetén erősebb lapok
        result = "draw (compare cards)"
    }

    game.result = result

    res.json({
        player: {
            hand: game.player.hand,
            evaluation: player
        },
        bot: {
            hand: game.bot.hand,
            evaluation: bot
        },
        result
    })
}

module.exports = { fajerStart, playerMove, botMove,getResult }