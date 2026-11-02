const usernameElement = document.querySelector("#id_username");

if (usernameElement) {
    usernameElement.textContent = sessionStorage.getItem("NOME_USUARIO") || "";
}

/**
 * Busca as permissões e o cargo do usuário atual no banco de dados através da rota /usuario/permissoes/:idUsuario
 * e armazena em cache na sessionStorage.
 * retorna Lista de IDs das permissões (fk_permissao)
 */
async function obterPermissoesUsuario() {
    const dados = await obterDadosUsuario();
    return dados.permissoes;
}

window.obterPermissoesUsuario = obterPermissoesUsuario;

/**
 * Obtém o ID do cargo do usuário (fk_cargo).
 * retorna o numero ou null
 */
function obterFkCargoUsuario() {
    const fkCargo = sessionStorage.getItem("FK_CARGO");
    if (fkCargo != null && fkCargo !== "") {
        return Number(fkCargo);
    }
    if (window.fkCargoUsuario != null) {
        return Number(window.fkCargoUsuario);
    }
    return null;
}

window.obterFkCargoUsuario = obterFkCargoUsuario;

/**
 * Carrega permissões e cargo do usuário do backend ou do cache de sessão.
 */
async function obterDadosUsuario() {
    const idUsuario = sessionStorage.getItem("ID_USUARIO") || sessionStorage.getItem("FK_CARGO");
    let fkCargo = sessionStorage.getItem("FK_CARGO");

    let permissoes = [];
    const cachePermissoes = sessionStorage.getItem("PERMISSOES_USUARIO");
    const cacheUsuario = sessionStorage.getItem("PERMISSOES_ID_USUARIO");

    if (cachePermissoes && cacheUsuario === String(idUsuario)) {
        try {
            permissoes = JSON.parse(cachePermissoes);
        } catch (e) {
            console.error("[Permissões] Erro ao ler permissões em cache:", e);
        }
    }

    if (idUsuario) {
        try {
            const resposta = await fetch(`/usuario/permissoes/${idUsuario}`);
            if (resposta.ok) {
                const dados = await resposta.json();
                if (Array.isArray(dados) && dados.length > 0) {
                    permissoes = dados.map(item => Number(item.fk_permissao)).filter(n => !isNaN(n));
                    if (dados[0].fk_cargo) {
                        fkCargo = String(dados[0].fk_cargo);
                        sessionStorage.setItem("FK_CARGO", fkCargo);
                    }
                }
                sessionStorage.setItem("PERMISSOES_USUARIO", JSON.stringify(permissoes));
                sessionStorage.setItem("PERMISSOES_ID_USUARIO", String(idUsuario));
            } else {
                console.error("[Permissões] Erro na requisição:", resposta.status);
            }
        } catch (erro) {
            console.error("[Permissões] Falha ao consultar rota de permissões:", erro);
        }
    }

    const cargoNum = fkCargo ? Number(fkCargo) : null;
    window.fkCargoUsuario = cargoNum;
    window.permissoesUsuario = permissoes;

    return {
        idUsuario,
        fkCargo: cargoNum,
        permissoes
    };
}

window.obterDadosUsuario = obterDadosUsuario;

/**
 * Aplica as regras de bloqueio na sidebar e protege as rotas:
 * - fk_cargo != 1: oculta e bloqueia telas de gerenciamento de usuário (editar grupos e cadastrar funcionários).
 * - fk_permissao 1 ausente: oculta "Painel" (dashboards) e redireciona caso acesse diretamente.
 * - fk_permissao 3 ausente: oculta "Cadastro de Servidores" e redireciona caso acesse diretamente.
 */
