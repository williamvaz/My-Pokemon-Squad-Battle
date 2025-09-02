function goToGame() {
  window.location.href = "game.html";
}

// garante que o DOM esteja pronto antes de registrar os eventos
window.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", goToGame);
  document.body.addEventListener("keydown", goToGame);
});
