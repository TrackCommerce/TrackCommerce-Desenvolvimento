  function criarGraficoProjecao(idCanvas, dadosHistoricos, dadoProjecao) {
    const ctx = document.getElementById(idCanvas);
    if (!ctx) return;
    return new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['ontem 14:30', '18:30', '22:30', '02:30', '06:30', '10:30', '14:30', 'agora'],
        datasets: [
          {
            label: 'Uso de RAM',
            data: dadosHistoricos,
            borderColor: '#2563eb', // azul forte
            backgroundColor: '#2563eb',
            borderWidth: 2,
            fill: true,
            backgroundColor: 'rgba(37, 99, 235, 0.05)',
            tension: 0.4,
            pointRadius: [0,0,0,0,0,0,0,4], // ponto só no "agora"
            pointBackgroundColor: '#2563eb'
          },
          {
            label: 'Projeção',
            data: [null, null, null, null, null, null, dadosHistoricos[6], dadoProjecao], // conecta no último ponto
            borderColor: '#ea580c', // laranja/vermelho
            borderWidth: 2,
            borderDash: [5, 5],
            fill: false,
            tension: 0.4,
            pointRadius: [0,0,0,0,0,0,0,4],
            pointBackgroundColor: 'white',
            pointBorderColor: '#ea580c',
            pointBorderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function(context) {
                return ` ${context.dataset.label}: ${context.parsed.y}%`;
              }
            }
          },
          annotation: { // Requer plugin chartjs-plugin-annotation se quiser as linhas horizontais exatas, 
                        // ou podemos desenhar nativamente. Vamos usar linhas normais no dataset por simplicidade.
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#64748b', font: { size: 10, family: "'Outfit', sans-serif" } },
            border: { color: '#e2e8f0' }
          },
          y: {
            min: 40,
            max: 100,
            ticks: {
              stepSize: 20,
              color: '#64748b',
              font: { size: 10, family: "'Outfit', sans-serif" },
              callback: (v) => v + '%'
            },
            grid: { color: '#f1f5f9' },
            border: { display: false }
          }
        }
      }
    });
  }

  function criarGraficoPaginacao(idCanvas) {
    const ctx = document.getElementById(idCanvas);
    if (!ctx) return;
    return new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['ontem 14:30', '', '', '', '02:30', '', '', '14:30'],
        datasets: [
          {
            label: 'Swap-in',
            data: [0, 0.1, 0.2, 0, 0, 0.1, 0.2, 1.8],
            borderColor: '#2563eb', // azul
            borderWidth: 2,
            tension: 0.2,
            pointRadius: 0,
            pointHoverRadius: 4
          },
          {
            label: 'Swap-out',
            data: [0.1, 0.2, 0.6, 0.1, 0, 0.1, 0.3, 4.2],
            borderColor: '#ea580c', // laranja
            borderWidth: 2,
            tension: 0.2,
            pointRadius: 0,
            pointHoverRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              label: function(context) {
                return ` ${context.dataset.label}: ${context.parsed.y} MB/s`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#64748b', font: { size: 10, family: "'Outfit', sans-serif" } },
            border: { color: '#e2e8f0' }
          },
          y: {
            min: 0,
            max: 8,
            ticks: {
              stepSize: 2,
              color: '#64748b',
              font: { size: 10, family: "'Outfit', sans-serif" }
            },
            grid: { color: '#f1f5f9' },
            border: { display: false }
          }
        }
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Lógica de tempo estimado para o KPI de RAM (Evitar fadiga de alarme)
    const tempoEstimadoMinutos = 150; // Simulando 2h 30min da ETL
    const kpiTempo = document.querySelector('.kpi-highlight');
    
    if (kpiTempo) {
        kpiTempo.classList.remove('kpi-safe', 'kpi-warning-state', 'kpi-critical-state');
        if (tempoEstimadoMinutos <= 30) {
            kpiTempo.classList.add('kpi-critical-state');
        } else if (tempoEstimadoMinutos <= 60) {
            kpiTempo.classList.add('kpi-warning-state');
        } else {
            kpiTempo.classList.add('kpi-safe');
        }
    }

    // Renderizar Gráficos
    const historicoRAM = [71, 74, 78, 68, 59, 58, 63, 70, 80]; // Último ponto é o "agora" (80%)
    const projecaoRAM = 85; // Bate no limite crítico na projeção
    
    criarGraficoProjecao('grafico-ram-projecao', historicoRAM, projecaoRAM);
    criarGraficoPaginacao('grafico-paginacao');

    // Lógica das abas da tabela
    const tabs = document.querySelectorAll('.table-tabs .tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            tabs.forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            // Aqui entraria a lógica para trocar os dados do tbody 'tabela-processos-tendencia'
        });
    });
  });