// Gráfico de Linha (CPU Principal)
function criarGraficoLinha(idCanvas, dados, labelsX) {
  const ctx = document.getElementById(idCanvas);
  if (!ctx) return;

  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: labelsX,
      datasets: [{
        label: 'Uso de CPU',
        data: dados,
        borderColor: '#e54d15', 
        backgroundColor: '#e54d15',
        borderWidth: 2,
        fill: false,
        tension: 0, 
        pointRadius: 0,
        pointHoverRadius: 4,
        pointHoverBackgroundColor: '#e54d15'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { 
        legend: { display: false },
        tooltip: {
          displayColors: false,
          callbacks: {
            label: function (context) {
              return ` Uso: ${context.parsed.y}%`;
            }
          }
        }
      },
      scales: {
        x: { 
          grid: { display: false },
          ticks: { color: '#8c97b0', font: { size: 10, family: "'Outfit', sans-serif" } }
        },
        y: { 
          display: false, 
          min: 0,
          max: 100
        }
      }
    }
  });
}

// Gráfico Load Average 
function criarGraficoLoadAverage(idCanvas, dados = [1, 2, 1, 4, 5]) {
  const ctx = document.getElementById(idCanvas);
  if (!ctx) return;

  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['12:00', '12:15', '12:30', '12:45', 'Agora'],
      datasets: [
        { 
          label: '15 min', 
          data: dados, 
          borderColor: '#0284c7', 
          backgroundColor: '#0284c7',
          borderWidth: 2, 
          tension: 0, 
          pointRadius: 0,
          pointHoverRadius: 4,
          pointHoverBackgroundColor: '#0284c7'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { 
        legend: { 
          display: true, 
          position: 'top', 
          align: 'end',
          labels: { 
            usePointStyle: true, 
            pointStyle: 'circle',
            boxWidth: 6,
            boxHeight: 6,
            padding: 8,
            font: { size: 10, family: "'Outfit', sans-serif", weight: '600' },
            color: '#6b7486'
          } 
        },
        tooltip: {
          displayColors: true,
          boxWidth: 6,
          boxHeight: 6,
          usePointStyle: true
        }
      },
      scales: {
        x: { 
          grid: { color: '#e6e9ef', drawTicks: false },
          ticks: { color: '#8c97b0', font: { size: 10, family: "'Outfit', sans-serif" } },
          border: { color: '#e6e9ef', width: 1.5 }
        },
        y: {
          display: true,
          position: 'left', 
          grid: { color: '#e6e9ef', drawTicks: false },
          ticks: { color: '#8c97b0', font: { size: 10, family: "'Outfit', sans-serif" } },
          border: { display: false },
          min: 0
        }
      }
    }
  });
}

// Gráfico de Rosca
function criarGraficoDoughnut(idCanvas, data, colors) {
  const ctx = document.getElementById(idCanvas);
  if (!ctx) return;

  return new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['User', 'System', 'Idle', 'IOWait'],
      datasets: [{
        data: data,
        backgroundColor: colors,
        borderWidth: 0,
        cutout: '62%'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { 
          enabled: true,
          callbacks: {
            label: function(context) {
              return ` ${context.label}: ${context.parsed}%`;
            }
          }
        }
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const servidor = (typeof obterServidorAtual === 'function')
    ? obterServidorAtual()
    : (window.DADOS_MOCKADOS ? window.DADOS_MOCKADOS.atencao : null);

  const labelsTempo = ['12:00', '12:15', '12:30', '12:45', 'Agora'];
  const dadosCpu = servidor ? servidor.cpu : {
    usoAtual: "80%",
    evolucao: [40, 55, 60, 75, 80],
    loadAverage: [1, 2, 1, 4, 5],
    cores: [80, 45, 60, 10],
    modoLegenda: { user: "55%", system: "25%", idle: "15%" }
  };

  // Atualiza valor destaque
  const elUsoAtual = document.getElementById('cpu-uso-atual');
  if (elUsoAtual) elUsoAtual.textContent = dadosCpu.usoAtual;

  // Atualiza tabela de top 5 processos CPU
  const elTbody = document.getElementById('tabela-processos-cpu');
  if (elTbody && dadosCpu.processos) {
    elTbody.innerHTML = dadosCpu.processos.map(p => `
      <tr>
        <td class="pid">${p.pid}</td>
        <td>${p.nome}</td>
        <td class="num">${p.cpu}</td>
        <td class="num">${p.ram}</td>
      </tr>
    `).join('');
  }

  // Atualiza barras dos núcleos
  if (dadosCpu.cores) {
    const coreItems = document.querySelectorAll('.core-item');
    dadosCpu.cores.forEach((val, idx) => {
      if (coreItems[idx]) {
        const valEl = coreItems[idx].querySelector('.core-value');
        const fillEl = coreItems[idx].querySelector('.core-bar-fill');
        if (valEl) valEl.textContent = `${val}%`;
        if (fillEl) fillEl.style.width = `${val}%`;
      }
    });
  }

  // Atualiza legenda do uso por modo
  if (dadosCpu.modoLegenda) {
    const legendVals = document.querySelectorAll('.modo-container .legend-item .leg-right');
    if (legendVals.length >= 3) {
      legendVals[0].textContent = dadosCpu.modoLegenda.user;
      legendVals[1].textContent = dadosCpu.modoLegenda.system;
      legendVals[2].textContent = dadosCpu.modoLegenda.idle;
    }
  }

  const userVal = parseInt(dadosCpu.modoLegenda?.user) || 55;
  const sysVal = parseInt(dadosCpu.modoLegenda?.system) || 25;
  const idleVal = parseInt(dadosCpu.modoLegenda?.idle) || 15;
  const ioVal = Math.max(0, 100 - userVal - sysVal - idleVal);

  criarGraficoLinha('grafico-cpu-principal', dadosCpu.evolucao, labelsTempo);
  criarGraficoLoadAverage('grafico-load-average', dadosCpu.loadAverage);
  criarGraficoDoughnut('grafico-uso-modo', [userVal, sysVal, idleVal, ioVal], ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981']);
});