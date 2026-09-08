var permissoesModel = require("../models/permissoesModel");

function buscarCargos(req, res){

    permissoesModel.buscarCargos().then(function (resultado){
        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(204).send("Nenhum resultado encontrado!")
        }
    }).catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao buscar os cargos.", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}

function buscarPermissoes(req, res){
    
    let idCargo = req.params.idCargo;

    permissoesModel.buscarPermissoes(idCargo).then(function (resultado){
        res.status(200).json(resultado);
    }).catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao buscar as permissões.", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}

function editarPermissoes(req, res){

    let idCargo = req.params.idCargo;
    let permissoes = req.body.permissoes;

    permissoesModel.editarPermissoes(idCargo, permissoes).then(function (resultado){
        res.json(resultado);
    }).catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao editar as permissões.", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}

function deletarCargo(req, res) {
    var idCargo = req.params.idCargo;

    permissoesModel.deletarCargo(idCargo)
        .then(
            function (resultado) {
                res.json(resultado);
            }
        )
        .catch(
            function (erro) {
                console.log(erro);
                console.log("Houve um erro ao deletar o cargo: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            }
        );
}

function adicionarCargo(req, res) {

    var nome = req.body.nomeServer;
    var experiencia = req.body.experienciaServer;
    var permissoes = req.body.permissoesServer;

        permissoesModel.adicionarCargo(nome, experiencia, permissoes)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar o cadastro! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }

module.exports = {
    buscarCargos,
    buscarPermissoes,
    editarPermissoes,
    deletarCargo,
    adicionarCargo
}