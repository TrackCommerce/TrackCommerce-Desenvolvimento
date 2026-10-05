with open("/home/enzo/21CCOA/05-Projeto-Interdisciplinar/TrackCommerce-Desenvolvimento/public/dashboard/dashboard-ram.html", "r") as f:
    lines = f.readlines()

new_main = """    <main>
        <header class="topbar">
            <h1 class="title-orange">DASHBOARD RAM</h1>
            <div class="topbar-right">
                <button class="menu-btn" aria-label="Abrir menu">
                    <img src="../assets/imgs/menu.svg" alt="Menu">
                </button>
            </div>
        </header>

        <div class="dashboard-grid">
            <div class="col-left">
                <!-- USO TOTAL, DISPONÍVEL E USADO -->
                <section class="card card-uso-total">
                    <h2 class="card-title">USO TOTAL, DISPONÍVEL E USADO</h2>
                    <div class="bar-chart-container">
                        <div class="bar-used" style="width: 80%;"></div>
                        <div class="bar-free" style="width: 20%;"></div>
                    </div>
                    <div class="legend-list">
                        <div class="legend-item">
                            <div><span class="dot d-total"></span> Total Instalado</div>
                            <span class="val-bold">16.0 GB</span>
                        </div>
                        <div class="legend-item">
                            <div><span class="dot d-used"></span> Memória Usada</div>
                            <span class="val-bold">12.8 GB</span>
                        </div>
                        <div class="legend-item">
                            <div><span class="dot d-free"></span> Disponível</div>
                            <span class="val-bold">3.2 GB</span>
                        </div>
                    </div>
                </section>

                <!-- PORCENTAGEM RAM -->
                <section class="card card-porcentagem">
                    <h2 class="card-title">PORCENTAGEM RAM</h2>
                    <div class="metric-container">
                        <div class="chart-box-large"><canvas id="grafico-porcentagem"></canvas></div>
                        <div class="metric-value-container">
                            <div class="metric-value">80%</div>
                            <div class="metric-subtitle">USO ATUAL</div>
                        </div>
                    </div>
                    <div class="axis"><span>12:00</span><span>14:00</span><span>16:00</span></div>
                </section>

                <!-- TOP 5 PROCESSOS RAM -->
                <section class="card card-processes">
                    <h2 class="card-title">TOP 5 PROCESSOS RAM</h2>
                    <table>
                        <thead>
                            <tr><th>PID</th><th>NAME</th><th class="num">CPU%</th><th class="num">RAM%</th></tr>
                        </thead>
                        <tbody>
                            <tr><td class="pid">3104</td><td>rtgtrgrt</td><td class="num">12.4%</td><td class="num bold-red">32.1%</td></tr>
                            <tr><td class="pid">1923</td><td>gdfgdfg</td><td class="num">4.2%</td><td class="num bold-red">18.5%</td></tr>
                            <tr><td class="pid">0844</td><td>dgdfgdgdf</td><td class="num">8.1%</td><td class="num bold-red">12.0%</td></tr>
                            <tr><td class="pid">5221</td><td>grgdfd</td><td class="num">1.5%</td><td class="num bold-red">4.7%</td></tr>
                            <tr><td class="pid">4102</td><td>gdfgfgdgd</td><td class="num">0.8%</td><td class="num bold-red">1.2%</td></tr>
                        </tbody>
                    </table>
                </section>
            </div>

            <div class="col-right">
                <div class="top-row-right">
                    <!-- SWAP -->
                    <section class="card card-swap">
                        <h2 class="card-title">SWAP</h2>
                        <div class="doughnut-container">
                            <div class="doughnut-chart-box-swap"><canvas id="grafico-swap"></canvas></div>
                            <div class="total-center">
                                <div style="display: flex; flex-direction: column; align-items: center;">
                                    <span class="total-val">8GB</span>
                                    <span class="total-lbl">TOTAL</span>
                                </div>
                            </div>
                        </div>
                        <div class="swap-legend">
                            <div class="legend-item-inline">
                                <div><span class="dot d-usando"></span> Usando</div>
                                <div class="val-bold">
                                    <div style="text-align: right;">2.0 GB (25%)</div>
                                </div>
                            </div>
                            <div class="legend-item-inline">
                                <div><span class="dot d-livre"></span> Livre</div>
                                <div class="val-bold">
                                    <div style="text-align: right;">6.0 GB (75%)</div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- USO POR MODO -->
                    <section class="card card-modo">
                        <h2 class="card-title">USO POR MODO</h2>
                        <div class="doughnut-container">
                            <div class="doughnut-chart-box-modo"><canvas id="grafico-modo"></canvas></div>
                        </div>
                        <div class="modo-legend">
                            <div class="legend-item-inline"><span><span class="dot c-cached"></span> Cached</span> <span class="val-bold">25%</span></div>
                            <div class="legend-item-inline"><span><span class="dot c-buffers"></span> Buffers</span> <span class="val-bold">15%</span></div>
                            <div class="legend-item-inline"><span><span class="dot c-shared"></span> Shared</span> <span class="val-bold">5%</span></div>
                            <div class="legend-item-inline"><span><span class="dot c-slab"></span> Slab</span> <span class="val-bold">10%</span></div>
                            <div class="legend-item-inline"><span><span class="dot c-available"></span> Available</span> <span class="val-bold">45%</span></div>
                        </div>
                    </section>
                </div>

                <!-- BUFFERS & CACHE -->
                <section class="card card-buffers">
                    <h2 class="card-title">BUFFERS & CACHE</h2>
                    <div class="legend-load">
                        <span><span class="dot d-used-line"></span> USED</span>
                        <span><span class="dot d-buffer-line"></span> BUFFER & CACHE</span>
                    </div>
                    <div class="chart-box-buffers"><canvas id="grafico-buffers"></canvas></div>
                </section>
            </div>
        </div>
    </main>
"""

with open("/home/enzo/21CCOA/05-Projeto-Interdisciplinar/TrackCommerce-Desenvolvimento/public/dashboard/dashboard-ram.html", "w") as f:
    f.writelines(lines[:80] + [new_main + "\n"] + lines[184:])

