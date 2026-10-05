const anos = ["2021", "2022", "2023", "2024", "2025"];

function criarGraficoLinha(idCanvas, dados) {
    const canvas = document.getElementById(idCanvas);
    if (!canvas) return;

    return new Chart(canvas, {
        type: "line",
        data: {
            labels: anos,
            datasets: [{
                data: dados,
                borderColor: "#3b82f6",
                backgroundColor: "#3b82f6",
                borderWidth: 2.5,
                tension: 0,
                pointRadius: 2,
                pointHoverRadius: 4,
                pointBackgroundColor: "#3b82f6",
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 400 },
            interaction: { intersect: false, mode: "index" },
            plugins: {
                legend: { display: false },
                tooltip: { displayColors: false }
            },
            scales: {
                x: {
                    grid: { display: false },
                    border: { display: false },
                    ticks: {
                        color: "#92a0b8",
                        font: { family: "Outfit", size: 10 }
                    }
                },
                y: {
                    min: 0,
                    max: 40,
                    ticks: {
                        stepSize: 10,
                        color: "#92a0b8",
                        font: { family: "Outfit", size: 10 }
                    },
                    grid: {
                        color: "#dfe5ee",
                        drawTicks: false
                    },
                    border: { display: false }
                }
            }
        }
    });
}

function criarGraficoConexoes() {
    const canvas = document.getElementById("grafico-conexoes");
    if (!canvas) return;

    return new Chart(canvas, {
        type: "pie",
        data: {
            labels: ["ESTABLISHED", "TIME_WAIT", "CLOSE_WAIT"],
            datasets: [{
                data: [110, 50, 40],
                backgroundColor: ["#3b82f6", "#8755ef", "#18a5dd"],
                borderColor: "#ffffff",
                borderWidth: 4,
                hoverOffset: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 400 },
            plugins: {
                legend: { display: false }
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    criarGraficoConexoes();
    criarGraficoLinha("grafico-pacotes-perdidos", [8, 18, 20, 33, 36]);

    const dadosTrafego = [8, 18, 20, 33, 36];
    criarGraficoLinha("grafico-download-gb", dadosTrafego);
    criarGraficoLinha("grafico-upload-gb", dadosTrafego);
    criarGraficoLinha("grafico-download-pacotes", dadosTrafego);
    criarGraficoLinha("grafico-upload-pacotes", dadosTrafego);
});
