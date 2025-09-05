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

// ----- MOEDAS -----
const COST_PER_POINT = 2;

function getCoins() {
  return parseInt(localStorage.getItem("Pokemoedas") || "0", 10);
}
function setCoins(v) {
  localStorage.setItem("Pokemoedas", String(v));
  pokecoinsEl.textContent = v; // atualiza HUD
}
function trySpendCoins(cost) {
  const c = getCoins();
  if (c < cost) return false;
  setCoins(c - cost);
  return true;
}

// ----- CUSTO DE GOLPES -----
const MOVE_COST_SAME_TYPE = 30;  // golpe do mesmo tipo do Pokémon
const MOVE_COST_DIFF_TYPE = 60;  // golpe de tipo diferente

function moveCost(pokemon, moveMeta) {
  const mt = (moveMeta?.Type || "").toLowerCase();
  const t1 = (pokemon["Type 1"] || "").toLowerCase();
  const t2 = (pokemon["Type 2"] || "").toLowerCase();
  return mt && (mt === t1 || mt === t2) ? MOVE_COST_SAME_TYPE : MOVE_COST_DIFF_TYPE;
}

// CARREGAMENTO DO CATALOGO DE GOLPES PARA PREENCHER MODO/DANO/VELOCIDADE
let MOVES_BY_NAME = null;
let MOVES_LIST = null;

// POKEDEX - MÁXIMO POR ATRIBUTOS
let DEX_BY_POKEDEX = null;

async function ensureDexLoaded() {
  if (DEX_BY_POKEDEX) return;
  try {
    const res = await fetch("JSON/pokemons.json"); // ajuste o caminho se preciso
    const arr = await res.json();
    // Map por Pokedex (id como string)
    DEX_BY_POKEDEX = new Map(arr.map(e => [String(e.Pokedex), e]));
  } catch (e) {
    console.warn("Não consegui carregar pokemons.json", e);
    DEX_BY_POKEDEX = new Map();
  }
}

