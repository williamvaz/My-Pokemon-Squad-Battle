const container = document.getElementById("pokemonContainer");
const bgm = document.getElementById("bgm");

async function loadJSON(path) {
  const response = await fetch(path);
  return await response.json();
}

// Sorteia chance de shiny
function isShiny() {
  return Math.random() < 0.002;
}

// Formata ID em 4 dígitos
function formatId(id) {
  return id.toString().padStart(4, "0");
}

// Cria card HTML
function createCard(pokemon, shiny) {
  const idFormatado = formatId(pokemon.ID);
  const imgPath = shiny
    ? `pokemons/shiny/${idFormatado}-shiny.png`
    : `pokemons/normal/${idFormatado}.png`;

  const card = document.createElement("div");
  card.className = "pokemon-card";
  card.innerHTML = `
    <img src="${imgPath}" alt="${pokemon.Nome}">
    <div class="pokemon-name">${pokemon.Nome}</div>
    <div class="pokemon-types">
      <img src="types/${pokemon.Tipo[0]}.png" alt="${pokemon.Tipo[0]}" class="type-icon" />
      ${pokemon.Tipo[1] ? `<img src="types/${pokemon.Tipo[1]}.png" alt="${pokemon.Tipo[1]}" class="type-icon" />` : ""}
    </div>
    ${shiny ? `<div class="shiny-label">✨ Shiny!</div>` : ""}
  `;
  card.addEventListener("click", () => selectPokemon(pokemon, shiny));
  return card;
}

// Salva escolha e vai para explorar.html
function selectPokemon(pokemon, shiny) {
  localStorage.setItem("pokemonInicial", JSON.stringify(pokemon));
  localStorage.setItem("isShiny", shiny);
  bgm.pause();
  window.location.href = "explorar.html";
}

async function start() {
  const iniciais = await loadJSON("JSON/iniciais.json");
  const pokemons = await loadJSON("JSON/pokemons.json");

  // Pega o grupo aleatório
  const grupo = iniciais[Math.floor(Math.random() * iniciais.length)];

  // IDs de apenas 3 pokémons: "1", "2", "3"
  const ids = [grupo["1"], grupo["2"], grupo["3"]];

  for (let id of ids) {
    const poke = pokemons.find(p => p.ID == id);
    if (poke) {
      const shiny = isShiny();
      const card = createCard(poke, shiny);
      container.appendChild(card);
    }
  }
}

start();
