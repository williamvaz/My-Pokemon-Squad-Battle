// Carrega os dados dos arquivos JSON
async function loadJSON(path) {
  const response = await fetch(path);
  return await response.json();
}

// Mostra o loading por 1.5s antes de exibir os prêmios
window.onload = async () => {
  const loadingScreen = document.getElementById("loading-screen");
  const container = document.querySelector(".container");
  const bgm = document.getElementById("bgm");

  container.style.display = "none";
  bgm.volume = 0.2;

  setTimeout(() => {
    loadingScreen.style.display = "none";
    container.style.display = "block";
    startExploration();
  }, 1500);
};

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

    if (premio.tipo === "pokemoeda") {
      const valor = Number(premio.valor);
      pokecoins += valor;
      div.innerHTML = `<img src="itens/${premio.img}" /><div>${valor} MOEDAS</div>`;
    } else if (premio.tipo === "megarock") {
      const valor = Number(premio.valor);
      megarocks += valor;
      div.innerHTML = `<img src="itens/${premio.img}" /><div>${valor} MEGA ROCKS</div>`;
    } else if (premio.tipo === "pokemon") {
      const tier = premio.valor;
      const pokesDaTier = pokemons.filter(p => p["Tierlist"] === tier);
      const escolhido = pokesDaTier[Math.floor(Math.random() * pokesDaTier.length)];
      const id = escolhido.ID.toString().padStart(4, "0");

      const shiny = Math.random() < 0.002;
      const img = shiny ? `pokemons/shiny/${id}-shiny.png` : `pokemons/normal/${id}.png`;

      salvarPokemon(escolhido, shiny);
      div.innerHTML = `<img src="${img}" /><div>${escolhido.Name}</div>`;
    }

    rewardsContainer.appendChild(div);
  }

  document.getElementById("pokecoins").textContent = pokecoins;
  document.getElementById("megarocks").textContent = megarocks;
  localStorage.setItem("Pokemoedas", pokecoins);
  localStorage.setItem("Mega Rock", megarocks);
}

// Sorteia o prêmio com base na tabela de probabilidades
function sortearPremio(probabilidades) {
  const total = probabilidades.reduce((sum, p) => sum + Number(p.Probabilidade), 0);
  const sorteio = Math.random() * total;
  let acumulado = 0;

  for (let p of probabilidades) {
    acumulado += Number(p.Probabilidade);
    if (sorteio <= acumulado) {
      return { tipo: p.Tipo, valor: p.Valor, img: p.Imagem };
    }
  }
}

// Salva o Pokémon no localStorage (simplificado)
function salvarPokemon(pokemon, shiny) {
  const lista = JSON.parse(localStorage.getItem("pokemons")) || [];

  // Apenas salvar o ID e nome como exemplo simplificado
  lista.push({
    ID: pokemon.ID,
    Name: pokemon.Name,
    Shiny: shiny ? "Sim" : "Não"
  });

  localStorage.setItem("pokemons", JSON.stringify(lista));
}

// Botão prosseguir: vai para próxima exploração ou intervalo
document.getElementById("proceedBtn").addEventListener("click", () => {
  let rodada = Number(localStorage.getItem("rodadas_finalizadas")) || 0;
  rodada++;
  localStorage.setItem("rodadas_finalizadas", rodada);

  const proxima = rodada % 6 === 0 ? "intervalo.html" : "explorar.html";
  window.location.href = proxima;
});
