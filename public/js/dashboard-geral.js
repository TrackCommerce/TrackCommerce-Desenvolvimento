let graficoHistorico;
let servidorAtual;
let metricaAtual = 'rede';

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
  document.getElementById('historico-descricao').textContent = rede
    ? 'Tráfego e horários ilustrativos; limites simulados em MB/s.'
    : 'Evolução dos recursos nos dados disponíveis; horários ilustrativos.';
  const series = rede
    ? [{ label: 'Recebido (Download)', data: [80, 100, 90, 128, 120], cor: '#347cff' }, { label: 'Enviado (Upload)', data: [22, 40, 37, 48, 65], cor: '#ff9000' }]
    : [{ label: metrica === 'disco' ? 'Disco' : metrica.toUpperCase(), data: servidorAtual[metrica].evolucao, cor: '#347cff' }];
  const unidade = rede ? 'MB/s' : '%';
  const total = series[0].data.length;
  const limites = { cpu: [80, 90], ram: [75, 85], disco: [80, 90], rede: [100, 150] }[metrica];
  const linhasLimite = limites ? limites.map((valor, indice) => ({
    label: `${indice === 0 ? 'Atenção' : 'Crítico'}: ${valor}${rede ? ' MB/s' : '%'}`,
    data: Array(total).fill(valor),
    borderColor: indice === 0 ? '#ff9000' : '#e42c49',
    backgroundColor: indice === 0 ? '#ff9000' : '#e42c49',
    borderWidth: 1.5,
    borderDash: [6, 5],
    pointRadius: 0,
    pointHoverRadius: 0,
    fill: false
  })) : [];
  graficoHistorico = new Chart(document.getElementById('grafico-historico'), {
    type: 'line',
    data: {
      labels: Array.from({ length: total }, (_, i) => {
        const minutos = (16 * 60 + Math.round(i * (22 * 60 + 30) / Math.max(total - 1, 1))) % (24 * 60);
        return `${String(Math.floor(minutos / 60)).padStart(2, '0')}:${String(minutos % 60).padStart(2, '0')}`;
      }),
      datasets: [...series.map(serie => ({ label: serie.label, data: serie.data, borderColor: serie.cor, backgroundColor: serie.cor === '#347cff' ? 'rgba(52, 124, 255, .08)' : 'rgba(255, 144, 0, .06)', borderWidth: 2, fill: true, tension: 0, pointRadius: 2 })), ...linhasLimite]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: { legend: { position: 'bottom', align: 'start', labels: { boxWidth: 10, boxHeight: 10, color: '#74819a', font: { family: 'Outfit', size: 12 } } }, tooltip: { callbacks: { label: contexto => `${contexto.dataset.label}: ${contexto.parsed.y} ${unidade}` } } },
      scales: { x: { grid: { display: false }, ticks: { color: '#74819a', font: { size: 11 } } }, y: { beginAtZero: true, suggestedMax: rede ? undefined : 100, grid: { color: '#e3e9f1' }, border: { display: false }, ticks: { color: '#74819a', font: { size: 11 }, callback: valor => `${valor} ${unidade}` } } }
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
  servidorAtual = obterServidorAtual();
  document.getElementById('servidor-nome').textContent = servidorAtual.nome;
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
  renderizarProcessos();
  renderizarGrafico(metricaAtual);
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-metrica]').forEach(botao => botao.addEventListener('click', () => renderizarGrafico(botao.dataset.metrica)));
  document.getElementById('busca-processo').addEventListener('input', renderizarProcessos);
  document.getElementById('btn-atualizar').addEventListener('click', renderizarDashboardGeral);
  renderizarDashboardGeral();
});
