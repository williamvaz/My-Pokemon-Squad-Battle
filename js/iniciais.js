const container = document.getElementById("pokemonContainer");

async function loadJSON(path) {
  const response = await fetch(path);
  return await response.json();
}

function createCard(pokemon) {
  const card = document.createElement("div");
  card.className = "pokemon-card";
  card.innerHTML = `
    <img src="pokemons/${pokemon.ID}.png" alt="${pokemon.Name}">
    <div class="pokemon-name">${pokemon.Name}</div>
  `;
  card.addEventListener("click", () => selectPokemon(pokemon));
  return card;
}

function selectPokemon(pokemon) {
  localStorage.setItem("pokemonInicial", JSON.stringify(pokemon));
  const bgm = document.getElementById("bgm");
  bgm.pause();
  window.location.href = "explorar.html";
}

async function start() {
  const iniciais = await loadJSON("JSON/iniciais.json");
  const pokemons = await loadJSON("JSON/pokemons.json");

  const grupoAleatorio = iniciais[Math.floor(Math.random() * iniciais.length)];
  const iniciaisIds = Object.values(grupoAleatorio).filter(v => v !== grupoAleatorio.Grupo);

  const iniciaisDetalhados = iniciaisIds.map(id => pokemons.find(p => p.ID == id));

  iniciaisDetalhados.forEach(poke => {
    if (poke) container.appendChild(createCard(poke));
  });
}

start();
