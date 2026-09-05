let emailEditando = null;
let idEditando = null;

document.getElementById('btn-atualizar').style.display = "none";

const funcionarios = [
    // { nome: "Carlos", cargo: "Analista de Infra", permissoes: "Monitoramento", email: "CarlosEdu@email.com", contato: "11967966767" },
    // { nome: "Ana Silva", cargo: "Desenvolvedora Front-end", permissoes: "Leitura/Escrita", email: "ana.silva@email.com", contato: "11988881111" },
    // { nome: "João Pedro", cargo: "Gerente de Projetos", permissoes: "Administrador", email: "joao.gp@email.com", contato: "11977772222" },
    // { nome: "Mariana Souza", cargo: "Designer UX/UI", permissoes: "Leitura", email: "mari.ux@email.com", contato: "21999993333" },
];

// for(let i = 5; i <= 20; i++) {
//     funcionarios.push({
//         nome: `Funcionário Nome ${i}`,
//         cargo: `Cargo Genérico ${i}`,
//         permissoes: "Permissões Padrão",
//         email: `funcionario${i}@email.com`,
//         contato: "00000000000"
//     });
// }

window.onload = function () {
    listarFunc();
    listarCargos();
}

function listarFunc(){
    fetch("/usuario/listar").then(function (resposta) {
        if (resposta.ok) {
            if (resposta.status == 204) {
                aviso.innerText = "Nenhum resultado encontrado"
            }

            resposta.json().then(function (resposta){
                console.log("Dados recebido: ", JSON.stringify(resposta))

                if (resposta.length === 0){
                    divLista.innerHTML = '<p style="text-align:center; margin-top:20px; color:#555;">Nenhum funcionário encontrado.</p>';
                    return;
                }
                
                resposta.forEach(func =>{
                    funcionarios.push({
                        id: func.id_usuario,
                        nome: func.nome,
                        cargo: func.nome_cargo,
                        email: func.email,
                        contato: func.celular
                    })
                })
                
                console.log(funcionarios)
                renderizarLista(funcionarios)
                return false
                
            })
        }
    })
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
    const func = funcionarios.find(f => f.email === emailClicado);
    
    if(func) {
        document.getElementById('registro-nome').value = func.nome;
        document.getElementById('registro-cargo').value = func.cargo;
        document.getElementById('registro-ctt').value = func.contato;
        document.getElementById('registro-email').value = func.email;
        
        emailEditando = func.email;
        idEditando = func.id;
        //document.querySelector('.botao-salvar').innerText = "Atualizar usuário";
        document.getElementById('btn-salvar').style.display = "none";
        document.getElementById('btn-atualizar').style.display = "block";
        document.getElementById('btn-cancelar').style.display = "block";
        document.getElementById('btn-deletar').style.display = "block";


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
                    <span>Contato: ${formatarParaExibicao(func.contato)}</span>
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

function filtrarFuncionarios() {
    const termoPesquisado = inputPesquisa.value.toLowerCase();
    const filtroSelecionado = selectFiltro.value; 

    const dadosFiltrados = funcionarios.filter(func => {
        
        const valorDoCampo = String(func[filtroSelecionado]).toLowerCase();
        
        
        return valorDoCampo.includes(termoPesquisado);
    });

    renderizarLista(dadosFiltrados);
}


inputPesquisa.addEventListener('input', filtrarFuncionarios);
selectFiltro.addEventListener('change', filtrarFuncionarios);


function registrarFunc(){
    let nomeReg = document.getElementById('registro-nome').value.trim();
    let cargoReg = document.getElementById('registro-cargo').value.trim();
    let contatoReg = document.getElementById('registro-ctt').value.replace(/\D/g, "");
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

    let emailEmUso = funcionarios.some(f => f.email === emailReg && f.email !== emailEditando);
    let contatoEmUso = funcionarios.some(f => f.contato === contatoReg && f.email !== emailEditando);

    if (emailEmUso){
        aviso.innerText = "Email já cadastrado";
        return; 
    } else if (contatoEmUso){
        aviso.innerText = "Contato já cadastrado";
        return; 
    }

    aviso.innerText = "";

    if (emailEditando !== null) {
        const index = funcionarios.findIndex(f => f.email === emailEditando);
        
        if (index !== -1) {
            funcionarios[index].nome = nomeReg;
            funcionarios[index].cargo = cargoReg;
            funcionarios[index].contato = contatoReg;
            funcionarios[index].email = emailReg;
        }
        
        emailEditando = null;
        document.querySelector('.botao-salvar').innerText = "Salvar usuário";
        
    } else {
        funcionarios.push({
            nome: nomeReg,
            cargo: cargoReg,
            email: emailReg,
            contato: contatoReg
        });

        fetch("/usuario/cadastrar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            nomeServer: nomeReg,
            emailServer: emailReg,
            contatoServer: contatoReg,
            cargoServer: cargoReg
        }),

    }).then(function (resposta) {

        console.log("resposta: ", resposta);

        if (resposta.ok) {
            //cardErro.style.display = "block";

            alert("Cadastro foi realizado com sucesso!");

            //sessionStorage.clear();

            // setTimeout(() => {
            //     window.location.href = "../registroFunc.html";
            // }, 2000);
            //limparFormulario();
            listarFunc(funcionarios);

        } else {

            resposta.text().then((texto) => {
                console.log(texto);

                if (
                    texto.includes("Duplicate")
                ) {
                    alert("Este email já está cadastrado")
                }


            })

        }

    }).catch(function (erro) {

        console.log(`#ERRO: ${erro}`);
        alert("Erro ao cadastrar.");

    });

    return false;
    }

    document.getElementById('registro-nome').value = "";
    document.getElementById('registro-cargo').value = "";
    document.getElementById('registro-ctt').value = "";
    document.getElementById('registro-email').value = "";

    document.getElementById('btn-cancelar').style.display = "none";
    renderizarLista(funcionarios);
}

