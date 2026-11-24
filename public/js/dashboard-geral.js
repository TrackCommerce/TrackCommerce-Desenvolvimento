let graficoHistorico;
let servidorAtual;
let metricaAtual = 'rede';
let dadosRecebidos = null;

// Ponto de entrada para a futura integração: aceita objeto ou texto JSON.
window.atualizarDashboardComJson = function (entrada) {
  const dados = interpretarJsonDashboard(entrada);
  dadosRecebidos = dados;
  if (document.readyState !== 'loading') renderizarDashboardGeral();
};

function atualizarBadge(id, texto, classe) {
  const elemento = document.getElementById(id);
  elemento.textContent = texto || 'Normal';
  elemento.className = `badge ${classe || ''}`;
}

function renderizarGrafico(metrica) {
  metricaAtual = metrica;
  document.querySelectorAll('[data-metrica]').forEach(botao => {
    const ativo = botao.dataset.metrica === metrica;
    botao.classList.toggle('active', ativo);
    botao.setAttribute('aria-selected', String(ativo));
  });
  if (typeof Chart === 'undefined') return;
  if (graficoHistorico) graficoHistorico.destroy();

  const rede = metrica === 'rede';
  const unidade = rede ? 'MB/m' : '%';
  document.getElementById('historico-descricao').textContent = servidorAtual.simulado
    ? 'Evolução simulada dos recursos; horários ilustrativos.'
    : 'Evolução dos recursos nas capturas recebidas.';
  const series = rede
    ? [
        { label: 'Recebido (Download)', data: servidorAtual.rede.volumeDownloadGrafico, cor: '#347cff' },
        { label: 'Enviado (Upload)', data: servidorAtual.rede.volumeUploadGrafico, cor: '#ff9000' }
      ]
    : [{ label: metrica === 'disco' ? 'Disco' : metrica.toUpperCase(), data: servidorAtual[metrica].evolucao, cor: '#347cff' }];
  const total = series[0].data.length;
  if (!total) document.getElementById('historico-descricao').textContent = 'Nenhum dado de histórico recebido.';
  // Os limites em MB/m são ilustrativos, assim como as séries de rede.
  const limites = { cpu: [80, 90], ram: [75, 85], disco: [80, 90], rede: [100, 150] }[metrica];
  const linhasLimite = limites.map((valor, indice) => ({
    label: `${indice === 0 ? 'Atenção' : 'Crítico'}: ${valor} ${unidade}`,
    data: Array(total).fill(valor),
    borderColor: indice === 0 ? '#ff9000' : '#e42c49',
    backgroundColor: indice === 0 ? '#ff9000' : '#e42c49',
    borderWidth: 1.5, borderDash: [6, 5], pointRadius: 0, pointHoverRadius: 0, fill: false
  }));

  graficoHistorico = new Chart(document.getElementById('grafico-historico'), {
    type: 'line',
    data: {
      labels: servidorAtual.historicoDatas ? servidorAtual.historicoDatas.map(data => new Date(data).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })) : Array.from({ length: total }, (_, i) => {
        const minutos = (16 * 60 + Math.round(i * (22 * 60 + 30) / Math.max(total - 1, 1))) % (24 * 60);
        return `${String(Math.floor(minutos / 60)).padStart(2, '0')}:${String(minutos % 60).padStart(2, '0')}`;
      }),
      datasets: [...series.map(serie => ({
        label: serie.label, data: serie.data, borderColor: serie.cor,
        backgroundColor: serie.cor === '#347cff' ? 'rgba(52, 124, 255, .08)' : 'rgba(255, 144, 0, .06)',
        borderWidth: 2, fill: true, tension: 0, pointRadius: 2
      })), ...linhasLimite]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { position: 'bottom', align: 'start', labels: { boxWidth: 10, boxHeight: 10, color: '#74819a', font: { family: 'Outfit', size: 12 } } },
        tooltip: { callbacks: { label: contexto => `${contexto.dataset.label}: ${contexto.parsed.y} ${unidade}` } }
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#74819a', font: { size: 11 } } },
        y: { beginAtZero: true, suggestedMax: rede ? 175 : 100, grid: { color: '#e3e9f1' }, border: { display: false }, ticks: { color: '#74819a', font: { size: 11 }, callback: valor => `${valor} ${unidade}` } }
      }
    }
  });
}

