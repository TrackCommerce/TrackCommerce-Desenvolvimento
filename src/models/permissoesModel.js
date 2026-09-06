var database = require("../database/config");

function buscarCargos(){
    var instrucaoSQL = `SELECT nome_cargo FROM cargo`

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    buscarCargos
}