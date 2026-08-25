let containerCadastro = document.querySelector('.container-cadastro');

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
                        id="ipt-apelido-servidor" 
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
                        id="ipt-identificador-servidor" 
                        placeholder="Insira um identificador para o servidor ser monitorado">
                    </div>
                </div>
            </section>
    
            <section class="botoes">
                <button class="botao cancelar">
                    Cancelar
                </button>
                <button class="botao avancar">
                    Avançar
                </button>
            </section>
        `

containerCadastro.innerHTML = primeiraEtapaCadastro;