async function aplicarControleDeAcesso() {
    const dados = await obterDadosUsuario();
    const idUsuario = dados.idUsuario;
    const fkCargo = dados.fkCargo;
    const permissoes = dados.permissoes;

    const ehAdmin = (fkCargo === 1);
    const temPermissao1 = permissoes.includes(1); // visualização (Painel / Dashboards)
    const temPermissao3 = permissoes.includes(3); // cadastro de servidores

    // 1. Ocultar itens no menu aside
    const itensMenu = document.querySelectorAll(".sidebar .menu .item, .sidebar nav a, aside .menu a");
    itensMenu.forEach(item => {
        const texto = (item.textContent || "").trim().toLowerCase();
        const href = (item.getAttribute("href") || "").toLowerCase();

        const ehPainel = texto.includes("painel") || href.includes("selecionar-servidor");
        const ehCadastroServidores = texto.includes("cadastro de servidores") || href.includes("cadastro-instancia") || href.includes("lista-instancia");
        const ehPermissoesGrupos = texto.includes("permissões de grupos") || texto.includes("permissoes de grupos") || href.includes("permissoes.html");
        const ehCadastroFuncionarios = texto.includes("cadastro de funcionários") || texto.includes("cadastro de funcionarios") || href.includes("registrofunc.html");

        // Regra: Apenas fk_cargo == 1 (Administrador) tem acesso ao gerenciamento de usuário
        if ((ehPermissoesGrupos || ehCadastroFuncionarios) && !ehAdmin) {
            item.classList.add("bloqueado");
            item.style.setProperty("display", "none", "important");
        }

        // Regra: fk_permissao 1 ausente bloqueia "Painel"
        if (ehPainel && !temPermissao1) {
            item.classList.add("bloqueado");
            item.style.setProperty("display", "none", "important");
        }

        // Regra: fk_permissao 3 ausente bloqueia "Cadastro de Servidores"
        if (ehCadastroServidores && !temPermissao3) {
            item.classList.add("bloqueado");
            item.style.setProperty("display", "none", "important");
        }
    });

    // 2. Bloqueio de rota direta
    const pathname = window.location.pathname.toLowerCase();
    const isSubdir = pathname.includes("/dashboard/");

    if (pathname.endsWith("login.html") || pathname.endsWith("index.html") || pathname === "/" || pathname.endsWith("cadastro-gestor.html")) {
        return;
    }

    if (idUsuario) {
        // Bloqueio das telas de gerenciamento de usuário se não for Administrador (fk_cargo == 1)
        const estaEmGerenciamentoUsuario = pathname.endsWith("permissoes.html") || pathname.endsWith("registrofunc.html");
        if (!ehAdmin && estaEmGerenciamentoUsuario) {
            alert("Acesso negado: apenas administradores (cargo Administrador) possuem acesso ao gerenciamento de usuários e grupos.");
            const destino = temPermissao1 ? "selecionar-servidor.html" : "alertas.html";
            window.location.href = destino;
            return;
        }

        // Bloqueio se não tem permissão 1
        const estaNoPainelOuDashboard = pathname.endsWith("selecionar-servidor.html") || pathname.includes("/dashboard/") || pathname.endsWith("dashboard-especifica.html");
        if (!temPermissao1 && estaNoPainelOuDashboard) {
            alert("Acesso negado: seu cargo não possui permissão de visualização do Painel/Dashboards.");
            const destino = isSubdir ? "../alertas.html" : "alertas.html";
            window.location.href = destino;
            return;
        }

        // Bloqueio se não tem permissão 3
        const estaNoCadastroServidor = pathname.endsWith("cadastro-instancia.html") || pathname.endsWith("lista-instancia.html");
        if (!temPermissao3 && estaNoCadastroServidor) {
            alert("Acesso negado: seu cargo não possui permissão para acessar o cadastro de servidores.");
            const destino = temPermissao1 ? (isSubdir ? "../selecionar-servidor.html" : "selecionar-servidor.html") : (isSubdir ? "../alertas.html" : "alertas.html");
            window.location.href = destino;
            return;
        }
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", aplicarControleDeAcesso);
} else {
    aplicarControleDeAcesso();
}
