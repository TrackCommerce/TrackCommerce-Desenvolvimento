var database = require("../database/config");

function buscarEmpresaPorId(idEmpresa) {
    return database.executar(`
        SELECT id_empresa, razao_social, token_instalacao
        FROM empresa
        WHERE id_empresa = ?;
    `, [idEmpresa]);
}

function definirTokenInstalacao(idEmpresa, token) {
    return database.executar(`
        UPDATE empresa
        SET token_instalacao = COALESCE(token_instalacao, ?)
        WHERE id_empresa = ?;
    `, [token, idEmpresa]);
}

function buscarEmpresaPorToken(token) {
    return database.executar(`
        SELECT id_empresa, razao_social
        FROM empresa
        WHERE token_instalacao = ?;
    `, [token]);
}

function buscarInstanciaPorIdentificador(identificador) {
    return database.executar(`
        SELECT id_instancia, fk_empresa, nome, identificador, ativo
        FROM instancias
        WHERE identificador = ?;
    `, [identificador]);
}

function cadastrarInstanciaAutomatica(empresa, nome, descricao, identificador) {
    return database.executar(`
        INSERT INTO instancias (fk_empresa, nome, descricao, identificador, ativo)
        VALUES (?, ?, ?, ?, 1);
    `, [empresa, nome, descricao, identificador]);
}

function reativarInstancia(idInstancia, empresa, nome, descricao) {
    return database.executar(`
        UPDATE instancias
        SET nome = ?, descricao = ?, ativo = 1
        WHERE id_instancia = ? AND fk_empresa = ?;
    `, [nome, descricao, idInstancia, empresa]);
}

module.exports = {
    buscarEmpresaPorId,
    definirTokenInstalacao,
    buscarEmpresaPorToken,
    buscarInstanciaPorIdentificador,
    cadastrarInstanciaAutomatica,
    reativarInstancia
};
