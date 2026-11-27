// Dados mockados e estado da Central de Status (Gestor de Infraestrutura/TI)
const CORES_COMPONENTES = {
  CPU: '#7c3aed',
  RAM: '#f59e0b',
  DISCO: '#10b981',
  REDE: '#3b82f6'
};

const ESTADO = {
  valorPadraoRequisicao: 0.004,
  filtroData: '6m', // '12m' | '6m' | '30d' | '1d'
  filtroBaseAnual: 'media_todos', // 'media_todos' | 'ano_anterior'
  filtroComposicaoFin: 'total', // 'total' | 'instancias' | 'downtime'
  alvoSelecionadoModal: 'padrao', // 'padrao' ou id da instância
  instancias: [
    {
      id: 'inst-1',
      nome: 'Financeiro',
      identificador: 'SRV-FIN-01',
      situacaoAtual: 'alerta', // 'alerta' | 'downtime' | 'estavel'
      detalheSituacao: 'CPU em 87% nos últimos 12 min',
      custoMensalInstancia: 9200,
      reqPorMinuto: 14500,
      downtimeMinMes: 18,
      precoReqPersonalizado: null
    },
    {
      id: 'inst-2',
      nome: 'Aplicação',
      identificador: 'SRV-APP-02',
      situacaoAtual: 'alerta',
      detalheSituacao: 'RAM em 82% com fila elevada',
      custoMensalInstancia: 10800,
      reqPorMinuto: 22000,
      downtimeMinMes: 12,
      precoReqPersonalizado: null
    },
    {
      id: 'inst-3',
      nome: 'Rota',
      identificador: 'SRV-ROT-03',
      situacaoAtual: 'downtime',
      detalheSituacao: 'Sem resposta HTTP há 9 min',
      custoMensalInstancia: 7600,
      reqPorMinuto: 18400,
      downtimeMinMes: 34,
      precoReqPersonalizado: null
    },
    {
      id: 'inst-4',
      nome: 'Vendas',
      identificador: 'SRV-VND-04',
      situacaoAtual: 'estavel',
      detalheSituacao: 'Operação normal',
      custoMensalInstancia: 8900,
      reqPorMinuto: 19600,
      downtimeMinMes: 6,
      precoReqPersonalizado: null
    },
    {
      id: 'inst-5',
      nome: 'API Banco',
      identificador: 'SRV-BDB-05',
      situacaoAtual: 'estavel',
      detalheSituacao: 'Operação normal',
      custoMensalInstancia: 11200,
      reqPorMinuto: 16200,
      downtimeMinMes: 4,
      precoReqPersonalizado: null
    },
    {
      id: 'inst-6',
      nome: 'Gateway Pagamentos',
      identificador: 'SRV-PAY-06',
      situacaoAtual: 'estavel',
      detalheSituacao: 'Latência média de 42ms',
      custoMensalInstancia: 8300,
      reqPorMinuto: 21000,
      downtimeMinMes: 8,
      precoReqPersonalizado: null
    }
  ]
};

