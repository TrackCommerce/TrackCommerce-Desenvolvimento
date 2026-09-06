var database = require("../database/config");

function buscarCargos(){
    var instrucaoSql = `SELECT * FROM cargo`

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    buscarCargos
}