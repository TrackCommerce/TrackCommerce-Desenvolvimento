var express = require("express");
var router = express.Router();

var permissoesController = require("../controllers/permissoesController");

router.get("/cargos", function (req, res){
    permissoesController.buscarCargos(req, res);
});

router.get("/buscarPermissoes/:idCargo", function (req, res){
    permissoesController.buscarPermissoes(req, res);
});

router.post("/editarPermissoes/:idCargo", function (req, res){
    permissoesController.editarPermissoes(req, res);
});

router.delete("/deletarCargo/:idCargo", function (req, res){
    permissoesController.deletarCargo(req, res);
});

router.post("/adicionarCargo", function (req, res){
    permissoesController.adicionarCargo(req, res);
});
module.exports = router;