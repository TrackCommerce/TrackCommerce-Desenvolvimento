var instanciaModel = require("../models/instanciaModel");

function listar(req, res){
    let id = req.params.id;

    console.log(id, "No controller")

    instanciaModel.listar(id).then((resultado) => {
        if(resultado.length > 0){
            res.status(200).json(resultado)
        }else{
            res.status(204).json("Nenhum resultado encontrado")
        }
    })
}

module.exports = {
    listar
}