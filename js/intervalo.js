/* INICIALIZAÇÃO DA PÁGINA */
document.addEventListener("DOMContentLoaded", () => {

/* TOCAR MÚSICA DE FUNDO */
const bgMusic = new Audio("music/main-theme.mpeg");
bgMusic.loop = true;     // repete infinitamente
bgMusic.volume = 0.5;    // volume (0.0 a 1.0)
bgMusic.play().catch(err => {
  console.log("Autoplay bloqueado, esperando interação:", err);
  document.body.addEventListener("click", () => {
    bgMusic.play();
  }, { once: true });
});

/* BARRA SUPERIOR DE MOEDAS */
  const pokecoinsEl = document.getElementById("pokecoins"); // span/div que mostra quantidade de Pokemoedas
  const megarocksEl = document.getElementById("megarocks"); // span/div que mostra quantidade de Mega Rocks

// CARREGAMENTO DO CATALOGO DE GOLPES PARA PREENCHER MODO/DANO/VELOCIDADE
let MOVES_BY_NAME = null;
async function ensureMovesLoaded() {
  if (MOVES_BY_NAME) return;
  try {
    const res = await fetch("JSON/golpes.json");
    const arr = await res.json();
    MOVES_BY_NAME = new Map(arr.map(m => [m.Attack, m]));
  } catch (e) {
    console.warn("Não consegui carregar golpes.json, vou mostrar só os nomes.", e);
    MOVES_BY_NAME = new Map();
  }
}

/* GRID DE POKEMONS */
  const grid = document.getElementById("pokemon-grid"); // container (grid) onde os cards serão inseridos

/* FILTROS E ORDENAÇÃO */
  const typeFiltersEl = document.getElementById("type-filters");
  const sortSelect = document.getElementById("sort-select");

/* CARREGAR POKEMONS DO LOCALSTORAGE */
  const pokemons = JSON.parse(localStorage.getItem("pokemons")) || [];

/* ATUALIZAR QUANTIDADE DE MOEDAS */
  pokecoinsEl.textContent = localStorage.getItem("Pokemoedas") || 0;
  megarocksEl.textContent = localStorage.getItem("Mega Rock") || 0;

function renderPokemons(list) {
  grid.innerHTML = ""; // limpa grid

  list.forEach(p => {
    const div = document.createElement("div");
    div.classList.add("pokemon-card");

    // CARD COM TEMA SHINY
    if (p.Shiny === "Sim") div.classList.add("shiny-card");

    // IMAGENS DOS POKEMONS
    const imagePath = p.Shiny === "Sim"
      ? `pokemons/shiny/${p.ID.padStart(4, '0')}-shiny.png`
      : `pokemons/normal/${p.ID.padStart(4, '0')}.png`;

    // HTML DO CARD (COM SELO DOS POKEMONS SHINY)
    div.innerHTML = `
      <div class="pokemon-inner">
        <img class="pokemon-image" src="${imagePath}" alt="${p.Name}">
        <div class="pokemon-name">${p.Name}</div>
        ${p.Shiny === "Sim" ? `<div class="shiny-label">✨ Shiny</div>` : ""}
        <div class="pokemon-bottom">
          <div class="types">
            <img src="types/${p["Type 1"]}.png" alt="${p["Type 1"]}" class="type-icon">
            ${p["Type 2"] && p["Type 2"] !== "" 
              ? `<img src="types/${p["Type 2"]}.png" alt="${p["Type 2"]}" class="type-icon">`
              : ""}
          </div>
          <div class="cp-label">CP: ${p.CP}</div>
        </div>
      </div>
    `;

    // ABIR DETALHES
    div.addEventListener("click", () => openDetails(p));

    grid.appendChild(div);
  });
}

/* FILTRAR E ORDENAR */
function applyFiltersAndSort() {
  let filtered = [...pokemons];

// TIPOS SELECIONADOS
  const selectedTypes = [...typeFiltersEl.querySelectorAll("img.selected")].map(img => img.alt);

  if (selectedTypes.length > 0) {
    filtered = filtered.filter(p =>
      selectedTypes.includes(p["Type 1"]) || selectedTypes.includes(p["Type 2"])
    );
  }

// ORDENAÇÃO
  const criterio = sortSelect.value;
  filtered.sort((a, b) => {
    if (criterio === "CP") return b.CP - a.CP;
    if (criterio === "IV") return b.IV - a.IV;
    if (criterio === "ID") return Number(a.ID) - Number(b.ID);
  });

  renderPokemons(filtered);
}

/* CRIAR FILTROS DE TIPOS */
const types = [
  "Normal","Fire","Water","Grass","Electric","Ice",
  "Fighting","Poison","Ground","Flying",
  "Psychic","Bug","Rock","Ghost",
  "Dark","Steel","Dragon","Fairy"
];
types.forEach(type => {
  const img = document.createElement("img");
  img.src = `types/${type}.png`;
  img.alt = type;
  img.addEventListener("click", () => {
    img.classList.toggle("selected");
    applyFiltersAndSort();
  });
  typeFiltersEl.appendChild(img);
});

/* EVENTO DE ORDENAÇÃO */
sortSelect.addEventListener("change", applyFiltersAndSort);

/* EXIBIR TODOS INICIALMENTE */
applyFiltersAndSort();

/* BOTÃO CONTINUAR */
const continueBtn = document.getElementById("continue-btn");

continueBtn.addEventListener("click", () => {
  const rodadas = parseInt(localStorage.getItem("rodadas_finalizadas")) || 0;

  if (rodadas > 19) {
    window.location.href = "time.html";     // mais de 19 rodadas → vai para montar time
  } else {
    window.location.href = "explorar.html"; // senão → continua explorando
  }
});

/* FUNÇÃO PARA ABRIR DETALHES DO POKÉMON */
async function openDetails(pokemon) {
  await ensureMovesLoaded();

  const details = document.getElementById("details-screen");
  const isShiny = pokemon.Shiny === "Sim";
  const imgPath = isShiny
    ? `pokemons/shiny/${pokemon.ID.padStart(4, "0")}-shiny.png`
    : `pokemons/normal/${pokemon.ID.padStart(4, "0")}.png`;

  // PEGA LISTA DE GOLPES
  const g1 = MOVES_BY_NAME.get(pokemon["Golpe 1"]);
  const g2 = MOVES_BY_NAME.get(pokemon["Golpe 2"]);

  // PREENCHE AS LINHAS DA TABELA
  const moveRow = (name, meta) => `
    <div class="moves-row">
      <img src="types/${pokemon["Type 1"]}.png" class="type-icon" alt="">
      <div>${name || "-"}</div>
      <div class="pill">${meta?.Modo ?? "-"}</div>
      <div class="pill">${meta?.Damage ?? "-"}</div>
      <div class="pill">${meta?.Speed ?? "-"}</div>
    </div>
  `;

  details.innerHTML = `
    <article class="details-card ${isShiny ? "shiny-card" : ""}">
      <h2 class="details-name">${pokemon.Name.toUpperCase()}</h2>

      <div class="details-top">
        <div class="details-imgbox">
          <img src="${imgPath}" alt="${pokemon.Name}" class="details-image">
          <div class="details-types">
            <img src="types/${pokemon["Type 1"]}.png" alt="${pokemon["Type 1"]}">
            ${pokemon["Type 2"] ? `<img src="types/${pokemon["Type 2"]}.png" alt="${pokemon["Type 2"]}">` : ""}
          </div>
          ${isShiny ? `<span class="shiny-label">Shiny</span>` : ""}
        </div>

        <div class="mini-stats">
          <div class="stat-chip"><span>CP</span><strong>${pokemon.CP}</strong></div>
          <div class="stat-chip"><span>IV</span><strong>${Math.round(pokemon.IV * 100)}%</strong></div>
          <div class="details-actions">
            <button class="btn btn-blue" id="btn-evolve">EVOLUIR</button>
            <button class="btn btn-red"  id="btn-mega">MEGA EVOLUIR</button>
          </div>
        </div>
      </div>

      <div class="section-title">Golpes</div>
      <div class="moves">
        <div class="moves-row moves-head">
          <div></div><div>Golpe</div><div>Modo</div><div>Dano</div><div>Speed</div>
        </div>
        ${moveRow(pokemon["Golpe 1"], g1)}
        ${moveRow(pokemon["Golpe 2"], g2)}
      </div>

      <div class="section-title">Atributos</div>
      <div class="base-stats">
        ${[
          ["HP",        pokemon.HP],
          ["Ataque",    pokemon.Attack],
          ["Defesa",    pokemon.Defense],
          ["Atk Esp.",  pokemon["Sp. Atk"]],
          ["Def Esp.",  pokemon["Sp. Def"]],
          ["Velocidade",pokemon.Speed],
        ].map(([label,val],i)=>`
          <div class="stat-row">
            <div class="stat-label">${label}</div>
            <div class="stat-value">${val}</div>
            <button class="stat-add" data-stat="${i}">＋</button>
          </div>
        `).join("")}
      </div>

      <div class="details-footer">
        <button class="btn btn-gray" id="btn-close">VOLTAR</button>
      </div>
    </article>
  `;

  details.classList.remove("hidden");

  // listeners de ação – por enquanto só placeholders
  details.querySelector("#btn-close").onclick = () => details.classList.add("hidden");
  details.querySelector("#btn-evolve").onclick = () => console.log("Evoluir:", pokemon.Name);
  details.querySelector("#btn-mega").onclick   = () => console.log("Mega Evoluir:", pokemon.Name);
  details.querySelectorAll(".stat-add").forEach(btn=>{
    btn.addEventListener("click", () => {
      const which = btn.dataset.stat; // 0..5
      console.log("Incrementar atributo", which, "de", pokemon.Name);
      // aqui depois aplicamos sua regra de upgrade
    });
  });

  // fecha ao clicar fora do card
  details.onclick = (e)=>{ if(e.target === details) details.classList.add("hidden"); };
}


});
