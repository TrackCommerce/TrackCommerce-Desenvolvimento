// Ao incrementar com o banco de dados, penso em utilizar como paramêtro o próprio ID da máquina virtual
// A partir da criação de todos os card, já irei adicionar o ID de cada instância como paramêtro
let containerPopUpEditar = document.querySelector(".container_pop_up_editar");
let popUpConfirmacao = document.querySelector(".pop_up_confirmar");

function popUpAtualizarInstancia() {
    let containerMainLista = document.querySelector('.botao-editar');

    containerMainLista.style.cursor = 'default'

    containerPopUpEditar.style.display = "block";
    containerPopUpEditar.innerHTML = popUpEditar;
}

function fecharPopUp() {
    containerPopUpEditar.style.display = "none";
    containerPopUpEditar.style.display = "pointer";
}

function fecharPopUpConfirmacao() {
    popUpConfirmacao.style.display = "none";
}

function confirmarAtualizarInstancia() {
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
                <button class="botao confirmar">
                    Confirmar
                </button>
            </div>
    `
}

function confirmarDeletarInstancia() {
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
                <button class="botao confirmar">
                    Confirmar
                </button>
            </div>
    `
}

let popUpEditar = `
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
                    value="Apelido">
                </div>
                 
                <div class="sessao-apelido">
                    <label for="ipt_identificador_servidor">
                        Identificador
                    </label>
                    <input 
                    type="text" 
                    id="ipt_identificador_servidor"
                    placeholder="Insira o identificador da instância"
                    value="Identificador">
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
                                <input type="checkbox" id="checkbox_porcentagem_cpu">
                                <label for="checkbox_porcentagem_cpu">Porcentagem de Uso</label>
                            </div>
                            <div class="opcao">
                                <input type="checkbox" id="checkbox_frequencia_cpu">
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
                                <input type="checkbox" id="checkbox_porcentagem_disco">
                                <label for="checkbox_porcentagem_disco">Porcentagem de Uso</label>
                            </div>
                            <div class="opcao">
                                <input type="checkbox" id="checkbox_disco_livre">
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
                                <input type="checkbox" id="checkbox_porcentagem_ram">
                                <label for="checkbox_porcentagem_ram">Porcentagem de Uso</label>
                            </div>
                            <div class="opcao">
                                <input type="checkbox" id="checkbox_ram_livre">
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
                                <input type="checkbox" id="checkbox_latencia_rede">
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
                        value="80">    
                    </div>

                    <div class="inputs-parametros">
                        <label for="ipt_editar_frequencia_cpu">
                            Frequência do uso de Processador
                        </label>
                        <input 
                        type="text" 
                        id="ipt_editar_frequencia_cpu"
                        placeholder="Insira o seu paramêtro"
                        value="82">    
                    </div>

                    <div class="inputs-parametros">
                        <label for="ipt_editar_porcentual_disco">
                            Porcentual de uso de Armazenamento
                        </label>
                        <input 
                        type="text" 
                        id="ipt_editar_porcentual_disco"
                        placeholder="Insira o seu paramêtro"
                        value="75">    
                    </div>

                    <div class="inputs-parametros">
                        <label for="ipt_editar_quantidade_livre_disco">
                            Quantidade de GM Livre no Armazenamento
                        </label>
                        <input 
                        type="text" 
                        id="ipt_editar_quantidade_livre_disco"
                        placeholder="Insira o seu paramêtro"
                        value="120">    
                    </div>

                    <div class="inputs-parametros">
                        <label for="ipt_editar_porcentual_ram">
                            Porcentual de uso do Memória RAM
                        </label>
                        <input 
                        type="text" 
                        id="ipt_editar_porcentual_ram"
                        placeholder="Insira o seu paramêtro"
                        value="80">    
                    </div>

                    <div class="inputs-parametros">
                        <label for="ipt_editar_quantidade_livre_ram">
                            Quantidade de GM Livre da Memória RAM
                        </label>
                        <input 
                        type="text" 
                        id="ipt_editar_quantidade_livre_ram"
                        placeholder="Insira o seu paramêtro"
                        value="16">    
                    </div>

                    <div class="inputs-parametros">
                        <label for="ipt_editar_latencia_rede">
                            Latência Rede (ms)
                        </label>
                        <input 
                        type="text" 
                        id="ipt_editar_latencia_rede"
                        placeholder="Insira o seu paramêtro"
                        value="200">    
                    </div>
                </div>
            </section>

            <section class="sessao-botoes">
                <button class="editar botao" onclick="confirmarAtualizarInstancia()">
                    Editar
                </button>

                <button class="deletar botao" onclick="confirmarDeletarInstancia()">
                    Deletar
                </button>
            </section>
        </div>
`