var centralStatusModel = require("../models/centralStatusModel");

/**
 * Verifica se o usuário autenticado corresponde ao perfil de Gestor de empresa cliente.
 */
function ehUsuarioGestor(usuario) {
    if (!usuario) return false;

    var fkCargo = Number(usuario.fk_cargo);
    var fkEmpresa = Number(usuario.fk_empresa);
    var nomeCargo = String(usuario.nome_cargo || "").trim().toLowerCase();

    if (fkEmpresa === 1) {
        return false;
    }

    return fkCargo === 1 || nomeCargo === "gestor";
}

/**
 * Valida no servidor se o usuário informado possui perfil de Gestor para acessar a Central de Status.
 */
function validarAcesso(req, res) {
    var idUsuario = Number(req.params.idUsuario);

    if (!Number.isInteger(idUsuario) || idUsuario <= 0) {
        return res.status(400).json({
            autorizado: false,
            ehGestor: false,
            mensagem: "ID do usuário inválido para validação de acesso."
        });
    }

    centralStatusModel.buscarUsuarioParaAcesso(idUsuario)
        .then(function (resultado) {
            if (!resultado || resultado.length === 0) {
                return res.status(401).json({
                    autorizado: false,
                    ehGestor: false,
                    mensagem: "Usuário não encontrado."
                });
            }

            var usuario = resultado[0];
            var autorizado = ehUsuarioGestor(usuario);

            if (!autorizado) {
                return res.status(403).json({
                    autorizado: false,
                    ehGestor: false,
                    mensagem: "Acesso negado: apenas gestores têm acesso à Central de Status."
                });
            }

            return res.status(200).json({
                autorizado: true,
                ehGestor: true,
                usuario: {
                    id_usuario: usuario.id_usuario,
                    nome: usuario.nome,
                    fk_empresa: usuario.fk_empresa,
                    fk_cargo: usuario.fk_cargo,
                    nome_cargo: usuario.nome_cargo || "Gestor"
                }
            });
        })
        .catch(function (erro) {
            console.error("Erro ao validar acesso à Central de Status:", erro);
            res.status(500).json({
                autorizado: false,
                ehGestor: false,
                mensagem: erro.sqlMessage || "Erro interno ao validar acesso."
            });
        });
}

module.exports = {
    ehUsuarioGestor,
    validarAcesso
};