function deletarFunc() {
    if (emailEditando !== null) {

        if (confirm("Tem certeza que deseja excluir este funcionário?")) {

            const func = funcionarios.find(f => f.email === emailEditando);

            if (!func) {
                alert("Funcionário não encontrado.");
                return;
            }

            const id = func.id;

            fetch("/usuario/deletar", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    idServer: id
                })
            })
            .then(function (resposta) {
                if (resposta.ok) {
                    alert("Funcionário deletado com sucesso!");
                    const index = funcionarios.findIndex(f => f.id === id);

                    if (index !== -1) {
                        funcionarios.splice(index, 1);
                    }

                    cancelarEdicao();
                    listarFunc(funcionarios);

                } else {
                    alert("Erro ao deletar funcionário.");
                }
            })
            .catch(function (erro) {
                console.log("Erro:", erro);
                alert("Erro ao conectar com o servidor.");
            });
        }
    }
}

function mascaraTelefone(input) {
    let valor = input.value.replace(/\D/g, "");

    if (!valor) {
        input.value = "";
        return;
    }

    valor = valor.replace(/^(\d{2})(\d)/g, "($1) $2");
    
    valor = valor.replace(/(\d)(\d{4})$/, "$1-$2");
    input.value = valor;
}

function formatarParaExibicao(numero) {
    let valor = String(numero).replace(/\D/g, "");
    
    if (valor.length === 11) {
        return valor.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
    }
    return numero;
}

function atualizarFunc(){
    const func = funcionarios.find(f => f.email === emailEditando);

    if (!func) {
        alert("Funcionário não encontrado.");
        return;
    }

    const id = func.id;

    let nomeAtt = document.getElementById('registro-nome').value.trim();
    let cargoAtt = document.getElementById('registro-cargo').value.trim();
    let contatoAtt = document.getElementById('registro-ctt').value.replace(/\D/g, "");
    let emailAtt = document.getElementById('registro-email').value.trim();
    let aviso = document.getElementById('aviso');
    

    if(nomeAtt.length < 2){
        aviso.innerText = "Funcionário sem nome";
        return;
    } else if(cargoAtt.length < 2){
        aviso.innerText = "Funcionário sem cargo";
        return;
    } else if(contatoAtt.length !== 11){
        aviso.innerText = "Número inválido (deve ter 11 dígitos)";
        return;
    } else if(!emailAtt.includes("@") || !emailAtt.includes(".")){
        aviso.innerText = "Email inválido";
        return;
    }

    let emailEmUso = funcionarios.some(f => f.email === emailAtt && f.email !== emailEditando);
    let contatoEmUso = funcionarios.some(f => f.contato === contatoAtt && f.email !== emailEditando);


    if (emailEmUso){
        aviso.innerText = "Email já cadastrado";
        return; 
    } else if (contatoEmUso){
        aviso.innerText = "Contato já cadastrado";
        return; 
    }

    fetch("/usuario/editar", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            idServer: id,
            nomeServer: nomeAtt,
            emailServer: emailAtt,
            contatoServer: contatoAtt,
            cargoServer: cargoAtt
        }),

        })    .then(function (resposta) {

        if (resposta.ok) {
            alert("Atualização foi realizada com sucesso!");

            // setTimeout(() => {
            //     window.location.href = "../registroFunc.html";
            // }, 200);

            listarFunc(funcionarios);

        } else {
            resposta.text().then(texto => {
                console.log(texto);
            });
        }

    })
    .catch(function (erro) {
        console.log(`#ERRO: ${erro}`);
        alert("Erro ao atualizar funcionário.");
    });
}

function deletarFunc() {

    if (idEditando === null) {
        alert("Nenhum funcionário selecionado.");
        return;
    }

    if (confirm("Tem certeza que deseja excluir este funcionário?")) {

        fetch("/usuario/deletar", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                idServer: idEditando
            })
        })
        .then(function (resposta) {
            if (resposta.ok) {
                alert("Funcionário deletado com sucesso!");

                const index = funcionarios.findIndex(f => f.id === idEditando);

                if (index !== -1) {
                    funcionarios.splice(index, 1);
                }

                cancelarEdicao();
                
                renderizarLista(funcionarios);

            } else {
                alert("Erro ao deletar funcionário.");
            }
        })
        .catch(function (erro) {
            console.log("Erro:", erro);
            alert("Erro ao conectar com o servidor.");
        });
    }

    document.getElementById('btn-atualizar').style.display = 'none';
    document.getElementById('btn-salvar').style.display = 'block'
}

function listarCargos(){
        fetch("/cargo/listar")
        .then(resposta => resposta.json())
        .then(cargos => {

            const select = document.getElementById("registro-cargo");  

            select.innerHTML = `
                <option value="" disabled selected hidden>
                    Selecione um cargo
                </option>
            `;

            cargos.forEach(cargo => {
                const option = document.createElement("option");
                option.value = cargo.nome_cargo;
                option.textContent = cargo.nome_cargo;
                
                select.appendChild(option);
                //console.log(cargos.carrgo.id_cargo)
            });

        })
        .catch(erro => {
            console.error("Erro ao listar cargos:", erro);
        });
}