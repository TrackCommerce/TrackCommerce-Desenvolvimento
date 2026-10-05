function criarGrafico(idCanvas, dados, cor = '#10b981', { max = 100, passo = 30 } = {}) {
  const ctx = document.getElementById(idCanvas);

  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: dados.map((_, i) => i),
      datasets: [{
        data: dados,
        borderColor: cor,
        borderWidth: 3,
        fill: false,              
        tension: 0,               
        borderJoinStyle: 'round',
        borderCapStyle: 'round',
        pointRadius: 0,           
        pointHoverRadius: 4,
        pointHoverBackgroundColor: cor
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 400 },
      layout: { padding: { top: 4, right: 4 } },
      plugins: {
        legend: { display: false },
        tooltip: { displayColors: false }
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
  cpu: criarGrafico(
    'grafico-cpu',
    [54, 58, 61, 65, 64, 67, 72, 70, 74, 78, 76, 80, 82, 79, 77, 81, 83, 80, 78, 82, 79, 81, 80, 80]
  ),
  ram: criarGrafico(
    'grafico-ram',
    [38, 41, 45, 48, 46, 49, 53, 51, 55, 58, 56, 60, 62, 61, 64, 66, 65, 68, 67, 66, 68, 67, 66, 67]
  ),
  diskRead: criarGrafico(
    'grafico-disk-read',
    [20, 31, 45, 38, 30, 42, 60, 51, 40, 48, 55, 63, 58, 66, 61, 55]
  ),
  diskWrite: criarGrafico(
    'grafico-disk-write',
    [15, 21, 25, 33, 40, 35, 30, 41, 50, 44, 35, 39, 47, 42, 38, 35]
  ),
  netDown: criarGrafico(
    'grafico-net-down',
    [30, 41, 55, 49, 45, 57, 70, 64, 60, 68, 75, 72, 78, 74, 77, 75]
  ),
  netUp: criarGrafico(
    'grafico-net-up',
    [10, 14, 20, 18, 15, 25, 35, 31, 25, 27, 30, 34, 29, 33, 31, 30]
  )
};
