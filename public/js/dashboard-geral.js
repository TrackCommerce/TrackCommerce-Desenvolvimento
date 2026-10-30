function criarGraficoDuplo(idCanvas, datasets, { max = 100, passo = 25 } = {}) {
  const ctx = document.getElementById(idCanvas);
  if (!ctx) return null;

  const labels = datasets[0]?.data ? datasets[0].data.map((_, i) => i) : [];

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
        tension: 0.15,
        borderJoinStyle: 'round',
        borderCapStyle: 'round',
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

const graficos = {
  disco: criarGraficoDuplo('grafico-disco', [
    {
      label: 'Read',
      data: [20, 31, 45, 38, 30, 42, 60, 51, 40, 48, 55, 63, 58, 66, 61, 55],
      cor: '#10b981'
    },
    {
      label: 'Write',
      data: [15, 21, 25, 33, 40, 35, 30, 41, 50, 44, 35, 39, 47, 42, 38, 35],
      cor: '#e54d15'
    }
  ], { max: 80, passo: 20 }),

  rede: criarGraficoDuplo('grafico-rede', [
    {
      label: 'Download',
      data: [30, 41, 55, 49, 45, 57, 70, 64, 60, 68, 75, 72, 78, 74, 77, 75],
      cor: '#0284c7'
    },
    {
      label: 'Upload',
      data: [10, 14, 20, 18, 15, 25, 35, 31, 25, 27, 30, 34, 29, 33, 31, 30],
      cor: '#f59e0b'
    }
  ], { max: 100, passo: 25 })
};
