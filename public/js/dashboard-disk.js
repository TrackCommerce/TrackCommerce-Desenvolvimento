function criarGraficoUsoDisco(idCanvas) {
  const ctx = document.getElementById(idCanvas);
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: [0, 1, 2, 3, 4, 5, 6, 7, 8],
      datasets: [
        {
          data: [85, 85, 85, 85, 85, 85, 85, 85, 85],
          borderColor: '#fbbf24',
          borderWidth: 1.5,
          fill: false,
          tension: 0,
          pointRadius: 0,
          pointHoverRadius: 0
        },
        {
          data: [20, 34, 45, 48, 52, 62, 74, 78, 80],
          borderColor: '#3b82f6',
          borderWidth: 2.5,
          fill: false,
          tension: 0.4,
          borderJoinStyle: 'round',
          pointRadius: 0,
          pointHoverRadius: 4,
          pointHoverBackgroundColor: '#3b82f6'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 400 },
      plugins: {
        legend: { display: false },
        tooltip: { enabled: true }
      },
      scales: {
        x: {
          display: false
        },
        y: {
          min: 0,
          max: 100,
          ticks: { display: false },
          grid: {
            color: '#edf1f7',
            drawTicks: false
          },
          border: { display: false, dash: [4, 4] }
        }
      }
    }
  });
}

function criarGraficoDuasLinhas(idCanvas, dados1, cor1, dados2, cor2) {
  const ctx = document.getElementById(idCanvas);
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: dados1.map((_, i) => i),
      datasets: [
        {
          data: dados1,
          borderColor: cor1,
          borderWidth: 2,
          fill: false,
          tension: 0.4,
          borderJoinStyle: 'round',
          pointRadius: 0,
          pointHoverRadius: 4,
          pointHoverBackgroundColor: cor1
        },
        {
          data: dados2,
          borderColor: cor2,
          borderWidth: 2,
          fill: false,
          tension: 0.4,
          borderJoinStyle: 'round',
          pointRadius: 0,
          pointHoverRadius: 4,
          pointHoverBackgroundColor: cor2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 400 },
      plugins: {
        legend: { display: false },
        tooltip: { enabled: true }
      },
      scales: {
        x: {
          display: false
        },
        y: {
          ticks: { display: false },
          grid: {
            color: '#edf1f7',
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
    '#3b82f6',
    [12, 24, 21, 38, 34, 54, 52, 70],
    '#8b5cf6'
  );
  criarGraficoDuasLinhas(
    'grafico-io-iops',
    [16, 29, 26, 44, 39, 60, 57, 78],
    '#3b82f6',
    [13, 25, 22, 39, 35, 55, 53, 72],
    '#8b5cf6'
  );
  criarGraficoDuasLinhas(
    'grafico-io-latency',
    [14, 26, 22, 36, 32, 52, 50, 72],
    '#3b82f6',
    [16, 30, 25, 42, 38, 60, 56, 76],
    '#f59e0b'
  );
});
