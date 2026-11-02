// Estrutura HTML da tela de cadastro de novo servidor (apenas download do agente)
let telaCadastro = `
            <section class="sessao-titulo">
                <h1 class="titulo">
                    Cadastro de novo servidor
                </h1>
            </section>

            <section class="instalacao-automatica" aria-labelledby="titulo-instalacao-automatica">
                <div>
                    <span class="instalacao-automatica__etiqueta">Recomendado</span>
                    <h2 id="titulo-instalacao-automatica">Cadastrar esta máquina automaticamente</h2>
                    <p>
                        Baixe o agente, instale as dependências e execute o arquivo na máquina que será monitorada.
                        O identificador e o vínculo com sua empresa serão criados automaticamente.
                    </p>
                    <code>pip install psutil python-dotenv boto3</code>
                </div>
                <div class="instalacao-automatica__acao">
                    <button type="button" class="botao avancar" id="btn_baixar_agente" onclick="baixarAgente()">
                        Baixar agente Python
                    </button>
                    <small id="status_download_agente" aria-live="polite"></small>
                </div>
            </section>
        `;

// Pegando o elemento usando o DOM a partir da classe chamada "container-cadastro"
let containerCadastro = document.querySelector('.container-cadastro');

// Inserindo a estrutura na página caso ainda não esteja presente no HTML
if (containerCadastro && !containerCadastro.querySelector('.instalacao-automatica')) {
    containerCadastro.innerHTML = telaCadastro;
}

// Função para realizar o download do agente Python
async function baixarAgente() {
    const botao = document.getElementById("btn_baixar_agente");
    const status = document.getElementById("status_download_agente");
    const empresa = Number(sessionStorage.getItem("FK_EMPRESA"));

    if (!Number.isSafeInteger(empresa) || empresa <= 0) {
        status.textContent = "Faça login novamente para identificar sua empresa.";
        return;
    }

    botao.disabled = true;
    status.textContent = "Preparando o agente...";

    try {
        const resposta = await fetch("/agente/download", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ empresaServidor: empresa })
        });

        if (!resposta.ok) {
            throw new Error(await resposta.text() || "Não foi possível baixar o agente.");
        }

        const arquivo = await resposta.blob();
        const url = URL.createObjectURL(arquivo);
        const link = document.createElement("a");
        link.href = url;
        link.download = "trackcommerce-agente.py";
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
        status.textContent = "Download iniciado. Execute o arquivo na máquina monitorada.";
    } catch (erro) {
        status.textContent = erro.message || "Não foi possível baixar o agente.";
    } finally {
        botao.disabled = false;
    }
}
