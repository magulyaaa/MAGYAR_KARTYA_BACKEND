//gyakorlatilag létrehoz egy új játékot
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

//a kártyák értékeinek a meghatározására szolgál,hiszen minden játékban
//más-más a lapok értéke(value)-ja
const valuePoints = {
    "also": 2,
    "felso": 3,
    "kiraly": 4,
    "asz": 11
}

//létrehoz egy paklit az összes kártya felhasználásával
function createDeck() {
    const suits = ["makk", "tok", "zold", "piros"]
    const values = ["also", "felso", "kiraly", "asz"]

    const deck = []
//vegigmegy az összes szinen és értéken majd összerakja a kártyákat mindet
//egyedi azonositoval ellátva
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

//random megkeveri a paklit hogy kiosztásnál véletlenszerű lapok kerüljenek a kezünkbe
function shuffle(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
            ;[deck[i], deck[j]] = [deck[j], deck[i]]
    }
}

//ezzel indul el maga a fájer játék
function fajerStart(req, res) {
    const deck = createDeck()
    shuffle(deck)
    //a game-be beletölti a paklit
    game.deck = deck

    //kioszt a játékosnak és a gépnek 3-3 lapot és az asztalra 4-et
    game.player.hand = deck.splice(0, 3)
    game.bot.hand = deck.splice(0, 3)
    game.table = deck.splice(0, 4)

    game.turn = "player"
    game.gameOver = false
    game.result = null

    console.log("GAME STARTED")

    return res.json(game)
}

//jatekos lap cserélése az asztalról
function playerMove(req, res) {
    //ha nem a player következik nem enged cserélni
    if (game.turn !== "player") {
        return res.json({ error: "Not player turn" })
    }

    //a cserélni kivant kartya azonositojat es a masik kartya azonositojat body-ban kell megadni
    const { handIndex, tableIndex } = req.body

    //ha nincs ilyen azonosito nem engedélyezi a cserét
    if (
        game.player.hand[handIndex] == null ||
        game.table[tableIndex] == null
    ) {
        return res.json({ error: "Invalid move" })
    }

    //helyet cserél a két lap
    const temp = game.player.hand[handIndex]
    game.player.hand[handIndex] = game.table[tableIndex]
    game.table[tableIndex] = temp

    game.turn = "bot"

    res.json(game)
}
//bot lap cserélése az asztalról
function botMove(req, res) {
    //amíg nem a bot következik nem engedi cserélni
    if (game.turn !== "bot") {
        return res.json({ error: "Not bot turn" })
    }
    //ha nincs ilyen azonosito nem engedélyezi a cserét
    if (!game.bot.hand.length || !game.table.length) {
        return res.json({ error: "Invalid state" })
    }
    //a két lap zonositojat random megallapitja neki
    const handIndex = Math.floor(Math.random() * game.bot.hand.length)
    const tableIndex = Math.floor(Math.random() * game.table.length)

    if (
        game.bot.hand[handIndex] == null ||
        game.table[tableIndex] == null
    ) {
        return res.json({ error: "Invalid card" })
    }
    //kicseréli a bot lapjait is
    const temp = game.bot.hand[handIndex]
    game.bot.hand[handIndex] = game.table[tableIndex]
    game.table[tableIndex] = temp

    game.turn = "player"

    res.json(game)
}

//lapok vizsgálása(mi van a kezünkben)
function getHandValue(hand) {
    let sum = 0
    let hasAce = false
    //megvizsgalja hogy van e lap a kezében es hogy az ász e hiszen a későbbiekben ez sokat szamit
    for (let card of hand) {
        if (!card) continue
        sum += valuePoints[card.value]
        if (card.value === "asz") hasAce = true
    }

    return { sum, hasAce }
}

//kártya kombinaciók megvizsgálása az eredményhez
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

    //31 (fájer): ász + két 10-es értékű kártya azonos színből
    if (
        aceCount === 1 &&
        tenValueCards === 2 &&
        allSameSuit
    ) {
        return { score: 31, type: "faier" }
    }

    //3 ász
    if (aceCount === 3) {
        return { score: 33, type: "three_aces" }
    }

    //2 ász
    if (aceCount === 2) {
        return { score: 22, type: "two_aces" }
    }

    //3 egyforma figura
    if (allSameValue) {
        return { score: 30 + sum, type: "three_of_kind" }
    }

    //3 azonos szín
    if (allSameSuit) {
        return { score: sum, type: "same_suit" }
    }

    //ha semmi különleges kombináció nincs
    return { score: sum, type: "normal" }
}
//eredmény kiértékelése
function getResult(req, res) {
    const player = evaluateHand(game.player.hand)
    const bot = evaluateHand(game.bot.hand)

    let result = "draw"

    if (player.score > bot.score) {
        result = "player wins"
    } else if (bot.score > player.score) {
        result = "bot wins"
    } else {
        // döntetlen esetén erősebb lapok
        result = "draw (strongest cards)"
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