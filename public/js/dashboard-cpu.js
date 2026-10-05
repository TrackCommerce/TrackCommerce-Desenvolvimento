// Gráfico de Linha (CPU Principal e Núcleos)
function criarGraficoLinha(idCanvas, dados, labelsX) {
  const ctx = document.getElementById(idCanvas);
  if (!ctx) return;

  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: labelsX,
      datasets: [{
        data: dados,
        borderColor: '#3b82f6', 
        borderWidth: 2,
        fill: false,
        tension: 0.3, 
        pointRadius: 0 
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { 
          grid: { display: false },
          ticks: { color: '#8c97b0', font: { size: 10 } }
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
function criarGraficoLoadAverage(idCanvas) {
  const ctx = document.getElementById(idCanvas);
  if (!ctx) return;

  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['12:00', '13:00', '14:00', '15:00', '16:00'],
      datasets: [
        { label: '1min', data: [2, 4, 3, 7, 8], borderColor: '#3b82f6', borderWidth: 2, tension: 0.3, pointRadius: 0 },
        { label: '5min', data: [1, 3, 2, 5, 6], borderColor: '#8b5cf6', borderWidth: 2, tension: 0.3, pointRadius: 0 },
        { label: '15min', data: [1, 2, 1, 4, 5], borderColor: '#f59e0b', borderWidth: 2, tension: 0.3, pointRadius: 0 }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { 
        legend: { display: true, position: 'top', labels: { usePointStyle: true, boxWidth: 8 } } 
      },
      scales: {
        x: { 
          grid: { color: '#e6e9ef', drawBorder: false },
          ticks: { color: '#8c97b0', font: { size: 10 } }
        },
        y: {
          display: true,
          position: 'right', 
          grid: { color: '#e6e9ef', drawBorder: false },
          border: { display: false },
          ticks: { display: false }, 
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
  const labelsTempo = ['12:00', '', '14:00', '', '16:00'];
  const dadosEvolucao = [40, 55, 60, 75, 80];

  criarGraficoLinha('grafico-cpu-principal', dadosEvolucao, labelsTempo);
  criarGraficoLoadAverage('grafico-load-average');
  


  criarGraficoDoughnut('grafico-uso-modo', [55, 25, 15, 5], ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981']);
});