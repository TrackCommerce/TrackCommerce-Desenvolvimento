// Colocando a primeira estrutura do HTML em uma variável
let primeiraEtapaCadastro = `
            <section class="sessao-titulo">
                <h1 class="titulo">
                    Cadastro de novo servidor
                </h1>
                <p class="sub-titulo">
                    Complete os campos abaixo para cadastrar o servidor para ser monitorado!
                </p>
            </section>
    
            <section class="sessao-processo">
                <div class="processo processo-completo">
                    <h2 class="numero">
                        1
    
                    </h2>
                    <h2 class="titulo-processo">
                        Identificação
                    </h2>
                </div>
                <div class="processo processo-incompleto">
                    <h2 class="numero">
                        2
    
                    </h2>
                    <h2 class="titulo-processo">
                        Componentes
                    </h2>
                </div>
                <div class="processo processo-incompleto">
                    <h2 class="numero">
                        3
                    </h2>
                    <h2 class="titulo-processo">
                        Paramêtros
                    </h2>
                </div>
            </section>
    
            <section class="sessao-card">
                <h2 class="titulo-sessao">
                    Identificação do Servidor
                </h2>
    
                <div class="caixa-explicacao">
                    Preencha os campos baixo para que o sistema possa identificar qual servidor precisa ser monitorado. Além de adicionar um apelido para melhor organização e facilidade na procura.
                </div>
    
                <div class="formulario">
                    <div class="caixa-texto">
                        <div class="sub-titulo-formulario">
                            <figure>
                                <img 
                                src="assets/imgs/computador-cadastro-instância.png" 
                                alt="Imagem de Exemplo de um Computador">
                            </figure>
                            <h3>
                                Apelido para o servidor
                            </h3>
                        </div>
                        <input 
                        type="text" 
                        id="ipt_apelido_servidor" 
                        placeholder="Insira um apelido para melhor organização de servidores">
                    </div>
                    <div class="caixa-texto">
                        <div class="sub-titulo-formulario">
                            <figure>
                                <img 
                                src="assets/imgs/id-usuario.png" 
                                alt="Imagem de Exemplo para um identificador do servidor">
                            </figure>
                            <h3>
                                Identificador do servidor
                            </h3>
                        </div>
                        <input 
                        type="text" 
                        id="ipt_identificador_servidor" 
                        placeholder="Insira um identificador para o servidor ser monitorado">
                    </div>
                </div>
            </section>
    
            <section class="botoes">
                <button class="botao cancelar">
                    Cancelar
                </button>
                <button class="botao avancar" onclick="transicaoSegundaEtapa()">
                    Avançar
                </button>
            </section>
        `

// Colocando a segunda estrutura do HTML em uma variável
let segundaEtapaCadastro = `
            <section class="sessao-titulo">
                <h1 class="titulo">
                    Cadastro de novo servidor
                </h1>
                <p class="sub-titulo">
                    Complete os campos abaixo para cadastrar o servidor para ser monitorado!
                </p>
            </section>
    
            <section class="sessao-processo">
                <div class="processo-completo">
                    <div class="processo">
                        <h2 class="numero">
                            1
        
                        </h2>
                        <h2 class="titulo-processo">
                            Identificação
                        </h2>
                    </div>
                    <div class="processo">
                        <h2 class="numero">
                            2
        
                        </h2>
                        <h2 class="titulo-processo">
                            Componentes
                        </h2>
                    </div>
                </div>
                <div class="processo processo-incompleto">
                    <h2 class="numero">
                        3
                    </h2>
                    <h2 class="titulo-processo">
                        Paramêtros
                    </h2>
                </div>
            </section>
    
            <section class="sessao-card">
                <h2 class="titulo-sessao">
                    Componentes Físicos
                </h2>
    
                <div class="caixa-explicacao">
                    Escolha quais e as opções para o monitoramento dos componentes físicos (hardwares) do seu servidor.
                </div>
    
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
                                <input type="checkbox" id="checkbox_monitorar_cpu">
                                <label for="checkbox_monitorar_cpu">Monitorar Processador</label>
                            </div>
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
                                <input type="checkbox" id="checkbox_monitorar_disco">
                                <label for="checkbox_monitorar_disco">Monitorar Armazenamento</label>
                            </div>
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
                                <input type="checkbox" id="checkbox_monitorar_ram">
                                <label for="checkbox_monitorar_ram">Monitorar Memória</label>
                            </div>
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
                                <input type="checkbox" id="checkbox_monitorar_rede">
                                <label for="checkbox_monitorar_rede">Monitorar Rede</label>
                            </div>
                            <div class="opcao">
                                <input type="checkbox" id="checkbox_latencia_rede">
                                <label for="checkbox_latencia_rede">Monitorar Latência da Rede</label>
                            </div>
                        </div>                        
                    </div>
                </div>
            </section>
    
            <section class="botoes">
                <button class="botao cancelar" onclick="trocaTela(primeiraEtapaCadastro)">
                    Voltar
                </button>
                <button class="botao avancar" onclick="transicaoTerceiraEtapa()">
                    Avançar
                </button>
            </section>
`

