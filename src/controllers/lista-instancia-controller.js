let lista_instancia_model = require("../models/lista-instancia-model")

function buscar_instancias(req, res) {
    var fk_empresa = req.params.empresaServidor;
    
    lista_instancia_model.buscar_instancias(fk_empresa)
    .then((resultado) => {
        res.status(200).json(resultado)
    })
}

function editar_nome_identificador_instancia(req, res) {
    var fk_instancia = req.params.idInstancia;
    var nome = req.body.nomeServer;
    var identificador = req.body.identificadorServer;

   lista_instancia_model.editar_nome_identificador_instancia(nome, identificador, fk_instancia)
        .then(
            function (resultado) {
                res.json(resultado);
            }
        )
        .catch(
            function (erro) {
                console.log(erro);
                console.log("Houve um erro ao realizar o post: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            }
        );

}

function deletar_relacionamento(req, res) {
    var fk_instancia = req.params.idInstancia;

    lista_instancia_model.deletar_relacionamento(fk_instancia)
    .then(
        function (resultado) {
            res.json(resultado);
        }
    )
    .catch(
        function (erro) {
            console.log(erro);
            console.log("Houve um erro ao deletar o post: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        }
    );
}


function deletar_instancia(req, res) {
    var fk_instancia = req.params.idInstancia;

    lista_instancia_model.deletar_instancia(fk_instancia)
        .then(
            function (resultado) {
                res.json(resultado);
            }
        )
        .catch(
            function (erro) {
                console.log(erro);
                console.log("Houve um erro ao deletar o post: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            }
        );
}

function busca_componentes_instancia(req, res) {
    var fk_instancia = req.params.idInstancia;
    
    lista_instancia_model.busca_componentes_instancia(fk_instancia)
    .then((resultado) => {
        res.status(200).json(resultado)
    })
}

module.exports = {
    buscar_instancias,
    deletar_instancia,
    busca_componentes_instancia,
    editar_nome_identificador_instancia,
    deletar_relacionamento
};