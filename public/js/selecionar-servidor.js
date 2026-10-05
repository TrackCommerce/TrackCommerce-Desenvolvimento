let id = sessionStorage.ID_USUARIO;
console.log("ID do Usuário:", id);

let idInstanciaAtual = null;

window.onload = listarInstancias;

function listarInstancias() {
    fetch(`/instancia/listar/${id}`)
        .then(resposta => resposta.json())
        .then(resposta => {
            const card = document.getElementById("instancia");
            
            card.innerHTML = "";

            if (resposta != null && resposta.length > 0) {
                for (let i = 0; i < resposta.length; i++) {
                
                    card.innerHTML += `
                        <div class="card">
                            <button class="btn-editar" onclick="prepararEdicao(${resposta[i].id_instancia})">
                                <img src="./assets/imgs/edit.svg" alt="Editar">
                            </button>
                            
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
        })
        .catch(erro => {
            console.error("Erro ao listar instâncias:", erro);
        });
}

function prepararEdicao(idDaInstanciaClicada) {
    idInstanciaAtual = idDaInstanciaClicada;
    abrirModal(); 
}

function salvarEdicao() {
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