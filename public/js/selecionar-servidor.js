let id = sessionStorage.ID_USUARIO;
console.log(id)

window.onload = listarInstancias;

function listarInstancias(){
        fetch(`/instancia/listar/${id}`)
        .then(resposta => resposta.json())
        .then(resposta => {

            const card = document.getElementById("instancia");  

            if (resposta != null){
                for (let i = 0; i < resposta.length; i++) {
                    card.innerHTML += `
                        <div class="card">
                            <div class="texto">
                                <h2>${resposta[i].nome}</h2>
                            </div>

                            <button class="botao" onclick="redirecionar()"><img src="./assets/imgs/arrow-right.png" alt=""></button>

                        </div>
                `;
                }
            } else{
                card.innerHTML = `
                    <h1>Sem instâncias cadastradas<h1/>
                `
            }

        })
        .catch(erro => {
            console.error("Erro ao listar instâncias:", erro);
        });
}