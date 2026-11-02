var database = require("../database/config")

function cadastrar_instancia(nome, identificador, fkEmpresa) {
    console.log("ACESSEI O CADASTRO INSTANCIA MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar_instancia():", nome, identificador, fkEmpresa);
    
    var instrucaoSql = `
        INSERT INTO instancia (nome, identificador, fk_empresa, ativo) 
        VALUES ('${nome}', '${identificador}', ${fkEmpresa}, 1);
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscar_id_instancia(identificador) {
    console.log("ACESSEI O CADASTRO INSTANCIA MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function buscar_id_instancia(): ", identificador);
    var instrucaoSql = `
        SELECT id_instancia, identificador, nome, fk_empresa, ativo 
        FROM instancia 
        WHERE identificador = '${identificador}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

async function cadastrar_componente_instancia(fk_componente, fk_instancia, parametro) {
    console.log("ACESSEI O CADASTRO INSTANCIA MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar_componente_instancia():", fk_componente, fk_instancia, parametro);

    var alertaCritico = (parametro != undefined && parametro != null && parametro != "" && !isNaN(parametro)) ? Number(parametro) : 85.00;
    var alertaModerado = Number((alertaCritico * 0.85).toFixed(2));

    var instrucaoSql = `
        INSERT INTO instancia_componente (
            fk_instancia, 
            fk_componente, 
            alerta_moderado, 
            alerta_critico, 
            ativo
        ) VALUES (
            ${fk_instancia}, 
            ${fk_componente}, 
            ${alertaModerado}, 
            ${alertaCritico}, 
            1
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