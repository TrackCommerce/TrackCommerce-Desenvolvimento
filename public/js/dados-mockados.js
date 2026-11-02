/**
 * Sistema centralizado de dados mockados para as Dashboards
 * Cada métrica possui fonte única de dados compartilhada entre a visão Geral
 * e as visões específicas (CPU, RAM, Disco e Rede), eliminando divergências.
 */

// ==========================================
// 1. PERFIL: CRÍTICO (Gateway de API)
// RAM: 89% (Crítico), CPU: 82% (Atenção)
// ==========================================
const CRITICO_CPU = {
  usoAtual: "82%",
  classe: "atencao",
  saudeTexto: "Atenção",
  saudeClasse: "atencao",
  evolucao: [65, 72, 75, 80, 82],
  loadAverage: [3.8, 4.2, 4.9, 5.8, 6.4],
  cores: [88, 82, 84, 74],
  modo: [68, 24, 8],
  modoLegenda: { user: "68%", system: "24%", idle: "8%" },
  processos: [
    { pid: 1042, nome: "api-gateway", cpu: "45.2%", ram: "48.0%" },
    { pid: 3029, nome: "node /app/gateway.js", cpu: "26.8%", ram: "28.5%" },
    { pid: 2108, nome: "redis-server", cpu: "6.2%", ram: "8.4%" },
    { pid: 847, nome: "proxy-router", cpu: "2.5%", ram: "3.1%" },
    { pid: 5221, nome: "logger-agent", cpu: "1.3%", ram: "1.0%" }
  ]
};

const CRITICO_RAM = {
  usoAtual: "89%",
  classe: "critico",
  saudeTexto: "Crítico",
  saudeClasse: "critico",
  totalGb: "16.0 GB",
  usadaGb: "14.2 GB",
  livreGb: "1.8 GB",
  usadaPorc: "89%",
  livrePorc: "11%",
  evolucao: [78, 82, 85, 87, 89],
  swapTotal: "8GB",
  swapUsandoTexto: "5.2 GB (65%)",
  swapLivreTexto: "2.8 GB (35%)",
  swapDados: [65, 35],
  modoDados: [35, 20, 8, 12, 14],
  modoLegenda: { cached: "35%", buffers: "20%", shared: "8%", slab: "12%", available: "14%" },
  buffers: [250, 310, 280, 340, 380],
  processos: [
    { pid: 1042, nome: "api-gateway", cpu: "45.2%", ram: "48.0%" },
    { pid: 3029, nome: "node /app/gateway.js", cpu: "26.8%", ram: "28.5%" },
    { pid: 2108, nome: "redis-server", cpu: "6.2%", ram: "8.4%" },
    { pid: 847, nome: "proxy-router", cpu: "2.5%", ram: "3.1%" },
    { pid: 5221, nome: "logger-agent", cpu: "1.3%", ram: "1.0%" }
  ]
};

const CRITICO_DISCO = {
  usoAtual: "88%",
  classe: "atencao",
  saudeTexto: "Atenção",
  saudeClasse: "atencao",
  totalGb: "1500 GB",
  usadosGb: "1320 GB",
  livresGb: "180 GB",
  usadosTexto: "1320 GB usados • 180 GB livres",
  particaoPrincipal: "88%",
  particaoBackup: "64%",
  evolucao: [75, 78, 82, 85, 88],
  ioBytes: {
    read: [75, 85, 98, 92, 105],
    write: [60, 72, 85, 80, 95]
  },
  ioIops: {
    read: [85, 95, 110, 105, 120],
    write: [70, 80, 95, 90, 105]
  },
  ioLatency: {
    read: [12, 15, 18, 16, 22],
    write: [14, 18, 24, 20, 28]
  }
};

