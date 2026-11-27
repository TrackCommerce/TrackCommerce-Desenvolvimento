var express = require("express");
var router = express.Router();

var centralStatusController = require("../controllers/centralStatusController");

router.get("/validar-acesso/:idUsuario", function (req, res) {
    centralStatusController.validarAcesso(req, res);
});

module.exports = router;
