let id = sessionStorage.ID_USUARIO;
console.log("ID do Usuário:", id);

let idInstanciaAtual = null;

window.onload = listarInstancias;

async function listarInstancias() {
    // Obtém as permissões do usuário
    let permissoes = [];
    if (typeof window.obterPermissoesUsuario === "function") {
        permissoes = await window.obterPermissoesUsuario();
    } else {
        const idUsuario = sessionStorage.getItem("ID_USUARIO") || sessionStorage.getItem("FK_CARGO");
        if (idUsuario) {
            try {
                const res = await fetch(`/usuario/permissoes/${idUsuario}`);
                if (res.ok) {
                    const dados = await res.json();
                    permissoes = dados.map(item => Number(item.fk_permissao)).filter(n => !isNaN(n));
                }
            } catch (e) {
                console.error("Erro ao obter permissões no selecionar-servidor:", e);
            }
        }
    }

    const podeEditar = permissoes.includes(2);

    // Se não tem permissão 2, aplica bloqueio visual a todos os botões de edição
    if (!podeEditar) {
        document.body.classList.add("sem-permissao-edicao");
        document.querySelectorAll(".btn-editar").forEach(btn => {
            btn.classList.add("bloqueado");
            btn.style.setProperty("display", "none", "important");
        });
    }

    fetch(`/instancia/listar/${id}`)
        .then(resposta => resposta.json())
        .then(resposta => {
            const card = document.getElementById("instancia");
            
            card.innerHTML = "";

            if (resposta != null && resposta.length > 0) {
                for (let i = 0; i < resposta.length; i++) {
                    const botaoEditarHtml = podeEditar ? `
                        <button class="btn-editar" onclick="prepararEdicao(${resposta[i].id_instancia})">
                            <img src="./assets/imgs/edit.svg" alt="Editar">
                        </button>
                    ` : '';

                    card.innerHTML += `
                        <div class="card">
                            ${botaoEditarHtml}
                            
                            <div class="icone verde"><img src="./assets/imgs/server.png" alt=""></div>
                            
                            <div class="texto">
                                <div class="titulo-status">
                                    <h3>${resposta[i].nome}</h3>
                                    <span class="status verde-texto">SAUDÁVEL</span>
                                </div>
                                <p>${resposta[i].descricao || 'Nenhuma descrição definida ainda.'}</p>
                            </div>
                            
                            <a href="dashboard/dashboard-geral.html">
                                <button class="botao"><img src="./assets/imgs/arrow-right.png" alt=""></button>
                            </a>    
                        </div>
                    `;
                }
            } else {
                card.innerHTML = `<h1>Sem instâncias cadastradas</h1>`;
            }

            // Garante que cards existentes/estáticos também respeitem o bloqueio
            if (!podeEditar) {
                document.querySelectorAll(".btn-editar").forEach(btn => {
                    btn.classList.add("bloqueado");
                    btn.style.setProperty("display", "none", "important");
                });
            }
        })
        .catch(erro => {
            console.error("Erro ao listar instâncias:", erro);
        });
}

function prepararEdicao(idDaInstanciaClicada) {
    if (document.body.classList.contains("sem-permissao-edicao") || 
        (window.permissoesUsuario && !window.permissoesUsuario.includes(2))) {
        alert("Acesso restrito: seu grupo não possui permissão para customizar servidores.");
        return;
    }
    idInstanciaAtual = idDaInstanciaClicada;
    abrirModal(); 
}

function salvarEdicao() {
    if (document.body.classList.contains("sem-permissao-edicao") || 
        (window.permissoesUsuario && !window.permissoesUsuario.includes(2))) {
        alert("Acesso restrito: seu grupo não possui permissão para customizar servidores.");
        return;
    }

    var nomeVar = document.getElementById('ipt_nome').value;
    var identificadorVar = document.getElementById('ipt_identificador').value;
    var descricaoVar = document.getElementById('ipt_descricao').value;

    if (idInstanciaAtual == null) {
        alert("Erro: Nenhuma instância selecionada para edição.");
        return;
    }

    fetch(`/instancia/editar/${idInstanciaAtual}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nomeServer: nomeVar,
            identificadorServer: identificadorVar,
            descricaoServer: descricaoVar
        })
    }).then(function (resposta) {
        if (resposta.ok) {
            alert("Servidor atualizado com sucesso!");
            fecharModal();
            window.location.reload(); 
        } else {
            alert("Erro ao atualizar o servidor.");
        }
    }).catch(function (erro) {
        console.log("Erro no fetch de edição: ", erro);
    });
}