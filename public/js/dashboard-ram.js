function criarGraficoLinha(idCanvas, dados, cor = '#0284c7') {
  const ctx = document.getElementById(idCanvas);
  if (!ctx) return;
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['12:00', '12:15', '12:30', '12:45', 'Agora'],
      datasets: [{
        label: 'Uso de RAM',
        data: dados,
        borderColor: cor,
        backgroundColor: cor,
        borderWidth: 2,
        fill: false,
        tension: 0,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointHoverBackgroundColor: cor
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
            label: function(context) {
              return ` Uso: ${context.parsed.y}%`;
            }
          }
        }
      },
      scales: {
        x: { display: false },
        y: { display: false, min: 0, max: 100 }
      }
    }
  });
}

function criarGraficoBuffers(idCanvas) {
  const ctx = document.getElementById(idCanvas);
  if (!ctx) return;
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['12:00', '12:15', '12:30', '12:45', 'Agora'],
      datasets: [
        {
          label: 'USED',
          data: [2, 2.1, 4.5, 4.2, 4.1],
          borderColor: '#0284c7', // used
          backgroundColor: '#0284c7',
          borderWidth: 2,
          tension: 0,
          pointRadius: 0,
          pointHoverRadius: 4,
          pointHoverBackgroundColor: '#0284c7'
        },
        {
          label: 'BUFFER & CACHE',
          data: [4, 4.2, 6.5, 7.0, 7.5],
          borderColor: '#f59e0b', // buffer & cache
          backgroundColor: '#f59e0b',
          borderWidth: 2,
          tension: 0,
          pointRadius: 0,
          pointHoverRadius: 4,
          pointHoverBackgroundColor: '#f59e0b'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { 
        legend: { display: false },
        tooltip: {
          displayColors: true,
          boxWidth: 6,
          boxHeight: 6,
          usePointStyle: true,
          callbacks: {
            label: function(context) {
              return ` ${context.dataset.label}: ${context.parsed.y} GB`;
            }
          }
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
            ticks: { color: '#8c97b0', font: { size: 10, family: "'Outfit', sans-serif" } },
            grid: { color: '#e6e9ef', drawTicks: false },
            border: { display: false },
            min: 0
        }
      }
    }
  });
}

function criarGraficoDoughnut(idCanvas, data, colors, labels = ['Item 1', 'Item 2']) {
    const ctx = document.getElementById(idCanvas);
    if (!ctx) return;
    return new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
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

  const dadosRam = servidor ? servidor.ram : {
    usoAtual: "80%",
    totalGb: "16.0 GB",
    usadaGb: "12.8 GB",
    livreGb: "3.2 GB",
    usadaPorc: "80%",
    livrePorc: "20%",
    evolucao: [30, 45, 50, 70, 80],
    swapUsandoTexto: "2.0 GB (25%)",
    swapLivreTexto: "6.0 GB (75%)",
    swapDados: [25, 75],
    modoDados: [25, 15, 5, 10, 45],
    modoLegenda: { cached: "25%", buffers: "15%", shared: "5%", slab: "10%", available: "45%" }
  };

  // Atualiza barras de uso total
  const elBarUsed = document.getElementById('ram-bar-used');
  const elBarFree = document.getElementById('ram-bar-free');
  if (elBarUsed) elBarUsed.style.width = dadosRam.usadaPorc;
  if (elBarFree) elBarFree.style.width = dadosRam.livrePorc;

  // Atualiza legendas
  const elTotal = document.getElementById('ram-total-instalado');
  const elUsada = document.getElementById('ram-memoria-usada');
  const elLivre = document.getElementById('ram-memoria-livre');
  if (elTotal) elTotal.textContent = dadosRam.totalGb;
  if (elUsada) elUsada.textContent = dadosRam.usadaGb;
  if (elLivre) elLivre.textContent = dadosRam.livreGb;

  // Atualiza valor destaque
  const elUsoAtual = document.getElementById('ram-uso-atual');
  if (elUsoAtual) elUsoAtual.textContent = dadosRam.usoAtual;

  // Atualiza tabela top 5 processos RAM
  const elTbody = document.getElementById('tabela-processos-ram');
  if (elTbody && dadosRam.processos) {
    elTbody.innerHTML = dadosRam.processos.map(p => `
      <tr>
        <td class="pid">${p.pid}</td>
        <td>${p.nome}</td>
        <td class="num">${p.cpu}</td>
        <td class="num">${p.ram}</td>
      </tr>
    `).join('');
  }

  // Atualiza swap
  const elSwapUsando = document.getElementById('ram-swap-usando');
  const elSwapLivre = document.getElementById('ram-swap-livre');
  if (elSwapUsando) elSwapUsando.textContent = dadosRam.swapUsandoTexto;
  if (elSwapLivre) elSwapLivre.textContent = dadosRam.swapLivreTexto;

  // Atualiza modo legenda
  if (dadosRam.modoLegenda) {
    const modoItems = document.querySelectorAll('.modo-legend .val-bold');
    if (modoItems.length >= 5) {
      modoItems[0].textContent = dadosRam.modoLegenda.cached;
      modoItems[1].textContent = dadosRam.modoLegenda.buffers;
      modoItems[2].textContent = dadosRam.modoLegenda.shared;
      modoItems[3].textContent = dadosRam.modoLegenda.slab;
      modoItems[4].textContent = dadosRam.modoLegenda.available;
    }
  }

  const corLinha = dadosRam.usoAtual === "89%" ? '#dc2626' : '#0284c7';
  criarGraficoLinha('grafico-porcentagem', dadosRam.evolucao, corLinha);
  criarGraficoDoughnut('grafico-swap', dadosRam.swapDados, ['#e54d15', '#0284c7'], ['Usando', 'Livre']);
  criarGraficoDoughnut('grafico-modo', dadosRam.modoDados, ['#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#0284c7'], ['Cached', 'Buffers', 'Shared', 'Slab', 'Available']);
  criarGraficoBuffers('grafico-buffers');
});
