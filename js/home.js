window.addEventListener("DOMContentLoaded", () => {
  const music = document.getElementById("bgMusic");
  let started = false; // controla se a música já começou

  function handleInteraction() {
    if (!started) {
      // Primeiro clique → inicia música
      music.volume = 0.5;
      music.play().catch(err => console.log("Autoplay bloqueado:", err));
      started = true;
    } else {
      // Segundo clique → para música e sai da tela
      music.pause();
localStorage.removeItem("pokemons");
localStorage.removeItem("rodadas_finalizadas");
localStorage.removeItem("Pokemoedas");
localStorage.removeItem("Mega Rock");

window.location.href = "iniciais.html";
    }
  }

  document.body.addEventListener("click", handleInteraction);
  document.body.addEventListener("keydown", handleInteraction);
});
