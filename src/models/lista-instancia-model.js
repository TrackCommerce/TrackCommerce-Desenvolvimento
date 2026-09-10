var database = require("../database/config")



function buscar_instancias(fk_empresa) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", fk_empresa)
    var instrucaoSql = `
       
SELECT 
    a.nome,
a.identificador,
a.id_instancia,
GROUP_CONCAT(DISTINCT c.nome SEPARATOR ', ') AS grupoComponentes,
GROUP_CONCAT(DISTINCT CONCAT(c.id_componente, ':',  ci.parametro) SEPARATOR', ') AS grupoOpcoesComponentes
FROM instancia a
JOIN componente_instancia ci ON ci.fk_instancia = a.id_instancia
JOIN componente c ON c.id_componente = ci.fk_componente
WHERE a.fk_empresa = ${fk_empresa}
GROUP BY a.id_instancia, a.nome;

    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function deletar_instancia(fk_instancia) {
    console.log("ACESSEI O AVISO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function deletar():", fk_instancia);
    var instrucaoSql1 = `
        DELETE FROM componente_instancia WHERE fk_instancia = ${fk_instancia};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql1);
    return database.executar(instrucaoSql1);

    var instrucaoSql2 = `
        DELETE FROM instancia WHERE id_instancia = ${fk_instancia};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql2);
    return database.executar(instrucaoSq2);
}

function busca_componentes_instancia(fk_instancia) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function busca_componentes_instancias(): ", fk_instancia)
    var instrucaoSql = `
        SELECT * FROM componente_instancia WHERE fk_instancia = ${fk_instancia};
    `
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function deletar_relacionamento(fk_instancia) {
    console.log("ACESSEI O AVISO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function deletar():", fk_instancia);
    var instrucaoSql = `
        DELETE FROM componente_instancia WHERE fk_instancia = ${fk_instancia};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function editar_nome_identificador_instancia(nome, identificador, id_instancia) {
    console.log("ACESSEI O AVISO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function editar_nome_identificador_instancia(): ", nome, identificador, id_instancia);
    var instrucaoSql = `
        UPDATE instancia SET nome = '${nome}', identificador = '${identificador}' WHERE id_instancia = ${id_instancia};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}


module.exports = {
    buscar_instancias,
    deletar_instancia,
    busca_componentes_instancia,
    editar_nome_identificador_instancia,
    deletar_relacionamento
};