const CRITICO_REDE = {
  latencia: "380ms",
  classe: "atencao",
  saudeTexto: "Atenção",
  saudeClasse: "atencao",
  conexoesEst: 380,
  conexoesTime: 150,
  conexoesClose: 90,
  conexoesTotal: 620,
  conexoesPorcEst: "61%",
  conexoesPorcTime: "24%",
  conexoesPorcClose: "15%",
  perdaPacotesTotal: "68",
  perdaPacotesGrafico: [30, 42, 50, 58, 68],
  volumeDownload: "120",
  volumeUpload: "65",
  volumeDownloadGrafico: [80, 95, 105, 112, 120],
  volumeUploadGrafico: [40, 48, 55, 60, 65],
  pacotesDownload: "58",
  pacotesUpload: "32",
  pacotesDownloadGrafico: [35, 42, 48, 52, 58],
  pacotesUploadGrafico: [18, 22, 26, 28, 32]
};

// ==========================================
// 2. PERFIL: ATENÇÃO (Servidor de Banco de Dados)
// CPU: 80% (Atenção), RAM: 67% (Normal), Disco: 54% (Normal), Rede: 150ms (Normal)
// ==========================================
const ATENCAO_CPU = {
  usoAtual: "80%",
  classe: "atencao",
  saudeTexto: "Atenção",
  saudeClasse: "atencao",
  evolucao: [40, 55, 60, 75, 80],
  loadAverage: [1, 2, 1, 4, 5],
  cores: [80, 45, 60, 10],
  modo: [55, 25, 15, 5],
  modoLegenda: { user: "55%", system: "25%", idle: "15%" },
  processos: [
    { pid: 1094, nome: "Server 01", cpu: "32.4%", ram: "18.1%" },
    { pid: 3029, nome: "node /app/server.js", cpu: "28.1%", ram: "22.5%" },
    { pid: 4810, nome: "Server 02", cpu: "12.5%", ram: "14.2%" },
    { pid: 847, nome: "Server 03", cpu: "4.2%", ram: "8.4%" },
    { pid: 5221, nome: "Server 04", cpu: "2.8%", ram: "3.8%" }
  ]
};

const ATENCAO_RAM = {
  usoAtual: "67%",
  classe: "",
  saudeTexto: "Normal",
  saudeClasse: "normal",
  totalGb: "16.0 GB",
  usadaGb: "10.7 GB",
  livreGb: "5.3 GB",
  usadaPorc: "67%",
  livrePorc: "33%",
  evolucao: [45, 52, 58, 62, 67],
  swapTotal: "8GB",
  swapUsandoTexto: "2.0 GB (25%)",
  swapLivreTexto: "6.0 GB (75%)",
  swapDados: [25, 75],
  modoDados: [25, 15, 5, 10, 45],
  modoLegenda: { cached: "25%", buffers: "15%", shared: "5%", slab: "10%", available: "45%" },
  buffers: [150, 210, 180, 230, 260],
  processos: [
    { pid: 3029, nome: "node /app/server.js", cpu: "28.1%", ram: "22.5%" },
    { pid: 1094, nome: "Server 01", cpu: "32.4%", ram: "18.1%" },
    { pid: 4810, nome: "Server 02", cpu: "12.5%", ram: "14.2%" },
    { pid: 847, nome: "Server 03", cpu: "4.2%", ram: "8.4%" },
    { pid: 5221, nome: "Server 04", cpu: "2.8%", ram: "3.8%" }
  ]
};

const ATENCAO_DISCO = {
  usoAtual: "54%",
  classe: "",
  saudeTexto: "Normal",
  saudeClasse: "normal",
  totalGb: "1500 GB",
  usadosGb: "810 GB",
  livresGb: "690 GB",
  usadosTexto: "810 GB usados • 690 GB livres",
  particaoPrincipal: "54%",
  particaoBackup: "38%",
  evolucao: [42, 45, 48, 51, 54],
  ioBytes: {
    read: [30, 42, 60, 51, 55],
    write: [25, 33, 40, 35, 35]
  },
  ioIops: {
    read: [40, 52, 65, 58, 70],
    write: [30, 42, 55, 48, 60]
  },
  ioLatency: {
    read: [4, 6, 8, 7, 9],
    write: [5, 8, 11, 9, 12]
  }
};