async function ensureMovesLoaded() {
  if (MOVES_BY_NAME && MOVES_LIST) return; // já carregado

  try {
    const res = await fetch("JSON/golpes.json"); // mantém teu caminho
    const arr = await res.json();

    MOVES_LIST = arr;                              // array completo (para listar/filtrar)
    MOVES_BY_NAME = new Map(arr.map(m => [m.Attack, m])); // acesso rápido por nome
  } catch (e) {
    console.warn("Não consegui carregar golpes.json", e);
    MOVES_LIST = [];
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

// Máximo por atributo, usando o pokedex; fallback para um padrão se não achar
const DEFAULT_STAT_CAP = 125;

function statMaxFor(pokemon, key) {
  const dex = DEX_BY_POKEDEX?.get(String(pokemon.Pokedex));
  if (dex && dex[key] != null) {
    return Number(dex[key]); // no JSON vem como string -> converte
  }
  return DEFAULT_STAT_CAP; // fallback
}

/* FUNÇÃO PARA ABRIR DETALHES DO POKÉMON */
async function openDetails(pokemon) {
  await Promise.all([ ensureMovesLoaded(), ensureDexLoaded() ]);

  const details = document.getElementById("details-screen");
  const isShiny = pokemon.Shiny === "Sim";
  const imgPath = isShiny
    ? `pokemons/shiny/${pokemon.ID.padStart(4, "0")}-shiny.png`
    : `pokemons/normal/${pokemon.ID.padStart(4, "0")}.png`;

  const g1 = MOVES_BY_NAME.get(pokemon["Golpe 1"]);
  const g2 = MOVES_BY_NAME.get(pokemon["Golpe 2"]);

// helper para pegar o ícone do tipo do golpe (com fallback)
const typeIconFor = (meta) => {
  const t = meta?.Type;                 // ex: "Bug", "Steel", "Water"...
  return t ? `types/${t}.png` : `types/${pokemon["Type 1"]}.png`;
};

// linha da tabela de golpes (usa o tipo do golpe!)
const moveRow = (slot, name, meta) => `
  <div class="moves-row">
    <img src="${typeIconFor(meta)}" class="type-icon" alt="">
    <div>${name || "-"}</div>
    <div class="pill">${meta?.Modo ?? "-"}</div>
    <div class="pill">${meta?.Damage ?? "-"}</div>
    <div class="pill">${meta?.Speed ?? "-"}</div>
    <button class="btn-mini move-change" data-slot="${slot}">Trocar</button>
  </div>
`;

const statDefs = [
  ["HP",        "HP"],
  ["Ataque",    "Attack"],
  ["Defesa",    "Defense"],
  ["Atk Esp.",  "Sp. Atk"],
  ["Def Esp.",  "Sp. Def"],
  ["Velocidade","Speed"],
];

const statsHtml = statDefs.map(([label, key], i) => {
  const val = Number(pokemon[key] ?? 0);
  const max = statMaxFor(pokemon, key); // usa o pokedex.json
  return `
    <div class="stat-row">
      <div class="stat-label">${label}</div>
      <div class="stat-value">
        <span>${val}</span><span class="stat-max"> / ${max}</span>
      </div>
      <button class="stat-add" data-stat="${i}">＋</button>
    </div>
  `;
}).join("");

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
          <div></div><div>Golpe</div><div>Modo</div><div>Dano</div><div>Speed</div><div></div>
        </div>
        ${moveRow(1, pokemon["Golpe 1"], g1)}
        ${moveRow(2, pokemon["Golpe 2"], g2)}
      </div>

      <div class="section-title">Atributos</div>
<div class="base-stats">
  ${statsHtml}
</div>

      <div class="details-footer">
        <button class="btn btn-gray" id="btn-close">VOLTAR</button>
      </div>
    </article>
  `;

  details.classList.remove("hidden");

// '+' — nasce desabilitado se já estiver no teto e aplica custo de 2 Pokemoedas
details.querySelectorAll(".stat-add").forEach((btn, idx) => {
  const [, key] = statDefs[idx];
  const max = statMaxFor(pokemon, key);
  const current = Number(pokemon[key] ?? 0);

  if (current >= max) btn.disabled = true;

  btn.onclick = () => {
    const cur = Number(pokemon[key] ?? 0);
    const cap = statMaxFor(pokemon, key);

    // já no máximo
    if (cur >= cap) {
      btn.disabled = true;
      return;
    }

    // não tem moedas suficientes
    if (!trySpendCoins(COST_PER_POINT)) {
      // feedback visual simples
      btn.classList.add("deny");
      setTimeout(() => btn.classList.remove("deny"), 350);
      return;
    }

    // aplica upgrade
    pokemon[key] = cur + 1;

    // persiste
    localStorage.setItem("pokemons", JSON.stringify(pokemons));

    // reabre o modal para atualizar valores e estado dos botões
    openDetails(pokemon);
  };
});

  // listeners básicos
  details.querySelector("#btn-close").onclick = () => details.classList.add("hidden");
  details.querySelector("#btn-evolve").onclick = () => console.log("Evoluir:", pokemon.Name);
  details.querySelector("#btn-mega").onclick   = () => console.log("Mega Evoluir:", pokemon.Name);

  // abrir seletor de golpes
  details.querySelectorAll(".move-change").forEach(btn=>{
    btn.addEventListener("click", ()=> openMovePicker(pokemon, Number(btn.dataset.slot)));
  });

  // fecha clicando fora
  details.onclick = (e)=>{ if(e.target === details) details.classList.add("hidden"); };
}

function openMovePicker(pokemon, slot) {
  const wrapper = document.getElementById("details-screen");

  // painel
  const picker = document.createElement("div");
  picker.className = "move-picker";
  picker.innerHTML = `
    <h3>Trocar Golpe ${slot}</h3>
    <input class="move-search" type="text" placeholder="Buscar golpe...">
    <div class="move-head">
      <div></div><div>Golpe</div><div>Modo</div><div>Dano</div><div>Speed</div><div>Valor</div><div></div>
    </div>
    <div class="move-list"></div>
    <div class="picker-actions">
      <button class="btn btn-gray" id="picker-cancel">Cancelar</button>
    </div>
  `;
  wrapper.appendChild(picker);

  const listEl = picker.querySelector(".move-list");
  const searchEl = picker.querySelector(".move-search");

  // renderizador (TODOS os golpes; filtra só por texto)
  const renderList = (q = "") => {
    const term = q.trim().toLowerCase();

    const src = term
      ? MOVES_LIST.filter(m => (m.Attack || "").toLowerCase().includes(term))
      : MOVES_LIST;

    const rows = src.slice(0, 400).map(m => {
      const cost = moveCost(pokemon, m);
      const typeIcon = m.Type ? `types/${m.Type}.png` : `types/${pokemon["Type 1"]}.png`;
      return `
        <div class="move-option" data-name="${m.Attack}" data-cost="${cost}">
          <img src="${typeIcon}" class="type-icon" alt="${m.Type || ""}">
          <div>${m.Attack}</div>
          <div class="pill">${m.Modo ?? "-"}</div>
          <div class="pill">${m.Damage ?? "-"}</div>
          <div class="pill">${m.Speed ?? "-"}</div>
          <div class="price-pill">${cost}</div>
          <button class="btn-mini move-select" data-name="${m.Attack}" data-cost="${cost}">Trocar</button>
        </div>
      `;
    }).join("");

    listEl.innerHTML = rows || `<div style="opacity:.7;padding:6px 2px;">Nenhum golpe encontrado.</div>`;

    // ação: tentar comprar/trocar
    listEl.querySelectorAll(".move-select").forEach(btn => {
      btn.onclick = () => {
        const name = btn.dataset.name;
        const cost = Number(btn.dataset.cost);

        if (!trySpendCoins(cost)) {
          btn.classList.add("deny");
          setTimeout(() => btn.classList.remove("deny"), 350);
          return;
        }

        // aplica golpe no slot
        if (slot === 1) pokemon["Golpe 1"] = name;
        else            pokemon["Golpe 2"] = name;

        // salva e reabre detalhes
        localStorage.setItem("pokemons", JSON.stringify(pokemons));
        picker.remove();
        openDetails(pokemon);
      };
    });
  };

  renderList();
  searchEl.oninput = () => renderList(searchEl.value);
  picker.querySelector("#picker-cancel").onclick = () => picker.remove();
}

});
