const btnMenu = document.getElementById('btn-menu');
const overlay = document.getElementById('menu-overlay');
 
function abrirMenu() {
  overlay.hidden = false;
  overlay.querySelector('.menu-opcao').focus();
}
 
function fecharMenu() {
  overlay.hidden = true;
  btnMenu.focus();
}
 
btnMenu.addEventListener('click', abrirMenu);
 
overlay.addEventListener('click', (e) => {
  if (e.target === overlay) fecharMenu();
});
 

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !overlay.hidden) fecharMenu();
});
 
