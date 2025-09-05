
let selectedCard = null;
let selectedPokemon = null;
let selectedIsShiny = false;

const container = document.getElementById("pokemonContainer");
const bgm = document.getElementById("bgm");

async function loadJSON(path) {
  const response = await fetch(path);
  return await response.json();
}

function isShiny() {
  return Math.random() < 0.002;
}

function createCard(pokemon, shiny) {
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

  card.addEventListener("click", () => selectPokemon(pokemon, shiny, card));
  return card;
}

function selectPokemon(pokemon, shiny, cardElement) {
  if (selectedCard) {
    selectedCard.classList.remove("selected");
  }

  selectedCard = cardElement;
  selectedCard.classList.add("selected");

  selectedPokemon = pokemon;
  selectedIsShiny = shiny;

  document.getElementById("proceedBtn").style.display = "block";
}

async function proceedToNextPage() {
  if (!selectedPokemon) return;

  const golpes = await loadJSON("JSON/golpes.json");
  const rand = (min, max) => Math.random() * (max - min) + min;
  const arred = (v) => Math.round(v);

  const base = selectedPokemon;
  const mod = {
    HP: arred(base.HP * rand(0.20, 1.00)),
    Attack: arred(base.Attack * rand(0.20, 1.00)),
    Defense: arred(base.Defense * rand(0.20, 1.00)),
    "Sp. Atk": arred(base["Sp. Atk"] * rand(0.20, 1.00)),
    "Sp. Def": arred(base["Sp. Def"] * rand(0.20, 1.00)),
    Speed: arred(base.Speed * rand(0.20, 1.00))
  };

  const total = mod.HP + mod.Attack + mod.Defense + mod["Sp. Atk"] + mod["Sp. Def"] + mod.Speed;

  const cp = arred(((mod.HP + mod.Defense + mod["Sp. Def"]) / 3 +
                    (mod.Attack + mod["Sp. Atk"] + mod.Speed) / 3 *
                    (mod.HP + mod.Attack + mod.Defense) / 3 +
                    (mod["Sp. Atk"] + mod["Sp. Def"] + mod.Speed) / 3) / 3 * 1.1);

  const iv = +(cp / base.CP).toFixed(2);

  const golpesCompatíveis = golpes.filter(g =>
    g.Type === base["Type 1"] || g.Type === base["Type 2"]
  );

  const escolhidos = [];
  while (escolhidos.length < 2 && golpesCompatíveis.length > 0) {
    const i = Math.floor(Math.random() * golpesCompatíveis.length);
    const golpe = golpesCompatíveis.splice(i, 1)[0].Attack;
    if (!escolhidos.includes(golpe)) escolhidos.push(golpe);
  }

  const finalPokemon = {
    ID: base.ID,
    Pokedex: base.Pokedex,
    Name: base.Name,
    "Type 1": base["Type 1"],
    "Type 2": base["Type 2"],
    CP: cp,
    IV: iv,
    Total: total,
    HP: mod.HP,
    Attack: mod.Attack,
    Defense: mod.Defense,
    "Sp. Atk": mod["Sp. Atk"],
    "Sp. Def": mod["Sp. Def"],
    Speed: mod.Speed,
    Tierlist: base.Tierlist,
    "Golpe 1": escolhidos[0] || "",
    "Golpe 2": escolhidos[1] || "",
    Shiny: selectedIsShiny ? "Sim" : "Não"
  };

  const pokemons = JSON.parse(localStorage.getItem("pokemons") || "[]");
  pokemons.push(finalPokemon);
  localStorage.setItem("pokemons", JSON.stringify(pokemons));

  bgm.pause();
  window.location.href = "explorar.html";
}

function getRandomStarterID(grupo) {
  const chaves = Object.keys(grupo).filter(key => key !== "Grupo");
  const aleatoria = chaves[Math.floor(Math.random() * chaves.length)];
  return grupo[aleatoria];
}

async function start() {
  const iniciais = await loadJSON("JSON/iniciais.json");
  const pokemons = await loadJSON("JSON/pokemons.json");

  const ids = [
    getRandomStarterID(iniciais[0]),
    getRandomStarterID(iniciais[1]),
    getRandomStarterID(iniciais[2])
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

  document.addEventListener("click", () => {
    if (bgm.paused) {
      bgm.play().catch(e => console.warn("Erro ao tentar tocar música:", e));
    }
  }, { once: true });
}

start();
