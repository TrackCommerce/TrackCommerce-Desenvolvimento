// Ao incrementar com o banco de dados, penso em utilizar como paramêtro o próprio ID da máquina virtual
// A partir da criação de todos os card, já irei adicionar o ID de cada instância como paramêtro



function listarInstancias() {
    let empresaServidor = 1;
    let container_instancias = document.getElementById("container_instancias");


    fetch(`/listarInstancias/buscarIdInstancia/${empresaServidor}`, {
        method: "GET",
    })
        .then(
            function (resposta) {
                if (resposta.ok) {
                    resposta.json()
                        .then((instancias) => {

                            instancias.forEach(instancia => {
                                container_instancias.innerHTML += `
                        <div class="instancia">
                    <div class="titulo-instancia">
                        <h1>
                            ${instancia.nome}
                        </h1>
                        <button onclick="popUpAtualizarInstancia('${instancia.nome}', '${instancia.identificador}', '${instancia.grupoOpcoesComponentes}', '${instancia.id_instancia}')" class="botao-editar">
                            <figure>
                                <img src="assets/imgs/editar-icon.png" alt="Icone para representar o botão de editar">
                            </figure>
                        </button>
                    </div>

                    <div class="informacoes-instancia">
                        <p>${instancia.identificador}</p>
                        <p>Principais componentes:
                        ${instancia.grupoComponentes}
                        </p>
                    </div>
                </div>
                        `

                            });
                        })
                }
            }
        )

}


let containerPopUpEditar = document.querySelector(".container_pop_up_editar");
let popUpConfirmacao = document.querySelector(".pop_up_confirmar");

