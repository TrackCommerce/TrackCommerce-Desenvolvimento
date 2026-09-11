var database = require("../database/config");

function listar(id){
        console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n")
        
        var instrucaoSql = `
            SELECT i.id_instancia, 
		            i.nome 
                    FROM instancia AS i
		        JOIN empresa AS e ON i.fk_empresa = e.id_empresa
                JOIN usuario AS u ON u.fk_empresa = e.id_empresa
                WHERE id_usuario = ${id};
        `
        console.log("Executando a instrução SQL: \n" + instrucaoSql);
        return database.executar(instrucaoSql);
}

module.exports = {
    listar
}