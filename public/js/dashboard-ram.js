function criarGraficoProjecao(idCanvas, dadosHistoricos, dadoProjecao) {
  const ctx = document.getElementById(idCanvas);
  if (!ctx) return;

  const labels = ['ontem 14:30', '18:30', '22:30', '02:30', '06:30', '10:30', '14:30', '+2h30'];
  const totalPontos = labels.length;

  // Garante que o histórico pare no penúltimo ponto ("14:30") e a projeção ligue até o último ("+2h30")
  const serieHistorico = [...dadosHistoricos.slice(0, totalPontos - 1), null];
  const ultimoValorReal = serieHistorico[totalPontos - 2];

  const serieProjecao = Array(totalPontos).fill(null);
  serieProjecao[totalPontos - 2] = ultimoValorReal;
  serieProjecao[totalPontos - 1] = dadoProjecao;

  const linhaAtencao = Array(totalPontos).fill(70);
  const linhaCritico = Array(totalPontos).fill(85);

  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Uso de RAM',
          data: serieHistorico,
          borderColor: '#2563eb',
          backgroundColor: 'rgba(37, 99, 235, 0.08)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: [0, 0, 0, 0, 0, 0, 4, 0],
          pointBackgroundColor: '#2563eb'
        },
        {
          label: 'Projeção',
          data: serieProjecao,
          borderColor: '#7c3aed',
          borderWidth: 2,
          borderDash: [5, 5],
          fill: false,
          tension: 0.4,
          pointRadius: [0, 0, 0, 0, 0, 0, 0, 4],
          pointBackgroundColor: '#ffffff',
          pointBorderColor: '#7c3aed',
          pointBorderWidth: 2
        },
        {
          label: 'Limite de atenção (70%)',
          data: linhaAtencao,
          borderColor: '#f59e0b',
          borderWidth: 1.5,
          borderDash: [4, 4],
          fill: false,
          pointRadius: 0,
          pointHoverRadius: 0
        },
        {
          label: 'Limite crítico (85%)',
          data: linhaCritico,
          borderColor: '#ef4444',
          borderWidth: 1.5,
          borderDash: [4, 4],
          fill: false,
          pointRadius: 0,
          pointHoverRadius: 0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          align: 'start',
          labels: {
            usePointStyle: true,
            pointStyle: 'line',
            boxWidth: 18,
            padding: 16,
            color: '#64748b',
            font: { size: 11, family: "'Outfit', sans-serif" }
          }
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return ` ${context.dataset.label}: ${context.parsed.y}%`;
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
          borderColor: '#2563eb',
          borderWidth: 2,
          tension: 0.2,
          pointRadius: 0,
          pointHoverRadius: 4
        },
        {
          label: 'Swap-out',
          data: [0.1, 0.2, 0.6, 0.1, 0, 0.1, 0.3, 4.2],
          borderColor: '#ea580c',
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
        legend: {
          display: true,
          position: 'bottom',
          align: 'start',
          labels: {
            usePointStyle: true,
            pointStyle: 'line',
            boxWidth: 16,
            padding: 12,
            color: '#64748b',
            font: { size: 11, family: "'Outfit', sans-serif" }
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: function (context) {
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
          title: {
            display: true,
            text: 'MB/s',
            color: '#64748b',
            font: { size: 11, weight: '600', family: "'Outfit', sans-serif" }
          },
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
  // Lógica de tempo estimado para o KPI de RAM
  const tempoEstimadoMinutos = 150;
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
  const historicoRAM = [71, 74, 78, 65, 59, 68, 80];
  const projecaoRAM = 85;

  criarGraficoProjecao('grafico-ram-projecao', historicoRAM, projecaoRAM);
  criarGraficoPaginacao('grafico-paginacao');

  // Lógica das abas da tabela
  const tabs = document.querySelectorAll('.table-tabs .tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      tabs.forEach(t => t.classList.remove('active'));
      e.target.classList.add('active');
    });
  });
});