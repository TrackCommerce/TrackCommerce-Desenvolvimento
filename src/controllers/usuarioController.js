var usuarioModel = require("../models/usuarioModel");

function cadastrar(req, res) {
    var nome = req.body.nomeServer;
    var email = req.body.emailServer;
    var contato = req.body.contatoServer;
    var cargo = req.body.cargoServer;

    // Faça as validações dos valores
    if (nome == undefined) {
        res.status(400).send("Seu nome está undefined!");
    } else if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (contato == undefined) {
        res.status(400).send("Seu contato está undefined!");
    } else if (cargo == undefined) {
        res.status(400).send("Cargo está undefined!");
    } else {

        // Passe os valores como parâmetro e vá para o arquivo usuarioModel.js
        usuarioModel.cadastrar(nome, email, contato, cargo)
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
}

function listarTodos(req,res){
    usuarioModel.listarTodos().then((resultado) => {
        if(resultado.length > 0){
            res.status(200).json(resultado)
        }else{
            res.status(204).json("Nenhum resultado encontrado")
        }
    })
}

function editar(req, res){
    var id = req.body.idServer;
    var nome = req.body.nomeServer;
    var email = req.body.emailServer;
    var contato = req.body.contatoServer;
    var cargo = req.body.cargoServer;

    // Faça as validações dos valores
    if (nome == undefined) {
        res.status(400).send("Seu nome está undefined!");
    } else if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (contato == undefined) {
        res.status(400).send("Seu contato está undefined!");
    } else if (cargo == undefined) {
        res.status(400).send("Cargo está undefined!");
    } else {

        // Passe os valores como parâmetro e vá para o arquivo usuarioModel.js
        usuarioModel.editar(id, nome, email, contato, cargo)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao atualizar! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}

module.exports = {
    cadastrar,
    listarTodos,
    editar
}