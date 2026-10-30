function criarGraficoRede(idCanvas, dados, { cor = '#0284c7', label = 'Tráfego', unidade = 'MB/m', max = null, passo = null } = {}) {
    const canvas = document.getElementById(idCanvas);
    if (!canvas) return;

    const labels = dados.map((_, i) => i);

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
                tension: 0.15,
                borderJoinStyle: 'round',
                borderCapStyle: 'round',
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

function criarGraficoConexoes() {
    const canvas = document.getElementById("grafico-conexoes");
    if (!canvas) return;

    return new Chart(canvas, {
        type: "doughnut",
        data: {
            labels: ["ESTABLISHED", "TIME_WAIT", "CLOSE_WAIT"],
            datasets: [{
                data: [110, 50, 40],
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
            cutout: "68%",
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

document.addEventListener("DOMContentLoaded", () => {
    criarGraficoConexoes();
    criarGraficoRede("grafico-pacotes-perdidos", [12, 18, 14, 25, 20, 32, 28, 36], {
        cor: "#e54d15",
        label: "Pacotes perdidos",
        unidade: "pacotes"
    });
    criarGraficoRede("grafico-download-gb", [35, 48, 52, 45, 60, 68, 72, 75], {
        cor: "#0284c7",
        label: "Download",
        unidade: "MB/m"
    });
    criarGraficoRede("grafico-upload-gb", [14, 20, 18, 22, 28, 25, 32, 30], {
        cor: "#f59e0b",
        label: "Upload",
        unidade: "MB/m"
    });
    criarGraficoRede("grafico-download-pacotes", [15, 22, 20, 26, 31, 29, 34, 36], {
        cor: "#0284c7",
        label: "Download",
        unidade: "mil pacotes/m"
    });
    criarGraficoRede("grafico-upload-pacotes", [8, 12, 11, 14, 16, 15, 17, 18], {
        cor: "#f59e0b",
        label: "Upload",
        unidade: "mil pacotes/m"
    });

    window.addEventListener('resize', () => {
        if (window.scrollX > 0) {
            window.scrollTo({ left: 0 });
        }
    });
});