// Colocando a estrutura HTML da terceira etapa do cadastro em uma variável
let terceiraEtapaCadastro = `
            <section class="sessao-titulo">
                <h1 class="titulo">
                    Cadastro de novo servidor
                </h1>
                <p class="sub-titulo">
                    Complete os campos abaixo para cadastrar o servidor para ser monitorado!
                </p>
            </section>
    
            <section class="sessao-processo">
                <div class="processo-completo">
                    <div class="processo">
                        <h2 class="numero">
                            1
        
                        </h2>
                        <h2 class="titulo-processo">
                            Identificação
                        </h2>
                    </div>
                    <div class="processo">
                        <h2 class="numero">
                            2
        
                        </h2>
                        <h2 class="titulo-processo">
                            Componentes
                        </h2>
                    </div>
                    <div class="processo">
                        <h2 class="numero">
                            3
                        </h2>
                        <h2 class="titulo-processo">
                            Paramêtros
                        </h2>
                    </div>
                </div>
            </section>
    
            <section class="alerta-parametros">
                <div class="lembrete-parametro">
                    <p>
                        Lembrete!!!
                    </p>
                    <p>
                        Caso nenhum paramêtro seja específicado, todos os componentes emitiram alertas a partir de 80% de uso (ou similar, dependendo da escolha de monitoramento)
                    </p>
                </div>
            </section>

            <section class="sessao-card">
                <h2 class="titulo-sessao">
                    Paramêtros
                </h2>
    
                <div class="caixa-explicacao">
                    Escolha o limite de porcentagem de uso para que o sistema solte um alerta. <strong>Utilize apenas números!</strong>
                </div>
                
                <div class="caixa_parametros">
                    <div id="especificacoes_parametros"></div>
                </div>
            </section>
    
            <section class="botoes">
                <button class="botao cancelar" onclick="trocaTela(segundaEtapaCadastro)">
                    Voltar
                </button>
                <button class="botao avancar" onclick="confirmacaoParametro()">
                    Concluir
                </button>
            </section>
`

// Colocando a estrutura HTML para a confirmação 
let containerPopUpConfirmacao = `
            <div class="pop_up pop_up_confirmacao">
                <div class="texto_alerta">
                    <p>
                        Você tem certeza que gostaria de criar esse serviço com esses paramêtros?
                    </p>
                </div>
                <div class="botoes_alerta">
                    <button class="botao_cancelar" onclick="fecharPopUp(containerPopUp)">Cancelar</button>
                    <button class="botao_aceitar" onclick="">Aceitar</button>
                </div>
            </div>
`

// Pegando o elemento usando o DOM a partir classe chamada "container-cadastro"
let containerCadastro = document.querySelector('.container-cadastro');

