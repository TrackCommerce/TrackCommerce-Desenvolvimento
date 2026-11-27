const usernameElement = document.querySelector("#id_username");

if (usernameElement) {

    usernameElement.textContent = sessionStorage.getItem("NOME_USUARIO") || "";

    usernameElement.textContent = sessionStorage.getItem("NOME_USUARIO") || "Usuário";

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
 * Consulta o back-end para confirmar se o usuário autenticado é um Gestor
 * autorizado a acessar a Central de Status.
 */
async function validarAcessoCentralStatus(idUsuario) {
    if (!idUsuario) {
        sessionStorage.setItem("EH_GESTOR", "false");
        return { autorizado: false, semSessao: true };
    }

    try {
        const resposta = await fetch(`/central-status/validar-acesso/${encodeURIComponent(idUsuario)}`);
        if (resposta.ok) {
            const dados = await resposta.json();
            const autorizado = Boolean(dados && dados.autorizado);
            sessionStorage.setItem("EH_GESTOR", autorizado ? "true" : "false");
            return { autorizado, dados };
        }

        sessionStorage.setItem("EH_GESTOR", "false");
        return { autorizado: false, status: resposta.status };
    } catch (erro) {
        console.error("[Central de Status] Falha ao validar acesso no servidor:", erro);
        return { autorizado: false, erroRede: true };
    }
}

window.validarAcessoCentralStatus = validarAcessoCentralStatus;

const ICONES_VETORIZADOS_SIDEBAR = {
    central: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
    painel: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h5v-6h4v6h5V10"/></svg>`,
    alertas: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8"/><path d="M10.3 20a1.94 1.94 0 0 0 3.4 0"/></svg>`,
    permissoes: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="7.5" cy="15.5" r="4.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/></svg>`,
    servidores: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/><path d="M7 7h.01M7 17h.01"/></svg>`,
    funcionarios: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`
};

function identificarChaveIconeSidebar(item) {
    const href = (item.getAttribute("href") || "").toLowerCase();
    const texto = (item.textContent || "").trim().toLowerCase();

    if (href.includes("central-status")) return "central";
    if (href.includes("selecionar-servidor") || href.includes("dashboard") || texto.includes("painel")) return "painel";
    if (href.includes("alertas") || texto.includes("alertas")) return "alertas";
    if (href.includes("permissoes") || texto.includes("permiss")) return "permissoes";
    if (href.includes("cadastro-instancia") || href.includes("lista-instancia") || texto.includes("servidores")) return "servidores";
    if (href.includes("registrofunc") || texto.includes("funcion")) return "funcionarios";
    return null;
}

/**
 * Substitui os ícones de imagem dos itens do sidebar por SVGs vetoriais inline
 * com stroke="currentColor", permitindo destacar o ícone ativo em branco.
 */
function vetorizarIconesSidebar() {
    const itens = document.querySelectorAll(".sidebar .menu .item");
    itens.forEach(item => {
        const chave = identificarChaveIconeSidebar(item);
        const containerIcone = item.querySelector(".icone");
        if (!chave || !containerIcone) return;
        containerIcone.innerHTML = ICONES_VETORIZADOS_SIDEBAR[chave];
    });
}

/**
 * Configura o comportamento responsivo de menu hambúrguer para celular (<= 768px)
 * com overlay escurecido em 20% ao abrir a barra lateral.
 */
function configurarMenuMobileSidebar() {
    const sidebar = document.querySelector(".sidebar");
    if (!sidebar || document.getElementById("btnSidebarHamburguer")) return;

    if (!sidebar.id) {
        sidebar.id = "sidebarPrincipal";
    }

    const logo = sidebar.querySelector(".logo");
    if (logo && !sidebar.querySelector(".sidebar-topo")) {
        const topo = document.createElement("div");
        topo.className = "sidebar-topo";
        logo.parentNode.insertBefore(topo, logo);
        topo.appendChild(logo);

        const btnFechar = document.createElement("button");
        btnFechar.type = "button";
        btnFechar.className = "btn-sidebar-fechar";
        btnFechar.setAttribute("aria-label", "Fechar menu lateral");
        btnFechar.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
        topo.appendChild(btnFechar);
        btnFechar.addEventListener("click", fecharSidebarMobile);
    }

    const btnHamburguer = document.createElement("button");
    btnHamburguer.type = "button";
    btnHamburguer.id = "btnSidebarHamburguer";
    btnHamburguer.className = "btn-sidebar-hamburguer";
    btnHamburguer.setAttribute("aria-label", "Abrir menu de navegação");
    btnHamburguer.setAttribute("aria-expanded", "false");
    btnHamburguer.setAttribute("aria-controls", sidebar.id);
    btnHamburguer.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`;

    const backdrop = document.createElement("div");
    backdrop.id = "sidebarBackdrop";
    backdrop.className = "sidebar-backdrop";
    backdrop.setAttribute("aria-hidden", "true");

    document.body.appendChild(backdrop);
    document.body.appendChild(btnHamburguer);

    function sincronizarComVisualViewport() {
        if (window.innerWidth > 768 || !window.visualViewport) {
            sidebar.style.removeProperty("top");
            sidebar.style.removeProperty("height");
            backdrop.style.removeProperty("top");
            backdrop.style.removeProperty("height");
            btnHamburguer.style.removeProperty("top");
            btnHamburguer.style.removeProperty("left");
            return;
        }

        const vv = window.visualViewport;
        if (vv.offsetTop > 0 || vv.offsetLeft > 0) {
            sidebar.style.setProperty("top", `${vv.offsetTop}px`, "important");
            sidebar.style.setProperty("height", `${vv.height}px`, "important");
            backdrop.style.setProperty("top", `${vv.offsetTop}px`, "important");
            backdrop.style.setProperty("height", `${vv.height}px`, "important");
            btnHamburguer.style.setProperty("top", `${vv.offsetTop + 12}px`, "important");
            btnHamburguer.style.setProperty("left", `${vv.offsetLeft + 12}px`, "important");
        } else {
            sidebar.style.removeProperty("top");
            sidebar.style.setProperty("height", `${vv.height}px`, "important");
            backdrop.style.removeProperty("top");
            backdrop.style.removeProperty("height");
            btnHamburguer.style.removeProperty("top");
            btnHamburguer.style.removeProperty("left");
        }
    }

    function abrirSidebarMobile() {
        sidebar.scrollTop = 0;
        sincronizarComVisualViewport();
        sidebar.classList.add("aberta");
        backdrop.classList.add("visivel");
        document.body.classList.add("sidebar-mobile-aberta");
        btnHamburguer.setAttribute("aria-expanded", "true");
    }

    function fecharSidebarMobile() {
        sidebar.classList.remove("aberta");
        backdrop.classList.remove("visivel");
        document.body.classList.remove("sidebar-mobile-aberta");
        btnHamburguer.setAttribute("aria-expanded", "false");
    }

    btnHamburguer.addEventListener("click", () => {
        if (sidebar.classList.contains("aberta")) {
            fecharSidebarMobile();
        } else {
            abrirSidebarMobile();
        }
    });

    backdrop.addEventListener("click", fecharSidebarMobile);

    sidebar.querySelectorAll(".menu .item").forEach(item => {
        item.addEventListener("click", () => {
            if (window.innerWidth <= 768) {
                fecharSidebarMobile();
            }
        });
    });

    document.addEventListener("keydown", evento => {
        if (evento.key === "Escape" && sidebar.classList.contains("aberta")) {
            fecharSidebarMobile();
        }
    });

    if (window.visualViewport) {
        window.visualViewport.addEventListener("resize", sincronizarComVisualViewport);
        window.visualViewport.addEventListener("scroll", sincronizarComVisualViewport);
    }

    window.addEventListener("scroll", sincronizarComVisualViewport, { passive: true });
    window.addEventListener("resize", () => {
        sincronizarComVisualViewport();
        if (window.innerWidth > 768 && sidebar.classList.contains("aberta")) {
            fecharSidebarMobile();
        }
    });

    sincronizarComVisualViewport();
}

/**
 * Garante que o link "Central" apareça na sidebar apenas para gestores
 * e fique oculto para os demais perfis.
 */
function sincronizarLinkCentralSidebar(ehGestor, isSubdir) {
    const menu = document.querySelector(".sidebar .menu");
    if (!menu) return;

    const prefixo = isSubdir ? "../" : "";
    let linkCentral = menu.querySelector('a[href*="central-status.html"]');

    if (ehGestor) {
        if (!linkCentral) {
            linkCentral = document.createElement("a");
            linkCentral.href = `${prefixo}central-status.html`;
            linkCentral.className = "item";
            linkCentral.innerHTML = `
                <div class="icone">
                    ${ICONES_VETORIZADOS_SIDEBAR.central}
                </div>
                <span>Central</span>
            `;
            menu.insertBefore(linkCentral, menu.firstChild);
        } else {
            linkCentral.classList.remove("bloqueado");
            linkCentral.style.removeProperty("display");
        }
    } else if (linkCentral) {
        linkCentral.classList.add("bloqueado");
        linkCentral.style.setProperty("display", "none", "important");
    }
}

/**
 * Aplica as regras de bloqueio na sidebar e protege as rotas:
 * - Central de Status: restrita apenas a gestores validados pelo back-end.
 * - fk_cargo != 1: oculta e bloqueia telas de gerenciamento de usuário (editar grupos e cadastrar funcionários).
 * - fk_permissao 1 ausente: oculta "Painel" (dashboards) e redireciona caso acesse diretamente.
 * - fk_permissao 3 ausente: oculta "Cadastro de Servidores" e redireciona caso acesse diretamente.
 */
async function aplicarControleDeAcesso() {
    const dados = await obterDadosUsuario();
    const idUsuario = dados.idUsuario;
    const idUsuarioSessao = sessionStorage.getItem("ID_USUARIO");
    const fkCargo = dados.fkCargo;
    const permissoes = dados.permissoes;

    const ehAdmin = (fkCargo === 1);
    const temPermissao1 = permissoes.includes(1); // visualização (Painel / Dashboards)
    const temPermissao3 = permissoes.includes(3); // cadastro de servidores

    const pathname = window.location.pathname.toLowerCase();
    const isSubdir = pathname.includes("/dashboard/");
    const estaNaCentralStatus = pathname.endsWith("central-status.html");

    if (pathname.endsWith("login.html") || pathname.endsWith("index.html") || pathname === "/" || pathname.endsWith("cadastro-gestor.html")) {
        return;
    }

    const validacaoCentral = await validarAcessoCentralStatus(idUsuarioSessao);
    const ehGestor = validacaoCentral.autorizado;

    if (estaNaCentralStatus) {
        if (!ehGestor) {
            if (validacaoCentral.semSessao) {
                alert("Faça login com uma conta de gestor para acessar a Central de Status.");
                window.location.href = "login.html";
                return;
            }
            alert("Acesso negado: apenas gestores têm acesso à Central de Status.");
            const destino = temPermissao1 ? "selecionar-servidor.html" : "alertas.html";
            window.location.href = destino;
            return;
        }

        const roleElement = document.querySelector("#id_user_role");
        if (roleElement && validacaoCentral.dados && validacaoCentral.dados.usuario && validacaoCentral.dados.usuario.nome_cargo) {
            roleElement.textContent = validacaoCentral.dados.usuario.nome_cargo;
        }
        document.body.classList.remove("validando-acesso");
    }

    sincronizarLinkCentralSidebar(ehGestor, isSubdir);
    vetorizarIconesSidebar();
    configurarMenuMobileSidebar();

    // Sem sessão identificada, preserva o menu das dashboards como referência visual,
    // mas não permite navegar por ele até que o usuário faça login.
    if (!idUsuario && pathname.includes("/dashboard/")) {
        document.querySelectorAll(".sidebar .menu .item").forEach(item => {
            if ((item.getAttribute("href") || "").toLowerCase().includes("alertas.html")) return;
            item.setAttribute("aria-disabled", "true");
            item.title = "Entre na sua conta para acessar";
            item.addEventListener("click", event => event.preventDefault());
        });
        return;
    }


    // 1. Ocultar itens no menu aside
    const itensMenu = document.querySelectorAll(".sidebar .menu .item, .sidebar nav a, aside .menu a");
    itensMenu.forEach(item => {
        const texto = (item.textContent || "").trim().toLowerCase();
        const href = (item.getAttribute("href") || "").toLowerCase();

        const ehCentral = href.includes("central-status");
        const ehPainel = texto.includes("painel") || href.includes("selecionar-servidor");
        const ehCadastroServidores = texto.includes("cadastro de servidores") || href.includes("cadastro-instancia") || href.includes("lista-instancia");
        const ehPermissoesGrupos = texto.includes("permissões de grupos") || texto.includes("permissoes de grupos") || href.includes("permissoes.html");
        const ehCadastroFuncionarios = texto.includes("cadastro de funcionários") || texto.includes("cadastro de funcionarios") || href.includes("registrofunc.html");

        if (ehCentral && !ehGestor) {
            item.classList.add("bloqueado");
            item.style.setProperty("display", "none", "important");
        }

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
