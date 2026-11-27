/** Converte o contrato JSON da dashboard para o formato usado pela interface. */


function adaptarJsonGold(dados) {

    function converterRede(valor) {
        if (!Number.isFinite(valor) || valor < 0) {
            return null;
        }

        return Number(
            ((valor * 60) / 1000000).toFixed(4)
        );
    }

    function formatarData(valor) {
        return valor.replace(" ", "T");
    }

    const historicoRam = new Map(
        dados.ram.historico.map(item => [
            item.timestamp, item
        ])
    );

    const historicoDisco = new Map(
        dados.disco.historico.map(item => [
            item.timestamp, item
        ])
    );

    const historicoRede = new Map(
        dados.rede.historico.map(item => [
            item.timestamp, item
        ])
    );

    const historico = dados.cpu.historico.map(cpu => {

        const ram = historicoRam.get(cpu.timestamp);
        const disco = historicoDisco.get(cpu.timestamp);
        const rede = historicoRede.get(cpu.timestamp);

        if (!ram || !disco || !rede) {
            return null;
        }

        const download = converterRede(
            rede.rede_download_bytes_s
        );

        const upload = converterRede(
            rede.rede_upload_bytes_s
        );

        if (
            !Number.isFinite(cpu.cpu_percent) ||
            !Number.isFinite(ram.ram_percent) ||
            !Number.isFinite(disco.disco_percent) ||
            download === null ||
            upload === null
        ) {
            return null;
        }

        return {
            data: formatarData(cpu.timestamp),
            cpu: cpu.cpu_percent,
            ram: ram.ram_percent,
            disco: disco.disco_percent,

            rede: {
                download: download,
                upload: upload
            }
        };

    }).filter(item => item !== null)
      .sort((a, b) => a.data.localeCompare(b.data));

    return {

        servidor: {
            nome: dados.maquina.hostname
        },

        captura: formatarData(
            dados.maquina.ultimo_registro
        ),

        metricas: {

            cpu: dados.cpu.atual.uso_percent,

            ram: dados.ram.atual.uso_percent,

            disco: dados.disco.atual.uso_percent,

            rede: {
                download: converterRede(
                    dados.rede.atual.download_bytes_s
                ),

                upload: converterRede(
                    dados.rede.atual.upload_bytes_s
                )
            }
        },

        capacidade: {
    ram: {
        total: dados.ram.atual.total_gb,
        usado: dados.ram.atual.usada_gb,
        disponivel: dados.ram.atual.disponivel_gb
    },

    disco: {
        total: dados.disco.atual.total_gb,
        usado: dados.disco.atual.usado_gb,
        disponivel: dados.disco.atual.livre_gb
    }
},

        historico: historico,

        processos: dados.processos.map(processo => ({
            pid: processo.pid,
            nome: processo.nome,
            cpu: processo.cpu,
            ram: processo.ram
        }))
    };
}


