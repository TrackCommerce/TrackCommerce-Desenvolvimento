var cargoModel = require("../models/cargoModel");

function listar(req, res){
    cargoModel.listar().then((resultado) => {
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