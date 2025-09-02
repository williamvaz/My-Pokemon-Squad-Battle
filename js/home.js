// qualquer clique ou tecla leva para o game.html
function goToGame() {
  window.location.href = "game.html";
}

document.body.addEventListener("click", goToGame);
document.body.addEventListener("keydown", goToGame);