function interpretarJsonDashboard(entrada) {
  const dados = typeof entrada === 'string' ? JSON.parse(entrada) : entrada;
  if (!dados || typeof dados !== 'object' || Array.isArray(dados)) throw new Error('O JSON deve conter um objeto.');
  const numero = (valor, campo, maximo = Infinity) => {
    if (typeof valor !== 'number' || !Number.isFinite(valor) || valor < 0 || valor > maximo) {
      throw new Error(`${campo} deve ser um número entre 0 e ${maximo === Infinity ? 'infinito' : maximo}.`);
    }
    return valor;
  };
  const texto = (valor, campo) => {
    if (typeof valor !== 'string' || !valor.trim()) throw new Error(`${campo} deve ser um texto não vazio.`);
    return valor;
  };
  const data = (valor, campo) => {
    texto(valor, campo);
    if (!/^\d{4}-\d{2}-\d{2}T/.test(valor) || !Number.isFinite(Date.parse(valor))) throw new Error(`${campo} deve ser uma data ISO 8601 válida.`);
    return valor;
  };
  const servidor = dados.servidor;
  if (!servidor || typeof servidor !== 'object') throw new Error('servidor é obrigatório.');
  const nome = texto(servidor.nome, 'servidor.nome');
  const captura = data(dados.captura, 'captura');
  const metricas = dados.metricas;
  if (!metricas || typeof metricas !== 'object' || !metricas.rede || typeof metricas.rede !== 'object') throw new Error('metricas e metricas.rede são obrigatórios.');
  const cpu = numero(metricas.cpu, 'metricas.cpu', 100);
  const ram = numero(metricas.ram, 'metricas.ram', 100);
  const disco = numero(metricas.disco, 'metricas.disco', 100);
  const download = numero(metricas.rede.download, 'metricas.rede.download');
  const upload = numero(metricas.rede.upload, 'metricas.rede.upload');
  const saude = (valor, atencao, critico) => valor >= critico
    ? { texto: 'Crítico', classe: 'critico' }
    : valor >= atencao ? { texto: 'Atenção', classe: 'atencao' } : { texto: 'Normal', classe: 'normal' };
  const estados = { cpu: saude(cpu, 80, 90), ram: saude(ram, 75, 85), disco: saude(disco, 80, 90), rede: saude(Math.max(download, upload), 100, 150) };
  const estadoGeral = Object.values(estados).some(item => item.classe === 'critico') ? 'critico'
    : Object.values(estados).some(item => item.classe === 'atencao') ? 'atencao' : 'normal';
  const historico = dados.historico === undefined ? [] : dados.historico;
  if (!Array.isArray(historico)) throw new Error('historico deve ser uma lista.');
  const pontos = historico.map((ponto, i) => {
    if (!ponto || typeof ponto !== 'object' || !ponto.rede || typeof ponto.rede !== 'object') throw new Error(`historico[${i}] deve conter rede.`);
    return {
      data: data(ponto.data, `historico[${i}].data`),
      cpu: numero(ponto.cpu, `historico[${i}].cpu`, 100),
      ram: numero(ponto.ram, `historico[${i}].ram`, 100),
      disco: numero(ponto.disco, `historico[${i}].disco`, 100),
      download: numero(ponto.rede.download, `historico[${i}].rede.download`),
      upload: numero(ponto.rede.upload, `historico[${i}].rede.upload`)
    };
  });
  const processos = dados.processos === undefined ? [] : dados.processos;
  if (!Array.isArray(processos)) throw new Error('processos deve ser uma lista.');
  const processosFormatados = processos.map((processo, i) => {
    if (!processo || typeof processo !== 'object') throw new Error(`processos[${i}] deve ser um objeto.`);
    if (!Number.isInteger(processo.pid) || processo.pid < 0) throw new Error(`processos[${i}].pid deve ser um inteiro não negativo.`);
    return { pid: processo.pid, nome: texto(processo.nome, `processos[${i}].nome`), cpu: `${numero(processo.cpu, `processos[${i}].cpu`)}%`, ram: `${numero(processo.ram, `processos[${i}].ram`, 100)}%` };
  });
  return {
    capacidade: dados.capacidade ?? null,
    nome, captura, simulado: false, historicoDatas: pontos.map(ponto => ponto.data),
    status: estadoGeral, statusTexto: { critico: 'Crítico', atencao: 'Atenção', normal: 'Normal' }[estadoGeral],
    geral: { cpu: `${cpu}%`, ram: `${ram}%`, disco: `${disco}%`, saude: estados, processos: processosFormatados },
    cpu: { evolucao: pontos.map(ponto => ponto.cpu) },
    ram: { evolucao: pontos.map(ponto => ponto.ram) },
    disco: { evolucao: pontos.map(ponto => ponto.disco) },
    rede: { volumeDownload: download, volumeUpload: upload, volumeDownloadGrafico: pontos.map(ponto => ponto.download), volumeUploadGrafico: pontos.map(ponto => ponto.upload) }
  };
}

if (typeof module !== 'undefined' && module.exports) module.exports = { interpretarJsonDashboard };
