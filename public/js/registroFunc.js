

let emailEditando = null;
let idEditando = null;

const funcionarios = [];

const divLista = document.getElementById('lista-funcionarios');
const inputPesquisa = document.getElementById('campo-pesquisa');
const selectFiltro = document.getElementById('seletor-filtro');

window.onload = function () {
    // Esconde botões de ação secundários no carregamento inicial
    document.getElementById('btn-atualizar').style.display = "none";
    document.getElementById('btn-cancelar').style.display = "none";
    if (document.getElementById('btn-deletar')) {
        document.getElementById('btn-deletar').style.display = "none";
    }

    listarFunc();
    listarCargos();
}

function listarFunc() {
    fetch("/usuario/listar").then(function (resposta) {
        if (resposta.ok) {
            if (resposta.status == 204) {
                const aviso = document.getElementById('aviso');
                if (aviso) aviso.innerText = "Nenhum resultado encontrado";
                return;
            }

            resposta.json().then(function (resposta) {
                console.log("Dados recebidos: ", JSON.stringify(resposta));

                funcionarios.length = 0; 

                if (resposta.length === 0) {
                    divLista.innerHTML = '<p style="text-align:center; margin-top:20px; color:#555;">Nenhum funcionário encontrado.</p>';
                    return;
                }

                resposta.forEach(func => {
                    funcionarios.push({
                        id: func.id_usuario,
                        nome: func.nome,
                        cargo: func.nome_cargo,
                        permissoes: func.permissoes || "N/A", 
                        email: func.email,
                        contato: func.celular
                    });
                });

                renderizarLista(funcionarios);
            });
        }
    }).catch(erro => console.error("Erro ao listar funcionários:", erro));
}

function cancelarEdicao() {
    document.getElementById('registro-nome').value = "";
    document.getElementById('registro-cargo').value = "";
    document.getElementById('registro-ctt').value = "";
    document.getElementById('registro-email').value = "";

    const aviso = document.getElementById('aviso');
    if (aviso) aviso.innerText = "";

    emailEditando = null;
    idEditando = null;

    document.getElementById('btn-salvar').style.display = "block";
    document.getElementById('btn-atualizar').style.display = "none";
    document.getElementById('btn-cancelar').style.display = "none";
    if (document.getElementById('btn-deletar')) {
        document.getElementById('btn-deletar').style.display = "none";
    }

    const radios = document.getElementsByName('selecao-func');
    radios.forEach(radio => radio.checked = false);
}

function preencherFormulario(emailClicado) {
    const func = funcionarios.find(f => f.email === emailClicado);

    if (func) {
        document.getElementById('registro-nome').value = func.nome;
        document.getElementById('registro-cargo').value = func.cargo;
        document.getElementById('registro-ctt').value = formatarParaExibicao(func.contato);
        document.getElementById('registro-email').value = func.email;

        emailEditando = func.email;
        idEditando = func.id;


        document.getElementById('btn-salvar').style.display = "none";
        document.getElementById('btn-atualizar').style.display = "block";
        document.getElementById('btn-cancelar').style.display = "block";
        if (document.getElementById('btn-deletar')) {
            document.getElementById('btn-deletar').style.display = "block";
        }
    }
}

function renderizarLista(dados) {
    divLista.innerHTML = '';

    if (dados.length === 0) {
        divLista.innerHTML = '<p style="text-align:center; margin-top:20px; color:#555;">Nenhum funcionário encontrado.</p>';
        return;
    }

    dados.forEach(func => {
        const cartao = document.createElement('div');
        cartao.className = 'cartao-funcionario';

        cartao.innerHTML = `
            <div class="info-cartao">
                <div class="coluna">
                    <span><strong>Funcionário:</strong> ${func.nome}</span>
                    <span><strong>Cargo:</strong> ${func.cargo}</span>
                    <span><strong>Permissões:</strong> ${func.permissoes}</span>
                </div>
                <div class="coluna">
                    <span><strong>Email:</strong> ${func.email}</span>
                    <span><strong>Contato:</strong> ${formatarParaExibicao(func.contato)}</span>
                </div>
            </div>
            <div class="botao-radio">
                <input type="radio" name="selecao-func" onchange="preencherFormulario('${func.email}')">
            </div>
        `;

        divLista.appendChild(cartao);
    });
}

function filtrarFuncionarios() {
    const termoPesquisado = inputPesquisa.value.toLowerCase();
    const filtroSelecionado = selectFiltro.value;

    const dadosFiltrados = funcionarios.filter(func => {
        const valorDoCampo = String(func[filtroSelecionado] || '').toLowerCase();
        return valorDoCampo.includes(termoPesquisado);
    });

    renderizarLista(dadosFiltrados);
}

if (inputPesquisa) inputPesquisa.addEventListener('input', filtrarFuncionarios);
if (selectFiltro) selectFiltro.addEventListener('change', filtrarFuncionarios);

