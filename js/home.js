window.addEventListener("DOMContentLoaded", () => {
  const music = document.getElementById("bgMusic");

  // Só inicia a música depois da primeira interação (necessário em navegadores)
  function initMusic() {
    if (music.paused) {
      music.volume = 0.5; // Ajuste do volume
      music.play().catch(err => console.log("Autoplay bloqueado:", err));
    }
  }

  // Avança para o game e para a música
  function goToGame() {
    music.pause();
    window.location.href = "game.html";
  }

  // Primeiro clique/tecla inicia música
  document.body.addEventListener("click", initMusic, { once: true });
  document.body.addEventListener("keydown", initMusic, { once: true });

  // Depois qualquer clique/tecla sai para o game
  document.body.addEventListener("click", goToGame);
  document.body.addEventListener("keydown", goToGame);
});
