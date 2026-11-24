function criarGraficoDuplo(idCanvas, datasets, { max = 100, passo = 25, unidade = 'MB/m' } = {}) {
  const ctx = document.getElementById(idCanvas);
  if (!ctx) return null;

  const labels = ['12:00', '12:15', '12:30', '12:45', 'Agora'];

  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: datasets.map(ds => ({
        label: ds.label,
        data: ds.data,
        borderColor: ds.cor,
        backgroundColor: ds.cor,
        borderWidth: 2,
        fill: false,
        tension: 0,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointHoverBackgroundColor: ds.cor
      }))
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 400 },
      interaction: {
        mode: 'index',
        intersect: false
      },
      layout: { padding: { top: 0, right: 6, bottom: 0, left: 0 } },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          align: 'end',
          labels: {
            boxWidth: 6,
            boxHeight: 6,
            usePointStyle: true,
            pointStyle: 'circle',
            font: { size: 9, family: "'Outfit', sans-serif", weight: '600' },
            color: '#6b7486',
            padding: 8,
            generateLabels: function (chart) {
              const original = Chart.defaults.plugins.legend.labels.generateLabels(chart);
              return original.map(item => {
                const ds = chart.data.datasets[item.datasetIndex];
                const lastVal = ds.data && ds.data.length ? ds.data[ds.data.length - 1] : '';
                return {
                  ...item,
                  text: `${item.text}: ${lastVal} ${unidade}`
                };
              });
            }
          }
        },
        tooltip: {
          displayColors: true,
          boxWidth: 6,
          boxHeight: 6,
          usePointStyle: true,
          callbacks: {
            label: function (context) {
              return ` ${context.dataset.label}: ${context.parsed.y} ${unidade}`;
            }
          }
        }
      },
      scales: {
        x: {
          ticks: { display: false },
          grid: { display: false },
          border: { color: '#e6e9ef', width: 1.5 }
        },
        y: {
          min: 0,
          suggestedMax: max,
          ticks: { 
            display: true, 
            stepSize: passo,
            color: '#8c97b0',
            font: { size: 9, family: "'Outfit', sans-serif", weight: '500' },
            padding: 4
          },
          grid: {
            color: '#e6e9ef',
            drawTicks: false
          },
          border: { display: false, dash: [4, 4] }
        }
      }

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


function renderizarDashboardGeral() {
  const servidor = (typeof obterServidorAtual === 'function') 
    ? obterServidorAtual() 
    : (window.DADOS_MOCKADOS ? window.DADOS_MOCKADOS.atencao : null);
    
  if (!servidor) return;

  // Atualiza nome do servidor e resumo meta
  const elMeta = document.getElementById('resumo-meta');
  if (elMeta) {
    elMeta.textContent = servidor.geral.resumoMeta;
  }

  // Atualiza os 4 KPIs principais
  const elCpu = document.getElementById('valor-cpu');
  if (elCpu) {
    elCpu.textContent = servidor.geral.cpu;
    elCpu.className = 'big ' + (servidor.geral.cpuClasse || '');
  }

  const elRam = document.getElementById('valor-ram');
  if (elRam) {
    elRam.textContent = servidor.geral.ram;
    elRam.className = 'big ' + (servidor.geral.ramClasse || '');
  }

  const elDisco = document.getElementById('valor-disco');
  if (elDisco) {
    elDisco.textContent = servidor.geral.disco;
    elDisco.className = 'big ' + (servidor.geral.discoClasse || '');
  }

  const elRede = document.getElementById('valor-rede');
  if (elRede) {
    elRede.innerHTML = `${parseInt(servidor.geral.rede)}<small>ms</small>`;
    elRede.className = 'big ' + (servidor.geral.redeClasse || '');
  }

  // Atualiza indicadores de saúde
  function atualizarSaudeItem(compKey, idItem, idVal) {
    const item = servidor.geral.saude[compKey];
    const elBox = document.getElementById(idItem);
    const elVal = document.getElementById(idVal);
    if (elBox && item) {
      elBox.className = 'saude-item ' + (item.classe || '');
    }
    if (elVal && item) {
      elVal.textContent = item.texto;
      elVal.className = item.classe || '';
    }
  }

  atualizarSaudeItem('cpu', 'saude-cpu', 'saude-cpu-val');
  atualizarSaudeItem('ram', 'saude-ram', 'saude-ram-val');
  atualizarSaudeItem('disco', 'saude-disco', 'saude-disco-val');
  atualizarSaudeItem('rede', 'saude-rede', 'saude-rede-val');

  // Atualiza tabela de top 5 processos
  const elTbody = document.getElementById('tabela-processos-geral');
  if (elTbody && servidor.geral.processos) {
    elTbody.innerHTML = servidor.geral.processos.map(p => `
      <tr>
        <td class="pid">${p.pid}</td>
        <td>${p.nome}</td>
        <td class="num">${p.cpu}</td>
        <td class="num">${p.ram}</td>
      </tr>
    `).join('');
  }

  // Cria gráficos com os dados do servidor selecionado
  criarGraficoDuplo('grafico-disco', [
    {
      label: 'Read',
      data: servidor.geral.discoGrafico.read,
      cor: '#10b981'
    },
    {
      label: 'Write',
      data: servidor.geral.discoGrafico.write,
      cor: '#e54d15'
    }
  ], { max: Math.max(...servidor.geral.discoGrafico.read, ...servidor.geral.discoGrafico.write, 80), passo: 20 });

  criarGraficoDuplo('grafico-rede', [
    {
      label: 'Download',
      data: servidor.geral.redeGrafico.download,
      cor: '#0284c7'
    },
    {
      label: 'Upload',
      data: servidor.geral.redeGrafico.upload,
      cor: '#f59e0b'
    }
  ], { max: Math.max(...servidor.geral.redeGrafico.download, 100), passo: 25 });
}

document.addEventListener('DOMContentLoaded', () => {

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
