var express = require("express");
var router = express.Router();

var gestorController = require("../controllers/gestorController");

router.get("/empresas", function (req, res) {
    gestorController.listarEmpresas(req, res);
});

router.post("/cadastrar", function (req, res) {
    gestorController.cadastrar(req, res);
});

router.get("/listar", function (req, res) {
    gestorController.listarGestores(req, res);
});

module.exports = router;

