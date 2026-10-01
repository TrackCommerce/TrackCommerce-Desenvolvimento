var database = require("../database/config");

function listar(id) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n")

    var instrucaoSql = `
            SELECT i.id_instancia, 
		            i.nome 
                    FROM instancias AS i
		        JOIN empresa AS e ON i.fk_empresa = e.id_empresa
                JOIN usuario AS u ON u.fk_empresa = e.id_empresa
                WHERE id_usuario = ${id};
        `
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function editar(idInstancia, nome, identificador, descricao) {
    console.log("ACESSEI O INSTANCIA MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function editar():", idInstancia, nome, identificador, descricao);

    var instrucao = `
        UPDATE Instancias 
        SET nome = '${nome}', 
            identificador = '${identificador}', 
            descricao = '${descricao}'
        WHERE id_instancia = ${idInstancia};
    `;

    console.log("Executando a instrução SQL: \n" + instrucao);

    return database.executar(instrucao);
}

module.exports = {
    listar,
    editar
}