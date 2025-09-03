
let allPokemons = [];
let selectedType = null;
let currentSort = { field: "CP", order: "desc" };

window.onload = async () => {
  const storage = localStorage.getItem("pokemons");
  allPokemons = JSON.parse(storage) || [];

  renderTypeFilters();
  renderPokemonGrid();

  document.getElementById("sortSelector").addEventListener("change", e => {
    const [field, order] = e.target.value.split("-");
    currentSort = { field, order };
    renderPokemonGrid();
  });

  document.getElementById("proceedBtn").addEventListener("click", () => {
    const rodadas = parseInt(localStorage.getItem("rodadas finalizadas") || 0);
    window.location.href = rodadas >= 20 ? "deck.html" : "explorar.html";
  });
};

function renderTypeFilters() {
  const types = [...new Set(allPokemons.flatMap(p => [p["Type 1"], p["Type 2"]].filter(Boolean)))];
  const container = document.getElementById("typeFilters");
  container.innerHTML = "";
  types.forEach(type => {
    const btn = document.createElement("button");
    btn.className = "type-filter";
    btn.innerHTML = `<img src="types/${type}.png" class="type-icon"> ${type}`;
    btn.onclick = () => {
      selectedType = selectedType === type ? null : type;
      renderPokemonGrid();
    };
    container.appendChild(btn);
  });
}

function renderPokemonGrid() {
  let pokemons = [...allPokemons];

  if (selectedType) {
    pokemons = pokemons.filter(p => p["Type 1"] === selectedType || p["Type 2"] === selectedType);
  }

  const { field, order } = currentSort;
  pokemons.sort((a, b) => {
    const aVal = parseFloat(a[field]) || 0;
    const bVal = parseFloat(b[field]) || 0;
    return order === "asc" ? aVal - bVal : bVal - aVal;
  });

  const grid = document.getElementById("pokemonGrid");
  grid.innerHTML = "";

  pokemons.forEach(pokemon => {
    const card = document.createElement("div");
    card.className = "pokemon-card";
    card.innerHTML = `
      <img src="pokemons/normal/${pokemon.ID.toString().padStart(4, "0")}.png" style="width: 80px;"><br>
      <strong>${pokemon.Name}</strong><br>
      <div class="types">
        <img src="types/${pokemon["Type 1"]}.png" class="type-icon">
        ${pokemon["Type 2"] ? `<img src="types/${pokemon["Type 2"]}.png" class="type-icon">` : ""}
      </div>
    `;
    card.onclick = () => showDetails(pokemon);
    grid.appendChild(card);
  });
}

function showDetails(pokemon) {
  alert("Detalhes futuros para " + pokemon.Name);
}
