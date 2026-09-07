var express = require("express");
var router = express.Router();

let listaInstancias = require("../controllers/lista-instancia-controller");

router.get("/buscarIdInstancia/:empresaServidor", function (req, res) {
    listaInstancias.buscar_instancias(req, res);
});

router.delete("/deletarInstancia/:idInstancia", function (req, res) {
    listaInstancias.deletar_instancia(req, res);
});


module.exports = router;