function criarGraficoRede(idCanvas, dados, { cor = '#0284c7', label = 'Tráfego', unidade = 'MB/m', max = null, passo = null } = {}) {
    const canvas = document.getElementById(idCanvas);
    if (!canvas) return;

    const labels = ['12:00', '12:15', '12:30', '12:45', 'Agora'];

    return new Chart(canvas, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
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
            }]
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
                            return ` ${label}: ${context.parsed.y} ${unidade}`;
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
                    max: max || undefined,
                    ticks: { display: false, stepSize: passo || undefined },
                    grid: { color: '#e6e9ef', drawTicks: false },
                    border: { display: false, dash: [4, 4] }
                }
            }
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

function criarGraficoRedeDuasLinhas(idCanvas, dadosDownload, dadosUpload, unidade = 'MB/m') {
    const canvas = document.getElementById(idCanvas);
    if (!canvas) return null;

    const labels = ['12:00', '12:15', '12:30', '12:45', 'Agora'];

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
                    ticks: { display: false },
                    grid: { color: '#e6e9ef', drawTicks: false },
                    border: { display: false, dash: [4, 4] }
                }
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const servidor = (typeof obterServidorAtual === 'function')
        ? obterServidorAtual()
        : (window.DADOS_MOCKADOS ? window.DADOS_MOCKADOS.atencao : null);

    const dadosRede = servidor ? servidor.rede : {
        conexoesEst: 110,
        conexoesTime: 50,
        conexoesClose: 40,
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

    criarGraficoConexoes([dadosRede.conexoesEst, dadosRede.conexoesTime, dadosRede.conexoesClose]);
    criarGraficoRede("grafico-pacotes-perdidos", dadosRede.perdaPacotesGrafico, {
        cor: "#e54d15",
        label: "Pacotes perdidos",
        unidade: "pacotes"
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

    window.addEventListener('resize', () => {
        if (window.scrollX > 0) {
            window.scrollTo({ left: 0 });
        }
    });
});
