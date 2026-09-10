var express = require("express");
var router = express.Router();

let listaInstancias = require("../controllers/lista-instancia-controller");

router.get("/buscarIdInstancia/:empresaServidor", function (req, res) {
    listaInstancias.buscar_instancias(req, res);
});

router.get("/buscarComponentesInstancias/:idInstancia", function (req, res) {
    listaInstancias.busca_componentes_instancia(req, res);
});

router.put("/editarNomeIdentificadorInstancia/:idInstancia", function (req, res) {
    listaInstancias.editar_nome_identificador_instancia(req, res);
});

router.delete("/deletarInstancia/:idInstancia", function (req, res) {
    listaInstancias.deletar_instancia(req, res);
});

router.delete("/deletarRelacionamento/:idInstancia", function (req, res) {
    listaInstancias.deletar_relacionamento(req, res);
});


module.exports = router;