var database = require("../database/config")

function cadastrar(nome, email, contato, cargo) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", nome, email, contato, cargo);
    
    // Insira exatamente a query do banco aqui, lembrando da nomenclatura exata nos valores
    //  e na ordem de inserção dos dados.
    var instrucaoSql = `
        INSERT INTO usuario (nome, email, celular, fk_cargo) VALUES ('${nome}', '${email}', '${contato}', (
                SELECT id_cargo
                FROM cargo
                WHERE nome_cargo = '${cargo}'
            ));
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function listarTodos(){
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n")

    var instrucaoSql = `
        SELECT u.id_usuario, u.nome, u.email, u.celular, c.nome_cargo FROM usuario as u JOIN cargo as c ON u.fk_cargo = c.id_cargo;
    `
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function editar(id, nome, email, contato, cargo){
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n")

    var instrucaoSql = `
        UPDATE usuario SET nome = "${nome}", 
            email = "${email}", 
            celular = "${contato}",
            fk_cargo = (
                SELECT id_cargo
                FROM cargo
                WHERE nome_cargo = '${cargo}'
            )
        WHERE id_usuario = ${id};     
    `
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

module.exports = {
    cadastrar,
    listarTodos,
    editar,
    deletar
};