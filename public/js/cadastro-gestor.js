// Validação de acesso restrito a funcionários da TrackCommerce (@TrackCommerce.com)
// function validarAcesso() {
//     const emailUsuario = sessionStorage.getItem("EMAIL_USUARIO") || sessionStorage.EMAIL_USUARIO;
//     const nomeUsuario = sessionStorage.getItem("NOME_USUARIO") || sessionStorage.NOME_USUARIO;

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

// Carregar empresas disponíveis no <select>
function carregarEmpresas() {
    const selectEmpresa = document.getElementById("slct_empresa");

    fetch("/gestor/empresas")
        .then(function (resposta) {
            if (resposta.ok) {
                return resposta.json();
            } else {
                throw new Error("Erro ao buscar empresas.");
            }
        })
        .then(function (empresas) {
            selectEmpresa.innerHTML = '<option value="">Selecione a Empresa</option>';

            if (!empresas || empresas.length === 0) {
                selectEmpresa.innerHTML = '<option value="">Nenhuma empresa encontrada</option>';
                return;
            }

            empresas.forEach(function (empresa) {
                const option = document.createElement("option");
                option.value = empresa.id_empresa;
                option.textContent = empresa.razao_social;
                selectEmpresa.appendChild(option);
            });
        })
        .catch(function (erro) {
            console.error("Erro ao carregar lista de empresas:", erro);
            selectEmpresa.innerHTML = '<option value="">Erro ao carregar empresas</option>';
        });
}

// Alternar visibilidade da senha
function mostrarSenha() {
    const iptSenha = document.getElementById("ipt_senha");
    if (iptSenha.type === "password") {
        iptSenha.type = "text";
    } else {
        iptSenha.type = "password";
    }
}

// Cadastrar novo gestor
function cadastrarGestor() {
    const iptNome = document.getElementById("ipt_nome");
    const iptEmail = document.getElementById("ipt_email");
    const iptSenha = document.getElementById("ipt_senha");
    const slctEmpresa = document.getElementById("slct_empresa");
    const iptTokenJira = document.getElementById("ipt_token_jira");

    const nome = iptNome ? iptNome.value.trim() : "";
    const email = iptEmail ? iptEmail.value.trim() : "";
    const senha = iptSenha ? iptSenha.value : "";
    const fkEmpresa = slctEmpresa ? slctEmpresa.value : "";
    const tokenJira = iptTokenJira ? iptTokenJira.value.trim() : "";
    const emailSolicitante = sessionStorage.getItem("EMAIL_USUARIO") || sessionStorage.EMAIL_USUARIO || "";

    // if (!validarAcesso()) return;

    if (!nome) {
        alert("Por favor, insira o nome do gestor.");
        if (iptNome) iptNome.focus();
        return;
    }

    if (!email) {
        alert("Por favor, insira o e-mail do gestor.");
        if (iptEmail) iptEmail.focus();
        return;
    }

    if (!senha) {
        alert("Por favor, crie uma senha para o gestor.");
        if (iptSenha) iptSenha.focus();
        return;
    }

    if (!fkEmpresa) {
        alert("Por favor, selecione a empresa correspondente.");
        if (slctEmpresa) slctEmpresa.focus();
        return;
    }

    const btnCadastrar = document.getElementById("btn_cadastrar");
    if (btnCadastrar) {
        btnCadastrar.disabled = true;
        btnCadastrar.textContent = "Cadastrando...";
    }

    fetch("/gestor/cadastrar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nomeServer: nome,
            emailServer: email,
            senhaServer: senha,
            fkEmpresaServer: fkEmpresa,
            tokenJiraServer: tokenJira,
            emailSolicitanteServer: emailSolicitante
        })
    })
        .then(async function (resposta) {
            const dados = await resposta.json().catch(() => ({}));

            if (resposta.status === 201) {
                alert("Gestor cadastrado com sucesso!");
                const form = document.getElementById("form_cadastro_gestor");
                if (form) form.reset();
            } else if (resposta.status === 403) {
                alert(dados.mensagem || "Acesso negado: apenas funcionários da TrackCommerce (@TrackCommerce.com) podem realizar esta ação.");
            } else if (resposta.status === 409) {
                alert(dados.mensagem || "Este e-mail já está cadastrado no sistema.");
            } else {
                alert(dados.mensagem || "Houve um erro ao realizar o cadastro. Tente novamente.");
            }
        })
        .catch(function (erro) {
            console.error("Erro na requisição de cadastro:", erro);
            alert("Erro de conexão com o servidor. Verifique se o servidor está ativo.");
        })
        .finally(function () {
            if (btnCadastrar) {
                btnCadastrar.disabled = false;
                btnCadastrar.textContent = "Criar conta";
            }
        });
}

document.addEventListener("DOMContentLoaded", function () {
    // if (validarAcesso()) {
    //     carregarEmpresas();
    // }
    carregarEmpresas();
});
