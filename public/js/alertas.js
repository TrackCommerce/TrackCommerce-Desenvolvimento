// Mock do Webhook do Jira simulando retorno da API
const mockData = [
    { data: "18/08/2026 20:20:44", servidor: "Server 05", componente: "Disco", tipo: "Espaço em disco", severidade: "Crítico", status: "Pendente", reincidente: false },
    { data: "18/08/2026 20:12:12", servidor: "API Gateway", componente: "Rede / Latência", tipo: "Pico de Latência", severidade: "Aviso", status: "Em Investigação", reincidente: false },
    { data: "18/08/2026 19:44:01", servidor: "Server 04", componente: "Processamento (CPU)", tipo: "Pico de uso", severidade: "Crítico", status: "Em Investigação", reincidente: true },
    { data: "18/08/2026 19:02:50", servidor: "Server 03", componente: "Memória RAM", tipo: "Uso de RAM", severidade: "Aviso", status: "Resolvido", reincidente: false },
    { data: "18/08/2026 18:31:05", servidor: "Server 02", componente: "Rede / Latência", tipo: "Reinicialização", severidade: "Aviso", status: "Resolvido", reincidente: false },
    { data: "18/08/2026 17:15:00", servidor: "DB Master", componente: "Disco", tipo: "I/O Alto", severidade: "Crítico", status: "Pendente", reincidente: false },
    { data: "18/08/2026 16:40:22", servidor: "Cache 01", componente: "Memória RAM", tipo: "Uso de RAM", severidade: "Aviso", status: "Resolvido", reincidente: false },
    { data: "18/08/2026 15:20:10", servidor: "Server 01", componente: "Processamento (CPU)", tipo: "Pico de uso", severidade: "Aviso", status: "Pendente", reincidente: false },
    { data: "18/08/2026 14:05:00", servidor: "Worker 02", componente: "Processamento (CPU)", tipo: "Pico de uso", severidade: "Aviso", status: "Resolvido", reincidente: false },
    { data: "18/08/2026 13:30:15", servidor: "Server 04", componente: "Processamento (CPU)", tipo: "Sobrecarga de CPU", severidade: "Crítico", status: "Resolvido", reincidente: true },
    { data: "18/08/2026 12:15:40", servidor: "Cluster-BD-01", componente: "Disco", tipo: "Espaço em disco", severidade: "Crítico", status: "Resolvido", reincidente: false },
    { data: "18/08/2026 11:50:22", servidor: "Server 03", componente: "Memória RAM", tipo: "Vazamento de memória", severidade: "Aviso", status: "Resolvido", reincidente: false },
    { data: "18/08/2026 10:20:10", servidor: "Worker 01", componente: "Processamento (CPU)", tipo: "Pico de uso", severidade: "Aviso", status: "Resolvido", reincidente: false },
    { data: "18/08/2026 09:10:05", servidor: "Server 01", componente: "Processamento (CPU)", tipo: "Pico de uso", severidade: "Crítico", status: "Resolvido", reincidente: false }
];

// Estado global
let alertasFiltrados = [...mockData];
let paginaAtual = 1;
const itensPorPagina = 5;

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    calcularKPIs();
    renderizarTabela();
    inicializarGrafico();
    configurarFiltros();
});

function calcularKPIs() {
    const total = mockData.length;

    // Total de alertas
    const elTotal = document.getElementById("totalAlertasHoje");
    if (elTotal) elTotal.textContent = total;

    // Chamados Jira não respondidos (Pendente + Em Investigação)
    const naoRespondidos = mockData.filter(a => a.status === "Pendente" || a.status === "Em Investigação").length;
    const elChamados = document.getElementById("chamadosNaoRespondidos");
    if (elChamados) {
        elChamados.textContent = naoRespondidos;
        elChamados.style.color = naoRespondidos > 5 ? "#ef4444" : (naoRespondidos >= 3 ? "#f59e0b" : "#10b981");
    }

    // Taxa de Reincidência (24h) calculada a partir do JSON
    // Conta quantos alertas no JSON têm a flag reincidente: true (ou servidores repetidos)
    const contagemServidores = {};
    mockData.forEach(a => {
        contagemServidores[a.servidor] = (contagemServidores[a.servidor] || 0) + 1;
    });

    const totalReincidentes = mockData.filter(a => {
        if (typeof a.reincidente === "boolean") return a.reincidente;
        return contagemServidores[a.servidor] > 1;
    }).length;

    const taxaReinc = total > 0 ? ((totalReincidentes / total) * 100).toFixed(1) : "0.0";
    const elReinc = document.getElementById("taxaReincidencia");
    if (elReinc) {
        elReinc.textContent = taxaReinc + "%";
    }

    // Taxa de Resolução (24h) calculada a partir do JSON (status === "Resolvido")
    const totalResolvidos = mockData.filter(a => a.status === "Resolvido").length;
    const taxaRes = total > 0 ? ((totalResolvidos / total) * 100).toFixed(1) : "0.0";
    const elRes = document.getElementById("taxaResolucao");
    if (elRes) {
        elRes.textContent = taxaRes + "%";
    }
}