// Séries e tabelas mockadas por filtro de data
const DADOS_POR_PERIODO = {
  '12m': {
    tituloFin: 'Prejuízo Últimos 12 Meses',
    mesesEquivalentes: 12,
    fatorDowntime: 1.0,
    labels: ['Dez', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov'],
    alertas: [5, 7, 4, 8, 6, 9, 6, 1, 15, 0, 5, 2],
    downtimes: [1, 2, 0, 2, 1, 2, 1, 0, 7, 0, 2, 1],
    tabela: [
      { nome: 'Financeiro', cpu: 18, ram: 4, disco: 2, rede: 8, situacao: 'Crítico' },
      { nome: 'Aplicação', cpu: 3, ram: 15, disco: 1, rede: 5, situacao: 'Moderado' },
      { nome: 'Rota', cpu: 6, ram: 4, disco: 1, rede: 6, situacao: 'Downtime' },
      { nome: 'Vendas', cpu: 2, ram: 1, disco: 0, rede: 7, situacao: 'Estável' },
      { nome: 'API Banco', cpu: 1, ram: 1, disco: 0, rede: 1, situacao: 'Estável' },
      { nome: 'Gateway Pagamentos', cpu: 2, ram: 1, disco: 1, rede: 2, situacao: 'Estável' }
    ],
    moderados: { CPU: 14, RAM: 8, DISCO: 3, REDE: 11 },
    criticos: { CPU: 18, RAM: 18, DISCO: 2, REDE: 18 }
  },
  '6m': {
    tituloFin: 'Prejuízo Últimos 6 Meses',
    mesesEquivalentes: 6,
    fatorDowntime: 0.48,
    labels: ['Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov'],
    alertas: [6, 1, 15, 0, 5, 2],
    downtimes: [1, 0, 7, 0, 2, 1],
    tabela: [
      { nome: 'Financeiro', cpu: 10, ram: 0, disco: 0, rede: 5, situacao: 'Crítico' },
      { nome: 'Aplicação', cpu: 0, ram: 9, disco: 0, rede: 3, situacao: 'Moderado' },
      { nome: 'Rota', cpu: 3, ram: 2, disco: 0, rede: 2, situacao: 'Downtime' },
      { nome: 'Vendas', cpu: 0, ram: 0, disco: 0, rede: 5, situacao: 'Estável' },
      { nome: 'API Banco', cpu: 0, ram: 0, disco: 0, rede: 0, situacao: 'Estável' },
      { nome: 'Gateway Pagamentos', cpu: 1, ram: 1, disco: 0, rede: 1, situacao: 'Estável' }
    ],
    moderados: { CPU: 8, RAM: 3, DISCO: 3, REDE: 4 },
    criticos: { CPU: 5, RAM: 8, DISCO: 7, REDE: 1 }
  },
  '30d': {
    tituloFin: 'Prejuízo Últimos 30 Dias',
    mesesEquivalentes: 1,
    fatorDowntime: 0.085,
    labels: ['01/11', '05/11', '10/11', '15/11', '20/11', '25/11', '30/11'],
    alertas: [2, 3, 1, 4, 2, 5, 3],
    downtimes: [0, 1, 0, 1, 0, 2, 1],
    tabela: [
      { nome: 'Financeiro', cpu: 4, ram: 1, disco: 0, rede: 2, situacao: 'Crítico' },
      { nome: 'Aplicação', cpu: 1, ram: 4, disco: 0, rede: 1, situacao: 'Moderado' },
      { nome: 'Rota', cpu: 1, ram: 1, disco: 0, rede: 2, situacao: 'Downtime' },
      { nome: 'Vendas', cpu: 0, ram: 0, disco: 0, rede: 2, situacao: 'Estável' },
      { nome: 'API Banco', cpu: 0, ram: 1, disco: 0, rede: 0, situacao: 'Estável' },
      { nome: 'Gateway Pagamentos', cpu: 0, ram: 0, disco: 1, rede: 0, situacao: 'Estável' }
    ],
    moderados: { CPU: 3, RAM: 4, DISCO: 1, REDE: 3 },
    criticos: { CPU: 3, RAM: 3, DISCO: 0, REDE: 4 }
  },
  '1d': {
    tituloFin: 'Prejuízo Último Dia (24h)',
    mesesEquivalentes: 1 / 30,
    fatorDowntime: 0.0032,
    labels: [
      '00h', '01h', '02h', '03h', '04h', '05h', '06h', '07h',
      '08h', '09h', '10h', '11h', '12h', '13h', '14h', '15h',
      '16h', '17h', '18h', '19h', '20h', '21h', '22h', '23h'
    ],
    alertas: [0, 0, 0, 1, 0, 0, 1, 0, 2, 1, 0, 1, 2, 1, 0, 1, 0, 2, 1, 0, 1, 0, 1, 1],
    downtimes: [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    tabela: [
      { nome: 'Financeiro', cpu: 3, ram: 0, disco: 0, rede: 1, situacao: 'Crítico' },
      { nome: 'Aplicação', cpu: 0, ram: 2, disco: 0, rede: 1, situacao: 'Moderado' },
      { nome: 'Rota', cpu: 1, ram: 0, disco: 0, rede: 2, situacao: 'Downtime' },
      { nome: 'Vendas', cpu: 0, ram: 0, disco: 0, rede: 1, situacao: 'Estável' },
      { nome: 'API Banco', cpu: 0, ram: 0, disco: 0, rede: 0, situacao: 'Estável' },
      { nome: 'Gateway Pagamentos', cpu: 0, ram: 0, disco: 0, rede: 0, situacao: 'Estável' }
    ],
    moderados: { CPU: 2, RAM: 1, DISCO: 0, REDE: 3 },
    criticos: { CPU: 2, RAM: 1, DISCO: 0, REDE: 2 }
  }
};

// Referências dos gráficos Chart.js
let graficoLinha = null;
let graficoModerados = null;
let graficoCriticos = null;
let graficoBarraComponentes = null;
let timerToast = null;

function obterValorRequisicaoEfetivo(instancia) {
  return instancia.precoReqPersonalizado != null
    ? instancia.precoReqPersonalizado
    : ESTADO.valorPadraoRequisicao;
}

function obterMediaValorRequisicao() {
  const soma = ESTADO.instancias.reduce((acc, inst) => acc + obterValorRequisicaoEfetivo(inst), 0);
  return soma / ESTADO.instancias.length;
}

function formatarMoedaCompacta(valor) {
  const abs = Math.abs(valor);
  const sinal = valor < 0 ? '-' : '';
  if (abs >= 1_000_000) {
    return `${sinal}US$ ${(abs / 1_000_000).toFixed(2).replace('.', ',')} MI`;
  }
  if (abs >= 1_000) {
    return `${sinal}US$ ${(abs / 1_000).toFixed(1).replace('.', ',')} MIL`;
  }
  return `${sinal}US$ ${abs.toFixed(2).replace('.', ',')}`;
}

function formatarPrecoReq(valor) {
  return `US$ ${valor.toFixed(3).replace('.', ',')}`;
}

function calcularCustosFinanceiros() {
  const dadosPeriodo = DADOS_POR_PERIODO[ESTADO.filtroData];

  // Custo mensal base das instâncias e perda mensal por downtime
  const custoMensalInstancias = ESTADO.instancias.reduce((acc, i) => acc + i.custoMensalInstancia, 0);
  const perdaMensalDowntime = ESTADO.instancias.reduce((acc, i) => {
    return acc + i.reqPorMinuto * obterValorRequisicaoEfetivo(i) * i.downtimeMinMes;
  }, 0);

  // Valores anuais de referência (mock histórico)
  const fatorHistorico = ESTADO.filtroBaseAnual === 'media_todos' ? 1.18 : 1.08;
  const refAnualInstancias = custoMensalInstancias * 12 * fatorHistorico;
  const refAnualDowntime = perdaMensalDowntime * 12 * (fatorHistorico + 0.08);

  // Valores do período selecionado
  const periodoInstancias = custoMensalInstancias * dadosPeriodo.mesesEquivalentes;
  const periodoDowntime = perdaMensalDowntime * 12 * dadosPeriodo.fatorDowntime;

  let valorReferencia = 0;
  let valorPeriodo = 0;

  if (ESTADO.filtroComposicaoFin === 'instancias') {
    valorReferencia = refAnualInstancias;
    valorPeriodo = periodoInstancias;
  } else if (ESTADO.filtroComposicaoFin === 'downtime') {
    valorReferencia = refAnualDowntime;
    valorPeriodo = periodoDowntime;
  } else {
    valorReferencia = refAnualInstancias + refAnualDowntime;
    valorPeriodo = periodoInstancias + periodoDowntime;
  }

  // Comparação proporcional ao número de meses equivalentes do período selecionado
  const referenciaProporcional = valorReferencia * (dadosPeriodo.mesesEquivalentes / 12);
  const variacaoPct = referenciaProporcional > 0
    ? ((valorPeriodo - referenciaProporcional) / referenciaProporcional) * 100
    : 0;

  return {
    valorReferencia,
    valorPeriodo,
    variacaoPct,
    tituloPeriodo: dadosPeriodo.tituloFin
  };
}

function renderizarSituacaoAtual() {
  const emAlerta = ESTADO.instancias.filter(i => i.situacaoAtual === 'alerta');
  const emDowntime = ESTADO.instancias.filter(i => i.situacaoAtual === 'downtime');
  const totalProblemas = emAlerta.length + emDowntime.length;

  document.getElementById('badgeProblemas').textContent =
    `COM PROBLEMAS: ${totalProblemas}/${ESTADO.instancias.length}`;
  document.getElementById('qtdEmAlerta').textContent = emAlerta.length;
  document.getElementById('qtdDowntime').textContent = emDowntime.length;

  const preencherLista = (elId, lista, vazioMsg) => {
    const ul = document.getElementById(elId);
    if (!lista.length) {
      ul.innerHTML = `<li><span>${vazioMsg}</span></li>`;
      return;
    }
    ul.innerHTML = lista.map(inst => `
      <li>
        <strong>${inst.nome} (${inst.identificador})</strong>
        <span>${inst.detalheSituacao}</span>
      </li>
    `).join('');
  };

  preencherLista('listaInstanciasAlerta', emAlerta, 'Nenhuma instância em alerta no momento.');
  preencherLista('listaInstanciasDowntime', emDowntime, 'Nenhuma instância em downtime no momento.');
}

function renderizarPrejuizoRequisicao() {
  const media = obterMediaValorRequisicao();
  const qtdPersonalizadas = ESTADO.instancias.filter(i => i.precoReqPersonalizado != null).length;

  document.getElementById('valorMedioRequisicao').textContent = formatarPrecoReq(media);
  document.getElementById('resumoPersonalizacaoReq').textContent = qtdPersonalizadas > 0
    ? `${qtdPersonalizadas} instância(s) personalizada(s) • padrão ${formatarPrecoReq(ESTADO.valorPadraoRequisicao)}`
    : `Valor padrão ativo (${formatarPrecoReq(ESTADO.valorPadraoRequisicao)})`;
}

function renderizarPrejuizoFinanceiro() {
  const { valorReferencia, valorPeriodo, variacaoPct, tituloPeriodo } = calcularCustosFinanceiros();

  const tituloBase = ESTADO.filtroBaseAnual === 'media_todos'
    ? 'Média Anual'
    : 'Prejuízo Ano Anterior';

  const textoComposicaoMap = {
    total: 'Prejuízo total',
    instancias: 'Apenas custo das instâncias',
    downtime: 'Apenas perda por downtime'
  };
  const textoComp = textoComposicaoMap[ESTADO.filtroComposicaoFin];

  document.getElementById('tituloFinReferencia').textContent = tituloBase;
  document.getElementById('tituloFinPeriodo').textContent = tituloPeriodo;
  document.getElementById('valorFinReferencia').textContent = formatarMoedaCompacta(valorReferencia);
  document.getElementById('valorFinPeriodo').textContent = formatarMoedaCompacta(valorPeriodo);
  document.getElementById('tagComposicaoEsq').textContent = textoComp;
  document.getElementById('tagComposicaoDir').textContent = textoComp;

  const pill = document.getElementById('pillComparativo');
  const sinal = variacaoPct > 0 ? '+' : '';
  const sufixo = ESTADO.filtroBaseAnual === 'media_todos' ? 'Média Anual' : 'Ano Anterior';
  pill.textContent = `${sinal}${Math.round(variacaoPct)}% ~ ${sufixo}`;
  pill.classList.toggle('positiva', variacaoPct <= 0);
  pill.classList.toggle('negativa', variacaoPct > 0);

  document.getElementById('pillImpactoPeriodo').textContent = `-${formatarMoedaCompacta(valorPeriodo)}`;

  document.getElementById('chipReferenciaAtiva').textContent =
    `Base: ${ESTADO.filtroBaseAnual === 'media_todos' ? 'Média Todos os anos' : 'Prejuízo Ano Anterior'}`;
  document.getElementById('chipComposicaoAtiva').textContent = `Escopo: ${textoComp}`;
}

function renderizarTabelaInstancias() {
  const dados = DADOS_POR_PERIODO[ESTADO.filtroData];
  const tbody = document.getElementById('corpoTabelaInstancias');

  const classeSituacao = {
    'Crítico': 'critico',
    'Moderado': 'moderado',
    'Downtime': 'downtime',
    'Estável': 'estavel'
  };

  tbody.innerHTML = dados.tabela.map(row => {
    const total = row.cpu + row.ram + row.disco + row.rede;
    const classe = classeSituacao[row.situacao] || 'estavel';
    return `
      <tr>
        <td><strong>${row.nome}</strong></td>
        <td>${row.cpu}</td>
        <td>${row.ram}</td>
        <td>${row.disco}</td>
        <td>${row.rede}</td>
        <td><strong>${total}</strong></td>
        <td><span class="badge-situacao ${classe}">${row.situacao}</span></td>
      </tr>
    `;
  }).join('');
}

function renderizarGraficoLinha() {
  const dados = DADOS_POR_PERIODO[ESTADO.filtroData];
  const totalAlertas = dados.alertas.reduce((acc, v) => acc + v, 0);
  const totalDowntimes = dados.downtimes.reduce((acc, v) => acc + v, 0);

  document.getElementById('totalAlertasPeriodo').textContent = totalAlertas;
  document.getElementById('totalDowntimesPeriodo').textContent = totalDowntimes;

  if (typeof Chart === 'undefined') return;
  const ctx = document.getElementById('graficoAlertasDowntimes');
  if (!ctx) return;

  if (graficoLinha) {
    graficoLinha.destroy();
  }

  graficoLinha = new Chart(ctx, {
    type: 'line',
    data: {
      labels: dados.labels,
      datasets: [
        {
          label: 'Alertas',
          data: dados.alertas,
          borderColor: '#e63946',
          backgroundColor: 'rgba(230, 57, 70, 0.12)',
          borderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 5,
          tension: 0.15,
          fill: false
        },
        {
          label: 'Downtimes',
          data: dados.downtimes,
          borderColor: '#5c1218',
          backgroundColor: 'rgba(92, 18, 24, 0.12)',
          borderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 5,
          tension: 0.15,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#14213d',
          titleFont: { family: 'Inter', size: 12 },
          bodyFont: { family: 'Inter', size: 12 }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: ESTADO.filtroData === '1d' ? 'Horário (1h)' : 'Período',
            color: '#475569',
            font: { family: 'Inter', size: 11, weight: '600' }
          },
          grid: { display: false },
          ticks: {
            color: '#64748b',
            font: { family: 'Inter', size: 10 },
            maxRotation: 0,
            autoSkip: true
          }
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Quantidade',
            color: '#475569',
            font: { family: 'Inter', size: 11, weight: '600' }
          },
          grid: { color: '#e9eef6' },
          ticks: {
            precision: 0,
            color: '#64748b',
            font: { family: 'Inter', size: 10 }
          }
        }
      }
    }
  });
}

