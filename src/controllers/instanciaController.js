var instanciaModel = require("../models/instanciaModel");

function listar(req, res) {
    let id = req.params.id;

    console.log(id, "No controller")

    instanciaModel.listar(id).then((resultado) => {
        if (resultado.length > 0) {
            res.status(200).json(resultado)
        } else {
            res.status(204).json("Nenhum resultado encontrado")
        }
    })
}

function editar(req, res) {
    var idInstancia = req.params.idInstancia;

    var nome = req.body.nomeServer;
    var identificador = req.body.identificadorServer;
    var descricao = req.body.descricaoServer;

    if (nome == undefined) {
        res.status(400).send("O nome está undefined!");
    } else if (identificador == undefined) {
        res.status(400).send("O identificador está undefined!");
    } else if (descricao == undefined) {
        res.status(400).send("A descrição está undefined!");
    } else {
        instanciaModel.editar(idInstancia, nome, identificador, descricao)
            .then(function (resultado) {
                res.status(200).json(resultado);
            }).catch(function (erro) {
                console.log(erro);
                console.log("\nHouve um erro ao realizar a edição! Erro: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

module.exports = {
    listar,
    editar
}