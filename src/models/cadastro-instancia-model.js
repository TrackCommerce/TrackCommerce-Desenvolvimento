var database = require("../database/config")

function cadastrar_instancia(nome, identificador, fkEmpresa) {
    console.log("ACESSEI O CADASTRO INSTANCIA MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar_instancia():", nome, identificador, fkEmpresa);
    
    var instrucaoSql = `
        INSERT INTO instancias (nome, identificador, fk_empresa, ativo) 
        VALUES ('${nome}', '${identificador}', ${fkEmpresa}, 1);
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscar_id_instancia(identificador) {
    console.log("ACESSEI O CADASTRO INSTANCIA MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function buscar_id_instancia(): ", identificador);
    var instrucaoSql = `
        SELECT id_instancia, identificador, nome, fk_empresa, ativo 
        FROM instancias 
        WHERE identificador = '${identificador}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

async function cadastrar_componente_instancia(fk_componente, fk_instancia, parametro) {
    console.log("ACESSEI O CADASTRO INSTANCIA MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar_componente_instancia():", fk_componente, fk_instancia, parametro);

    // Buscar o próximo id_instancia_componente
    var sqlMaxId = `SELECT COALESCE(MAX(id_instancia_componente), 0) + 1 AS proximoId FROM instancias_componentes;`;
    var resMaxId = await database.executar(sqlMaxId);
    var proximoId = (resMaxId && resMaxId.length > 0 && resMaxId[0].proximoId) ? resMaxId[0].proximoId : 1;

    // Buscar o id_parametro_alerta correspondente ao componente
    var sqlAlerta = `
        SELECT pa.id_parametro_alerta 
        FROM parametros_alertas pa 
        JOIN parametros p ON pa.fk_parametro = p.id_parametro 
        WHERE p.Componentes_id_componente = ${fk_componente} 
        LIMIT 1;
    `;
    var resAlerta = await database.executar(sqlAlerta);
    var idParametroAlerta = (resAlerta && resAlerta.length > 0 && resAlerta[0].id_parametro_alerta) ? resAlerta[0].id_parametro_alerta : fk_componente;

    // Se o usuário passou um valor numérico de parâmetro, atualizar alerta_critico em parametros_alertas
    if (parametro != undefined && parametro != null && parametro != "" && !isNaN(parametro)) {
        var sqlAtualizarAlerta = `
            UPDATE parametros_alertas 
            SET alerta_critico = ${parametro}, dt_edicao = NOW() 
            WHERE id_parametro_alerta = ${idParametroAlerta};
        `;
        try {
            await database.executar(sqlAtualizarAlerta);
        } catch (e) {
            console.log("Aviso ao atualizar parametros_alertas: ", e.sqlMessage || e);
        }
    }

    var instrucaoSql = `
        INSERT INTO instancias_componentes (
            id_instancia_componente, 
            fk_instancia, 
            fk_componentes, 
            fk_parametros_alertas, 
            Status, 
            dt_edicao
        ) VALUES (
            ${proximoId}, 
            ${fk_instancia}, 
            ${fk_componente}, 
            ${idParametroAlerta}, 
            1, 
            NOW()
        );
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    cadastrar_instancia,
    cadastrar_componente_instancia,
    buscar_id_instancia
};