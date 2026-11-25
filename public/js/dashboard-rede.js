function criarGraficoRede(
    idCanvas,
    dados,
    {
        cor = '#0284c7',
        label = 'Pacotes perdidos (interno)',
        unidade = 'pacotes',
        max = null,
        passo = null,
        dadosExternos = null,
        corExterna = '#7c3aed',
        labelExterna = 'Pacotes perdidos externos (Globalping)',
        unidadeExterna = 'pacotes'
    } = {}
) {
    const canvas = document.getElementById(idCanvas);
    if (!canvas) return null;

    const labels = ['12:00', '12:03', '12:06', '12:09', 'Agora'];
    const datasets = [{
        label: label,
        data: dados,
        borderColor: cor,
        backgroundColor: cor,
        borderWidth: 2,
        tension: 0,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointHoverBackgroundColor: cor,
        fill: false
    }];

    const temExterno = Array.isArray(dadosExternos) && dadosExternos.length > 0;
    if (temExterno) {
        datasets.push({
            label: labelExterna,
            data: dadosExternos,
            borderColor: corExterna,
            backgroundColor: corExterna,
            borderWidth: 2,
            borderDash: [5, 5],
            tension: 0,
            pointRadius: 0,
            pointHoverRadius: 4,
            pointHoverBackgroundColor: corExterna,
            fill: false
        });
    }

    const scales = {
        x: {
            ticks: { display: false },
            grid: { display: false },
            border: { color: '#e6e9ef', width: 1.5 }
        },
        y: {
            min: 0,
            suggestedMax: max || undefined,
            ticks: {
                display: true,
                stepSize: passo || undefined,
                color: '#8c97b0',
                font: { size: 9, family: "'Outfit', sans-serif", weight: '500' },
                padding: 4,
                callback: (v) => Number.isInteger(v) ? v : ''
            },
            grid: { color: '#e6e9ef', drawTicks: false },
            border: { display: false, dash: [4, 4] }
        }
    };

    return new Chart(canvas, {
        type: "line",
        data: {
            labels: labels,
            datasets: datasets
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
            layout: { padding: { top: 4, right: 4, bottom: 0, left: 0 } },
            plugins: {
                legend: { display: false },
                tooltip: {
                    displayColors: true,
                    boxWidth: 6,
                    boxHeight: 6,
                    usePointStyle: true,
                    callbacks: {
                        label: function (context) {
                            const un = context.datasetIndex === 1 ? unidadeExterna : unidade;
                            return ` ${context.dataset.label}: ${context.parsed.y} ${un}`.trimEnd();
                        }
                    }
                }
            },
            scales: scales
        }
    });
}

function criarGraficoConexoes(dados = [110, 50, 40]) {
    const canvas = document.getElementById("grafico-conexoes");
    if (!canvas) return;

    return new Chart(canvas, {
        type: "doughnut",
        data: {
            labels: ["ESTABLISHED", "TIME_WAIT", "CLOSE_WAIT"],
            datasets: [{
                data: dados,
                backgroundColor: ["#10b981", "#0284c7", "#f59e0b"],
                borderColor: "#ffffff",
                borderWidth: 2,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            resizeDelay: 50,
            cutout: "62%",
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return ` ${context.label}: ${context.raw} conexões`;
                        }
                    }
                }
            }
        }
    });
}

