const LIMITE_MODERADO_DISCO = 70;
const LIMITE_CRITICO_DISCO = 80;

let chartUsoDisco = null;
let chartIoBytes = null;
let chartIoIops = null;
let chartIoLatency = null;
let periodoAtual = '1h';

const LABELS_POR_PERIODO = {
  '1h': ['11:15', '11:30', '11:45', '12:00', 'Agora'],
  '6h': ['06:30', '08:00', '09:30', '11:00', 'Agora'],
  '24h': ['Ontem 12h', '18:00', '00:00', '06:00', 'Agora'],
  '7d': ['Dia -6', 'Dia -4', 'Dia -2', 'Ontem', 'Hoje']
};

const EXTRAS_DISCO_POR_STATUS = {
  critico: {
    iowaitPct: 18.6,
    swapIoMbS: 14.2,
    dp60Texto: 'dp60 elevado (anomalia)',
    crescimentoGbDia: 46,
    diasAteCritico: 0,
    proximoPico: 'Black Friday (3d)',
    ultimoEvento: '12:08 · Disco acima do limite crítico (88% ≥ 80%). Chamado aberto no Jira.',
    ultimoEventoClasse: 'critico',
    particoes: [
      { mountpoint: '/ (sistema)', device: '/dev/nvme0n1p1', usadoGb: 465, totalGb: 500 },
      { mountpoint: '/var/lib/docker', device: '/dev/nvme0n1p2', usadoGb: 365, totalGb: 400 },
      { mountpoint: '/dados/transacoes', device: '/dev/nvme1n1', usadoGb: 490, totalGb: 600 }
    ],
    processos: [
      { pid: 1042, nome: 'api-gateway', leituraMbS: 18.4, escritaMbS: 52.6 },
      { pid: 3029, nome: 'node /app/gateway.js', leituraMbS: 34.2, escritaMbS: 21.8 },
      { pid: 2108, nome: 'redis-server (aof)', leituraMbS: 9.1, escritaMbS: 14.3 },
      { pid: 847, nome: 'fluent-bit (logs)', leituraMbS: 1.5, escritaMbS: 4.9 },
      { pid: 5221, nome: 'logger-agent', leituraMbS: 0.8, escritaMbS: 1.4 }
    ],
    latencia: {
      media: [11, 14, 17, 15, 19],
      p95: [16, 21, 26, 23, 29],
      leituraAtual: 16,
      escritaAtual: 22
    }
  },
  atencao: {
    iowaitPct: 4.2,
    swapIoMbS: 0.0,
    dp60Texto: 'dp60 estável',
    crescimentoGbDia: 18,
    diasAteCritico: 21,
    proximoPico: 'Black Friday (3d)',
    ultimoEvento: '11:45 · Partição / em 82% (acima do limite crítico de 80%).',
    ultimoEventoClasse: 'atencao',
    particoes: [
      { mountpoint: '/ (sistema)', device: '/dev/xvda1', usadoGb: 410, totalGb: 500 },
      { mountpoint: '/var/lib/docker', device: '/dev/xvdb', usadoGb: 240, totalGb: 400 },
      { mountpoint: '/dados/transacoes', device: '/dev/xvdc', usadoGb: 160, totalGb: 600 }
    ],
    processos: [
      { pid: 3104, nome: 'mysqld', leituraMbS: 31.5, escritaMbS: 22.0 },
      { pid: 3029, nome: 'node /app/server.js', leituraMbS: 10.2, escritaMbS: 6.4 },
      { pid: 4810, nome: 'nginx (access.log)', leituraMbS: 2.8, escritaMbS: 3.9 },
      { pid: 1847, nome: 'dockerd', leituraMbS: 6.1, escritaMbS: 1.8 },
      { pid: 5221, nome: 'track-agente.py', leituraMbS: 0.4, escritaMbS: 0.3 }
    ],
    latencia: {
      media: [5, 6, 8, 7, 9],
      p95: [7, 9, 12, 10, 12],
      leituraAtual: 7,
      escritaAtual: 11
    }
  },
  estavel: {
    iowaitPct: 1.1,
    swapIoMbS: 0.0,
    dp60Texto: 'dp60 estável',
    crescimentoGbDia: 6,
    diasAteCritico: 90,
    proximoPico: 'Black Friday (3d)',
    ultimoEvento: 'Sem ocorrências críticas de disco nas últimas 24h.',
    ultimoEventoClasse: 'normal',
    particoes: [
      { mountpoint: '/ (sistema)', device: '/dev/nvme0n1p1', usadoGb: 250, totalGb: 500 },
      { mountpoint: '/var/lib/docker', device: '/dev/nvme0n1p2', usadoGb: 180, totalGb: 400 },
      { mountpoint: '/dados/transacoes', device: '/dev/nvme1n1', usadoGb: 140, totalGb: 600 }
    ],
    processos: [
      { pid: 1102, nome: 'checkout-api', leituraMbS: 12.0, escritaMbS: 8.5 },
      { pid: 2045, nome: 'payment-worker', leituraMbS: 8.4, escritaMbS: 6.2 },
      { pid: 3310, nome: 'cart-session', leituraMbS: 5.1, escritaMbS: 4.0 },
      { pid: 844, nome: 'nginx', leituraMbS: 2.3, escritaMbS: 1.9 },
      { pid: 5221, nome: 'systemd-journal', leituraMbS: 0.5, escritaMbS: 0.8 }
    ],
    latencia: {
      media: [2, 3, 3, 2, 3],
      p95: [3, 4, 4, 3, 4],
      leituraAtual: 2,
      escritaAtual: 4
    }
  }
};

