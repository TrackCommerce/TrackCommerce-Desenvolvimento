function criarGraficoLinha(idCanvas, dados, cor = '#3b82f6') {
  const ctx = document.getElementById(idCanvas);
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: dados.map((_, i) => i),
      datasets: [{
        data: dados,
        borderColor: cor,
        borderWidth: 2,
        fill: false,
        tension: 0,
        pointRadius: 0,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { display: false },
        y: { display: false, min: 0 }
      }
    }
  });
}

function criarGraficoBuffers(idCanvas) {
  const ctx = document.getElementById(idCanvas);
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai'],
      datasets: [
        {
          data: [2, 2.1, 4.5, 4.2, 4.1],
          borderColor: '#3b82f6', // used
          borderWidth: 2,
          tension: 0,
          pointRadius: 0
        },
        {
          data: [4, 4.2, 6.5, 7.0, 7.5],
          borderColor: '#f59e0b', // buffer & cache
          borderWidth: 2,
          tension: 0,
          pointRadius: 0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { 
            grid: { color: '#e6e9ef', drawBorder: false, borderDash: [4, 4] },
            ticks: { color: '#8c97b0', font: { size: 10 } }
        },
        y: {
            display: true,
            position: 'right',
            ticks: { display: false },
            grid: { color: '#e6e9ef', drawBorder: false, borderDash: [4, 4] },
            border: { display: false },
            min: 0
        }
      }
    }
  });
}

function criarGraficoDoughnut(idCanvas, data, colors) {
    const ctx = document.getElementById(idCanvas);
    return new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'],
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderWidth: 0,
                cutout: '70%'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { enabled: true }
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
  criarGraficoLinha('grafico-porcentagem', [30, 45, 50, 70, 80], '#3b82f6');
  criarGraficoDoughnut('grafico-swap', [25, 75], ['#ef4444', '#3b82f6']);
  criarGraficoDoughnut('grafico-modo', [25, 15, 5, 10, 45], ['#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#3b82f6']);
  criarGraficoBuffers('grafico-buffers');
});
