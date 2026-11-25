function criarGraficoUsoDisco(idCanvas, dados = [42, 45, 48, 51, 54]) {
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
          borderColor: '#c2410c',
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
          borderColor: '#0369a1',
          backgroundColor: '#0369a1',
          borderWidth: 2.2,
          fill: false,
          tension: 0,
          pointRadius: 0,
          pointHoverRadius: 4,
          pointHoverBackgroundColor: '#0369a1'
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
      layout: { padding: { top: 4, right: 6, bottom: 0, left: 0 } },
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
          ticks: {
            display: true,
            color: '#64748b',
            font: { size: 10, family: "'Outfit', sans-serif", weight: '500' },
            padding: 4
          },
          grid: { display: false },
          border: { color: '#e2e8f0', width: 1 }
        },
        y: {
          min: 0,
          max: 100,
          ticks: {
            display: true,
            stepSize: 25,
            color: '#64748b',
            font: { size: 10, family: "'Outfit', sans-serif", weight: '500' },
            padding: 6,
            callback: (v) => `${v}%`
          },
          grid: {
            color: '#eef2f6',
            drawTicks: false
          },
          border: { display: false }
        }
      }
    }
  });
}

function criarGraficoDuasLinhas(idCanvas, dados1, cor1, dados2, cor2, label1 = 'Leitura', label2 = 'Gravação', unidade = 'MB/s', passo = null) {
  const ctx = document.getElementById(idCanvas);
  if (!ctx) return null;

  const maxVal = Math.max(...dados1, ...dados2);
  const suggestedMax = Math.ceil((maxVal * 1.2) / 10) * 10 || 10;

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
      layout: { padding: { top: 4, right: 6, bottom: 0, left: 0 } },
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
          ticks: {
            display: true,
            color: '#64748b',
            font: { size: 10, family: "'Outfit', sans-serif", weight: '500' },
            padding: 4
          },
          grid: { display: false },
          border: { color: '#e2e8f0', width: 1 }
        },
        y: {
          min: 0,
          suggestedMax: suggestedMax,
          ticks: {
            display: true,
            stepSize: passo || undefined,
            color: '#64748b',
            font: { size: 10, family: "'Outfit', sans-serif", weight: '500' },
            padding: 6,
            callback: (v) => Number.isInteger(v) ? v : ''
          },
          grid: {
            color: '#eef2f6',
            drawTicks: false
          },
          border: { display: false }
        }
      }
    }
  });
}

function atualizarParticoes(dadosDisco, status) {
  const capacidades = [500, 400, 600];
  const distribuicoesPorStatus = {
    critico: [465, 365, 490],
    atencao: [410, 240, 160],
    estavel: [250, 180, 140]
  };

  let usados = distribuicoesPorStatus[status];
  if (!usados) {
    const totalUsado = parseInt(dadosDisco.usadosGb, 10) || 810;
    const fator = Math.min(Math.max(totalUsado / 1500, 0), 1);
    usados = capacidades.map((cap) => Math.round(cap * fator));
  }

  capacidades.forEach((cap, index) => {
    const idx = index + 1;
    const usado = usados[index];
    const pct = Math.round((usado / cap) * 100);

    const elSize = document.getElementById(`particao-${idx}-size`);
    const elPct = document.getElementById(`particao-${idx}-pct`);
    const elBar = document.getElementById(`particao-${idx}-bar`);
    const elTrack = document.getElementById(`particao-${idx}-track`);

    if (elSize) elSize.textContent = `${usado} GB de ${cap} GB`;
    if (elPct) {
      elPct.textContent = `${pct}%`;
      elPct.classList.toggle('text-orange', pct >= 80);
    }
    if (elBar) {
      elBar.style.width = `${pct}%`;
      elBar.classList.remove('bar-orange', 'bar-blue', 'bar-green');
      if (pct >= 80) {
        elBar.classList.add('bar-orange');
      } else if (pct >= 55) {
        elBar.classList.add('bar-blue');
      } else {
        elBar.classList.add('bar-green');
      }
    }
    if (elTrack) {
      elTrack.setAttribute('aria-valuenow', String(pct));
    }
  });
}

