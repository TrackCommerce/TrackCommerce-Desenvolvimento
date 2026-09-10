var express = require("express");
var router = express.Router();

var usuarioController = require("../controllers/usuarioController");

router.post("/cadastrar", function (req, res) {
    usuarioController.cadastrar(req, res);
})
router.get("/listar", function(req,res) {
    usuarioController.listarTodos(req,res)
})
router.put("/editar", function(req,res) {
    usuarioController.editar(req,res)
})
router.delete("/deletar", function(req,res) {
    usuarioController.deletar(req,res)
})


module.exports = router;