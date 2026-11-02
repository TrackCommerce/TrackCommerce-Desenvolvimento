var database = require("../database/config");

function listarEmpresas() {
    console.log("ACESSEI O GESTOR MODEL - listarEmpresas()");
    var instrucaoSql = `
        SELECT id_empresa, razao_social, cnpj 
        FROM empresa 
        WHERE razao_social NOT LIKE '%TrackCommerce%'
        ORDER BY razao_social ASC;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarUsuarioPorEmail(email) {
    console.log("ACESSEI O GESTOR MODEL - buscarUsuarioPorEmail():", email);
    var instrucaoSql = `
        SELECT id_usuario, email 
        FROM usuario 
        WHERE email = '${email}' 
        LIMIT 1;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

async function cadastrarGestor(nome, email, senha, fkEmpresa) {
    console.log("ACESSEI O GESTOR MODEL - cadastrarGestor():", nome, email, fkEmpresa);

    // Inserção do gestor com fk_cargo = 1 (cargo Administrador padrão)
    var instrucaoSql = `
        INSERT INTO usuario (nome, email, senha, celular, fk_empresa, fk_cargo) 
        VALUES (
            '${nome}', 
            '${email}', 
            '${senha}', 
            NULL, 
            ${fkEmpresa}, 
            1
        );
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

async function salvarOuAtualizarTokenJira(fkEmpresa, tokenJira) {
    console.log("ACESSEI O GESTOR MODEL - salvarOuAtualizarTokenJira():", fkEmpresa);

    var sqlVerificar = `
        SELECT id_integracao 
        FROM integracao 
        WHERE fk_empresa = ${fkEmpresa} 
        LIMIT 1;
    `;
    var resultadoVerificar = await database.executar(sqlVerificar);

    if (resultadoVerificar && resultadoVerificar.length > 0) {
        var sqlUpdate = `
            UPDATE integracao 
            SET codigo_api = '${tokenJira}' 
            WHERE fk_empresa = ${fkEmpresa};
        `;
        console.log("Executando a instrução SQL (Update Integracao): \n" + sqlUpdate);
        return database.executar(sqlUpdate);
    } else {
        var sqlInsert = `
            INSERT INTO integracao (codigo_api, fk_empresa) 
            VALUES ('${tokenJira}', ${fkEmpresa});
        `;
        console.log("Executando a instrução SQL (Insert Integracao): \n" + sqlInsert);
        return database.executar(sqlInsert);
    }
}

function listarGestores() {
    console.log("ACESSEI O GESTOR MODEL - listarGestores()");
    var instrucaoSql = `
        SELECT DISTINCT
            u.id_usuario,
            u.nome,
            u.email,
            u.celular,
            u.fk_empresa,
            e.razao_social AS empresa,
            c.nome_cargo AS cargo,
            COALESCE(ig.codigo_api, '') AS token_jira
        FROM usuario u
        JOIN cargo c ON u.fk_cargo = c.id_cargo
        JOIN empresa e ON u.fk_empresa = e.id_empresa
        LEFT JOIN integracao ig ON e.id_empresa = ig.fk_empresa
        WHERE u.fk_cargo = 1
          AND LOWER(u.email) NOT LIKE '%@trackcommerce.com'
          AND LOWER(e.razao_social) NOT LIKE '%trackcommerce%'
        ORDER BY u.nome ASC;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    listarEmpresas,
    buscarUsuarioPorEmail,
    cadastrarGestor,
    salvarOuAtualizarTokenJira,
    listarGestores
};
