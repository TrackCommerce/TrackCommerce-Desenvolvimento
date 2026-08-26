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
    
            <section class="sessao-formulario">
                <h2 class="titulo-formulario">
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
    
            <section class="sessao-formulario">
                <h2 class="titulo-formulario">
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
                                <input type="checkbox" name="" id="">
                                <label for="">Monitorar Processador</label>
                            </div>
                            <div class="opcao">
                                <input type="checkbox" name="" id="">
                                <label for="">Porcentagem de Uso</label>
                            </div>
                            <div class="opcao">
                                <input type="checkbox" name="" id="">
                                <label for="">Frequência do Processador</label>
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
                                <input type="checkbox" name="" id="">
                                <label for="">Monitorar Armazenamento</label>
                            </div>
                            <div class="opcao">
                                <input type="checkbox" name="" id="">
                                <label for="">Porcentagem de Uso</label>
                            </div>
                            <div class="opcao">
                                <input type="checkbox" name="" id="">
                                <label for="">Quantidade de GB (Gigas) Livre</label>
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
                                <input type="checkbox" name="" id="">
                                <label for="">Monitorar Memória</label>
                            </div>
                            <div class="opcao">
                                <input type="checkbox" name="" id="">
                                <label for="">Porcentagem de Uso</label>
                            </div>
                            <div class="opcao">
                                <input type="checkbox" name="" id="">
                                <label for="">Quantidade de GB (Gigas) Livre</label>
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
                                <input type="checkbox" name="" id="">
                                <label for="">Monitorar Rede</label>
                            </div>
                            <div class="opcao">
                                <input type="checkbox" name="" id="">
                                <label for="">Monitorar Latência da Rede</label>
                            </div>
                        </div>                        
                    </div>
                </div>
            </section>
    
            <section class="botoes">
                <button class="botao cancelar" onclick="trocaTela(primeiraEtapaCadastro)">
                    Voltar
                </button>
                <button class="botao avancar">
                    Avançar
                </button>
            </section>
`

let popUp = `
        <div class="pop_up">
            <div class="botao-saida" onclick="fecharPopUp(containerPopUp)">
                <button>X</button>
            </div>
            <div class="texto_alerta">
                <p>
                    Você não preencheu todos os campos! 
                </p>
                <p>
                    Preencha eles corretamente!
                </p>
            </div>
        </div>
`

// Pegando o element com a classe chamada "container-cadastro"
let containerCadastro = document.querySelector('.container-cadastro');

let containerPopUp = document.querySelector('.container_pop_up');

// Incializando a aplicação com a primeira etapa do cadastro
containerCadastro.innerHTML = primeiraEtapaCadastro;
containerPopUp.innerHTML = popUp;

function transicaoSegundaEtapa() {
    let iptApelidoServidor = ipt_apelido_servidor.value;
    let iptIdentificadorServidor = ipt_identificador_servidor.value;

    if(iptApelidoServidor == "" || iptIdentificadorServidor == ""){
        containerPopUp.style.display = "block";
    } else {
        trocaTela(segundaEtapaCadastro);
    }
}

function trocaTela(telaDestino) {
    containerCadastro.innerHTML = telaDestino;
}

function fecharPopUp(classeDoPopUp) {
    classeDoPopUp.style.display = "none";
}