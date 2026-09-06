let cadastro_instancia_model = require("../models/cadastro-instancia-model");

function cadastrar_instancia(req, res) {
    // Crie uma variável que vá recuperar os valores do arquivo cadastro.html
    var nome = req.body.nomeServidor;
    var identificador = req.body.identificadorServidor;
    var fkEmpresa = req.body.empresaServidor;

    // Faça as validações dos valores
    if (nome == undefined) {
        res.status(400).send("Seu nome está undefined!");
    } else if (identificador == undefined) {
        res.status(400).send("Seu identificador está undefined!");
    }else if (fkEmpresa == undefined) {
        res.status(400).send("Sua empresa a vincular está undefined!");
    } else {

        // Passe os valores como parâmetro e vá para o arquivo usuarioModel.js
        cadastro_instancia_model.cadastrar_instancia(nome, identificador, fkEmpresa)
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




function buscar_id_instancia(req, res) {
    var identificador = req.params.identificadorServidor;
    
    cadastro_instancia_model.buscar_id_instancia(identificador)
    .then((resultado) => {
        res.status(200).json(resultado)
    })
}







function cadastrar_componente_instancia(req, res) {
    // Crie uma variável que vá recuperar os valores do arquivo cadastro.html
    var fk_componente = req.body.componenteServidor;
    var fk_instancia = req.body.instanciaServidor;
    var parametro = req.body.parametroServidor;


    // Faça as validações dos valores
    if (fk_componente == undefined) {
        res.status(400).send("Seu id componente está undefined!");
    } else if (fk_instancia == undefined) {
        res.status(400).send("Seu id instancia está undefined!");
    }else if (parametro == undefined) {
        res.status(400).send("Seu parametro está undefined!");
    }else {

        // Passe os valores como parâmetro e vá para o arquivo usuarioModel.js
        cadastro_instancia_model.cadastrar_componente_instancia(fk_componente, fk_instancia, parametro)
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

module.exports = {
    cadastrar_instancia,
    cadastrar_componente_instancia,
    buscar_id_instancia
    
};