const { allPicture, uploadPicture } = require('../models/cardImgModel')

const getAllpictures = async (req, res) => {
    try {
        const result = await allPicture()

        return res.status(200).json(result)
    } catch (err) {
        return res.status(500).json({ error: 'Adatbázis hiba', err })
    }
}

const postPicture = async (req, res) => {
    try {
        const { card_name, card_color } = req.body;
        //console.log(card_name,card_color);
        const kep = req.file ? req.file.filename : null
        //console.log(kep);

        const result = await uploadPicture(card_name, card_color, kep)



        return res.status(201).json({ message: `Beszúrt id: ${result}` })
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Adatbázis hiba', err })
    }
}

module.exports = { getAllpictures, postPicture }