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
  cpu:       criarGrafico('grafico-cpu',        [60, 72, 70, 82, 78, 80]),
  ram:       criarGrafico('grafico-ram',        [40, 52, 50, 62, 66, 67]),
  diskRead:  criarGrafico('grafico-disk-read',  [20, 45, 30, 60, 40, 55]),
  diskWrite: criarGrafico('grafico-disk-write', [15, 25, 40, 30, 50, 35]),
  netDown:   criarGrafico('grafico-net-down',   [30, 55, 45, 70, 60, 75]),
  netUp:     criarGrafico('grafico-net-up',     [10, 20, 15, 35, 25, 30])
};