function renderizarTabela() {
    const tbody = document.getElementById("tabelaBody");
    tbody.innerHTML = "";

    const inicio = (paginaAtual - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;
    const alertasPagina = alertasFiltrados.slice(inicio, fim);

    alertasPagina.forEach(alerta => {
        const tr = document.createElement("tr");

        let classeSev = alerta.severidade === "Crítico" ? "sev-critico" : "sev-aviso";

        let classeStatus = "";
        if (alerta.status === "Pendente") classeStatus = "status-pendente";
        else if (alerta.status === "Em Investigação") classeStatus = "status-investigacao";
        else if (alerta.status === "Resolvido") classeStatus = "status-resolvido";

        let acao = "";
        let classeAcao = "";
        if (alerta.status === "Pendente") { acao = "Tratar"; classeAcao = ""; }
        else if (alerta.status === "Em Investigação") { acao = "Ver"; classeAcao = "ver"; }
        else { acao = "Histórico"; classeAcao = "historico"; }

        tr.innerHTML = `
            <td>${alerta.data}</td>
            <td><strong>${alerta.servidor}</strong></td>
            <td>${alerta.componente}</td>
            <td>${alerta.tipo}</td>
            <td><span class="${classeSev}">${alerta.severidade}</span></td>
            <td><span class="status-badge ${classeStatus}">${alerta.status}</span></td>
            <td><a href="#" class="action-link ${classeAcao}">${acao}</a></td>
        `;
        tbody.appendChild(tr);
    });

    atualizarPaginacao();
}

function atualizarPaginacao() {
    const totalPaginas = Math.ceil(alertasFiltrados.length / itensPorPagina);
    const info = document.getElementById("paginationInfo");

    if (alertasFiltrados.length === 0) {
        info.textContent = "Nenhum alerta encontrado";
    } else {
        const inicio = (paginaAtual - 1) * itensPorPagina + 1;
        const fim = Math.min(paginaAtual * itensPorPagina, alertasFiltrados.length);
        info.textContent = `Mostrando ${inicio} a ${fim} de ${alertasFiltrados.length} alertas`;
    }

    // Botões Anterior/Próximo
    document.getElementById("btnPrev").disabled = paginaAtual === 1;
    document.getElementById("btnNext").disabled = paginaAtual === totalPaginas || totalPaginas === 0;

    // Números das páginas
    const containerNum = document.getElementById("pageNumbers");
    containerNum.innerHTML = "";
    for (let i = 1; i <= totalPaginas; i++) {
        const btn = document.createElement("button");
        btn.className = `page-btn ${i === paginaAtual ? 'active' : ''}`;
        btn.textContent = i;
        btn.onclick = () => { paginaAtual = i; renderizarTabela(); };
        containerNum.appendChild(btn);
    }
}

// Configurar botões Prev/Next
document.getElementById("btnPrev").onclick = () => {
    if (paginaAtual > 1) { paginaAtual--; renderizarTabela(); }
};
document.getElementById("btnNext").onclick = () => {
    const totalPaginas = Math.ceil(alertasFiltrados.length / itensPorPagina);
    if (paginaAtual < totalPaginas) { paginaAtual++; renderizarTabela(); }
};

function configurarFiltros() {
    const compSelect = document.getElementById("filtroComponente");
    const sevSelect = document.getElementById("filtroSeveridade");
    const buscaInput = document.getElementById("buscaInput");

    function aplicarFiltros() {
        const comp = compSelect.value;
        const sev = sevSelect.value;
        const busca = buscaInput.value.toLowerCase();

        alertasFiltrados = mockData.filter(a => {
            let matchComp = true;
            if (comp !== "Todos") {
                if (comp === "CPU") matchComp = /cpu|processamento/i.test(a.componente);
                else if (comp === "Disco") matchComp = /disco|armazenamento/i.test(a.componente);
                else matchComp = a.componente.toLowerCase().includes(comp.toLowerCase());
            }
            const matchSev = sev === "Ambos" || a.severidade === sev;
            const matchBusca = a.servidor.toLowerCase().includes(busca) || a.tipo.toLowerCase().includes(busca);
            return matchComp && matchSev && matchBusca;
        });

        paginaAtual = 1;
        renderizarTabela();
    }

    compSelect.addEventListener("change", aplicarFiltros);
    sevSelect.addEventListener("change", aplicarFiltros);
    buscaInput.addEventListener("input", aplicarFiltros);
}

function inicializarGrafico() {
    const container = document.getElementById('chartComponentes');
    if (!container) return;

    const total = mockData.length;

    // Categorias de componentes esperadas no monitoramento
    const categorias = [
        {
            nome: 'Processamento (CPU)',
            cor: '#ef4444',
            match: comp => /cpu|processamento/i.test(comp)
        },
        {
            nome: 'Memória (RAM)',
            cor: '#f59e0b',
            match: comp => /memória|memoria|ram/i.test(comp)
        },
        {
            nome: 'Armazenamento',
            cor: '#3b82f6',
            match: comp => /disco|armazenamento|hd|ssd/i.test(comp)
        },
        {
            nome: 'Rede / Latência',
            cor: '#10b981',
            match: comp => /rede|latência|latencia|conexão|conexao/i.test(comp)
        }
    ];

    // Calcula a quantidade real de ocorrências e a porcentagem relativa ao total de alertas do JSON
    const distribuicao = categorias.map(cat => {
        const quantidade = mockData.filter(a => cat.match(a.componente)).length;
        const porcentagem = total > 0 ? Math.round((quantidade / total) * 100) : 0;

        return {
            nome: cat.nome,
            quantidade: quantidade,
            porcentagem: porcentagem,
            cor: cat.cor
        };
    });

    // Renderiza as barras com as porcentagens e larguras dinâmicas
    container.innerHTML = distribuicao.map(item => `
        <div class="comp-item">
            <div class="comp-header">
                <span class="comp-label">${item.nome}</span>
                <span class="comp-val">${item.porcentagem}%</span>
            </div>
            <div class="comp-track">
                <div class="comp-bar" style="width: ${item.porcentagem}%; background-color: ${item.cor};"></div>
            </div>
        </div>
    `).join('');
}