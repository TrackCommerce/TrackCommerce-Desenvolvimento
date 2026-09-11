var express = require("express");
var router = express.Router();

let cadastrar_instancia_controller = require("../controllers/cadastro-instancia-controller");

router.post("/cadastrarInstancia", function (req, res) {
    cadastrar_instancia_controller.cadastrar_instancia(req, res);
})

router.get("/buscarIdInstancia/:identificadorServidor", function (req, res) {
    cadastrar_instancia_controller.buscar_id_instancia(req, res);
});



router.post("/cadastrarComponenteInstancia", function (req, res) {
    cadastrar_instancia_controller.cadastrar_componente_instancia(req, res);
    });

module.exports = router;