const usernameElement = document.querySelector("#id_username");

if (usernameElement) {
    usernameElement.textContent = sessionStorage.getItem("NOME_USUARIO") || "";
}
