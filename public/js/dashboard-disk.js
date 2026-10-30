function criarGraficoUsoDisco(idCanvas, dados = [35, 48, 62, 74, 80]) {
  const ctx = document.getElementById(idCanvas);
  if (!ctx) return null;

  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['12:00', '12:15', '12:30', '12:45', 'Agora'],
      datasets: [
        {
          label: 'Limite (85%)',
          data: [85, 85, 85, 85, 85],
          borderColor: '#ea580c',
          borderWidth: 1.5,
          borderDash: [4, 4],
          fill: false,
          tension: 0,
          pointRadius: 0,
          pointHoverRadius: 0
        },
        {
          label: 'Uso atual',
          data: dados,
          borderColor: '#0284c7',
          backgroundColor: '#0284c7',
          borderWidth: 2.5,
          fill: false,
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
      resizeDelay: 50,
      animation: { duration: 400 },
      interaction: {
        mode: 'index',
        intersect: false
      },
      layout: { padding: { top: 2, right: 4, bottom: 0, left: 0 } },
      plugins: {
        legend: { display: false },
        tooltip: {
          displayColors: true,
          boxWidth: 6,
          boxHeight: 6,
          usePointStyle: true,
          callbacks: {
            label: function (context) {
              return ` ${context.dataset.label}: ${context.parsed.y}%`;
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
          max: 100,
          ticks: { display: false, stepSize: 25 },
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

function criarGraficoDuasLinhas(idCanvas, dados1, cor1, dados2, cor2, label1 = 'Leitura', label2 = 'Gravação', unidade = 'MB/s') {
  const ctx = document.getElementById(idCanvas);
  if (!ctx) return null;

  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['12:00', '12:15', '12:30', '12:45', 'Agora'],
      datasets: [
        {
          label: label1,
          data: dados1,
          borderColor: cor1,
          backgroundColor: cor1,
          borderWidth: 2,
          fill: false,
          tension: 0,
          pointRadius: 0,
          pointHoverRadius: 4,
          pointHoverBackgroundColor: cor1
        },
        {
          label: label2,
          data: dados2,
          borderColor: cor2,
          backgroundColor: cor2,
          borderWidth: 2,
          fill: false,
          tension: 0,
          pointRadius: 0,
          pointHoverRadius: 4,
          pointHoverBackgroundColor: cor2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      resizeDelay: 50,
      animation: { duration: 400 },
      interaction: {
        mode: 'index',
        intersect: false
      },
      layout: { padding: { top: 2, right: 4, bottom: 0, left: 0 } },
      plugins: {
        legend: { display: false },
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
          ticks: { display: false },
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

document.addEventListener('DOMContentLoaded', () => {
  const servidor = (typeof obterServidorAtual === 'function')
    ? obterServidorAtual()
    : (window.DADOS_MOCKADOS ? window.DADOS_MOCKADOS.atencao : null);

  const dadosDisco = servidor ? servidor.disco : {
    usoAtual: "80%",
    usadosTexto: "916 GB usados • 584 GB livres",
    evolucao: [70, 72, 75, 78, 80],
    ioBytes: { read: [42, 55, 68, 62, 70], write: [35, 45, 58, 52, 60] },
    ioIops: { read: [50, 65, 80, 72, 85], write: [40, 52, 65, 58, 70] },
    ioLatency: { read: [4, 6, 8, 7, 9], write: [5, 8, 11, 9, 12] }
  };

  // Atualiza valor destaque
  const elUsoAtual = document.getElementById('disco-uso-atual');
  if (elUsoAtual) elUsoAtual.textContent = dadosDisco.usoAtual;

  // Atualiza footer da partição
  const elFooter = document.getElementById('disco-footer-usados');
  if (elFooter) elFooter.textContent = dadosDisco.usadosTexto;

  criarGraficoUsoDisco('grafico-uso-disco', dadosDisco.evolucao);
  criarGraficoDuasLinhas(
    'grafico-io-bytes',
    dadosDisco.ioBytes.read,
    '#10b981',
    dadosDisco.ioBytes.write,
    '#ea580c',
    'Leitura',
    'Gravação',
    'MB/s'
  );
  criarGraficoDuasLinhas(
    'grafico-io-iops',
    dadosDisco.ioIops.read,
    '#10b981',
    dadosDisco.ioIops.write,
    '#ea580c',
    'Leitura',
    'Gravação',
    'IOPS'
  );
  criarGraficoDuasLinhas(
    'grafico-io-latency',
    dadosDisco.ioLatency.read,
    '#0284c7',
    dadosDisco.ioLatency.write,
    '#ea580c',
    'Média',
    'Percentil 95',
    'ms'
  );

  window.addEventListener('resize', () => {
    if (window.scrollX > 0) {
      window.scrollTo({ left: 0 });
    }
  });
});
