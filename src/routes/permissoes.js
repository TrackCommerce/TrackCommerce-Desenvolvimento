var express = require("express");
var router = express.Router();

var permissoesController = require("../controllers/permissoesController");

router.get("/cargos", function (req, res){
    permissoesController.buscarCargos(req, res);
});

module.exports = router;