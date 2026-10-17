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

    // Garante que o cargo padrão de nível mais alto (Administrador) tenha a permissão 1 (gerenciar_usuarios)
    var sqlGarantirPermissao = `
        INSERT IGNORE INTO cargo_permissao (fk_cargo, fk_permissao) 
        VALUES (1, 1);
    `;
    try {
        await database.executar(sqlGarantirPermissao);
    } catch (e) {
        console.log("Aviso ao assegurar cargo_permissao: ", e.sqlMessage || e);
    }

    // Inserção do gestor com fk_cargo = 1 (cargo associado à permissão nível mais alto)
    var instrucaoSql = `
        INSERT INTO usuario (nome, email, senha, celular, fk_empresa, fk_cargo) 
        VALUES (
            '${nome}', 
            '${email}', 
            '${senha}', 
            NULL, 
            ${fkEmpresa}, 
            COALESCE((SELECT fk_cargo FROM cargo_permissao WHERE fk_permissao = 1 LIMIT 1), 1)
        );
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

async function salvarOuAtualizarTokenJira(fkEmpresa, tokenJira) {
    console.log("ACESSEI O GESTOR MODEL - salvarOuAtualizarTokenJira():", fkEmpresa);

    var sqlVerificar = `
        SELECT id_api_jira 
        FROM apijira 
        WHERE fk_empresa = ${fkEmpresa} 
        LIMIT 1;
    `;
    var resultadoVerificar = await database.executar(sqlVerificar);

    if (resultadoVerificar && resultadoVerificar.length > 0) {
        var sqlUpdate = `
            UPDATE apijira 
            SET codigo_api = '${tokenJira}' 
            WHERE fk_empresa = ${fkEmpresa};
        `;
        console.log("Executando a instrução SQL (Update Jira): \n" + sqlUpdate);
        return database.executar(sqlUpdate);
    } else {
        var sqlInsert = `
            INSERT INTO apijira (id_api_jira, codigo_api, fk_empresa) 
            SELECT COALESCE(MAX(id_api_jira), 0) + 1, '${tokenJira}', ${fkEmpresa} 
            FROM apijira;
        `;
        console.log("Executando a instrução SQL (Insert Jira): \n" + sqlInsert);
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
            COALESCE(aj.codigo_api, '') AS token_jira
        FROM usuario u
        JOIN cargo c ON u.fk_cargo = c.id_cargo
        JOIN cargo_permissao cp ON c.id_cargo = cp.fk_cargo
        JOIN empresa e ON u.fk_empresa = e.id_empresa
        LEFT JOIN apijira aj ON e.id_empresa = aj.fk_empresa
        WHERE cp.fk_permissao = 1
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

