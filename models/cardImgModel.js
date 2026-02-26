const db=require('../db/db')

//összes kép lekérdezése
const allPicture=async()=>{
    const sql='SELECT * FROM `cards` WHERE 1'

    const[result]=await db.query(sql)
    return result
}

//EGY KÉP FELTÖltése
const uploadPicture=async (card_name,card_color,card_img)=>{
    const sql='INSERT INTO cards(card_id, card_name, card_color, card_img) VALUES (NULL,?,?,?)'
    const[result]=await db.query(sql, [card_name,card_color,card_img])
    return result.insertId
}

module.exports={allPicture, uploadPicture}