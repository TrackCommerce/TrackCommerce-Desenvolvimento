function criarGraficoDuplo(idCanvas, datasets, { max = 100, passo = 25 } = {}) {
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
      layout: { padding: { top: 0, right: 4, bottom: 0, left: 0 } },
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
            padding: 6
          }
        },
        tooltip: {
          displayColors: true,
          boxWidth: 6,
          boxHeight: 6,
          usePointStyle: true,
          callbacks: {
            label: function (context) {
              return ` ${context.dataset.label}: ${context.parsed.y} MB/m`;
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
          max: max,
          ticks: { display: false, stepSize: passo },
          grid: {
            color: '#e6e9ef',
            drawTicks: false
          },
          border: { display: false, dash: [4, 4] }
        }
      }
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
  renderizarDashboardGeral();
});
