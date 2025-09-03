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
      div.innerHTML = `<img src="itens/${premio.valor}_Pokemoedas.png"><div>${premio.valor} MOEDAS</div>`;
    } else if (premio.tipo === "Mega Rock") {
      megarocks += premio.valor;
      div.innerHTML = `<img src="itens/${premio.valor}_MegaRock.png"><div>${premio.valor} MEGA ROCKS</div>`;
    } else if (premio.tipo === "Pokemon") {
      const tier = premio.valor.toString();
      const pokes = pokemons.filter(p => p.Tierlist === tier);
      if (pokes.length === 0) continue;

      const escolhido = pokes[Math.floor(Math.random() * pokes.length)];
      const id = escolhido.ID.toString().padStart(4, "0");
      const shiny = Math.random() < 0.002;
      const img = shiny ? `pokemons/shiny/${id}-shiny.png` : `pokemons/normal/${id}.png`;

      salvarPokemon(escolhido, shiny);
      div.innerHTML = `<img src="${img}"><div>${escolhido.Name}</div>`;
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
function salvarPokemon(pokemon, shiny) {
  const lista = JSON.parse(localStorage.getItem("pokemons")) || [];
  lista.push({
    ID: pokemon.ID,
    Name: pokemon.Name,
    Shiny: shiny ? "Sim" : "Não"
  });
  localStorage.setItem("pokemons", JSON.stringify(lista));
}

// Prossegue para a próxima tela
document.getElementById("proceedBtn").addEventListener("click", () => {
  let rodada = Number(localStorage.getItem("rodadas_finalizadas")) || 0;
  rodada++;
  localStorage.setItem("rodadas_finalizadas", rodada);
  window.location.href = rodada % 6 === 0 ? "intervalo.html" : "explorar.html";
});