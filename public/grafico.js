const ctx = document.getElementById("grafico-alertas");

new Chart(ctx, {
    type: "bar",

    data: {
        labels: ["Latencia", "CPU", "Memória", "Disco"],

        datasets: [{
            label: "Quantidade de Alertas",
            data: [12, 8, 15, 6],
            backgroundColor: "orangered",
            borderRadius: 6
        }]
    },

    options: {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
            legend: {
                display: false
            }
        },

        scales: {
            x: {
                grid: {
                    display: false
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    display: false
                }
            }
        }
    }
});