function criarGraficoRedeDuasLinhas(idCanvas, dadosDownload, dadosUpload, unidade = 'MB/m', passo = null) {
    const canvas = document.getElementById(idCanvas);
    if (!canvas) return null;

    const labels = ['12:00', '12:03', '12:06', '12:09', 'Agora'];
    const maxVal = Math.max(...dadosDownload, ...dadosUpload);
    const suggestedMax = Math.ceil((maxVal * 1.2) / 10) * 10;

    return new Chart(canvas, {
        type: "line",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Download",
                    data: dadosDownload,
                    borderColor: "#0284c7",
                    backgroundColor: "#0284c7",
                    borderWidth: 2,
                    tension: 0,
                    pointRadius: 0,
                    pointHoverRadius: 4,
                    pointHoverBackgroundColor: "#0284c7",
                    fill: false
                },
                {
                    label: "Upload",
                    data: dadosUpload,
                    borderColor: "#f59e0b",
                    backgroundColor: "#f59e0b",
                    borderWidth: 2,
                    tension: 0,
                    pointRadius: 0,
                    pointHoverRadius: 4,
                    pointHoverBackgroundColor: "#f59e0b",
                    fill: false
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
                    ticks: { display: false },
                    grid: { display: false },
                    border: { color: '#e6e9ef', width: 1.5 }
                },
                y: {
                    min: 0,
                    suggestedMax: suggestedMax,
                    ticks: { 
                        display: true,
                        stepSize: passo || undefined,
                        color: '#8c97b0',
                        font: { size: 9, family: "'Outfit', sans-serif", weight: '500' },
                        padding: 4,
                        callback: (v) => Number.isInteger(v) ? v : ''
                    },
                    grid: { color: '#e6e9ef', drawTicks: false },
                    border: { display: false, dash: [4, 4] }
                }
            }
        }
    });
}

function aplicarBadgeTendencia(idBadge, serie, variacaoExplicita = null, { menorPior = false } = {}) {
    const el = document.getElementById(idBadge);
    if (!el) return;

    const info = (typeof calcularVariacaoUltimaHora === 'function')
        ? calcularVariacaoUltimaHora(serie, variacaoExplicita)
        : { texto: 'Tendência desde última hora: 0%', direcao: 'estavel' };

    el.textContent = info.texto;
    el.classList.remove('trend-alta', 'trend-baixa');

    if (info.direcao === 'alta') {
        el.classList.add(menorPior ? 'trend-baixa' : 'trend-alta');
    } else if (info.direcao === 'baixa') {
        el.classList.add(menorPior ? 'trend-alta' : 'trend-baixa');
    }
}

function aplicarBadgesLimite(idAtencao, idCritico, limiteConfig, prefixo = '') {
    if (!limiteConfig) return;
    const elAtencao = document.getElementById(idAtencao);
    const elCritico = document.getElementById(idCritico);
    const formatar = (typeof formatarTextoLimite === 'function')
        ? formatarTextoLimite
        : (rotulo, valor, cfg) => {
            const op = cfg.operador === '<=' ? '≤' : '≥';
            const un = cfg.unidade ? (cfg.unidade === '%' || cfg.unidade === 'ms' ? cfg.unidade : ` ${cfg.unidade}`) : '';
            return `${rotulo} ${op} ${valor}${un}`;
        };

    if (elAtencao && limiteConfig.atencao !== undefined) {
        elAtencao.textContent = `${prefixo}${formatar('Atenção', limiteConfig.atencao, limiteConfig)}`;
    }
    if (elCritico && limiteConfig.critico !== undefined) {
        elCritico.textContent = `${prefixo}${formatar('Crítico', limiteConfig.critico, limiteConfig)}`;
    }
}

function atualizarStatusGlobalping(globalping) {
    const avaliacao = (typeof avaliarRotaExternaGlobalping === 'function')
        ? avaliarRotaExternaGlobalping(globalping)
        : {
            classe: 'normal',
            textoPill: 'Rota Externa BR: Normal (22ms)',
            textoSubtitulo: 'Rota externa: 0% perda (22ms)'
        };

    const elPill = document.getElementById('globalping-status-pill');
    const elPillText = document.getElementById('globalping-status-text');
    const elSub = document.getElementById('rede-rota-externa-sub');
    const elExtNum = document.getElementById('rede-pacotes-externos-num');

    if (elPill) {
        elPill.className = `status-pill ${avaliacao.classe}`;
    }
    if (elPillText) {
        elPillText.textContent = avaliacao.textoPill;
    }
    if (elSub) {
        elSub.textContent = avaliacao.textoSubtitulo;
    }
    if (elExtNum) {
        elExtNum.textContent = globalping?.perdaExternaPacotes ?? 0;
    }
}

