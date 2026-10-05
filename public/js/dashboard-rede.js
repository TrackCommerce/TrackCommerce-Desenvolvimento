const anosRede = ["2021", "2022", "2023", "2024", "2025"];

function criarGraficoRede(idCanvas, dados) {
    const canvas = document.getElementById(idCanvas);
    if (!canvas) return;

    return new Chart(canvas, {
        type: "line",
        data: {
            labels: anosRede,
            datasets: [{
                data: dados,
                borderColor: "#3b82f6",
                backgroundColor: "#3b82f6",
                borderWidth: 2.5,
                tension: 0,
                pointRadius: 2,
                pointHoverRadius: 4,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { displayColors: false }
            },
            scales: {
                x: {
                    grid: { display: false },
                    border: { display: false },
                    ticks: { color: "#92a0b8", font: { family: "Outfit", size: 10 } }
                },
                y: {
                    min: 0,
                    max: 40,
                    ticks: { stepSize: 10, color: "#92a0b8", font: { family: "Outfit", size: 10 } },
                    grid: { color: "#dfe5ee", drawTicks: false },
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
                borderColor: "#fff",
                borderWidth: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } }
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const dados = [8, 18, 20, 33, 36];

    criarGraficoConexoes();
    criarGraficoRede("grafico-pacotes-perdidos", dados);
    criarGraficoRede("grafico-download-gb", dados);
    criarGraficoRede("grafico-upload-gb", dados);
    criarGraficoRede("grafico-download-pacotes", dados);
    criarGraficoRede("grafico-upload-pacotes", dados);
});