function escalarSerieParaPeriodo(serie, periodo) {
  if (!Array.isArray(serie) || serie.length === 0) return [];
  const fatores = {
    '1h': [1, 1, 1, 1, 1],
    '6h': [0.88, 0.92, 0.96, 0.98, 1],
    '24h': [0.76, 0.84, 0.80, 0.94, 1],
    '7d': [0.68, 0.75, 0.82, 0.91, 1]
  };
  const mults = fatores[periodo] || fatores['1h'];
  return serie.map((v, i) => Number((v * (mults[i] ?? 1)).toFixed(1)));
}

function criarGraficoUsoDisco(idCanvas, labels, dados) {
  const ctx = document.getElementById(idCanvas);
  if (!ctx) return null;
  if (chartUsoDisco) chartUsoDisco.destroy();

  chartUsoDisco = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: `Crítico (${LIMITE_CRITICO_DISCO}%)`,
          data: Array(labels.length).fill(LIMITE_CRITICO_DISCO),
          borderColor: '#dc2626',
          borderWidth: 1.4,
          borderDash: [4, 4],
          fill: false,
          tension: 0,
          pointRadius: 0,
          pointHoverRadius: 0
        },
        {
          label: `Atenção (${LIMITE_MODERADO_DISCO}%)`,
          data: Array(labels.length).fill(LIMITE_MODERADO_DISCO),
          borderColor: '#d97706',
          borderWidth: 1.2,
          borderDash: [3, 3],
          fill: false,
          tension: 0,
          pointRadius: 0,
          pointHoverRadius: 0
        },
        {
          label: 'Uso atual',
          data: dados,
          borderColor: '#0369a1',
          backgroundColor: 'rgba(3, 105, 161, 0.08)',
          borderWidth: 2.2,
          fill: true,
          tension: 0,
          pointRadius: 2,
          pointHoverRadius: 4,
          pointHoverBackgroundColor: '#0369a1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      resizeDelay: 50,
      animation: { duration: 280 },
      interaction: { mode: 'index', intersect: false },
      layout: { padding: { top: 4, right: 6, bottom: 0, left: 0 } },
      plugins: {
        legend: { display: false },
        tooltip: {
          displayColors: true,
          boxWidth: 6,
          boxHeight: 6,
          usePointStyle: true,
          callbacks: {
            label: (context) => ` ${context.dataset.label}: ${context.parsed.y}%`
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#64748b',
            font: { size: 9.5, family: "'Outfit', sans-serif", weight: '600' },
            padding: 3
          },
          grid: { display: false },
          border: { color: '#e2e8f0', width: 1 }
        },
        y: {
          min: 0,
          max: 100,
          ticks: {
            stepSize: 25,
            color: '#64748b',
            font: { size: 9.5, family: "'Outfit', sans-serif", weight: '600' },
            padding: 5,
            callback: (v) => `${v}%`
          },
          grid: { color: '#eef2f6', drawTicks: false },
          border: { display: false }
        }
      }
    }
  });
  return chartUsoDisco;
}