function renderizarLegendaRosca(elId, objDados) {
  const ul = document.getElementById(elId);
  const componentes = ['CPU', 'RAM', 'DISCO', 'REDE'];
  const total = componentes.reduce((acc, c) => acc + objDados[c], 0) || 1;

  ul.innerHTML = componentes.map(comp => {
    const val = objDados[comp];
    const pct = ((val / total) * 100).toFixed(1);
    return `
      <li>
        <span class="cor-legenda" style="background: ${CORES_COMPONENTES[comp]}"></span>
        <span>${comp}: <strong>${val}</strong> (${pct}%)</span>
      </li>
    `;
  }).join('');
}

function criarOuAtualizarRosca(instanciaAnterior, canvasId, objDados) {
  if (typeof Chart === 'undefined') return null;
  const ctx = document.getElementById(canvasId);
  if (!ctx) return null;

  if (instanciaAnterior) {
    instanciaAnterior.destroy();
  }

  const ordem = ['CPU', 'RAM', 'DISCO', 'REDE'];
  return new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ordem,
      datasets: [{
        data: ordem.map(c => objDados[c]),
        backgroundColor: ordem.map(c => CORES_COMPONENTES[c]),
        borderWidth: 2,
        borderColor: '#f8faff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '58%',
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#14213d',
          callbacks: {
            label: context => ` ${context.label}: ${context.parsed}`
          }
        }
      }
    }
  });
}