const ATENCAO_REDE = {
  latencia: "150ms",
  classe: "",
  saudeTexto: "Normal",
  saudeClasse: "normal",
  conexoesEst: 110,
  conexoesTime: 50,
  conexoesClose: 40,
  conexoesTotal: 200,
  conexoesPorcEst: "55%",
  conexoesPorcTime: "25%",
  conexoesPorcClose: "20%",
  perdaPacotesTotal: "36",
  perdaPacotesGrafico: [14, 25, 20, 28, 36],
  volumeDownload: "75",
  volumeUpload: "30",
  volumeDownloadGrafico: [45, 52, 60, 68, 75],
  volumeUploadGrafico: [18, 22, 28, 25, 30],
  pacotesDownload: "36",
  pacotesUpload: "18",
  pacotesDownloadGrafico: [20, 26, 31, 29, 36],
  pacotesUploadGrafico: [11, 14, 16, 15, 18]
};

// ==========================================
// 3. PERFIL: ESTÁVEL (Servidor de Checkout e demais)
// Todas as métricas abaixo dos limites de atenção e operando com folga
// ==========================================
const ESTAVEL_CPU = {
  usoAtual: "34%",
  classe: "",
  saudeTexto: "Normal",
  saudeClasse: "normal",
  evolucao: [25, 30, 28, 32, 34],
  loadAverage: [0.6, 0.8, 0.7, 0.9, 1.1],
  cores: [38, 32, 35, 28],
  modo: [28, 12, 60],
  modoLegenda: { user: "28%", system: "12%", idle: "60%" },
  processos: [
    { pid: 1102, nome: "checkout-api", cpu: "12.4%", ram: "8.5%" },
    { pid: 2045, nome: "payment-worker", cpu: "8.1%", ram: "11.2%" },
    { pid: 3310, nome: "cart-session", cpu: "5.2%", ram: "6.4%" },
    { pid: 844, nome: "btop", cpu: "1.8%", ram: "2.1%" },
    { pid: 5221, nome: "systemd", cpu: "0.8%", ram: "1.2%" }
  ]
};

const ESTAVEL_RAM = {
  usoAtual: "42%",
  classe: "",
  saudeTexto: "Normal",
  saudeClasse: "normal",
  totalGb: "16.0 GB",
  usadaGb: "6.7 GB",
  livreGb: "9.3 GB",
  usadaPorc: "42%",
  livrePorc: "58%",
  evolucao: [38, 40, 39, 41, 42],
  swapTotal: "8GB",
  swapUsandoTexto: "0.4 GB (5%)",
  swapLivreTexto: "7.6 GB (95%)",
  swapDados: [5, 95],
  modoDados: [15, 8, 4, 5, 68],
  modoLegenda: { cached: "15%", buffers: "8%", shared: "4%", slab: "5%", available: "68%" },
  buffers: [80, 95, 90, 110, 120],
  processos: [
    { pid: 2045, nome: "payment-worker", cpu: "8.1%", ram: "11.2%" },
    { pid: 1102, nome: "checkout-api", cpu: "12.4%", ram: "8.5%" },
    { pid: 3310, nome: "cart-session", cpu: "5.2%", ram: "6.4%" },
    { pid: 844, nome: "btop", cpu: "1.8%", ram: "2.1%" },
    { pid: 5221, nome: "systemd", cpu: "0.8%", ram: "1.2%" }
  ]
};

const ESTAVEL_DISCO = {
  usoAtual: "38%",
  classe: "",
  saudeTexto: "Normal",
  saudeClasse: "normal",
  totalGb: "1500 GB",
  usadosGb: "570 GB",
  livresGb: "930 GB",
  usadosTexto: "570 GB usados • 930 GB livres",
  particaoPrincipal: "38%",
  particaoBackup: "18%",
  evolucao: [35, 36, 37, 37, 38],
  ioBytes: {
    read: [18, 22, 28, 25, 30],
    write: [12, 15, 20, 18, 22]
  },
  ioIops: {
    read: [20, 25, 30, 28, 35],
    write: [15, 18, 22, 20, 25]
  },
  ioLatency: {
    read: [2, 3, 3, 2, 3],
    write: [3, 4, 3, 4, 4]
  }
};

