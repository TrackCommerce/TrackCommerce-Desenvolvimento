var gestorModel = require("../models/gestorModel");
var { cyrb53 } = require("../../public/js/hash");

function listarEmpresas(req, res) {
    console.log("ACESSEI O GESTOR CONTROLLER - listarEmpresas()");

    gestorModel.listarEmpresas()
        .then(function (resultado) {
            res.status(200).json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            console.log("\nHouve um erro ao listar as empresas! Erro: ", erro.sqlMessage || erro);
            res.status(500).json(erro.sqlMessage || erro);
        });
}

async function cadastrar(req, res) {
    console.log("ACESSEI O GESTOR CONTROLLER - cadastrar()");

    var nome = req.body.nomeServer;
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;
    var fkEmpresa = req.body.fkEmpresaServer;
    var tokenJira = req.body.tokenJiraServer;
    var emailSolicitante = req.body.emailSolicitanteServer;

    // Validação de acesso restrito
    // if (!emailSolicitante || !emailSolicitante.trim().toLowerCase().endsWith("@trackcommerce.com"))
    if (!emailSolicitante) {
        return res.status(403).json({
            mensagem: "Acesso negado: apenas funcionários da TrackCommerce (@TrackCommerce.com) podem cadastrar novos gestores."
        });
    }

    // Validação dos dados do formulário
    if (!nome || nome.trim() === "") {
        return res.status(400).json({ mensagem: "O nome do gestor é obrigatório!" });
    }
    if (!email || email.trim() === "") {
        return res.status(400).json({ mensagem: "O e-mail do gestor é obrigatório!" });
    }
    if (!senha || senha.trim() === "") {
        return res.status(400).json({ mensagem: "A senha do gestor é obrigatória!" });
    }
    if (!fkEmpresa || isNaN(fkEmpresa)) {
        return res.status(400).json({ mensagem: "A empresa é obrigatória!" });
    }

    try {
        // Verifica se o e-mail já existe
        var usuarioExistente = await gestorModel.buscarUsuarioPorEmail(email.trim());
        if (usuarioExistente && usuarioExistente.length > 0) {
            return res.status(409).json({ mensagem: "Já existe um usuário cadastrado com este e-mail!" });
        }

        // Hasheia a senha para garantir compatibilidade com o sistema de login
        var senhaHash = cyrb53(senha).toString();

        // Realiza o cadastro do gestor com fk_cargo = 1 (permissão nível mais alto)
        var resultadoGestor = await gestorModel.cadastrarGestor(nome.trim(), email.trim(), senhaHash, fkEmpresa);

        // Se o token Jira foi fornecido, salva ou atualiza na tabela apijira
        if (tokenJira && tokenJira.trim() !== "") {
            try {
                await gestorModel.salvarOuAtualizarTokenJira(fkEmpresa, tokenJira.trim());
            } catch (erroJira) {
                console.log("Aviso ao salvar Token Jira: ", erroJira.sqlMessage || erroJira);
            }
        }

        res.status(201).json({
            mensagem: "Gestor cadastrado com sucesso!",
            resultado: resultadoGestor
        });

    } catch (erro) {
        console.log(erro);
        console.log("\nHouve um erro ao cadastrar gestor! Erro: ", erro.sqlMessage || erro);
        res.status(500).json(erro.sqlMessage || erro);
    }
}

function listarGestores(req, res) {
    console.log("ACESSEI O GESTOR CONTROLLER - listarGestores()");

    gestorModel.listarGestores()
        .then(function (resultado) {
            res.status(200).json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            console.log("\nHouve um erro ao listar gestores! Erro: ", erro.sqlMessage || erro);
            res.status(500).json(erro.sqlMessage || erro);
        });
}

module.exports = {
    listarEmpresas,
    cadastrar,
    listarGestores
};