/**
 * Integração pronta com a API pública api.globalping.io (v1/measurements).
 * Executada automaticamente quando o servidor possuir `globalping.targetHost` definido.
 */
async function consultarGlobalpingAoVivo(targetHost, regiao = 'BR') {
    if (!targetHost) return null;
    try {
        const createRes = await fetch('https://api.globalping.io/v1/measurements', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'ping',
                target: targetHost,
                measurementOptions: { packets: 16 },
                locations: [{ country: regiao, limit: 3 }]
            })
        });
        if (!createRes.ok) return null;
        const { id } = await createRes.json();
        if (!id) return null;

        for (let tentativa = 0; tentativa < 5; tentativa++) {
            await new Promise(resolve => setTimeout(resolve, 600));
            const pollRes = await fetch(`https://api.globalping.io/v1/measurements/${id}`);
            if (!pollRes.ok) continue;
            const measurement = await pollRes.json();
            if (measurement.status === 'finished' && Array.isArray(measurement.results) && measurement.results.length) {
                const stats = measurement.results
                    .map(r => r.result?.stats)
                    .filter(Boolean);
                if (!stats.length) return null;

                const latenciaMedia = Math.round(stats.reduce((acc, s) => acc + (s.avg || 0), 0) / stats.length);
                const perdaMediaPorc = Math.round(stats.reduce((acc, s) => acc + (s.loss || 0), 0) / stats.length);
                const perdaPacotes = stats.reduce((acc, s) => acc + (s.drop || 0), 0);
                return {
                    regiao,
                    latenciaExternaMs: latenciaMedia,
                    perdaExternaPorc: perdaMediaPorc,
                    perdaExternaPacotes: perdaPacotes
                };
            }
        }
    } catch (erro) {
        console.warn('Falha ao consultar api.globalping.io, mantendo telemetria local:', erro);
    }
    return null;
}