function criarGraficoDuasLinhas(instanciaAtual, idCanvas, labels, dados1, cor1, dados2, cor2, label1, label2, unidade) {
  const ctx = document.getElementById(idCanvas);
  if (!ctx) return null;
  if (instanciaAtual) instanciaAtual.destroy();

  const maxVal = Math.max(...dados1, ...dados2, 1);
  const suggestedMax = Math.ceil((maxVal * 1.2) / 5) * 5 || 10;

  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
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
      animation: { duration: 280 },
      interaction: { mode: 'index', intersect: false },
      layout: { padding: { top: 4, right: 6, bottom: 0, left: 0 } },
      plugins: {
        legend: { display: false },
        tooltip: {
          displayColors: true,
          boxWidth: 6,
          boxHeight: 6,
          usePointStyle: true,
          callbacks: {
            label: (context) => ` ${context.dataset.label}: ${context.parsed.y} ${unidade}`
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#64748b',
            font: { size: 9.5, family: "'Outfit', sans-serif", weight: '600' },
            padding: 3
          },
          grid: { display: false },
          border: { color: '#e2e8f0', width: 1 }
        },
        y: {
          min: 0,
          suggestedMax: suggestedMax,
          ticks: {
            color: '#64748b',
            font: { size: 9.5, family: "'Outfit', sans-serif", weight: '600' },
            padding: 5,
            callback: (v) => Number.isInteger(v) ? v : ''
          },
          grid: { color: '#eef2f6', drawTicks: false },
          border: { display: false }
        }
      }
    }
  });
}

function renderizarParticoes(particoes) {
  const container = document.getElementById('lista-particoes');
  if (!container || !Array.isArray(particoes)) return;

  let maisCheia = { mountpoint: '/', pct: 0 };

  container.innerHTML = particoes.slice(0, 3).map((p) => {
    const pct = Math.round((p.usadoGb / p.totalGb) * 100);
    if (pct > maisCheia.pct) maisCheia = { mountpoint: p.mountpoint, pct };

    let barClass = 'bar-green';
    let pctClass = '';
    if (pct >= LIMITE_CRITICO_DISCO) {
      barClass = 'bar-red';
      pctClass = 'text-red';
    } else if (pct >= LIMITE_MODERADO_DISCO) {
      barClass = 'bar-orange';
      pctClass = 'text-orange';
    } else if (pct >= 55) {
      barClass = 'bar-blue';
    }

    return `
      <div class="partition-item">
        <div class="partition-header">
          <div class="partition-label">
            <span class="partition-name" title="${p.device}">${p.mountpoint}</span>
            <span class="partition-size">${p.usadoGb} GB / ${p.totalGb} GB</span>
          </div>
          <span class="partition-percentage ${pctClass}">${pct}%</span>
        </div>
        <div class="progress-track" role="progressbar" aria-label="Uso da partição ${p.mountpoint}" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100">
          <div class="progress-bar ${barClass}" style="width: ${pct}%;"></div>
        </div>
      </div>
    `;
  }).join('');

  const elCritica = document.getElementById('disco-footer-critica');
  if (elCritica) {
    elCritica.textContent = `Maior ocupação: ${maisCheia.mountpoint} (${maisCheia.pct}%)`;
  }
}