function configurarBotaoTelaCheia() {
  const btn = document.getElementById('btn-tela-cheia');
  const dashboardMain = document.querySelector('main');
  if (!btn || !dashboardMain) return;

  function obterElementoFullscreen() {
    return document.fullscreenElement || document.webkitFullscreenElement || null;
  }

  function estaEmTelaCheia() {
    return Boolean(obterElementoFullscreen()) || document.body.classList.contains('modo-tela-cheia');
  }

  function sincronizarEstado() {
    const ativo = estaEmTelaCheia();
    btn.textContent = ativo ? 'Sair da tela cheia' : 'Tela cheia';
    btn.setAttribute('aria-pressed', String(ativo));
    btn.classList.toggle('is-fullscreen', ativo);
  }

  btn.addEventListener('click', async () => {
    const fullscreenAtual = obterElementoFullscreen();

    if (fullscreenAtual) {
      try {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
      } catch (erro) {
        console.warn('Erro ao sair da tela cheia:', erro);
      }
      document.body.classList.remove('modo-tela-cheia');
      sincronizarEstado();
      return;
    }

    if (document.body.classList.contains('modo-tela-cheia')) {
      document.body.classList.remove('modo-tela-cheia');
      sincronizarEstado();
      return;
    }

    try {
      if (dashboardMain.requestFullscreen) {
        await dashboardMain.requestFullscreen();
      } else if (dashboardMain.webkitRequestFullscreen) {
        dashboardMain.webkitRequestFullscreen();
      } else {
        document.body.classList.add('modo-tela-cheia');
      }
    } catch (erro) {
      document.body.classList.add('modo-tela-cheia');
    }

    sincronizarEstado();
  });

  document.addEventListener('fullscreenchange', () => {
    if (!obterElementoFullscreen()) {
      document.body.classList.remove('modo-tela-cheia');
    }
    sincronizarEstado();
  });

  document.addEventListener('webkitfullscreenchange', () => {
    if (!obterElementoFullscreen()) {
      document.body.classList.remove('modo-tela-cheia');
    }
    sincronizarEstado();
  });

  document.addEventListener('keydown', (e) => {
    const overlay = document.getElementById('menu-overlay');
    const modalFechado = !overlay || overlay.hidden;
    if (e.key === 'Escape' && document.body.classList.contains('modo-tela-cheia') && modalFechado) {
      document.body.classList.remove('modo-tela-cheia');
      sincronizarEstado();
    }
  });

  sincronizarEstado();
}