document.addEventListener("DOMContentLoaded", async () => {
    const servidor = (typeof obterServidorAtual === 'function')
        ? obterServidorAtual()
        : (window.DADOS_MOCKADOS ? window.DADOS_MOCKADOS.atencao : null);

    const dadosRede = servidor ? servidor.rede : {
        conexoesEst: 110,
        conexoesTime: 50,
        conexoesClose: 40,
        conexoesEstPorcGrafico: [51, 52, 53, 54, 55],
        conexoesPorcEst: "55%",
        conexoesPorcTime: "25%",
        conexoesPorcClose: "20%",
        perdaPacotesTotal: "2",
        perdaPacotesGrafico: [1, 2, 2, 1, 2],
        volumeDownload: "75",
        volumeUpload: "30",
        volumeDownloadGrafico: [45, 52, 60, 68, 75],
        volumeUploadGrafico: [18, 22, 28, 25, 30],
        pacotesDownload: "36",
        pacotesUpload: "18",
        pacotesDownloadGrafico: [20, 26, 31, 29, 36],
        pacotesUploadGrafico: [11, 14, 16, 15, 18],
        limites: {
            conexoesEstablished: { atencao: 40, critico: 20, operador: "<=", unidade: "%", inverso: true },
            perdaPacotesInterna: { atencao: 3, critico: 10, operador: ">=", unidade: "pacotes", inverso: false },
            perdaPacotesExterna: { atencao: 3, critico: 8, operador: ">=", unidade: "pacotes", inverso: false },
            pingRotaExterna: { atencao: 100, critico: 250, operador: ">=", unidade: "ms", inverso: false },
            volumeDownload: { atencao: 15, critico: 5, operador: "<=", unidade: "MB/m", inverso: true },
            volumeUpload: { atencao: 8, critico: 3, operador: "<=", unidade: "MB/m", inverso: true },
            pacotesDownload: { atencao: 10, critico: 3, operador: "<=", unidade: "mil pacotes", inverso: true },
            pacotesUpload: { atencao: 5, critico: 2, operador: "<=", unidade: "mil pacotes", inverso: true }
        },
        globalping: {
            regiao: "BR",
            targetHost: null,
            perdaExternaPacotes: 0,
            perdaExternaPorc: 0,
            latenciaExternaMs: 22,
            perdaExternaPacotesGrafico: [0, 0, 0, 0, 0]
        }
    };

    const limites = dadosRede.limites || {
        conexoesEstablished: { atencao: 40, critico: 20, operador: "<=", unidade: "%", inverso: true },
        perdaPacotesInterna: { atencao: 3, critico: 10, operador: ">=", unidade: "pacotes", inverso: false },
        perdaPacotesExterna: { atencao: 3, critico: 8, operador: ">=", unidade: "pacotes", inverso: false },
        pingRotaExterna: { atencao: 100, critico: 250, operador: ">=", unidade: "ms", inverso: false },
        volumeDownload: { atencao: 15, critico: 5, operador: "<=", unidade: "MB/m", inverso: true },
        volumeUpload: { atencao: 8, critico: 3, operador: "<=", unidade: "MB/m", inverso: true },
        pacotesDownload: { atencao: 10, critico: 3, operador: "<=", unidade: "mil pacotes", inverso: true },
        pacotesUpload: { atencao: 5, critico: 2, operador: "<=", unidade: "mil pacotes", inverso: true }
    };
    const globalping = dadosRede.globalping || {
        regiao: "BR",
        perdaExternaPacotes: 0,
        perdaExternaPorc: 0,
        latenciaExternaMs: 22,
        perdaExternaPacotesGrafico: [0, 0, 0, 0, 0]
    };

    // Atualiza itens de conexões
    const elEstSmall = document.getElementById('conexoes-est-small');
    const elEstPerc = document.getElementById('conexoes-est-perc');
    const elTimeSmall = document.getElementById('conexoes-time-small');
    const elTimePerc = document.getElementById('conexoes-time-perc');
    const elCloseSmall = document.getElementById('conexoes-close-small');
    const elClosePerc = document.getElementById('conexoes-close-perc');

    if (elEstSmall) elEstSmall.textContent = `${dadosRede.conexoesEst} conexões`;
    if (elEstPerc) elEstPerc.textContent = dadosRede.conexoesPorcEst;
    if (elTimeSmall) elTimeSmall.textContent = `${dadosRede.conexoesTime} conexões`;
    if (elTimePerc) elTimePerc.textContent = dadosRede.conexoesPorcTime;
    if (elCloseSmall) elCloseSmall.textContent = `${dadosRede.conexoesClose} conexões`;
    if (elClosePerc) elClosePerc.textContent = dadosRede.conexoesPorcClose;

    // Atualiza perda de pacotes
    const elPerda = document.getElementById('rede-pacotes-perdidos-num');
    if (elPerda) elPerda.textContent = dadosRede.perdaPacotesTotal;

    // Atualiza volumes
    const elVolDown = document.getElementById('rede-vol-download');
    const elVolUp = document.getElementById('rede-vol-upload');
    if (elVolDown) elVolDown.textContent = dadosRede.volumeDownload;
    if (elVolUp) elVolUp.textContent = dadosRede.volumeUpload;

    // Atualiza pacotes
    const elPacDown = document.getElementById('rede-pac-download');
    const elPacUp = document.getElementById('rede-pac-upload');
    if (elPacDown) elPacDown.textContent = dadosRede.pacotesDownload;
    if (elPacUp) elPacUp.textContent = dadosRede.pacotesUpload;

    // Atualiza indicadores extras de KPI (tendência da última hora + limites com unidade)
    aplicarBadgeTendencia('conexoes-variacao-badge', dadosRede.conexoesEstPorcGrafico, dadosRede.conexoesVariacao, { menorPior: true });
    aplicarBadgesLimite('conexoes-limite-atencao', 'conexoes-limite-critico', limites.conexoesEstablished);

    aplicarBadgeTendencia('perda-local-variacao-badge', dadosRede.perdaPacotesGrafico, dadosRede.perdaPacotesVariacao);
    aplicarBadgeTendencia('perda-externa-variacao-badge', globalping.perdaExternaPacotesGrafico, globalping.perdaExternaVariacao);
    aplicarBadgesLimite('perda-int-limite-atencao', 'perda-int-limite-critico', limites.perdaPacotesInterna);
    aplicarBadgesLimite('perda-ext-limite-atencao', 'perda-ext-limite-critico', limites.perdaPacotesExterna);
    aplicarBadgesLimite('ping-ext-limite-atencao', 'ping-ext-limite-critico', limites.pingRotaExterna, 'Ping Ext: ');

    aplicarBadgeTendencia('vol-down-variacao-badge', dadosRede.volumeDownloadGrafico, dadosRede.volumeDownloadVariacao, { menorPior: true });
    aplicarBadgeTendencia('vol-up-variacao-badge', dadosRede.volumeUploadGrafico, dadosRede.volumeUploadVariacao, { menorPior: true });
    aplicarBadgesLimite('vol-down-limite-atencao', 'vol-down-limite-critico', limites.volumeDownload);
    aplicarBadgesLimite('vol-up-limite-atencao', 'vol-up-limite-critico', limites.volumeUpload);

    aplicarBadgeTendencia('pac-down-variacao-badge', dadosRede.pacotesDownloadGrafico, dadosRede.pacotesDownloadVariacao, { menorPior: true });
    aplicarBadgeTendencia('pac-up-variacao-badge', dadosRede.pacotesUploadGrafico, dadosRede.pacotesUploadVariacao, { menorPior: true });
    aplicarBadgesLimite('pac-down-limite-atencao', 'pac-down-limite-critico', limites.pacotesDownload);
    aplicarBadgesLimite('pac-up-limite-atencao', 'pac-up-limite-critico', limites.pacotesUpload);

    // Atualiza pílula do topo e subtítulo externo (Globalping)
    atualizarStatusGlobalping(globalping);

    criarGraficoConexoes([dadosRede.conexoesEst, dadosRede.conexoesTime, dadosRede.conexoesClose]);
    const graficoPerda = criarGraficoRede("grafico-pacotes-perdidos", dadosRede.perdaPacotesGrafico, {
        cor: "#e54d15",
        label: "Pacotes perdidos (interno)",
        unidade: "pacotes",
        dadosExternos: globalping.perdaExternaPacotesGrafico,
        corExterna: "#7c3aed",
        labelExterna: "Pacotes perdidos externos (Globalping)",
        unidadeExterna: "pacotes"
    });
    criarGraficoRedeDuasLinhas(
        "grafico-trafego-mb",
        dadosRede.volumeDownloadGrafico,
        dadosRede.volumeUploadGrafico,
        "MB/m"
    );
    criarGraficoRedeDuasLinhas(
        "grafico-trafego-pacotes",
        dadosRede.pacotesDownloadGrafico,
        dadosRede.pacotesUploadGrafico,
        "mil pacotes/m"
    );

    // Se houver host público configurado, atualiza ao vivo pela api.globalping.io
    if (globalping.targetHost) {
        const leituraAoVivo = await consultarGlobalpingAoVivo(globalping.targetHost, globalping.regiao || 'BR');
        if (leituraAoVivo) {
            const globalpingAtualizado = { ...globalping, ...leituraAoVivo };
            atualizarStatusGlobalping(globalpingAtualizado);
            if (graficoPerda && graficoPerda.data.datasets[1]) {
                const serie = graficoPerda.data.datasets[1].data;
                serie[serie.length - 1] = leituraAoVivo.perdaExternaPacotes;
                graficoPerda.update();
                aplicarBadgeTendencia('perda-externa-variacao-badge', serie, globalping.perdaExternaVariacao);
            }
        }
    }

    window.addEventListener('resize', () => {
        if (window.scrollX > 0) {
            window.scrollTo({ left: 0 });
        }
    });
});
