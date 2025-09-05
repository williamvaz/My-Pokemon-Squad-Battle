// Utilitário para carregar arquivos JSON
async function loadJSON(path) {
  const response = await fetch(path);
  return await response.json();
}

// Executado ao carregar a página
window.onload = async () => {
  const loadingScreen = document.getElementById("loading-screen");
  const container = document.querySelector(".container");
  const bgm = document.getElementById("bgm");

  container.style.display = "none";
  bgm.volume = 0.2;
  try { bgm.play(); } catch (e) {}

  setTimeout(() => {
    loadingScreen.style.display = "none";
    container.style.display = "block";
    startExploration();
  }, 1500);
};

function isShiny() {
  return Math.random() < 0.002; // 0.2% de chance
}

// Sorteio principal
async function startExploration() {
  const rewardsContainer = document.getElementById("rewards-container");
  const pokemons = await loadJSON("JSON/pokemons.json");
  const probabilidades = await loadJSON("JSON/probabilidade.json");

  const premios = [];
  for (let i = 0; i < 5; i++) {
    const premio = sortearPremio(probabilidades);
    premios.push(premio);
  }

  let pokecoins = Number(localStorage.getItem("Pokemoedas")) || 0;
  let megarocks = Number(localStorage.getItem("Mega Rock")) || 0;

  for (let premio of premios) {
    const div = document.createElement("div");
    div.className = "reward";

    if (!premio || !premio.tipo) continue;

    if (premio.tipo === "Pokemoedas") {
  pokecoins += premio.valor;
  div.classList.add("pokemon");
  div.innerHTML = `
    <img src="itens/${premio.valor}_Pokemoedas.png">
    <div>${premio.valor} MOEDAS</div>
    <span class="tag" style="background:${premio.color}"></span>
  `;
}
  else if (premio.tipo === "Mega Rock") {
  megarocks += premio.valor;
  div.classList.add("pokemon");
  div.innerHTML = `
    <img src="itens/${premio.valor}_MegaRock.png">
    <div>${premio.valor} MEGA ROCKS</div>
    <span class="tag" style="background:${premio.color}"></span>
  `;
}
   
    else if (premio.tipo === "Pokemon") {
      const tier = premio.valor.toString();
      const pokes = pokemons.filter(p => p.Tierlist === tier);
      if (pokes.length === 0) continue;

      const escolhido = pokes[Math.floor(Math.random() * pokes.length)];
      const id = escolhido.ID.toString().padStart(4, "0");
      const shiny = Math.random() < 0.01;
      const img = shiny ? `pokemons/shiny/${id}-shiny.png` : `pokemons/normal/${id}.png`;

      await salvarPokemon(escolhido, shiny);
      div.classList.add("pokemon");
      div.innerHTML = `
    <img src="${img}">
    <div class="label">${escolhido.Name}</div>
    <span class="tag" style="background:${premio.color}">Tier ${tier}</span>
    `;


      if (shiny) {
      div.classList.add("shiny");
}

    }

    rewardsContainer.appendChild(div);
  }

  document.getElementById("pokecoins").textContent = pokecoins;
  document.getElementById("megarocks").textContent = megarocks;
  localStorage.setItem("Pokemoedas", pokecoins);
  localStorage.setItem("Mega Rock", megarocks);
}

// Sorteia com base nas chances
function sortearPremio(lista) {
  const total = lista.reduce((sum, item) => sum + item.chance, 0);
  const r = Math.random() * total;
  let acumulado = 0;
  for (let p of lista) {
    acumulado += p.chance;
    if (r <= acumulado) return p;
  }
  return null;
}

// Salva o Pokémon de forma simplificada
async function salvarPokemon(pokemon, shiny) {
  const golpes = await loadJSON("JSON/golpes.json");

  const rand = (min, max) => Math.random() * (max - min) + min;
  const arred = (v) => Math.round(v);

  const mod = {
    HP: arred(pokemon.HP * rand(0.20, 1.00)),
    Attack: arred(pokemon.Attack * rand(0.20, 1.00)),
    Defense: arred(pokemon.Defense * rand(0.20, 1.00)),
    "Sp. Atk": arred(pokemon["Sp. Atk"] * rand(0.20, 1.00)),
    "Sp. Def": arred(pokemon["Sp. Def"] * rand(0.20, 1.00)),
    Speed: arred(pokemon.Speed * rand(0.20, 1.00))
  };

  const total = mod.HP + mod.Attack + mod.Defense + mod["Sp. Atk"] + mod["Sp. Def"] + mod.Speed;

  const cp = arred(((mod.HP + mod.Defense + mod["Sp. Def"]) / 3 +
                    (mod.Attack + mod["Sp. Atk"] + mod.Speed) / 3 *
                    (mod.HP + mod.Attack + mod.Defense) / 3 +
                    (mod["Sp. Atk"] + mod["Sp. Def"] + mod.Speed) / 3) / 3 * 1.1);

  const iv = +(cp / pokemon.CP).toFixed(2);

  const golpesCompatíveis = golpes.filter(g =>
    g.Type === pokemon["Type 1"] || g.Type === pokemon["Type 2"]
  );

  const escolhidos = [];
  while (escolhidos.length < 2 && golpesCompatíveis.length > 0) {
    const i = Math.floor(Math.random() * golpesCompatíveis.length);
    const golpe = golpesCompatíveis.splice(i, 1)[0].Attack;
    if (!escolhidos.includes(golpe)) escolhidos.push(golpe);
  }

  const finalPokemon = {
    ID: pokemon.ID,
    Pokedex: pokemon.Pokedex,
    Name: pokemon.Name,
    "Type 1": pokemon["Type 1"],
    "Type 2": pokemon["Type 2"],
    CP: cp,
    IV: iv,
    Total: total,
    HP: mod.HP,
    Attack: mod.Attack,
    Defense: mod.Defense,
    "Sp. Atk": mod["Sp. Atk"],
    "Sp. Def": mod["Sp. Def"],
    Speed: mod.Speed,
    Tierlist: pokemon.Tierlist,
    "Golpe 1": escolhidos[0] || "",
    "Golpe 2": escolhidos[1] || "",
    Shiny: shiny ? "Sim" : "Não"
  };

  const lista = JSON.parse(localStorage.getItem("pokemons")) || [];
  lista.push(finalPokemon);
  localStorage.setItem("pokemons", JSON.stringify(lista));
}


// Prossegue para a próxima tela
document.getElementById("proceedBtn").addEventListener("click", () => {
  let rodada = Number(localStorage.getItem("rodadas_finalizadas")) || 0;
  rodada++;
  localStorage.setItem("rodadas_finalizadas", rodada);
  window.location.href = rodada % 5 === 0 ? "intervalo.html" : "explorar.html";
});