const ESTAVEL_REDE = {
  latencia: "35ms",
  classe: "",
  saudeTexto: "Normal",
  saudeClasse: "normal",
  conexoesEst: 45,
  conexoesTime: 25,
  conexoesClose: 15,
  conexoesTotal: 85,
  conexoesPorcEst: "53%",
  conexoesPorcTime: "29%",
  conexoesPorcClose: "18%",
  perdaPacotesTotal: "2",
  perdaPacotesGrafico: [0, 1, 0, 1, 2],
  volumeDownload: "32",
  volumeUpload: "14",
  volumeDownloadGrafico: [20, 25, 30, 28, 32],
  volumeUploadGrafico: [8, 12, 15, 11, 14],
  pacotesDownload: "15",
  pacotesUpload: "7",
  pacotesDownloadGrafico: [10, 12, 13, 14, 15],
  pacotesUploadGrafico: [4, 5, 6, 6, 7]
};

// ==========================================
// ESTRUTURA CENTRAL DADOS_MOCKADOS
// Onde a visão geral espelha DIRETAMENTE as mesmas variáveis
// das visões específicas
// ==========================================
const DADOS_MOCKADOS = {
  critico: {
    nome: "Gateway de API",
    status: "critico",
    statusTexto: "CRÍTICO",
    geral: {
      resumoMeta: "Gateway de API • últimas 24 horas • leitura em 10 segundos",
      cpu: CRITICO_CPU.usoAtual,
      cpuClasse: CRITICO_CPU.classe,
      ram: CRITICO_RAM.usoAtual,
      ramClasse: CRITICO_RAM.classe,
      disco: CRITICO_DISCO.usoAtual,
      discoClasse: CRITICO_DISCO.classe,
      rede: CRITICO_REDE.latencia,
      redeClasse: CRITICO_REDE.classe,
      saude: {
        cpu: { texto: CRITICO_CPU.saudeTexto, classe: CRITICO_CPU.saudeClasse },
        ram: { texto: CRITICO_RAM.saudeTexto, classe: CRITICO_RAM.saudeClasse },
        disco: { texto: CRITICO_DISCO.saudeTexto, classe: CRITICO_DISCO.saudeClasse },
        rede: { texto: CRITICO_REDE.saudeTexto, classe: CRITICO_REDE.saudeClasse }
      },
      discoGrafico: {
        read: CRITICO_DISCO.ioBytes.read,
        write: CRITICO_DISCO.ioBytes.write
      },
      redeGrafico: {
        download: CRITICO_REDE.volumeDownloadGrafico,
        upload: CRITICO_REDE.volumeUploadGrafico
      },
      processos: CRITICO_CPU.processos
    },
    cpu: CRITICO_CPU,
    ram: CRITICO_RAM,
    disco: CRITICO_DISCO,
    rede: CRITICO_REDE
  },

  atencao: {
    nome: "Servidor de Banco de Dados",
    status: "atencao",
    statusTexto: "ATENÇÃO",
    geral: {
      resumoMeta: "Servidor de Banco de Dados • últimas 24 horas • leitura em 10 segundos",
      cpu: ATENCAO_CPU.usoAtual,
      cpuClasse: ATENCAO_CPU.classe,
      ram: ATENCAO_RAM.usoAtual,
      ramClasse: ATENCAO_RAM.classe,
      disco: ATENCAO_DISCO.usoAtual,
      discoClasse: ATENCAO_DISCO.classe,
      rede: ATENCAO_REDE.latencia,
      redeClasse: ATENCAO_REDE.classe,
      saude: {
        cpu: { texto: ATENCAO_CPU.saudeTexto, classe: ATENCAO_CPU.saudeClasse },
        ram: { texto: ATENCAO_RAM.saudeTexto, classe: ATENCAO_RAM.saudeClasse },
        disco: { texto: ATENCAO_DISCO.saudeTexto, classe: ATENCAO_DISCO.saudeClasse },
        rede: { texto: ATENCAO_REDE.saudeTexto, classe: ATENCAO_REDE.saudeClasse }
      },
      discoGrafico: {
        read: ATENCAO_DISCO.ioBytes.read,
        write: ATENCAO_DISCO.ioBytes.write
      },
      redeGrafico: {
        download: ATENCAO_REDE.volumeDownloadGrafico,
        upload: ATENCAO_REDE.volumeUploadGrafico
      },
      processos: ATENCAO_CPU.processos
    },
    cpu: ATENCAO_CPU,
    ram: ATENCAO_RAM,
    disco: ATENCAO_DISCO,
    rede: ATENCAO_REDE
  },

  estavel: {
    nome: "Servidor de Checkout",
    status: "estavel",
    statusTexto: "SAUDÁVEL",
    geral: {
      resumoMeta: "Servidor de Checkout • últimas 24 horas • leitura em 10 segundos",
      cpu: ESTAVEL_CPU.usoAtual,
      cpuClasse: ESTAVEL_CPU.classe,
      ram: ESTAVEL_RAM.usoAtual,
      ramClasse: ESTAVEL_RAM.classe,
      disco: ESTAVEL_DISCO.usoAtual,
      discoClasse: ESTAVEL_DISCO.classe,
      rede: ESTAVEL_REDE.latencia,
      redeClasse: ESTAVEL_REDE.classe,
      saude: {
        cpu: { texto: ESTAVEL_CPU.saudeTexto, classe: ESTAVEL_CPU.saudeClasse },
        ram: { texto: ESTAVEL_RAM.saudeTexto, classe: ESTAVEL_RAM.saudeClasse },
        disco: { texto: ESTAVEL_DISCO.saudeTexto, classe: ESTAVEL_DISCO.saudeClasse },
        rede: { texto: ESTAVEL_REDE.saudeTexto, classe: ESTAVEL_REDE.saudeClasse }
      },
      discoGrafico: {
        read: ESTAVEL_DISCO.ioBytes.read,
        write: ESTAVEL_DISCO.ioBytes.write
      },
      redeGrafico: {
        download: ESTAVEL_REDE.volumeDownloadGrafico,
        upload: ESTAVEL_REDE.volumeUploadGrafico
      },
      processos: ESTAVEL_CPU.processos
    },
    cpu: ESTAVEL_CPU,
    ram: ESTAVEL_RAM,
    disco: ESTAVEL_DISCO,
    rede: ESTAVEL_REDE
  }
};

