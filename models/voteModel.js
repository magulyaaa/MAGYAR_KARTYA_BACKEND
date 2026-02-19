const db=require('../db/db')

//szavazat letrehozasa
async function createVote(user_id,game_id){
    //console.log(user_id, game_id);
    const sql='INSERT INTO votes (user_id, game_id) VALUES (?, ?)'
    const [result]=await db.query(sql, [user_id, game_id])
    console.log(result);
}

//szavazat torlese
async function deleteVote(user_id,game_id){
    const sql='DELETE FROM votes WHERE votes.user_id = ? AND votes.game_id = ?'
    const [result]=await db.query(sql, [user_id, game_id])
    //console.log(result);
    return result
}

//osszes szavazat lekerese jatekok
async function getVotesByGame(){
    const sql='SELECT COUNT(votes.game_id)as szavazat, games.game_name as nev FROM `votes` INNER JOIN games USING(game_id) GROUP BY game_id'
    const [result]= await db.query(sql)
    return result
}


module.exports={createVote, deleteVote, getVotesByGame}