document.addEventListener('DOMContentLoaded', () => {
  const servidor = (typeof obterServidorAtual === 'function')
    ? obterServidorAtual()
    : (window.DADOS_MOCKADOS ? window.DADOS_MOCKADOS.atencao : null);

  const nomeServidor = servidor ? servidor.nome : 'Servidor de Banco de Dados';
  const statusServidor = servidor ? servidor.status : 'atencao';
  const dadosDisco = servidor ? servidor.disco : {
    usoAtual: '54%',
    saudeTexto: 'Normal',
    saudeClasse: 'normal',
    totalGb: '1500 GB',
    usadosGb: '810 GB',
    livresGb: '690 GB',
    usadosTexto: '810 GB usados • 690 GB livres',
    evolucao: [42, 45, 48, 51, 54],
    ioBytes: { read: [30, 42, 60, 51, 55], write: [25, 33, 40, 35, 35] },
    ioIops: { read: [40, 52, 65, 58, 70], write: [30, 42, 55, 48, 60] },
    ioLatency: { read: [4, 6, 8, 7, 9], write: [5, 8, 11, 9, 12] }
  };

  // Cabeçalho e metadados do servidor
  const elEyebrow = document.getElementById('disco-servidor-eyebrow');
  if (elEyebrow) elEyebrow.textContent = `TrackCommerce · ${nomeServidor}`;

  const elMeta = document.getElementById('disco-meta');
  const totalGbTexto = dadosDisco.totalGb || '1500 GB';
  if (elMeta) elMeta.textContent = `${nomeServidor} · ${totalGbTexto} provisionados · coleta a cada 15s`;

  const elBadgeTotal = document.getElementById('disco-total-badge');
  if (elBadgeTotal) elBadgeTotal.textContent = `${totalGbTexto} total`;

  // KPIs de performance de disco com o último ponto do gráfico correspondente
  const lastByteRead = dadosDisco.ioBytes.read.slice(-1)[0];
  const lastByteWrite = dadosDisco.ioBytes.write.slice(-1)[0];
  const lastIopsRead = dadosDisco.ioIops.read.slice(-1)[0];
  const lastIopsWrite = dadosDisco.ioIops.write.slice(-1)[0];
  const lastLatMedia = dadosDisco.ioLatency.read.slice(-1)[0];
  const lastLatP95 = dadosDisco.ioLatency.write.slice(-1)[0];

  // Faixa de KPIs no topo
  const elKpiEstado = document.getElementById('kpi-disco-estado');
  if (elKpiEstado) {
    const usoNumerico = parseInt(dadosDisco.usoAtual, 10) || 0;
    let textoEstado = 'Operação normal';
    let classeEstado = 'status-normal';

    if (usoNumerico >= 90) {
      textoEstado = 'Armazenamento crítico';
      classeEstado = 'status-critico';
    } else if (usoNumerico >= 80 || dadosDisco.saudeClasse === 'atencao') {
      textoEstado = 'Volume em atenção';
      classeEstado = 'status-atencao';
    }

    elKpiEstado.textContent = textoEstado;
    elKpiEstado.classList.remove('status-normal', 'status-atencao', 'status-critico');
    elKpiEstado.classList.add(classeEstado);
  }

  const elKpiEspaco = document.getElementById('kpi-disco-espaco');
  if (elKpiEspaco) elKpiEspaco.textContent = `${dadosDisco.usadosGb || '810 GB'} de ${totalGbTexto}`;

  const elKpiIo = document.getElementById('kpi-disco-io');
  if (elKpiIo) elKpiIo.textContent = `${lastByteRead} MB/s · ${lastByteWrite} MB/s`;

  const elKpiLatencia = document.getElementById('kpi-disco-latencia');
  if (elKpiLatencia) elKpiLatencia.textContent = `${lastLatMedia} ms · ${lastLatP95} ms`;

  // Atualiza valor destaque e legenda do volume
  const elUsoAtual = document.getElementById('disco-uso-atual');
  if (elUsoAtual) elUsoAtual.textContent = dadosDisco.usoAtual;

  const elCaption = document.getElementById('disco-uso-caption');
  if (elCaption) {
    const usoNum = parseInt(dadosDisco.usoAtual, 10) || 0;
    elCaption.textContent = usoNum >= 85
      ? `Uso em ${dadosDisco.usoAtual}, acima do limite de alerta de 85%. Considere expandir ou limpar volumes.`
      : `Operando dentro da margem segura, abaixo do limite de alerta de 85%.`;
  }

  // Atualiza partições e footer
  atualizarParticoes(dadosDisco, statusServidor);

  const elFooter = document.getElementById('disco-footer-usados');
  if (elFooter) elFooter.textContent = dadosDisco.usadosTexto;

  // Atualiza KPIs dos subcards de I/O
  const elByteRead = document.getElementById('disco-bytes-read');
  const elByteWrite = document.getElementById('disco-bytes-write');
  if (elByteRead) elByteRead.textContent = `${lastByteRead} MB/s`;
  if (elByteWrite) elByteWrite.textContent = `${lastByteWrite} MB/s`;

  const elIopsRead = document.getElementById('disco-iops-read');
  const elIopsWrite = document.getElementById('disco-iops-write');
  if (elIopsRead) elIopsRead.textContent = `${lastIopsRead} IOPS`;
  if (elIopsWrite) elIopsWrite.textContent = `${lastIopsWrite} IOPS`;

  const elLatMedia = document.getElementById('disco-lat-media');
  const elLatP95 = document.getElementById('disco-lat-p95');
  if (elLatMedia) elLatMedia.textContent = `${lastLatMedia} ms`;
  if (elLatP95) elLatP95.textContent = `${lastLatP95} ms`;

  // Gráficos
  criarGraficoUsoDisco('grafico-uso-disco', dadosDisco.evolucao);
  criarGraficoDuasLinhas(
    'grafico-io-bytes',
    dadosDisco.ioBytes.read,
    '#047857',
    dadosDisco.ioBytes.write,
    '#c2410c',
    'Leitura',
    'Gravação',
    'MB/s'
  );
  criarGraficoDuasLinhas(
    'grafico-io-iops',
    dadosDisco.ioIops.read,
    '#047857',
    dadosDisco.ioIops.write,
    '#c2410c',
    'Leitura',
    'Gravação',
    'IOPS'
  );
  criarGraficoDuasLinhas(
    'grafico-io-latency',
    dadosDisco.ioLatency.read,
    '#0369a1',
    dadosDisco.ioLatency.write,
    '#c2410c',
    'Média',
    'Percentil 95',
    'ms'
  );

  configurarBotaoTelaCheia();

  window.addEventListener('resize', () => {
    if (window.scrollX > 0) {
      window.scrollTo({ left: 0 });
    }
  });
});
