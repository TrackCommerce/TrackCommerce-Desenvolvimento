let emailEditando = null;

const funcionariosMock = [
    { nome: "Carlos", cargo: "Analista de Infra", permissoes: "Monitoramento", email: "CarlosEdu@email.com", contato: "(11) 96796-6767" },
    { nome: "Ana Silva", cargo: "Desenvolvedora Front-end", permissoes: "Leitura/Escrita", email: "ana.silva@email.com", contato: "(11) 98888-1111" },
    { nome: "João Pedro", cargo: "Gerente de Projetos", permissoes: "Administrador", email: "joao.gp@email.com", contato: "(11) 97777-2222" },
    { nome: "Mariana Souza", cargo: "Designer UX/UI", permissoes: "Leitura", email: "mari.ux@email.com", contato: "(21) 99999-3333" },
];

for(let i = 5; i <= 20; i++) {
    funcionariosMock.push({
        nome: `Funcionário Nome ${i}`,
        cargo: `Cargo Genérico ${i}`,
        permissoes: "Permissões Padrão",
        email: `funcionario${i}@email.com`,
        contato: "(00) 00000-0000"
    });
}

const divLista = document.getElementById('lista-funcionarios');
const inputPesquisa = document.getElementById('campo-pesquisa');
const selectFiltro = document.getElementById('seletor-filtro');

function cancelarEdicao() {
    document.getElementById('registro-nome').value = "";
    document.getElementById('registro-cargo').value = "";
    document.getElementById('registro-ctt').value = "";
    document.getElementById('registro-email').value = "";

    emailEditando = null;

    document.querySelector('.botao-salvar').innerText = "Salvar usuário";
    document.getElementById('btn-cancelar').style.display = "none";

    const radios = document.getElementsByName('selecao-func');
    radios.forEach(radio => radio.checked = false);
}
function preencherFormulario(emailClicado) {
    const func = funcionariosMock.find(f => f.email === emailClicado);
    
    if(func) {
        document.getElementById('registro-nome').value = func.nome;
        document.getElementById('registro-cargo').value = func.cargo;
        document.getElementById('registro-ctt').value = func.contato;
        document.getElementById('registro-email').value = func.email;
        
        emailEditando = func.email;
        document.querySelector('.botao-salvar').innerText = "Atualizar usuário";
        
        document.getElementById('btn-cancelar').style.display = "block";
        document.getElementById('btn-deletar').style.display = "block";

        document.getElementById('btn-deletar').style.display = "none";

        const radios = document.getElementsByName('selecao-func');
        radios.forEach(radio => radio.checked = false); 
    }
}

function renderizarLista(dados) {
    divLista.innerHTML = ''; 
    
    if(dados.length === 0) {
        divLista.innerHTML = '<p style="text-align:center; margin-top:20px; color:#555;">Nenhum funcionário encontrado.</p>';
        return;
    }

    dados.forEach(func => {
        const cartao = document.createElement('div');
        cartao.className = 'cartao-funcionario';
        
        cartao.innerHTML = `
            <div class="info-cartao">
                <div class="coluna">
                    <span>Funcionario: ${func.nome}</span>
                    <span>Cargo: ${func.cargo}</span>
                    <span>Permissões: ${func.permissoes}</span>
                </div>
                <div class="coluna">
                    <span>Email: ${func.email}</span>
                    <span>Contato: ${func.contato}</span>
                </div>
            </div>
            <div class="botao-radio">
                <!-- Adicionamos o input radio aqui -->
                <input type="radio" name="selecao-func" onchange="preencherFormulario('${func.email}')">
            </div>
        `;
        
        divLista.appendChild(cartao);
    });
}


function preencherFormulario(emailClicado) {
    const func = funcionariosMock.find(f => f.email === emailClicado);
    
    if(func) {
        document.getElementById('registro-nome').value = func.nome;
        document.getElementById('registro-cargo').value = func.cargo;
        document.getElementById('registro-ctt').value = func.contato;
        document.getElementById('registro-email').value = func.email;
        
        emailEditando = func.email;
        
        document.querySelector('.botao-salvar').innerText = "Atualizar usuário";
    }
}
function filtrarFuncionarios() {
    const termoPesquisado = inputPesquisa.value.toLowerCase();
    const filtroSelecionado = selectFiltro.value; 

    const dadosFiltrados = funcionariosMock.filter(func => {
        
        const valorDoCampo = String(func[filtroSelecionado]).toLowerCase();
        
        
        return valorDoCampo.includes(termoPesquisado);
    });

    renderizarLista(dadosFiltrados);
}


inputPesquisa.addEventListener('input', filtrarFuncionarios);
selectFiltro.addEventListener('change', filtrarFuncionarios);


renderizarLista(funcionariosMock);

function registrarFunc(){
    let nomeReg = document.getElementById('registro-nome').value.trim();
    let cargoReg = document.getElementById('registro-cargo').value.trim();
    let contatoReg = document.getElementById('registro-ctt').value.trim();
    let emailReg = document.getElementById('registro-email').value.trim();
    let aviso = document.getElementById('aviso');

    if(nomeReg.length < 2){
        aviso.innerText = "Funcionário sem nome";
        return;
    } else if(cargoReg.length < 2){
        aviso.innerText = "Funcionário sem cargo";
        return;
    } else if(contatoReg.length !== 11){
        aviso.innerText = "Número inválido (deve ter 11 dígitos)";
        return;
    } else if(!emailReg.includes("@") || !emailReg.includes(".")){
        aviso.innerText = "Email inválido";
        return;
    }

    aviso.innerText = "";

    if (emailEditando !== null) {
        const index = funcionariosMock.findIndex(f => f.email === emailEditando);
        
        if (index !== -1) {
            funcionariosMock[index].nome = nomeReg;
            funcionariosMock[index].cargo = cargoReg;
            funcionariosMock[index].contato = contatoReg;
            funcionariosMock[index].email = emailReg;
        }
        
        emailEditando = null;
        document.querySelector('.botao-salvar').innerText = "Salvar usuário";
        
    } else {
        funcionariosMock.push({
            nome: nomeReg,
            cargo: cargoReg,
            permissoes: "Permissões Padrão",
            email: emailReg,
            contato: contatoReg
        });
    }

    document.getElementById('registro-nome').value = "";
    document.getElementById('registro-cargo').value = "";
    document.getElementById('registro-ctt').value = "";
    document.getElementById('registro-email').value = "";

    document.getElementById('btn-cancelar').style.display = "none";
    renderizarLista(funcionariosMock);
}

function deletarFunc() {
    if (emailEditando !== null) {
        if (confirm("Tem certeza que deseja excluir este funcionário?")) {
            
            const index = funcionariosMock.findIndex(f => f.email === emailEditando);
            
            if (index !== -1) {
                funcionariosMock.splice(index, 1); 
            }
            
            cancelarEdicao();
            renderizarLista(funcionariosMock);
        }
    }
}