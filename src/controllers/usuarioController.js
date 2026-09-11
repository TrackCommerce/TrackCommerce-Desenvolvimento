var usuarioModel = require("../models/usuarioModel");
var { cyrb53 } = require("../../public/js/hash");

function cadastrar(req, res) {
    var nome = req.body.nomeServer;
    var email = req.body.emailServer;
    var contato = req.body.contatoServer;
    var cargo = req.body.cargoServer;
    var fk_empresa = req.body.fkEmpresaServer;
    var senha = cyrb53(email).toString();

    if (nome == undefined) {
        res.status(400).send("Seu nome está undefined!");
    } else if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (contato == undefined) {
        res.status(400).send("Seu contato está undefined!");
    } else if (cargo == undefined) {
        res.status(400).send("Cargo está undefined!");
    } else {

        usuarioModel.cadastrar(nome, email, contato, senha, cargo, fk_empresa)
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

function deletar(req, res){
    let id = req.body.idServer;

        usuarioModel.deletar(id)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao deletar! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
}

function autenticar(req, res) {
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está indefinida!");
    } else {

        usuarioModel.autenticar(email, senha)
            .then(
                function (resultadoAutenticar) {
                    console.log(`\nResultados encontrados: ${resultadoAutenticar.length}`);
                    console.log(`Resultados: ${JSON.stringify(resultadoAutenticar)}`); // transforma JSON em String

                    if (resultadoAutenticar.length == 1) {
                        var usuario = resultadoAutenticar[0];
                        var hashEmail = cyrb53(usuario.email).toString();

                        var PrimeiroAcesso = (senha == hashEmail);

                        res.status(200).json({
                            id_usuario: usuario.id_usuario,
                            nome: usuario.nome,
                            email: usuario.email,
                            fk_empresa: usuario.fk_empresa,
                            fk_cargo: usuario.fk_cargo,
                            primeiroAcesso: PrimeiroAcesso
                        });
                        console.log(resultadoAutenticar);
                    } else if (resultadoAutenticar.length == 0) {
                        res.status(403).send("Email e/ou senha inválido(s)");
                    } else {
                        res.status(403).send("Mais de um usuário com o mesmo login e senha!");
                    }

                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro ao realizar o login! Erro: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }

}

function redefinirSenha(req, res) {
    var idUsuario = req.body.idServer;
    var novaSenhaHash = req.body.novaSenhaServer;

    if (idUsuario == undefined || novaSenhaHash == undefined) {
        res.status(400).send("Dados incompletos para redefinir senha.");
    } else {
        usuarioModel.redefinirSenha(idUsuario, novaSenhaHash)
            .then(function (resultado) {
                res.status(200).json(resultado);
            })
            .catch(function (erro) {
                console.log(erro);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

module.exports = {
    cadastrar,
    listarTodos,
    editar,
    deletar,
    autenticar,
    redefinirSenha
}