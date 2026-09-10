var express = require("express");
var router = express.Router();

var instanciaController = require("../controllers/instanciaController");

router.get(`/listar/:id`, function(req,res) {
    instanciaController.listar(req,res)
})

module.exports = router;