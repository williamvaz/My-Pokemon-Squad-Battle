/* =========================
   Estado global da seleção
   ========================= */
let selectedCard = null;     // referência do card visual selecionado (div)
let selectedPokemon = null;  // objeto do pokémon escolhido
let selectedIsShiny = false; // flag se o escolhido é shiny

/* =========================
   Referências de DOM
   ========================= */
const container = document.getElementById("pokemonContainer"); // grid onde os 3 cards serão inseridos
const bgm = document.getElementById("bgm");                    // música de fundo (áudio)

/* =========================================
   Utilitário assíncrono para ler um JSON
   path: caminho relativo do arquivo
   retorna: objeto JS parseado
   ========================================= */
async function loadJSON(path) {
  const response = await fetch(path);
  return await response.json();
}

/* =========================================
   Probabilidade de shiny
   (1% = 0.01)
   ========================================= */
function isShiny() {
  return Math.random() < 0.01;
}

/* =========================================
   Cria o card de um pokémon
   - pokemon: objeto do pokémon base
   - shiny: boolean indicando se renderiza versão shiny
   Retorna: elemento <div> do card
   ========================================= */
function createCard(pokemon, shiny) {
  // Formata ID com 4 dígitos (ex: 7 -> "0007")
  const idFormatado = pokemon.ID.toString().padStart(4, "0");

  // Caminho da imagem conforme shiny ou normal
  const imgPath = shiny
    ? `pokemons/shiny/${idFormatado}-shiny.png`
    : `pokemons/normal/${idFormatado}.png`;

  // Cria o container do card
  const card = document.createElement("div");
  card.className = shiny ? "pokemon-card shiny-card" : "pokemon-card";


  // Monta o HTML interno do card
  card.innerHTML = `
    <img src="${imgPath}" alt="${pokemon.Name}">
    <div class="pokemon-name">${pokemon.Name}</div>
    <div class="pokemon-types">
      <img src="types/${pokemon["Type 1"]}.png" alt="${pokemon["Type 1"]}" class="type-icon" />
      ${pokemon["Type 2"] && pokemon["Type 2"] !== "" ? `<img src="types/${pokemon["Type 2"]}.png" alt="${pokemon["Type 2"]}" class="type-icon" />` : ""}
    </div>
    ${shiny ? `<div class="shiny-label">✨ Shiny!</div>` : ""}
  `;

  // Click no card => seleciona o pokémon
  card.addEventListener("click", () => selectPokemon(pokemon, shiny, card));

  return card;
}

/* =========================================
   Marca visualmente a seleção do card,
   registra o pokémon escolhido e exibe o
   botão "Prosseguir".
   ========================================= */
function selectPokemon(pokemon, shiny, cardElement) {
  // remove seleção do card anterior
  if (selectedCard) {
    selectedCard.classList.remove("selected");
  }

  // aplica seleção no card atual
  selectedCard = cardElement;
  selectedCard.classList.add("selected");

  // guarda dados da escolha
  selectedPokemon = pokemon;
  selectedIsShiny = shiny;

  // mostra o botão de continuar
  document.getElementById("proceedBtn").style.display = "block";
}

/* =========================================
   Avança para a próxima página (explorar.html)
   gerando os atributos aleatórios do pokémon
   escolhido, calculando CP/IV, escolhendo
   golpes compatíveis e salvando em localStorage.
   ========================================= */
async function proceedToNextPage() {
  if (!selectedPokemon) return; // sem seleção, não faz nada

  // Carrega golpes para filtrar por tipo
  const golpes = await loadJSON("JSON/golpes.json");

  // helpers de aleatoriedade e arredondamento
  const rand = (min, max) => Math.random() * (max - min) + min;
  const arred = (v) => Math.round(v);

  // base = pokémon selecionado (stats originais)
  const base = selectedPokemon;

  // Aplica multiplicadores aleatórios (20% a 100%) em cada atributo
  const mod = {
    HP: arred(base.HP * rand(0.30, 1.00)),
    Attack: arred(base.Attack * rand(0.30, 1.00)),
    Defense: arred(base.Defense * rand(0.30, 1.00)),
    "Sp. Atk": arred(base["Sp. Atk"] * rand(0.30, 1.00)),
    "Sp. Def": arred(base["Sp. Def"] * rand(0.30, 1.00)),
    Speed: arred(base.Speed * rand(0.30, 1.00))
  };

  // Soma total de atributos
  const total = mod.HP + mod.Attack + mod.Defense + mod["Sp. Atk"] + mod["Sp. Def"] + mod.Speed;

  // Cálculo de CP (fórmula atual do projeto)
  const cp = arred(
    (
      (mod.HP + mod.Defense + mod["Sp. Def"]) / 3 +
      (mod.Attack + mod["Sp. Atk"] + mod.Speed) / 3 *
      (mod.HP + mod.Attack + mod.Defense) / 3 +
      (mod["Sp. Atk"] + mod["Sp. Def"] + mod.Speed) / 3
    ) / 3 * 1.1
  );

  // IV relativo ao CP base do pokémon original
  const iv = +(cp / base.CP).toFixed(2);

  // Filtra golpes compatíveis por tipo 1 ou tipo 2
  const golpesCompatíveis = golpes.filter(g =>
    g.Type === base["Type 1"] || g.Type === base["Type 2"]
  );

  // Escolhe até 2 golpes aleatórios e distintos
  const escolhidos = [];
  while (escolhidos.length < 2 && golpesCompatíveis.length > 0) {
    const i = Math.floor(Math.random() * golpesCompatíveis.length);
    const golpe = golpesCompatíveis.splice(i, 1)[0].Attack;
    if (!escolhidos.includes(golpe)) escolhidos.push(golpe);
  }

  // Monta objeto final do pokémon para salvar
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

  // Salva no localStorage (append)
  const pokemons = JSON.parse(localStorage.getItem("pokemons") || "[]");
  pokemons.push(finalPokemon);
  localStorage.setItem("pokemons", JSON.stringify(pokemons));

  // Para a música e vai para a próxima tela
  bgm.pause();
  window.location.href = "explorar.html";
}

/* =========================================
   Sorteia um ID de pokémon inicial dentro
   de um grupo (objeto com chaves → IDs)
   ========================================= */
function getRandomStarterID(grupo) {
  const chaves = Object.keys(grupo).filter(key => key !== "Grupo");
  const aleatoria = chaves[Math.floor(Math.random() * chaves.length)];
  return grupo[aleatoria];
}

/* =========================================
   Ponto de entrada:
   - Carrega listas (iniciais e pokémons)
   - Escolhe 1 de cada grupo (3 no total)
   - Renderiza cards
   - Ativa o BGM no primeiro click do usuário
   ========================================= */
async function start() {
  // Carrega listas
  const iniciais = await loadJSON("JSON/iniciais.json");
  const pokemons = await loadJSON("JSON/pokemons.json");

  // Três IDs (um de cada grupo)
  const ids = [
    getRandomStarterID(iniciais[0]),
    getRandomStarterID(iniciais[1]),
    getRandomStarterID(iniciais[2])
  ];

  // Para cada ID sorteado, acha o pokémon e cria card (+ chance de shiny)
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

  // Primeira interação do usuário dispara a música (regras de autoplay mobile)
  document.addEventListener("click", () => {
    if (bgm.paused) {
      bgm.play().catch(e => console.warn("Erro ao tentar tocar música:", e));
    }
  }, { once: true });
}

/* Inicia fluxo */
start();
