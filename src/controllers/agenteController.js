var crypto = require("crypto");
var fs = require("fs/promises");
var path = require("path");
var agenteModel = require("../models/agenteModel");

var TOKEN_REGEX = /^[a-f0-9]{64}$/i;

function numeroPositivo(valor) {
    var numero = Number(valor);
    return Number.isSafeInteger(numero) && numero > 0 ? numero : null;
}

function textoValido(valor, limite) {
    return typeof valor === "string" && valor.trim() !== "" && valor.trim().length <= limite;
}

async function obterEmpresaComToken(idEmpresa) {
    var empresas = await agenteModel.buscarEmpresaPorId(idEmpresa);
    if (empresas.length === 0) return null;

    if (!empresas[0].token_instalacao) {
        await agenteModel.definirTokenInstalacao(idEmpresa, crypto.randomBytes(32).toString("hex"));
        empresas = await agenteModel.buscarEmpresaPorId(idEmpresa);
    }

    return empresas[0];
}

async function baixar(req, res) {
    var idEmpresa = numeroPositivo(req.body && req.body.empresaServidor);
    if (!idEmpresa) {
        return res.status(400).send("Informe uma empresa válida para baixar o agente.");
    }

    try {
        var empresa = await obterEmpresaComToken(idEmpresa);
        if (!empresa) {
            return res.status(404).send("Empresa não encontrada.");
        }

        var apiBaseUrl = process.env.AGENT_API_URL || `${req.protocol}://${req.get("host")}`;
        var template = await fs.readFile(path.join(__dirname, "../agente/script-escrita.py"), "utf8");
        var agente = template
            .replace('"__TRACKCOMMERCE_TOKEN__"', JSON.stringify(empresa.token_instalacao))
            .replace('"__TRACKCOMMERCE_API_URL__"', JSON.stringify(apiBaseUrl.replace(/\/$/, "")));

        res.set("Cache-Control", "no-store");
        res.attachment("trackcommerce-agente.py");
        return res.type("text/x-python; charset=utf-8").send(agente);
    } catch (erro) {
        console.error("Erro ao gerar o agente TrackCommerce:", erro.message);
        return res.status(500).send("Não foi possível gerar o agente de instalação.");
    }
}

async function ativar(req, res) {
    var authorization = req.get("authorization") || "";
    var token = authorization.replace(/^Bearer\s+/i, "").trim();
    var dados = req.body || {};

    if (!TOKEN_REGEX.test(token)) {
        return res.status(401).json({ mensagem: "Token de instalação ausente ou inválido." });
    }
    if (!textoValido(dados.identificadorServidor, 500)) {
        return res.status(400).json({ mensagem: "Informe um identificador de máquina válido." });
    }
    if (!textoValido(dados.nomeServidor, 50)) {
        return res.status(400).json({ mensagem: "Informe um nome de máquina com até 50 caracteres." });
    }

    var identificador = dados.identificadorServidor.trim();
    var nome = dados.nomeServidor.trim();
    var detalhes = [dados.sistemaOperacional, dados.plataforma]
        .filter(function (item) { return typeof item === "string" && item.trim() !== ""; })
        .join(" - ")
        .slice(0, 200);

    try {
        var empresas = await agenteModel.buscarEmpresaPorToken(token);
        if (empresas.length === 0) {
            return res.status(403).json({ mensagem: "Token de instalação não reconhecido." });
        }

        var empresa = empresas[0];
        var instancias = await agenteModel.buscarInstanciaPorIdentificador(identificador);

        if (instancias.length > 0) {
            var instancia = instancias[0];
            if (instancia.fk_empresa !== empresa.id_empresa) {
                return res.status(409).json({ mensagem: "Esta máquina já pertence a outra empresa." });
            }

            await agenteModel.reativarInstancia(instancia.id_instancia, empresa.id_empresa, nome, detalhes || null);
            return res.status(200).json({
                mensagem: "Agente ativado com sucesso.",
                id_instancia: instancia.id_instancia,
                id_empresa: empresa.id_empresa,
                empresa: empresa.razao_social
            });
        }

        var resultado = await agenteModel.cadastrarInstanciaAutomatica(
            empresa.id_empresa,
            nome,
            detalhes || null,
            identificador
        );
        return res.status(201).json({
            mensagem: "Máquina cadastrada e agente ativado com sucesso.",
            id_instancia: resultado.insertId,
            id_empresa: empresa.id_empresa,
            empresa: empresa.razao_social
        });
    } catch (erro) {
        if (erro.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ mensagem: "Esta máquina acabou de ser cadastrada. Execute o agente novamente." });
        }
        console.error("Erro ao ativar o agente TrackCommerce:", erro.message);
        return res.status(500).json({ mensagem: "Não foi possível ativar o agente." });
    }
}

module.exports = { baixar, ativar };