// Pegando o elemento usando o DOM a partir classe chamada "container_pop_up"
let containerPopUp = document.querySelector('.container_pop_up');

// Array de suporte para armazenar todos os componentes
let arrayComponentes = [];

// Incializando a aplicação com a primeira etapa do cadastro
containerCadastro.innerHTML = primeiraEtapaCadastro;

// Sobreescrevendo o containerPopUP usando a função de criar um pop-up
containerPopUp.innerHTML = criarPopUpBasico("Você não preencheu todos os campos! <br> Preencha eles corretamente!");

// Função para validar a primeira etapa do cadastro
function transicaoSegundaEtapa() {
    let iptApelidoServidor = ipt_apelido_servidor.value;
    let iptIdentificadorServidor = ipt_identificador_servidor.value;

    // Verificando um dos campos estão vazios
    if(iptApelidoServidor == "" || iptIdentificadorServidor == ""){
        containerPopUp.style.display = "block";
    } else {
        fecharPopUp(containerPopUp);
        trocaTela(segundaEtapaCadastro);
    }
}

function transicaoTerceiraEtapa() {
    let checkboxMonitorarCpu = document.querySelector("#checkbox_monitorar_cpu");
    let checkboxPorcetangemCpu = document.querySelector("#checkbox_porcentagem_cpu");
    let checkboxFrequenciaCpu = document.querySelector("#checkbox_frequencia_cpu");
    let checkboxMonitorarDisco = document.querySelector("#checkbox_monitorar_disco");
    let checkboxPorcetagemDisco = document.querySelector("#checkbox_porcentagem_disco");
    let checkboxDiscoLivre = document.querySelector("#checkbox_disco_livre");
    let checkboxMonitorarRam = document.querySelector("#checkbox_monitorar_ram");
    let checkboxPorcentagemRam = document.querySelector("#checkbox_porcentagem_ram");
    let checkboxRamLivre = document.querySelector("#checkbox_ram_livre");
    let checkboxMonitorarRede = document.querySelector("#checkbox_monitorar_rede");
    let checkboxLatenciaRede = document.querySelector("#checkbox_latencia_rede");

    if(
        (checkboxPorcetangemCpu.checked || checkboxFrequenciaCpu.checked) && !checkboxMonitorarCpu.checked ||
        (checkboxPorcetagemDisco.checked || checkboxDiscoLivre.checked) && !checkboxMonitorarDisco.checked ||
        (checkboxPorcentagemRam.checked || checkboxRamLivre.checked) && !checkboxMonitorarRam.checked ||
        checkboxLatenciaRede.checked && !checkboxMonitorarRede.checked 
    ){
        containerPopUp.style.display = "block";
        containerPopUp.innerHTML = criarPopUpBasico("Você está tentando monitorar porcentagens ou relacionados de componentes sem selecionar os componentes! <br> (Dica: Lembre-se sempre de escolher primeiro que vai monitorar e depois as suas funcionalidades");
    } else if(!checkboxMonitorarCpu.checked && !checkboxMonitorarDisco.checked && !checkboxMonitorarRam.checked && !checkboxMonitorarRede.checked) {
        containerPopUp.style.display = "block";
        containerPopUp.innerHTML = criarPopUpBasico("Selecione pelo menos um componente para ser monitorado!");    
    } else {
        if(
            checkboxMonitorarCpu.checked && !(checkboxPorcetangemCpu.checked || checkboxFrequenciaCpu.checked) ||
            checkboxMonitorarDisco.checked && !(checkboxPorcetagemDisco.checked || checkboxDiscoLivre.checked) ||
            checkboxMonitorarRam.checked && !(checkboxPorcentagemRam.checked || checkboxRamLivre.checked) ||
            checkboxLatenciaRede.checked && !checkboxMonitorarRede.checked 
        ) {
            containerPopUp.style.display = "block";
            containerPopUp.innerHTML = criarPopUpBasico("Você selecionou apenas o componente que quer monitorar! Selecione alguns atributos para monitorar esse componente");        
        } else {
            function criarCampoDeParametro(componente, idComponente, placeholder) {
                containerEspecificacoesParametros.innerHTML += `
                    <h3 class="titulo-parametro">
                        Paramêtro para ${componente}
                    </h3>
                    <input 
                        type="number" 
                        id="${idComponente}" 
                        placeholder="${placeholder}"
                    >
                `
            }

            fecharPopUp(containerPopUp);
            trocaTela(terceiraEtapaCadastro);     

            let containerEspecificacoesParametros = document.querySelector('#especificacoes_parametros');

            if(checkboxPorcetangemCpu.checked) {
                criarCampoDeParametro("porcentual de uso CPU", "id_parametro_porcentagem_cpu", "Insira o paramêtro para o porcentual de uso da CPU")
                arrayComponentes.push("id_parametro_porcentagem_cpu");
            }

            if(checkboxFrequenciaCpu.checked) {
                criarCampoDeParametro("frequência da CPU", "id_parametro_frequencia_cpu", "Insira o paramêtro para a frequência da CPU")
                arrayComponentes.push("id_parametro_frequencia_cpu");
            }

            if(checkboxPorcetagemDisco.checked) {
                criarCampoDeParametro("porcentual do armazenamento", "id_parametro_porcentagem_armazenamento", "Insira o paramêtro para o porcentual do armazenamento")
                arrayComponentes.push("id_parametro_porcentagem_armazenamento");
            }

             if(checkboxDiscoLivre.checked) {
                criarCampoDeParametro("a quantidade de Gigas (Gb) Livre no Armazenamento", "id_parametro_quantidade_livre_disco", "Insira o paramêtro para a quantidade de armazenamento livre")
                arrayComponentes.push("id_parametro_quantidade_livre_disco");
            }

            if(checkboxPorcentagemRam.checked) {
                criarCampoDeParametro("porcentual de uso da memória RAM", "id_parametro_porcentagem_ram", "Insira o paramêtro para o porcentual de uso da memória RAM")
                arrayComponentes.push("id_parametro_porcentagem_ram");
            }

            if(checkboxRamLivre.checked) {
                criarCampoDeParametro("a quantidade em MegaByes (MB) de memória RAM", "id_parametro_quantidade_livre_ram", "Insira o paramêtro para a quantidade de memória ram livre")
                arrayComponentes.push("id_parametro_quantidade_livre_ram");
            }

            if(checkboxLatenciaRede.checked) {
                criarCampoDeParametro("latência de rede", "id_parametro_latencia_rede", "Insira o paramêtro para a quantidade máxima de milisegundos (ms) que a latência pode chegar")
                arrayComponentes.push("id_parametro_latencia_rede");
            }

            return arrayComponentes;
        }
    }
}

function confirmacaoParametro() {
    for(let i = 0; i < arrayComponentes.length; i++){
        let idInput = document.getElementById(arrayComponentes[i]);
        let valorDoInput = idInput.value;
            
        if (valorDoInput !== "" && !isNaN(valorDoInput)) {
            containerPopUp.style.display = "block";
            containerPopUp.innerHTML = containerPopUpConfirmacao;
        } else {
            containerPopUp.style.display = "block";
            containerPopUp.innerHTML = criarPopUpBasico("Você colocou algo mais que números! Por favor, utilize apenas números!");    
        }
    }
}

function trocaTela(telaDestino) {
    containerCadastro.innerHTML = telaDestino;
}

function criarPopUpBasico(textoAlerta){
    return `
            <div class="pop_up">
                <div class="botao-saida" onclick="fecharPopUp(containerPopUp)">
                    <button>X</button>
                </div>
                <div class="texto_alerta">
                    <p>
                        ${textoAlerta}
                    </p>
                </div>
            </div>
    `
} 

function fecharPopUp(classeDoPopUp) {
    classeDoPopUp.style.display = "none";
}
