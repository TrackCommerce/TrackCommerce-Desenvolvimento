var express = require("express");
var router = express.Router();
var agenteController = require("../controllers/agenteController");

router.post("/download", agenteController.baixar);
router.post("/ativar", agenteController.ativar);
router.get("/resolver-instancia/:identificador", agenteController.resolverInstancia);

module.exports = router;
