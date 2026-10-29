// Validação de acesso restrito a funcionários da TrackCommerce (@TrackCommerce.com)
// function validarAcesso() {
//     const emailUsuario = sessionStorage.getItem("EMAIL_USUARIO");
//     const nomeUsuario = sessionStorage.getItem("NOME_USUARIO");

//     if (!emailUsuario || !emailUsuario.trim().toLowerCase().endsWith("@trackcommerce.com")) {
//         alert("Acesso restrito! Esta página só pode ser acessada por funcionários da TrackCommerce (@TrackCommerce.com).");
//         window.location.href = "login.html";
//         return false;
//     }

//     const perfilNome = document.getElementById("perfil_nome");
//     if (perfilNome) {
//         perfilNome.innerHTML = `${nomeUsuario || "Funcionário"}<br>TrackCommerce`;
//     }

//     return true;
// }

let todosGestores = [];
let gestoresFiltrados = [];
let paginaAtual = 1;
const ITENS_POR_PAGINA = 7;
const tokensRevelados = {};

function obterIniciais(nome) {
    if (!nome) return "TC";
    const partes = nome.trim().split(" ");
    if (partes.length === 1) return partes[0].substring(0, 2).toUpperCase();
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}

function carregarGestores() {
    const corpoTabela = document.getElementById("corpo_tabela");
    corpoTabela.innerHTML = `
        <tr>
            <td colspan="5" style="text-align: center; padding: 24px; color: #6b7790;">
                Carregando gestores...
            </td>
        </tr>
    `;

    fetch("/gestor/listar")
        .then(function (resposta) {
            if (resposta.ok) {
                return resposta.json();
            } else {
                throw new Error("Erro ao carregar lista de gestores.");
            }
        })
        .then(function (dados) {
            todosGestores = dados || [];
            gestoresFiltrados = [...todosGestores];
            paginaAtual = 1;
            renderizarTabela();
        })
        .catch(function (erro) {
            console.error("Erro na requisição:", erro);
            corpoTabela.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 24px; color: #ff4a05;">
                        Erro ao carregar os gestores. Verifique se o servidor está ativo.
                    </td>
                </tr>
            `;
        });
}

function filtrarGestores() {
    const termo = (document.getElementById("ipt_busca").value || "").trim().toLowerCase();

    if (!termo) {
        gestoresFiltrados = [...todosGestores];
    } else {
        gestoresFiltrados = todosGestores.filter(function (g) {
            const email = (g.email || "").toLowerCase();
            const nome = (g.nome || "").toLowerCase();
            const empresa = (g.empresa || "").toLowerCase();
            return email.includes(termo) || nome.includes(termo) || empresa.includes(termo);
        });
    }

    paginaAtual = 1;
    renderizarTabela();
}

function toggleToken(idUsuario) {
    tokensRevelados[idUsuario] = !tokensRevelados[idUsuario];
    renderizarTabela();
}

function renderizarTabela() {
    const corpoTabela = document.getElementById("corpo_tabela");
    const qtdGestores = document.getElementById("qtd_gestores");
    const textoPaginacao = document.getElementById("texto_paginacao");
    const containerBotoes = document.getElementById("botoes_paginacao");

    const total = gestoresFiltrados.length;
    qtdGestores.textContent = `${total} ${total === 1 ? "usuário" : "usuários"}`;

    if (total === 0) {
        corpoTabela.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 32px; color: #6b7790;">
                    Nenhum gestor encontrado.
                </td>
            </tr>
        `;
        textoPaginacao.textContent = "Exibindo 0 de 0 usuários";
        containerBotoes.innerHTML = "";
        return;
    }

    const totalPaginas = Math.ceil(total / ITENS_POR_PAGINA);
    if (paginaAtual > totalPaginas) paginaAtual = totalPaginas;

    const indiceInicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
    const indiceFim = Math.min(indiceInicio + ITENS_POR_PAGINA, total);
    const itensPagina = gestoresFiltrados.slice(indiceInicio, indiceFim);

    textoPaginacao.textContent = `Exibindo ${indiceInicio + 1}–${indiceFim} de ${total} usuários`;

    let html = "";
    itensPagina.forEach(function (gestor, idx) {
        const iniciais = obterIniciais(gestor.nome);
        const classeAvatar = (idx % 2 === 0) ? "avatar laranja" : "avatar";
        const codigoFormatado = `TC-${String(gestor.id_usuario).padStart(3, "0")}`;
        const estaRevelado = !!tokensRevelados[gestor.id_usuario];

        let tokenExibido = "•••• •••• ••••";
        if (estaRevelado) {
            tokenExibido = gestor.token_jira ? gestor.token_jira : "Sem token cadastrado";
        }

        html += `
            <tr>
                <td>
                    <div class="usuario">
                        <span class="${classeAvatar}">${iniciais}</span>
                        <div>
                            <p class="usuario-nome">${gestor.nome}</p>
                            <p class="usuario-codigo">${codigoFormatado} • ${gestor.empresa || "Empresa"}</p>
                        </div>
                    </div>
                </td>
                <td class="email">${gestor.email}</td>
                <td><span class="etiqueta-cargo">${gestor.cargo || "Administrador"}</span></td>
                <td class="token" style="${estaRevelado ? 'font-family: monospace; font-size: 11px; color: var(--laranja);' : ''}">${tokenExibido}</td>
                <td class="acoes">
                    <button class="botao-icone" onclick="toggleToken(${gestor.id_usuario})" title="${estaRevelado ? 'Ocultar Token' : 'Visualizar Token'}" aria-label="Ver Token">
                        <img class="icone" src="./assets/imgs/olho.svg" alt="Ver">
                    </button>
                </td>
            </tr>
        `;
    });

    corpoTabela.innerHTML = html;
    renderizarPaginacao(totalPaginas);
}

function renderizarPaginacao(totalPaginas) {
    const container = document.getElementById("botoes_paginacao");
    let html = "";

    // Botão Anterior
    html += `
        <button class="pagina-botao" onclick="mudarPagina(${paginaAtual - 1})" ${paginaAtual === 1 ? "disabled style='opacity: 0.5; cursor: default;'" : ""}>
            <img class="icone" src="./assets/imgs/esquerda.svg" alt=""> Anterior
        </button>
    `;

    // Botões numéricos de páginas
    for (let p = 1; p <= totalPaginas; p++) {
        const classeAtual = (p === paginaAtual) ? "pagina-botao pagina-atual" : "pagina-botao";
        html += `<button class="${classeAtual}" onclick="mudarPagina(${p})">${p}</button>`;
    }

    // Botão Próxima
    html += `
        <button class="pagina-botao" onclick="mudarPagina(${paginaAtual + 1})" ${paginaAtual === totalPaginas ? "disabled style='opacity: 0.5; cursor: default;'" : ""}>
            Próxima <img class="icone" src="./assets/imgs/direita.svg" alt="">
        </button>
    `;

    container.innerHTML = html;
}

function mudarPagina(novaPagina) {
    const totalPaginas = Math.ceil(gestoresFiltrados.length / ITENS_POR_PAGINA);
    if (novaPagina < 1 || novaPagina > totalPaginas) return;
    paginaAtual = novaPagina;
    renderizarTabela();
}

document.addEventListener("DOMContentLoaded", function () {
    // if (validarAcesso()) {
    //     carregarGestores();
    // }
    carregarGestores();
});