function popUpAtualizarInstancia(nome, identificador, grupoOpcoesComponentes, id_instancia) {
    let containerMainLista = document.querySelector('.botao-editar');
    if (containerMainLista) containerMainLista.style.cursor = 'default'

    let vetor_opcoes_componentes = {};

    grupoOpcoesComponentes.split(", ").forEach(opcao => {
        let [id, parametro] = opcao.split(":");

        vetor_opcoes_componentes[id] = parametro
    })




    function opcaoChecked(idOpcao) {
        let idConvertido = String(idOpcao)

        if (vetor_opcoes_componentes[idConvertido] !== undefined) {
            return "checked";
        } else {
            return "";
        }

    }


    function parametro(idOpcao) {
        let idConvertido = String(idOpcao)




        if (vetor_opcoes_componentes[idConvertido] !== undefined) {
            return vetor_opcoes_componentes[idConvertido];
        } else {
            return "";
        }
    }





    containerPopUpEditar.innerHTML = `
        <div class="container-edicao">
            <section class="seccao-acima">
                <p class="titulo-edicao">
                    Informações da "Apelido"
                </p>
                <button class="botoa-sair" onclick="fecharPopUp()">
                    X
                </button>
            </section>

            <section class="sessao-identificacao sublinhado">
                <div class="sessao-apelido">
                    <label for="ipt_apelido_servidor">
                      Apelido
                    </label>
                    <input 
                    type="text" 
                    id="ipt_apelido_servidor"
                    placeholder="Insira o apelido da instância"
                    value=${nome}>
                </div>
                 
                <div class="sessao-apelido">
                    <label for="ipt_identificador_servidor">
                        Identificador
                    </label>
                    <input 
                    type="text" 
                    id="ipt_identificador_servidor"
                    placeholder="Insira o identificador da instância"
                    value=${identificador}>
                </div>
            </section>

            <section class="sessao-componentes sublinhado">
                <p class="titulo-componentes">
                    Componentes Monitorados
                </p>
                <div class="opcoes-componentes">
                    <div class="opcao-componente">
                        <div class="titulo-componente">
                            <figure>
                                <img src="assets/imgs/processador-icon.png" alt="Icone de exemplo para um processador">
                            </figure>
                            <h2>Processador</h2>
                        </div>

                        <div class="opcoes-monitoramento">
                            <div class="opcao">
                                <input type="checkbox" id="checkbox_porcentagem_cpu" ${opcaoChecked(1)}>
                                <label for="checkbox_porcentagem_cpu">Porcentagem de Uso</label>
                            </div>
                            <div class="opcao">
                                <input type="checkbox" id="checkbox_frequencia_cpu"  ${opcaoChecked(2)}>
                                <label for="checkbox_frequencia_cpu">Frequência do Processador</label>
                            </div>
                        </div>
                    </div>
                    <div class="opcao-componente">
                        <div class="titulo-componente">
                            <figure>
                                <img src="assets/imgs/armazenamento-disco-icon.png" alt="Icone de exemplo para um armazenamento em disco">
                            </figure>
                            <h2>Armazenamento</h2>
                        </div>

                        <div class="opcoes-monitoramento">
                            <div class="opcao">
                                <input type="checkbox" id="checkbox_porcentagem_disco"  ${opcaoChecked(3)}>
                                <label for="checkbox_porcentagem_disco">Porcentagem de Uso</label>
                            </div>
                            <div class="opcao">
                                <input type="checkbox" id="checkbox_disco_livre"  ${opcaoChecked(4)}>
                                <label for="checkbox_disco_livre">Quantidade de GB (Gigas) Livre</label>
                            </div>
                        </div>                        
                    </div>
                    <div class="opcao-componente">
                        <div class="titulo-componente">
                            <figure>
                                <img src="assets/imgs/memoria-ram-icon.png" alt="Icone para representar a memória ram">
                            </figure>
                            <h2>Memóra RAM</h2>
                        </div>

                        <div class="opcoes-monitoramento">
                            <div class="opcao">
                                <input type="checkbox" id="checkbox_porcentagem_ram" ${opcaoChecked(5)}>
                                <label for="checkbox_porcentagem_ram">Porcentagem de Uso</label>
                            </div>
                            <div class="opcao">
                                <input type="checkbox" id="checkbox_ram_livre"  ${opcaoChecked(6)}>
                                <label for="checkbox_ram_livre">Quantidade de GB (Gigas) Livre</label>
                            </div>
                        </div>                        
                    </div>
                    
                    <div class="opcao-componente">
                        <div class="titulo-componente">
                            <figure>
                                <img src="assets/imgs/rede-icon.png" alt="Iconde de exemplo para representar a rede">
                            </figure>
                            <h2>Rede</h2>
                        </div>

                         <div class="opcoes-monitoramento">
                            <div class="opcao">
                                <input type="checkbox" id="checkbox_latencia_rede"  ${opcaoChecked(7)}>
                                <label for="checkbox_latencia_rede">Monitorar Latência da Rede</label>
                            </div>
                        </div>                        
                    </div>
                </div>
            </section>

            <section class="sessao-parametros sublinhado">
                <p class="titulo-parametro">
                    Paramêtros de cada componente
                </p>
                <div class="container-inputs">
                    <div class="inputs-parametros">
                        <label for="ipt_editar_porcentual_cpu">
                            Porcentual de uso do Processador
                        </label>
                        <input 
                        type="text" 
                        id="ipt_editar_porcentual_cpu"
                        placeholder="Insira o seu paramêtro"
                        value=${parametro(1)}>    
                    </div>

                    <div class="inputs-parametros">
                        <label for="ipt_editar_frequencia_cpu">
                            Frequência do uso de Processador
                        </label>
                        <input 
                        type="text" 
                        id="ipt_editar_frequencia_cpu"
                        placeholder="Insira o seu paramêtro"
                        value=${parametro(2)}>    
                    </div>

                    <div class="inputs-parametros">
                        <label for="ipt_editar_porcentual_disco">
                            Porcentual de uso de Armazenamento
                        </label>
                        <input 
                        type="text" 
                        id="ipt_editar_porcentual_disco"
                        placeholder="Insira o seu paramêtro"
                        value=${parametro(3)}>    
                    </div>

                    <div class="inputs-parametros">
                        <label for="ipt_editar_quantidade_livre_disco">
                            Quantidade de GM Livre no Armazenamento
                        </label>
                        <input 
                        type="text" 
                        id="ipt_editar_quantidade_livre_disco"
                        placeholder="Insira o seu paramêtro"
                        value=${parametro(4)}>    
                    </div>

                    <div class="inputs-parametros">
                        <label for="ipt_editar_porcentual_ram">
                            Porcentual de uso do Memória RAM
                        </label>
                        <input 
                        type="text" 
                        id="ipt_editar_porcentual_ram"
                        placeholder="Insira o seu paramêtro"
                        value=${parametro(5)}>    
                    </div>

                    <div class="inputs-parametros">
                        <label for="ipt_editar_quantidade_livre_ram">
                            Quantidade de GM Livre da Memória RAM
                        </label>
                        <input 
                        type="text" 
                        id="ipt_editar_quantidade_livre_ram"
                        placeholder="Insira o seu paramêtro"
                        value=${parametro(6)}>    
                    </div>

                    <div class="inputs-parametros">
                        <label for="ipt_editar_latencia_rede">
                            Latência Rede (ms)
                        </label>
                        <input 
                        type="text" 
                        id="ipt_editar_latencia_rede"
                        placeholder="Insira o seu paramêtro"
                        value=${parametro(7)}>    
                    </div>
                </div>
            </section>

            <section class="sessao-botoes">
                <button class="editar botao" onclick="confirmarAtualizarInstancia(${id_instancia})">
                    Editar
                </button>

                <button class="deletar botao" onclick="confirmarDeletarInstancia(${id_instancia})">
                    Deletar
                </button>
            </section>
        </div>
`
    containerPopUpEditar.style.display = "block";
}