function registrarFunc() {
    let nomeReg = document.getElementById('registro-nome').value.trim();
    let cargoReg = document.getElementById('registro-cargo').value.trim();
    let contatoReg = document.getElementById('registro-ctt').value.replace(/\D/g, "");
    let emailReg = document.getElementById('registro-email').value.trim();
    let aviso = document.getElementById('aviso');

    if (nomeReg.length < 2) {
        aviso.innerText = "Funcionário sem nome";
        return;
    } else if (cargoReg.length < 2) {
        aviso.innerText = "Funcionário sem cargo";
        return;
    } else if (contatoReg.length !== 11) {
        aviso.innerText = "Número inválido (deve ter 11 dígitos)";
        return;
    } else if (!emailReg.includes("@") || !emailReg.includes(".")) {
        aviso.innerText = "Email inválido";
        return;
    }

    let emailEmUso = funcionarios.some(f => f.email === emailReg);
    let contatoEmUso = funcionarios.some(f => f.contato === contatoReg);

    if (emailEmUso) {
        aviso.innerText = "Email já cadastrado";
        return;
    } else if (contatoEmUso) {
        aviso.innerText = "Contato já cadastrado";
        return;
    }

    aviso.innerText = "";

    fetch("/usuario/cadastrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            nomeServer: nomeReg,
            emailServer: emailReg,
            contatoServer: contatoReg,
            cargoServer: cargoReg,
            fkEmpresaServer: sessionStorage.fk_empresa
        }),
    }).then(function (resposta) {
        if (resposta.ok) {
            alert("Cadastro foi realizado com sucesso!");
            cancelarEdicao();
            listarFunc();
        } else {
            resposta.text().then((texto) => {
                if (texto.includes("Duplicate")) {
                    alert("Este email ou contato já está cadastrado.");
                } else {
                    alert("Erro ao cadastrar funcionário.");
                }
            });
        }
    }).catch(function (erro) {
        console.error(`#ERRO: ${erro}`);
        alert("Erro ao cadastrar.");
    });

    return false;
}

function atualizarFunc() {
    if (idEditando === null) {
        alert("Nenhum funcionário selecionado para atualização.");
        return;
    }

    let nomeAtt = document.getElementById('registro-nome').value.trim();
    let cargoAtt = document.getElementById('registro-cargo').value.trim();
    let contatoAtt = document.getElementById('registro-ctt').value.replace(/\D/g, "");
    let emailAtt = document.getElementById('registro-email').value.trim();
    let aviso = document.getElementById('aviso');

    if (nomeAtt.length < 2) {
        aviso.innerText = "Funcionário sem nome";
        return;
    } else if (cargoAtt.length < 2) {
        aviso.innerText = "Funcionário sem cargo";
        return;
    } else if (contatoAtt.length !== 11) {
        aviso.innerText = "Número inválido (deve ter 11 dígitos)";
        return;
    } else if (!emailAtt.includes("@") || !emailAtt.includes(".")) {
        aviso.innerText = "Email inválido";
        return;
    }

    let emailEmUso = funcionarios.some(f => f.email === emailAtt && f.id !== idEditando);
    let contatoEmUso = funcionarios.some(f => f.contato === contatoAtt && f.id !== idEditando);

    if (emailEmUso) {
        aviso.innerText = "Email já cadastrado por outro usuário";
        return;
    } else if (contatoEmUso) {
        aviso.innerText = "Contato já cadastrado por outro usuário";
        return;
    }

    aviso.innerText = "";

    fetch("/usuario/editar", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            idServer: idEditando,
            nomeServer: nomeAtt,
            emailServer: emailAtt,
            contatoServer: contatoAtt,
            cargoServer: cargoAtt
        }),
    })
    .then(function (resposta) {
        if (resposta.ok) {
            alert("Atualização realizada com sucesso!");
            cancelarEdicao();
            listarFunc();
        } else {
            resposta.text().then(texto => console.log(texto));
        }
    })
    .catch(function (erro) {
        console.error(`#ERRO: ${erro}`);
        alert("Erro ao atualizar funcionário.");
    });
}

function deletarFunc() {
    if (idEditando === null) {
        alert("Nenhum funcionário selecionado.");
        return;
    }

    if (confirm("Tem certeza que deseja excluir este funcionário?")) {
        fetch("/usuario/deletar", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idServer: idEditando })
        })
        .then(function (resposta) {
            if (resposta.ok) {
                alert("Funcionário deletado com sucesso!");
                cancelarEdicao();
                listarFunc();
            } else {
                alert("Erro ao deletar funcionário.");
            }
        })
        .catch(function (erro) {
            console.error("Erro:", erro);
            alert("Erro ao conectar com o servidor.");
        });
    }
}

function mascaraTelefone(input) {
    let valor = input.value.replace(/\D/g, "");
    if (!valor) {
        input.value = "";
        return;
    }
    valor = valor.replace(/^(\d{2})(\d)/g, "($1) $2");
    valor = valor.replace(/(\d)(\d{4})$/, "$1-$2");
    input.value = valor;
}

function formatarParaExibicao(numero) {
    let valor = String(numero).replace(/\D/g, "");
    if (valor.length === 11) {
        return valor.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
    }
    return numero;
}

function listarCargos() {
    fetch("/cargo/listar")
        .then(resposta => resposta.json())
        .then(cargos => {
            const select = document.getElementById("registro-cargo");
            if (!select) return;

            select.innerHTML = `
                <option value="" disabled selected hidden>
                    Selecione um cargo
                </option>
            `;

            cargos.forEach(cargo => {
                const option = document.createElement("option");
                option.value = cargo.nome_cargo;
                option.textContent = cargo.nome_cargo;
                select.appendChild(option);
            });
        })
        .catch(erro => console.error("Erro ao listar cargos:", erro));
}