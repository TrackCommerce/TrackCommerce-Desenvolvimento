let lista_instancia_model = require("../models/lista-instancia-model")

function buscar_instancias(req, res) {
    var fk_empresa = req.params.empresaServidor;
    
    lista_instancia_model.buscar_instancias(fk_empresa)
    .then((resultado) => {
        res.status(200).json(resultado)
    })
}

function editar_instancia(req, res) {
    var fk_instancia = req.params.idInstancia;
    var nome = req.body.nomeServer;
    var identificador = req.body.identificadorServer;
    var componentes = req.body.componentesServer;


   lista_instancia_model.buscar_instancias(fk_instancia, nome, identificador, componentes)
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



module.exports = {
    buscar_instancias,
    deletar_instancia
    
};