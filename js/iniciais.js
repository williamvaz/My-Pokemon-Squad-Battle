let selectedCard = null;
let selectedPokemon = null;
let selectedIsShiny = false;

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
function createCard(pokemon, shiny) {card.addEventListener("click", () => selectPokemon(pokemon, shiny, card));

  const idFormatado = pokemon.ID.toString().padStart(4, "0");
  const imgPath = shiny
    ? `pokemons/shiny/${idFormatado}-shiny.png`
    : `pokemons/normal/${idFormatado}.png`;

  const card = document.createElement("div");
  card.className = "pokemon-card";
  card.innerHTML = `
    <img src="${imgPath}" alt="${pokemon.Name}">
    <div class="pokemon-name">${pokemon.Name}</div>
<div class="pokemon-types">
  <img src="types/${pokemon["Type 1"]}.png" alt="${pokemon["Type 1"]}" class="type-icon" />
  ${pokemon["Type 2"] && pokemon["Type 2"] !== "" ? `<img src="types/${pokemon["Type 2"]}.png" alt="${pokemon["Type 2"]}" class="type-icon" />` : ""}
</div>

    ${shiny ? `<div class="shiny-label">✨ Shiny!</div>` : ""}
  `;
  card.addEventListener("click", () => selectPokemon(pokemon, shiny));
  return card;
}


// Salva escolha e vai para explorar.html
function selectPokemon(pokemon, shiny, cardElement) {
  // Remove destaque anterior
  if (selectedCard) {
    selectedCard.classList.remove("selected");
  }

  // Marca o novo card
  selectedCard = cardElement;
  selectedCard.classList.add("selected");

  // Guarda os dados do Pokémon escolhido
  selectedPokemon = pokemon;
  selectedIsShiny = shiny;

  // Mostra o botão "Prosseguir"
  document.getElementById("proceedBtn").style.display = "block";
}


async function start() {
  const iniciais = await loadJSON("JSON/iniciais.json");
  const pokemons = await loadJSON("JSON/pokemons.json");

  const container = document.getElementById("pokemonContainer");

  // Sorteia 1 ID de cada grupo (3 grupos no JSON)
  const ids = [
    iniciais[0][(Math.floor(Math.random() * Object.keys(iniciais[0]).length) + 1).toString()],
    iniciais[1][(Math.floor(Math.random() * Object.keys(iniciais[1]).length) + 1).toString()],
    iniciais[2][(Math.floor(Math.random() * Object.keys(iniciais[2]).length) + 1).toString()],
  ];

  for (let id of ids) {
    const poke = pokemons.find(p => p.ID == id);
    if (poke) {
      const shiny = isShiny();
      const card = createCard(poke, shiny);
      container.appendChild(card);
    } else {
      console.warn("ID não encontrado:", id);
    }
  }
}

function proceedToNextPage() {
  if (selectedPokemon) {
    localStorage.setItem("pokemonInicial", JSON.stringify(selectedPokemon));
    localStorage.setItem("isShiny", selectedIsShiny);
    bgm.pause();
    window.location.href = "explorar.html";
  }
}


start();
