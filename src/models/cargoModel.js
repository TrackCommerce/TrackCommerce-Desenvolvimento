var database = require("../database/config");

function listar(){
    console.log("ACESSEI O CARGO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n")

    var instrucaoSql = `
        SELECT id_cargo, nome_cargo, nivel FROM cargo;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    listar
}