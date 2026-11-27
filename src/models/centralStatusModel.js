var database = require("../database/config");

/**
 * Busca os dados básicos e o cargo de um usuário para validar o acesso à Central de Status.
 */
function buscarUsuarioParaAcesso(idUsuario) {
    var idNumerico = Number(idUsuario);
    if (!Number.isInteger(idNumerico) || idNumerico <= 0) {
        return Promise.resolve([]);
    }

    var instrucaoSql = `
        SELECT
            u.id_usuario,
            u.nome,
            u.email,
            u.fk_empresa,
            u.fk_cargo,
            c.nome_cargo,
            c.nivel
        FROM usuario u
        LEFT JOIN cargo c ON u.fk_cargo = c.id_cargo
        WHERE u.id_usuario = ${idNumerico}
        LIMIT 1;
    `;
    console.log("Executando a instrução SQL (Central de Status): \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    buscarUsuarioParaAcesso
};
