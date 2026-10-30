function criarGraficoUsoDisco(idCanvas) {
  const ctx = document.getElementById(idCanvas);
  if (!ctx) return null;

  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: [0, 1, 2, 3, 4, 5, 6, 7, 8],
      datasets: [
        {
          label: 'Limite (85%)',
          data: [85, 85, 85, 85, 85, 85, 85, 85, 85],
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
          data: [20, 34, 45, 48, 52, 62, 74, 78, 80],
          borderColor: '#0284c7',
          backgroundColor: '#0284c7',
          borderWidth: 2.5,
          fill: false,
          tension: 0.15,
          borderJoinStyle: 'round',
          borderCapStyle: 'round',
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
      labels: dados1.map((_, i) => i),
      datasets: [
        {
          label: label1,
          data: dados1,
          borderColor: cor1,
          backgroundColor: cor1,
          borderWidth: 2,
          fill: false,
          tension: 0.15,
          borderJoinStyle: 'round',
          borderCapStyle: 'round',
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
          tension: 0.15,
          borderJoinStyle: 'round',
          borderCapStyle: 'round',
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
  criarGraficoUsoDisco('grafico-uso-disco');
  criarGraficoDuasLinhas(
    'grafico-io-bytes',
    [15, 28, 25, 42, 38, 58, 56, 75],
    '#10b981',
    [12, 24, 21, 38, 34, 54, 52, 70],
    '#ea580c',
    'Leitura',
    'Gravação',
    'MB/s'
  );
  criarGraficoDuasLinhas(
    'grafico-io-iops',
    [16, 29, 26, 44, 39, 60, 57, 78],
    '#10b981',
    [13, 25, 22, 39, 35, 55, 53, 72],
    '#ea580c',
    'Leitura',
    'Gravação',
    'IOPS'
  );
  criarGraficoDuasLinhas(
    'grafico-io-latency',
    [14, 26, 22, 36, 32, 52, 50, 72],
    '#0284c7',
    [16, 30, 25, 42, 38, 60, 56, 76],
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