function fecharPopUp() {
    containerPopUpEditar.style.display = "none";

}

function fecharPopUpConfirmacao() {
    popUpConfirmacao.style.display = "none";
}


function guardarComponentes(){

    let componentes = [];

    if (checkbox_porcentagem_cpu.checked) {
        componentes.push({
            fk_componente: 1,
            parametro: ipt_editar_porcentual_cpu.value

        })};

     if (checkbox_frequencia_cpu.checked) {
        componentes.push({
            fk_componente: 2,
            parametro: ipt_editar_frequencia_cpu.value

        })};
    
     if (checkbox_porcentagem_disco.checked) {
        componentes.push({
            fk_componente: 3,
            parametro: ipt_editar_porcentual_disco.value

        })};

        if (checkbox_disco_livre.checked) {
        componentes.push({
            fk_componente: 4,
            parametro: ipt_editar_quantidade_livre_disco.value

        })};

        if (checkbox_porcentagem_ram.checked) {
        componentes.push({
            fk_componente: 5,
            parametro: ipt_editar_porcentual_ram.value

        })};

        if (checkbox_ram_livre.checked) {
        componentes.push({
            fk_componente: 6,
            parametro: ipt_editar_quantidade_livre_ram.value

        })};

        if (checkbox_latencia_rede.checked) {
        componentes.push({
            fk_componente: 7,
            parametro: ipt_editar_latencia_rede.value

        })};

        return componentes;
}
function confirmarAtualizarInstancia(id_instancia) {
    popUpConfirmacao.style.display = "block";

    popUpConfirmacao.innerHTML = `
            <div class="parte-superior">
                <button onclick="fecharPopUpConfirmacao()">X</button>
                <div class="texto-confirmacao">
                    <p>
                        Você tem certeza que deseja realizar essas as alterações?
                    </p>
                </div>
            </div>
            <div class="botoes-pop-up">
                <button class="botao voltar" onclick="fecharPopUpConfirmacao()">
                    Voltar
                </button>
                <button class="botao confirmar" onclick="editarDefinitivo(${id_instancia})">
                    Confirmar
                </button>
            </div>
    `
}

function confirmarDeletarInstancia(id_instancia) {
    popUpConfirmacao.style.display = "block";

    popUpConfirmacao.innerHTML = `
            <div class="parte-superior">
                <button onclick="fecharPopUpConfirmacao()">X</button>
                <div class="texto-confirmacao">
                    <p>
                        Você tem certeza que deseja deletar este servidor?
                    </p>
                </div>
            </div>
            <div class="botoes-pop-up">
                <button class="botao voltar" onclick="fecharPopUpConfirmacao()">
                    Voltar
                </button>
                <button class="botao confirmar" onclick="deletarDefinitivo(${id_instancia})">
                    Confirmar
                </button>
            </div>
    `

}

    function editarDefinitivo(id_instancia){
        let nome = ipt_apelido_servidor.value;
        let identificador = ipt_identificador_servidor.value;
        let componentes = guardarComponentes();


    }



 function deletarDefinitivo(id_instancia) {
        fetch(`/listarInstancias/deletarInstancia/${id_instancia}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (resposta) {

            if (resposta.ok) {
                window.alert("instancia deletado com sucesso!");
                  window.location.reload();
            } else if (resposta.status == 404) {
                window.alert("Deu 404!");
            } else {
                throw ("Houve um erro ao tentar realizar a postagem! Código da resposta: " + resposta.status);
            }
        }).catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`);
        });
    }