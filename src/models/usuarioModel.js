var database = require("../database/config")

function cadastrar(nome, email, contato, senha, cargo, fk_empresa) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", nome, email, contato, cargo);
    
    var fkEmpresaSql = (fk_empresa == undefined || fk_empresa == null || fk_empresa == "" || fk_empresa == "undefined") ? 1 : fk_empresa;

    var instrucaoSql = `
        INSERT INTO usuario (nome, email, celular, senha, fk_cargo, fk_empresa) VALUES ('${nome}', '${email}', '${contato}', '${senha}', (
            SELECT id_cargo
            FROM cargo
            WHERE nome_cargo = '${cargo}'
            LIMIT 1
        ), ${fkEmpresaSql});
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function listarTodos(fkEmpresa, idUsuarioLogado) {
    console.log("ACESSEI O USUARIO MODEL - listarTodos():", fkEmpresa, idUsuarioLogado);

    var filtros = [];
    if (fkEmpresa && fkEmpresa !== "undefined" && fkEmpresa !== "null" && !isNaN(fkEmpresa)) {
        filtros.push(`u.fk_empresa = ${fkEmpresa}`);
    }
    if (idUsuarioLogado && idUsuarioLogado !== "undefined" && idUsuarioLogado !== "null" && !isNaN(idUsuarioLogado)) {
        filtros.push(`u.id_usuario != ${idUsuarioLogado}`);
    }

    var clausulaWhere = filtros.length > 0 ? `WHERE ${filtros.join(" AND ")}` : "";

    var instrucaoSql = `
        SELECT u.id_usuario, u.nome, u.email, u.celular, u.fk_empresa, u.fk_cargo, c.nome_cargo, c.nivel 
        FROM usuario AS u 
        JOIN cargo AS c ON u.fk_cargo = c.id_cargo
        ${clausulaWhere};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function editar(id, nome, email, contato, cargo){
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n")

    var instrucaoSql = `
        UPDATE usuario SET 
            nome = '${nome}', 
            email = '${email}', 
            celular = '${contato}',
            fk_cargo = (
                SELECT id_cargo
                FROM cargo
                WHERE nome_cargo = '${cargo}'
                LIMIT 1
            )
        WHERE id_usuario = ${id};     
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function deletar(id) {
    var instrucaoSql = `
        DELETE FROM usuario
        WHERE id_usuario = ${id};
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function autenticar(email, senha) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", email, senha)
    var instrucaoSql = `
        SELECT id_usuario, nome, email, fk_empresa, fk_cargo 
        FROM usuario 
        WHERE email = '${email}' AND senha = '${senha}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function redefinirSenha(idUsuario, novaSenha) {
    var instrucaoSql = `
        UPDATE usuario SET senha = '${novaSenha}' WHERE id_usuario = ${idUsuario};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarPermissoes(idUsuario) {
    console.log("ACESSEI O USUARIO MODEL - buscarPermissoes():", idUsuario);

    var instrucaoSql = `
        SELECT 
            cp.fk_cargo,
            c.nome_cargo,
            cp.fk_permissao,
            p.nome_permissao
        FROM cargo_permissao cp
        JOIN cargo c ON cp.fk_cargo = c.id_cargo
        JOIN permissao p ON cp.fk_permissao = p.id_permissao
        WHERE cp.fk_cargo = (
            SELECT fk_cargo FROM usuario WHERE id_usuario = ${idUsuario} LIMIT 1
        ) OR cp.fk_cargo = ${idUsuario};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    cadastrar,
    listarTodos,
    editar,
    deletar,
    autenticar,
    redefinirSenha,
    buscarPermissoes
};