function renderizarGraficosComponentes() {
  const dados = DADOS_POR_PERIODO[ESTADO.filtroData];
  const { moderados, criticos } = dados;

  const totalMod = Object.values(moderados).reduce((a, b) => a + b, 0);
  const totalCrit = Object.values(criticos).reduce((a, b) => a + b, 0);

  document.getElementById('totalAlertasModerados').textContent = totalMod;
  document.getElementById('totalAlertasCriticos').textContent = totalCrit;

  renderizarLegendaRosca('legendaModerados', moderados);
  renderizarLegendaRosca('legendaCriticos', criticos);

  graficoModerados = criarOuAtualizarRosca(graficoModerados, 'graficoModerados', moderados);
  graficoCriticos = criarOuAtualizarRosca(graficoCriticos, 'graficoCriticos', criticos);

  if (typeof Chart === 'undefined') return;
  const ctxBarra = document.getElementById('graficoBarraComponentes');
  if (!ctxBarra) return;

  if (graficoBarraComponentes) {
    graficoBarraComponentes.destroy();
  }

  const ordemBarra = ['REDE', 'DISCO', 'RAM', 'CPU'];
  const valoresBarra = ordemBarra.map(comp => moderados[comp] + criticos[comp]);

  graficoBarraComponentes = new Chart(ctxBarra, {
    type: 'bar',
    data: {
      labels: ordemBarra,
      datasets: [{
        label: 'Total de Alertas',
        data: valoresBarra,
        backgroundColor: '#ff571a',
        borderRadius: 6,
        barThickness: 26
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#14213d',
          callbacks: {
            label: ctx => ` ${ctx.parsed.x} alertas`
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          grid: { color: '#eef2f8' },
          ticks: {
            precision: 0,
            color: '#64748b',
            font: { family: 'Inter', size: 11 }
          }
        },
        y: {
          grid: { display: false },
          ticks: {
            color: '#1e293b',
            font: { family: 'Inter', size: 11, weight: '600' }
          }
        }
      }
    }
  });
}

function renderizarTudo() {
  renderizarSituacaoAtual();
  renderizarPrejuizoRequisicao();
  renderizarPrejuizoFinanceiro();
  renderizarTabelaInstancias();
  renderizarGraficoLinha();
  renderizarGraficosComponentes();
}

// Pop-up estilo Alteração de Cargos (permissoes.html)
function renderizarListaModalReq() {
  const container = document.getElementById('listaInstanciasModal');
  const selecionado = ESTADO.alvoSelecionadoModal;

  const itemPadrao = `
    <label class="instancia-item-modal">
      <div class="instancia-info-modal">
        <div class="instancia-avatar-modal padrao">ALL</div>
        <div class="instancia-texto-modal">
          <div><b>Valor Padrão Global</b></div>
          <div><b>Valor atual:</b> ${formatarPrecoReq(ESTADO.valorPadraoRequisicao)} / req</div>
        </div>
      </div>
      <input type="radio" name="instanciaReq" class="radio-estilo" value="padrao" ${selecionado === 'padrao' ? 'checked' : ''} />
    </label>
  `;

  const itensInstancias = ESTADO.instancias.map(inst => {
    const iniciais = inst.nome.slice(0, 2).toUpperCase();
    const personalizado = inst.precoReqPersonalizado != null;
    const valorAtual = obterValorRequisicaoEfetivo(inst);
    const badgeCustom = personalizado ? '<span class="badge-custom-req">(Personalizado)</span>' : '';

    return `
      <label class="instancia-item-modal">
        <div class="instancia-info-modal">
          <div class="instancia-avatar-modal">${iniciais}</div>
          <div class="instancia-texto-modal">
            <div><b>Instância:</b> ${inst.nome}${badgeCustom}</div>
            <div><b>ID:</b> ${inst.identificador} &bull; <b>Valor:</b> ${formatarPrecoReq(valorAtual)}</div>
          </div>
        </div>
        <input type="radio" name="instanciaReq" class="radio-estilo" value="${inst.id}" ${selecionado === inst.id ? 'checked' : ''} />
      </label>
    `;
  }).join('');

  container.innerHTML = itemPadrao + itensInstancias;
}

function atualizarPainelEdicaoModalReq() {
  const alvo = ESTADO.alvoSelecionadoModal;
  const iptValor = document.getElementById('iptValorRequisicao');
  const nomeAlvoEl = document.getElementById('nomeAlvoEdicao');
  const wrapPadrao = document.getElementById('wrapAplicarTodas');
  const btnRestaurar = document.getElementById('btnRestaurarPadraoReq');

  if (alvo === 'padrao') {
    nomeAlvoEl.textContent = 'Valor Padrão Global (Todas as instâncias sem personalização)';
    iptValor.value = ESTADO.valorPadraoRequisicao.toFixed(3);
    wrapPadrao.style.display = 'block';
    btnRestaurar.style.display = 'none';
  } else {
    const inst = ESTADO.instancias.find(i => i.id === alvo);
    if (!inst) return;
    nomeAlvoEl.textContent = `${inst.nome} (${inst.identificador})`;
    iptValor.value = obterValorRequisicaoEfetivo(inst).toFixed(3);
    wrapPadrao.style.display = 'none';
    btnRestaurar.style.display = 'inline-block';
  }

  atualizarPreviewImpactoModal();
}

function atualizarPreviewImpactoModal() {
  const alvo = ESTADO.alvoSelecionadoModal;
  const val = parseFloat(document.getElementById('iptValorRequisicao').value) || 0;
  const resumoEl = document.getElementById('resumoImpactoInstancia');

  if (alvo === 'padrao') {
    const reqTotalMin = ESTADO.instancias.reduce((acc, i) => acc + i.reqPorMinuto, 0);
    const perdaMin = reqTotalMin * val;
    resumoEl.textContent = `Tráfego total: ${reqTotalMin.toLocaleString('pt-BR')} req/min • Impacto por min em queda total: ${formatarMoedaCompacta(perdaMin)}/min.`;
  } else {
    const inst = ESTADO.instancias.find(i => i.id === alvo);
    if (!inst) return;
    const perdaMes = inst.reqPorMinuto * val * inst.downtimeMinMes;
    resumoEl.textContent = `${inst.reqPorMinuto.toLocaleString('pt-BR')} req/min • Perda estimada (${inst.downtimeMinMes} min downtime/mês): ${formatarMoedaCompacta(perdaMes)}.`;
  }
}

function abrirModalRequisicao() {
  renderizarListaModalReq();
  atualizarPainelEdicaoModalReq();
  document.getElementById('modalPrejuizoReq').hidden = false;
}

function fecharModalRequisicao() {
  document.getElementById('modalPrejuizoReq').hidden = true;
}

function salvarAlteracaoRequisicao() {
  const val = parseFloat(document.getElementById('iptValorRequisicao').value);
  if (isNaN(val) || val <= 0) {
    exibirToast('Informe um valor válido maior que zero.');
    return;
  }

  if (ESTADO.alvoSelecionadoModal === 'padrao') {
    const padraoAnterior = ESTADO.valorPadraoRequisicao;
    const aplicarTodas = document.getElementById('chkAplicarPadrao').checked;
    ESTADO.valorPadraoRequisicao = val;
    if (!aplicarTodas) {
      // Se desmarcado, preserva o valor anterior nas instâncias que ainda não tinham personalização
      ESTADO.instancias.forEach(inst => {
        if (inst.precoReqPersonalizado == null) {
          inst.precoReqPersonalizado = padraoAnterior;
        }
      });
    }
    exibirToast(`Valor padrão atualizado para ${formatarPrecoReq(val)}.`);
  } else {
    const inst = ESTADO.instancias.find(i => i.id === ESTADO.alvoSelecionadoModal);
    if (inst) {
      inst.precoReqPersonalizado = val;
      exibirToast(`${inst.nome}: valor atualizado para ${formatarPrecoReq(val)}.`);
    }
  }

  renderizarListaModalReq();
  atualizarPainelEdicaoModalReq();
  renderizarPrejuizoRequisicao();
  renderizarPrejuizoFinanceiro();
}

function restaurarPadraoInstancia() {
  const inst = ESTADO.instancias.find(i => i.id === ESTADO.alvoSelecionadoModal);
  if (!inst) return;
  inst.precoReqPersonalizado = null;
  renderizarListaModalReq();
  atualizarPainelEdicaoModalReq();
  renderizarPrejuizoRequisicao();
  renderizarPrejuizoFinanceiro();
  exibirToast(`${inst.nome} voltou a utilizar o valor padrão (${formatarPrecoReq(ESTADO.valorPadraoRequisicao)}).`);
}

function abrirModalRelatorio() {
  const dados = DADOS_POR_PERIODO[ESTADO.filtroData];
  const { valorReferencia, valorPeriodo } = calcularCustosFinanceiros();
  const totalAlertas = dados.alertas.reduce((a, b) => a + b, 0);
  const totalDowntimes = dados.downtimes.reduce((a, b) => a + b, 0);

  document.getElementById('conteudoRelatorio').innerHTML = `
    <div class="relatorio-linha"><span>Período selecionado</span><strong>${dados.tituloFin}</strong></div>
    <div class="relatorio-linha"><span>Instâncias com problema agora</span><strong>${document.getElementById('badgeProblemas').textContent}</strong></div>
    <div class="relatorio-linha"><span>Prejuízo médio por requisição</span><strong>${formatarPrecoReq(obterMediaValorRequisicao())}</strong></div>
    <div class="relatorio-linha"><span>Referência (${document.getElementById('tituloFinReferencia').textContent})</span><strong>${formatarMoedaCompacta(valorReferencia)}</strong></div>
    <div class="relatorio-linha"><span>Impacto apurado no período</span><strong>${formatarMoedaCompacta(valorPeriodo)}</strong></div>
    <div class="relatorio-linha"><span>Total de Alertas / Downtimes</span><strong>${totalAlertas} alertas / ${totalDowntimes} downtimes</strong></div>
  `;
  document.getElementById('modalRelatorio').hidden = false;
}

function baixarResumoRelatorio() {
  const dados = DADOS_POR_PERIODO[ESTADO.filtroData];
  const fin = calcularCustosFinanceiros();
  const payload = {
    geradoEm: new Date().toISOString(),
    periodo: dados.tituloFin,
    composicaoFinanceira: ESTADO.filtroComposicaoFin,
    referenciaAnual: ESTADO.filtroBaseAnual,
    valorMedioRequisicaoUSD: obterMediaValorRequisicao(),
    valorReferenciaUSD: Number(fin.valorReferencia.toFixed(2)),
    valorPeriodoUSD: Number(fin.valorPeriodo.toFixed(2)),
    instancias: ESTADO.instancias.map(i => ({
      nome: i.nome,
      identificador: i.identificador,
      situacaoAtual: i.situacaoAtual,
      precoPorRequisicaoUSD: obterValorRequisicaoEfetivo(i)
    }))
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `relatorio-central-status-${ESTADO.filtroData}.json`;
  link.click();
  URL.revokeObjectURL(url);
  exibirToast('Resumo do relatório exportado em JSON (dados simulados).');
}

function exibirToast(mensagem) {
  const el = document.getElementById('toastAviso');
  if (!el) return;
  el.textContent = mensagem;
  el.hidden = false;
  clearTimeout(timerToast);
  timerToast = setTimeout(() => {
    el.hidden = true;
  }, 3200);
}

function configurarEventos() {
  // Filtro global de data
  document.getElementById('filtroDataGlobal').addEventListener('change', e => {
    ESTADO.filtroData = e.target.value;
    renderizarPrejuizoFinanceiro();
    renderizarTabelaInstancias();
    renderizarGraficoLinha();
    renderizarGraficosComponentes();
  });

  // Popover de filtros financeiros
  const btnFiltroFin = document.getElementById('btnFiltroFinanceiro');
  const popFiltroFin = document.getElementById('popoverFiltroFinanceiro');

  btnFiltroFin.addEventListener('click', e => {
    e.stopPropagation();
    const vaiAbrir = popFiltroFin.hidden;
    popFiltroFin.hidden = !vaiAbrir;
    btnFiltroFin.setAttribute('aria-expanded', String(vaiAbrir));
  });

  popFiltroFin.addEventListener('click', e => e.stopPropagation());

  document.getElementById('filtroBaseAnual').addEventListener('change', e => {
    ESTADO.filtroBaseAnual = e.target.value;
    renderizarPrejuizoFinanceiro();
  });

  document.getElementById('filtroComposicaoFin').addEventListener('change', e => {
    ESTADO.filtroComposicaoFin = e.target.value;
    renderizarPrejuizoFinanceiro();
  });

  // Situação atual (toggle ao clicar para mobile / toque além do hover)
  document.querySelectorAll('.subcard-situacao').forEach(card => {
    card.addEventListener('click', e => {
      e.stopPropagation();
      const estavaAberto = card.classList.contains('aberto');
      document.querySelectorAll('.subcard-situacao').forEach(c => c.classList.remove('aberto'));
      if (!estavaAberto) card.classList.add('aberto');
    });
  });

  // Menu rápido do cabeçalho
  const btnMenu = document.getElementById('btnMenuCabecalho');
  const menuDrop = document.getElementById('menuRapidoDropdown');

  btnMenu.addEventListener('click', e => {
    e.stopPropagation();
    const abrir = menuDrop.hidden;
    menuDrop.hidden = !abrir;
    btnMenu.setAttribute('aria-expanded', String(abrir));
  });

  document.getElementById('acaoAtualizarMock').addEventListener('click', () => {
    menuDrop.hidden = true;
    renderizarTudo();
    exibirToast('Leitura atualizada com os dados simulados mais recentes.');
  });

  document.getElementById('acaoAbrirModalReq').addEventListener('click', () => {
    menuDrop.hidden = true;
    abrirModalRequisicao();
  });

  document.getElementById('acaoResetarFiltros').addEventListener('click', () => {
    menuDrop.hidden = true;
    ESTADO.filtroData = '6m';
    ESTADO.filtroBaseAnual = 'media_todos';
    ESTADO.filtroComposicaoFin = 'total';
    document.getElementById('filtroDataGlobal').value = '6m';
    document.getElementById('filtroBaseAnual').value = 'media_todos';
    document.getElementById('filtroComposicaoFin').value = 'total';
    renderizarTudo();
    exibirToast('Filtros restaurados para o padrão.');
  });

  // Modal Prejuízo por Requisição
  document.getElementById('btnEditarRequisicao').addEventListener('click', abrirModalRequisicao);
  document.getElementById('btnFecharModalReq').addEventListener('click', fecharModalRequisicao);
  document.getElementById('btnSalvarReq').addEventListener('click', salvarAlteracaoRequisicao);
  document.getElementById('btnRestaurarPadraoReq').addEventListener('click', restaurarPadraoInstancia);
  document.getElementById('iptValorRequisicao').addEventListener('input', atualizarPreviewImpactoModal);

  document.getElementById('listaInstanciasModal').addEventListener('change', e => {
    if (e.target.name === 'instanciaReq') {
      ESTADO.alvoSelecionadoModal = e.target.value;
      atualizarPainelEdicaoModalReq();
    }
  });

  document.querySelectorAll('.btn-atalho-valor').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('iptValorRequisicao').value = btn.dataset.valor;
      atualizarPreviewImpactoModal();
    });
  });

  document.getElementById('modalPrejuizoReq').addEventListener('click', e => {
    if (e.target.id === 'modalPrejuizoReq') fecharModalRequisicao();
  });

  // Modal Relatório
  document.getElementById('btnGerarRelatorio').addEventListener('click', abrirModalRelatorio);
  document.getElementById('btnFecharModalRelatorio').addEventListener('click', () => {
    document.getElementById('modalRelatorio').hidden = true;
  });
  document.getElementById('btnFecharRelatorioSec').addEventListener('click', () => {
    document.getElementById('modalRelatorio').hidden = true;
  });
  document.getElementById('btnConfirmarDownloadRelatorio').addEventListener('click', baixarResumoRelatorio);
  document.getElementById('modalRelatorio').addEventListener('click', e => {
    if (e.target.id === 'modalRelatorio') {
      document.getElementById('modalRelatorio').hidden = true;
    }
  });

  // Fechar popovers ao clicar fora ou pressionar Escape
  document.addEventListener('click', () => {
    popFiltroFin.hidden = true;
    btnFiltroFin.setAttribute('aria-expanded', 'false');
    menuDrop.hidden = true;
    btnMenu.setAttribute('aria-expanded', 'false');
    document.querySelectorAll('.subcard-situacao').forEach(c => c.classList.remove('aberto'));
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      popFiltroFin.hidden = true;
      menuDrop.hidden = true;
      fecharModalRequisicao();
      document.getElementById('modalRelatorio').hidden = true;
      document.querySelectorAll('.subcard-situacao').forEach(c => c.classList.remove('aberto'));
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  configurarEventos();
  renderizarTudo();
});
