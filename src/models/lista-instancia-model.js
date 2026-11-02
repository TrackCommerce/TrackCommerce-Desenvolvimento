var database = require("../database/config")

function buscar_instancias(fk_empresa) {
    console.log("ACESSEI O LISTA INSTANCIA MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function buscar_instancias(): ", fk_empresa);
    var instrucaoSql = `
        SELECT 
            a.id_instancia,
            a.nome,
            a.identificador,
            a.descricao,
            a.ativo,
            COALESCE(GROUP_CONCAT(DISTINCT c.nome SEPARATOR ', '), '') AS grupoComponentes,
            COALESCE(GROUP_CONCAT(DISTINCT CONCAT(c.id_componente, ':', COALESCE(ci.alerta_critico, ci.alerta_moderado, '')) SEPARATOR ', '), '') AS grupoOpcoesComponentes
        FROM instancia a
        LEFT JOIN instancia_componente ci ON ci.fk_instancia = a.id_instancia AND ci.ativo = 1
        LEFT JOIN componente c ON c.id_componente = ci.fk_componente
        WHERE a.fk_empresa = ${fk_empresa} AND a.ativo = 1
        GROUP BY a.id_instancia, a.nome, a.identificador, a.descricao, a.ativo;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

async function deletar_instancia(fk_instancia) {
    console.log("ACESSEI O LISTA INSTANCIA MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function deletar_instancia():", fk_instancia);
    var instrucaoSql1 = `
        DELETE FROM instancia_componente WHERE fk_instancia = ${fk_instancia};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql1);
    await database.executar(instrucaoSql1);

    var instrucaoSql2 = `
        DELETE FROM instancia WHERE id_instancia = ${fk_instancia};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql2);
    return await database.executar(instrucaoSql2);
}

function busca_componentes_instancia(fk_instancia) {
    console.log("ACESSEI O LISTA INSTANCIA MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function busca_componentes_instancia(): ", fk_instancia);
    var instrucaoSql = `
        SELECT 
            ic.id_instancia_componente,
            ic.fk_instancia,
            ic.fk_componente,
            ic.fk_componente AS fk_componentes,
            ic.ativo,
            ic.ativo AS Status,
            c.nome AS nome_componente,
            ic.alerta_moderado,
            ic.alerta_critico,
            COALESCE(ic.alerta_critico, ic.alerta_moderado) AS parametro
        FROM instancia_componente ic
        JOIN componente c ON c.id_componente = ic.fk_componente
        WHERE ic.fk_instancia = ${fk_instancia};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function deletar_relacionamento(fk_instancia) {
    console.log("ACESSEI O LISTA INSTANCIA MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function deletar_relacionamento():", fk_instancia);
    var instrucaoSql = `
        DELETE FROM instancia_componente WHERE fk_instancia = ${fk_instancia};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function editar_nome_identificador_instancia(nome, identificador, id_instancia) {
    console.log("ACESSEI O LISTA INSTANCIA MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function editar_nome_identificador_instancia(): ", nome, identificador, id_instancia);
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