function renderizarProcessosDisco(processos) {
  const tbody = document.getElementById('tabela-processos-disco');
  if (!tbody || !Array.isArray(processos)) return;

  tbody.innerHTML = processos.slice(0, 5).map((proc) => {
    const total = (proc.leituraMbS + proc.escritaMbS).toFixed(1);
    return `
      <tr>
        <td class="pid">${proc.pid}</td>
        <td class="proc-name" title="${proc.nome}">${proc.nome}</td>
        <td class="num proc-read">${proc.leituraMbS.toFixed(1)} MB/s</td>
        <td class="num proc-write">${proc.escritaMbS.toFixed(1)} MB/s</td>
        <td class="num proc-total">${total} MB/s</td>
      </tr>
    `;
  }).join('');
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

function definirTexto(id, texto) {
  const el = document.getElementById(id);
  if (el) el.textContent = texto;
}

function renderizarDashboardDisco(periodo) {
  periodoAtual = periodo || periodoAtual;

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
    ioIops: { read: [40, 52, 65, 58, 70], write: [30, 42, 55, 48, 60] }
  };
  const extras = EXTRAS_DISCO_POR_STATUS[statusServidor] || EXTRAS_DISCO_POR_STATUS.atencao;
  const labels = LABELS_POR_PERIODO[periodoAtual] || LABELS_POR_PERIODO['1h'];

  // Cabeçalho e metadados
  const totalGbTexto = dadosDisco.totalGb || '1500 GB';
  definirTexto('disco-servidor-eyebrow', `TrackCommerce · ${nomeServidor}`);
  definirTexto('disco-meta', `· ${totalGbTexto} provisionados · Limites BD: ${LIMITE_MODERADO_DISCO}% atenção / ${LIMITE_CRITICO_DISCO}% crítico`);
  definirTexto('disco-total-badge', `${totalGbTexto} total`);
  definirTexto('disco-pico-badge', extras.proximoPico);
  definirTexto('disco-perf-badge', `Janela: ${periodoAtual} · ${extras.dp60Texto}`);

  // Séries ajustadas ao período selecionado
  const serieUso = escalarSerieParaPeriodo(dadosDisco.evolucao, periodoAtual);
  const serieBytesL = escalarSerieParaPeriodo(dadosDisco.ioBytes.read, periodoAtual);
  const serieBytesG = escalarSerieParaPeriodo(dadosDisco.ioBytes.write, periodoAtual);
  const serieIopsL = escalarSerieParaPeriodo(dadosDisco.ioIops.read, periodoAtual);
  const serieIopsG = escalarSerieParaPeriodo(dadosDisco.ioIops.write, periodoAtual);
  const serieLatMedia = escalarSerieParaPeriodo(extras.latencia.media, periodoAtual);
  const serieLatP95 = escalarSerieParaPeriodo(extras.latencia.p95, periodoAtual);

  const lastByteRead = serieBytesL.slice(-1)[0];
  const lastByteWrite = serieBytesG.slice(-1)[0];
  const lastIopsRead = Math.round(serieIopsL.slice(-1)[0]);
  const lastIopsWrite = Math.round(serieIopsG.slice(-1)[0]);
  const lastLatMedia = serieLatMedia.slice(-1)[0];
  const lastLatP95 = serieLatP95.slice(-1)[0];

  // Tamanho médio por operação (KB/op) a partir de throughput / IOPS
  const totalMbS = lastByteRead + lastByteWrite;
  const totalIops = lastIopsRead + lastIopsWrite;
  const kbPorOp = totalIops > 0 ? Math.round((totalMbS * 1000) / totalIops) : 0;

  // KPI 1: Estado unificado com limites do Script_BD2.sql (70% / 80%)
  const usoNum = parseInt(dadosDisco.usoAtual, 10) || 0;
  const elKpiEstado = document.getElementById('kpi-disco-estado');
  const elKpiEstadoSub = document.getElementById('kpi-disco-estado-sub');
  if (elKpiEstado) {
    elKpiEstado.classList.remove('status-normal', 'status-atencao', 'status-critico');
    if (usoNum >= LIMITE_CRITICO_DISCO) {
      elKpiEstado.textContent = 'Armazenamento crítico';
      elKpiEstado.classList.add('status-critico');
      if (elKpiEstadoSub) elKpiEstadoSub.textContent = `Acima de ${LIMITE_CRITICO_DISCO}% (alerta Jira ativo)`;
    } else if (usoNum >= LIMITE_MODERADO_DISCO) {
      elKpiEstado.textContent = 'Volume em atenção';
      elKpiEstado.classList.add('status-atencao');
      if (elKpiEstadoSub) elKpiEstadoSub.textContent = `Entre ${LIMITE_MODERADO_DISCO}% e ${LIMITE_CRITICO_DISCO}%`;
    } else {
      elKpiEstado.textContent = 'Operação normal';
      elKpiEstado.classList.add('status-normal');
      if (elKpiEstadoSub) elKpiEstadoSub.textContent = `Abaixo dos limites (${LIMITE_MODERADO_DISCO}% / ${LIMITE_CRITICO_DISCO}%)`;
    }
  }

  // KPI 2: Capacidade & Previsão
  definirTexto('kpi-disco-espaco', `${dadosDisco.usadosGb || '810 GB'} de ${totalGbTexto}`);
  definirTexto('kpi-disco-previsao', `+${extras.crescimentoGbDia} GB/dia · Próx. pico: ${extras.proximoPico}`);

  // KPI 3: Taxa I/O & Bloco Médio
  definirTexto('kpi-disco-io', `${lastByteRead} MB/s · ${lastByteWrite} MB/s`);
  definirTexto('kpi-disco-bloco', `~${kbPorOp} KB/op · ${extras.dp60Texto}`);

  // KPI 4: Latência Média / P95
  definirTexto('kpi-disco-latencia', `${lastLatMedia} ms · ${lastLatP95} ms`);
  definirTexto('kpi-disco-latencia-sub', `L: ${extras.latencia.leituraAtual} ms · G: ${extras.latencia.escritaAtual} ms`);

  // KPI 5: Pressão IOwait & Swap
  const elIoWait = document.getElementById('kpi-disco-iowait');
  const elIoWaitSub = document.getElementById('kpi-disco-iowait-sub');
  if (elIoWait) {
    elIoWait.classList.remove('status-normal', 'status-atencao', 'status-critico');
    elIoWait.textContent = `IOwait ${extras.iowaitPct}% · ${extras.swapIoMbS.toFixed(1)} MB/s`;
    if (extras.iowaitPct >= 15 || extras.swapIoMbS >= 5) {
      elIoWait.classList.add('status-critico');
      if (elIoWaitSub) elIoWaitSub.textContent = 'CPU aguardando disco + paginação Swap';
    } else if (extras.iowaitPct >= 7) {
      elIoWait.classList.add('status-atencao');
      if (elIoWaitSub) elIoWaitSub.textContent = 'Leve fila de I/O na CPU';
    } else {
      elIoWait.classList.add('status-normal');
      if (elIoWaitSub) elIoWaitSub.textContent = 'Sem gargalo de CPU/RAM no disco';
    }
  }

  // Card 1: Destaque, Previsão e Último Evento
  definirTexto('disco-uso-atual', dadosDisco.usoAtual);
  const elPrevPill = document.getElementById('disco-previsao-pill');
  if (elPrevPill) {
    elPrevPill.classList.remove('warn', 'crit');
    if (usoNum >= LIMITE_CRITICO_DISCO) {
      elPrevPill.textContent = `Limite ${LIMITE_CRITICO_DISCO}% atingido`;
      elPrevPill.classList.add('crit');
    } else if (extras.diasAteCritico <= 15) {
      elPrevPill.textContent = `~${extras.diasAteCritico}d até ${LIMITE_CRITICO_DISCO}%`;
      elPrevPill.classList.add('warn');
    } else {
      elPrevPill.textContent = `~${extras.diasAteCritico}d até ${LIMITE_CRITICO_DISCO}%`;
    }
  }

  definirTexto('disco-ultimo-evento', extras.ultimoEvento);
  const elEventTag = document.getElementById('disco-ultimo-evento-tag');
  if (elEventTag) {
    elEventTag.className = `event-tag ${extras.ultimoEventoClasse}`;
    elEventTag.textContent = extras.ultimoEventoClasse === 'critico'
      ? 'Crítico'
      : (extras.ultimoEventoClasse === 'atencao' ? 'Atenção' : 'Normal');
  }

  // Card 2: Partições & Footer
  renderizarParticoes(extras.particoes);
  definirTexto('disco-footer-usados', dadosDisco.usadosTexto);

  // Card 3: Top 5 Processos por I/O
  renderizarProcessosDisco(extras.processos);

  // Subcards I/O
  definirTexto('disco-bytes-read', `${lastByteRead} MB/s`);
  definirTexto('disco-bytes-write', `${lastByteWrite} MB/s`);
  definirTexto('disco-iops-read', `${lastIopsRead} IOPS`);
  definirTexto('disco-iops-write', `${lastIopsWrite} IOPS`);
  definirTexto('disco-lat-media', `${lastLatMedia} ms`);
  definirTexto('disco-lat-p95', `${lastLatP95} ms`);

  // Gráficos
  criarGraficoUsoDisco('grafico-uso-disco', labels, serieUso);
  chartIoBytes = criarGraficoDuasLinhas(
    chartIoBytes, 'grafico-io-bytes', labels,
    serieBytesL, '#047857', serieBytesG, '#c2410c',
    'Leitura', 'Gravação', 'MB/s'
  );
  chartIoIops = criarGraficoDuasLinhas(
    chartIoIops, 'grafico-io-iops', labels,
    serieIopsL, '#047857', serieIopsG, '#c2410c',
    'Leitura', 'Gravação', 'IOPS'
  );
  chartIoLatency = criarGraficoDuasLinhas(
    chartIoLatency, 'grafico-io-latency', labels,
    serieLatMedia, '#0369a1', serieLatP95, '#c2410c',
    'Média', 'Percentil 95', 'ms'
  );
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.period-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.period-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      renderizarDashboardDisco(btn.dataset.period);
    });
  });

  renderizarDashboardDisco('1h');
  configurarBotaoTelaCheia();

  window.addEventListener('resize', () => {
    if (window.scrollX > 0) {
      window.scrollTo({ left: 0 });
    }
  });
});