function renderizarProcessos() {
  const busca = document.getElementById('busca-processo').value.trim().toLocaleLowerCase('pt-BR');
  const processos = servidorAtual.geral.processos.filter(processo => `${processo.pid} ${processo.nome}`.toLocaleLowerCase('pt-BR').includes(busca));
  const tabela = document.getElementById('tabela-processos-geral');
  tabela.replaceChildren();
  processos.forEach(processo => {
    const linha = document.createElement('tr');
    [processo.pid, processo.nome, processo.cpu, processo.ram].forEach(valor => {
      const celula = document.createElement('td');
      celula.textContent = valor;
      linha.appendChild(celula);
    });
    tabela.appendChild(linha);
  });
  document.getElementById('sem-processos').hidden = processos.length > 0;
}

function renderizarDashboardGeral() {
  servidorAtual = dadosRecebidos || { ...obterServidorAtual(), simulado: true };
  document.getElementById('servidor-nome').textContent = servidorAtual.nome;
  document.getElementById('origem-dados').textContent = `Visão da última captura e histórico de utilização dos recursos do servidor.${servidorAtual.simulado ? ' Dados simulados.' : ''}`;
  document.getElementById('ultima-captura').textContent = servidorAtual.captura
    ? new Date(servidorAtual.captura).toLocaleString('pt-BR')
    : 'Data não disponível (dados simulados)';
  atualizarBadge('servidor-status', servidorAtual.statusTexto, servidorAtual.status);
  ['cpu', 'ram', 'disco', 'rede'].forEach(metrica => {
    const saude = servidorAtual.geral.saude[metrica];
    atualizarBadge(`status-${metrica}`, saude.texto, saude.classe);
    atualizarBadge(`link-status-${metrica}`, saude.texto, saude.classe);
    if (metrica !== 'rede') {
      const valor = servidorAtual.geral[metrica];
      const numero = document.getElementById(`valor-${metrica}`);
      numero.textContent = valor;
      numero.className = `big ${saude.classe || ''}`;
      const barra = document.getElementById(`progresso-${metrica}`);
      barra.style.width = `${Math.max(0, Math.min(100, parseFloat(valor) || 0))}%`;
      barra.className = saude.classe || '';
    }
  });
  document.getElementById('rede-download').textContent = `${servidorAtual.rede.volumeDownload} MB/m`;
  document.getElementById('rede-upload').textContent = `${servidorAtual.rede.volumeUpload} MB/m`;
  
  renderizarGrafico(metricaAtual);
  renderizarCapacidades();
  renderizarProcessos();
}


async function carregarDashboardLocal() {

    try {

        const identificador =
            "330efa59-52a3-45b0-b177-f0257fe345d7";

        const resposta = await fetch(
            `/api/dashboard/local?identificador=${encodeURIComponent(identificador)}`,
            {
                cache: "no-store"
            }
        );

        if (!resposta.ok) {
            throw new Error(
                `Erro HTTP: ${resposta.status}`
            );
        }

        const jsonGold = await resposta.json();

        const jsonAdaptado = adaptarJsonGold(jsonGold);

        window.atualizarDashboardComJson(jsonAdaptado);

        console.log("JSON recebido do S3:", jsonGold);

        console.log("JSON adaptado:", jsonAdaptado);

        console.log(
            "Dashboard alimentada com sucesso pelo S3!"
        );

    } catch (erro) {

        console.error(
            "Erro ao carregar dados do S3:",
            erro
        );

        document.getElementById("origem-dados").textContent =
            "Falha ao consultar o S3. Dados simulados ou desatualizados.";
    }
}


document.addEventListener('DOMContentLoaded', () => {

    document.querySelectorAll('[data-metrica]').forEach(botao =>
        botao.addEventListener('click', () =>
            renderizarGrafico(botao.dataset.metrica)
        )
    );

    document.getElementById('busca-processo')
        .addEventListener('input', renderizarProcessos);

    document.getElementById('btn-atualizar')
        .addEventListener('click', carregarDashboardLocal);

    renderizarDashboardGeral();

    carregarDashboardLocal();
});


function formatarCapacidade(valor) {

    if (!Number.isFinite(valor) || valor < 0) {
        return "--";
    }

    if (valor >= 1024) {
        return `${(valor / 1024).toFixed(2)} TB`;
    }

    return `${valor.toFixed(2)} GB`;
}

function renderizarCapacidades() {

    const capacidade = servidorAtual.capacidade;

    ["ram", "disco"].forEach(recurso => {

        ["total", "usado", "disponivel"].forEach(campo => {

            const elemento = document.getElementById(
                `${recurso}-${campo}`
            );

            if (elemento) {
                elemento.textContent = formatarCapacidade(
                    capacidade?.[recurso]?.[campo]
                );
            }
        });
    });
}