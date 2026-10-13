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
            COALESCE(GROUP_CONCAT(DISTINCT CONCAT(c.id_componente, ':', COALESCE(pa.alerta_critico, pa.alerta_moderado, '')) SEPARATOR ', '), '') AS grupoOpcoesComponentes
        FROM instancias a
        LEFT JOIN instancias_componentes ci ON ci.fk_instancia = a.id_instancia AND ci.Status = 1
        LEFT JOIN componentes c ON c.id_componente = ci.fk_componentes
        LEFT JOIN parametros_alertas pa ON pa.id_parametro_alerta = ci.fk_parametros_alertas
        WHERE a.fk_empresa = ${fk_empresa} AND a.ativo = 1
        GROUP BY a.id_instancia, a.nome, a.identificador, a.descricao, a.ativo;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

async function deletar_instancia(fk_instancia) {
    console.log("ACESSEI O LISTA INSTANCIA MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function deletar_instancia():", fk_instancia);
    var instrucaoSql1 = `
        DELETE FROM instancias_componentes WHERE fk_instancia = ${fk_instancia};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql1);
    await database.executar(instrucaoSql1);

    var instrucaoSql2 = `
        DELETE FROM instancias WHERE id_instancia = ${fk_instancia};
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
            ic.fk_componentes,
            ic.fk_componentes AS fk_componente,
            ic.fk_parametros_alertas,
            ic.Status,
            ic.Status AS ativo,
            c.nome AS nome_componente,
            pa.alerta_moderado,
            pa.alerta_critico,
            COALESCE(pa.alerta_critico, pa.alerta_moderado) AS parametro
        FROM instancias_componentes ic
        JOIN componentes c ON c.id_componente = ic.fk_componentes
        LEFT JOIN parametros_alertas pa ON pa.id_parametro_alerta = ic.fk_parametros_alertas
        WHERE ic.fk_instancia = ${fk_instancia};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function deletar_relacionamento(fk_instancia) {
    console.log("ACESSEI O LISTA INSTANCIA MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function deletar_relacionamento():", fk_instancia);
    var instrucaoSql = `
        DELETE FROM instancias_componentes WHERE fk_instancia = ${fk_instancia};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function editar_nome_identificador_instancia(nome, identificador, id_instancia) {
    console.log("ACESSEI O LISTA INSTANCIA MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function editar_nome_identificador_instancia(): ", nome, identificador, id_instancia);
    var instrucaoSql = `
        UPDATE instancias SET nome = '${nome}', identificador = '${identificador}' WHERE id_instancia = ${id_instancia};
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