/**
 * Obtém os dados mockados do servidor atualmente selecionado
 */
function obterServidorAtual() {
  const status = sessionStorage.getItem("SERVIDOR_SELECIONADO_STATUS") || "atencao";
  const nomePersonalizado = sessionStorage.getItem("SERVIDOR_SELECIONADO_NOME");
  
  const base = DADOS_MOCKADOS[status] || DADOS_MOCKADOS["atencao"];
  const dados = JSON.parse(JSON.stringify(base));

  if (nomePersonalizado) {
    dados.nome = nomePersonalizado;
    dados.geral.resumoMeta = `${nomePersonalizado} • últimas 24 horas • leitura em 10 segundos`;
  }
  return dados;
}

/**
 * Salva a seleção do servidor e redireciona para a dashboard
 */
function selecionarServidor(status, nome, redirecionarPara) {
  sessionStorage.setItem("SERVIDOR_SELECIONADO_STATUS", status);
  if (nome) {
    sessionStorage.setItem("SERVIDOR_SELECIONADO_NOME", nome);
  } else {
    sessionStorage.removeItem("SERVIDOR_SELECIONADO_NOME");
  }

  const emDashboard = window.location.pathname.includes("/dashboard/");
  const destino = redirecionarPara || (emDashboard ? "dashboard-geral.html" : "dashboard/dashboard-geral.html");
  window.location.href = destino;
}
