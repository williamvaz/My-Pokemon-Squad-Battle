
// Este é o esqueleto inicial do JS
// Ainda será completado com filtros, ordenações, interações, evoluções etc.

document.addEventListener("DOMContentLoaded", () => {
  const pokecoinsEl = document.getElementById("pokecoins");
  const megarocksEl = document.getElementById("megarocks");
  const grid = document.getElementById("pokemon-grid");

  const pokemons = JSON.parse(localStorage.getItem("pokemons")) || [];
  pokecoinsEl.textContent = localStorage.getItem("Pokemoedas") || 0;
  megarocksEl.textContent = localStorage.getItem("Mega Rock") || 0;

  // Exibir todos os pokémons inicialmente
  pokemons.forEach(p => {
    const div = document.createElement("div");
    div.classList.add("pokemon-card");
div.innerHTML = `
  <div class="pokemon-inner">
    <img class="pokemon-image" src="pokemons/normal/${p.ID.padStart(4, '0')}.png" alt="${p.Name}">
    <div class="pokemon-name">${p.Name}</div>
    <div class="pokemon-bottom">
      <div class="types">
        <img src="types/${p["Type 1"]}.png" alt="${p["Type 1"]}" class="type-icon">
        ${p["Type 2"] && p["Type 2"] !== "" ? `<img src="types/${p["Type 2"]}.png" alt="${p["Type 2"]}" class="type-icon">` : ""}
      </div>
      <div class="cp-label">CP: ${p.CP}</div>
    </div>
  </div>`;

    grid.appendChild(div);
  });
});
