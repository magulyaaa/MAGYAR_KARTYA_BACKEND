const {createVote, deleteVote, getVotesByGame}=require('../models/voteModel')

//szavazat leadasa
async function vote(req, res) {
    try {
        const { user_id } = req.user
        const { game_id } = req.params
        //console.log(user_id,game_id);


        await createVote(user_id,game_id)

        return res.status(201).json({message:'Szavazat leadva'})

    } catch (err) {
        //console.log(err);
        if(err.code==='ER_DUP_ENTRY'){
            return res.status(400).json({error: 'Erre a játékra már szavaztál!'})
        }
        return res.status(500).json({error: 'Hiba a szavazásnál'})
    }

}

//szavazat törlése
async function unvote(req,res){
    try {
        const { user_id } = req.user
        const { game_id } = req.params

        const result=await deleteVote(user_id, game_id)

        if(result.affectedRows===0){
            return res.status(400).json({error: 'Nincs ilyen szavazat'})
        }

        return res.status(204).send()

    } catch (err) {
        //console.log(err);
        return res.status(500).json({error: 'Sikertelen törlés'})
    }
}

//szavazatok szamanak lekerdezese
async function getVotes(req,res){
    try {
        const result=await getVotesByGame()


        return res.status(200).json(result)
    } catch (err) {
        console.log(err);
        return res.status(500).json({error: 'Sikertelen szavazat lekérés'})
    }
}

module.exports = { vote , unvote, getVotes}