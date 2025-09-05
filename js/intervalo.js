/* INICIALIZAÇÃO DA PÁGINA */
document.addEventListener("DOMContentLoaded", () => {

/* TOCAR MÚSICA DE FUNDO */
const bgMusic = new Audio("music/main-theme.mpeg");
bgMusic.loop = true;
bgMusic.volume = 0.5;
bgMusic.play().catch(err => {
  console.log("Autoplay bloqueado, esperando interação:", err);
  document.body.addEventListener("click", () => bgMusic.play(), { once: true });
});

/* BARRA SUPERIOR DE MOEDAS */
const pokecoinsEl = document.getElementById("pokecoins");
const megarocksEl = document.getElementById("megarocks");

/* ====== MOEDAS ====== */
const COST_PER_POINT = 2;

function getCoins() {
  return parseInt(localStorage.getItem("Pokemoedas") || "0", 10);
}
function setCoins(v) {
  localStorage.setItem("Pokemoedas", String(v));
  pokecoinsEl.textContent = v;
}
function trySpendCoins(cost) {
  const c = getCoins();
  if (c < cost) return false;
  setCoins(c - cost);
  return true;
}

/* ====== CUSTO DE GOLPES ====== */
const MOVE_COST_SAME_TYPE = 30;
const MOVE_COST_DIFF_TYPE = 60;
function moveCost(pokemon, moveMeta) {
  const mt = (moveMeta?.Type || "").toLowerCase();
  const t1 = (pokemon["Type 1"] || "").toLowerCase();
  const t2 = (pokemon["Type 2"] || "").toLowerCase();
  return mt && (mt === t1 || mt === t2) ? MOVE_COST_SAME_TYPE : MOVE_COST_DIFF_TYPE;
}

/* ====== GOLPES (catálogo) ====== */
let MOVES_BY_NAME = null;
let MOVES_LIST = null;
async function ensureMovesLoaded() {
  if (MOVES_BY_NAME && MOVES_LIST) return;
  try {
    const res = await fetch("JSON/golpes.json");
    const arr = await res.json();
    MOVES_LIST = arr;
    MOVES_BY_NAME = new Map(arr.map(m => [m.Attack, m]));
  } catch (e) {
    console.warn("Não consegui carregar golpes.json", e);
    MOVES_LIST = [];
    MOVES_BY_NAME = new Map();
  }
}

/* ====== DEX (espécies) ====== */
let DEX_LIST = null;
let DEX_BY_POKEDEX = null;
let DEX_BY_ID = null;

async function ensureDexLoaded() {
  if (DEX_LIST && DEX_BY_POKEDEX && DEX_BY_ID) return;
  try {
    const res = await fetch("JSON/pokemons.json");
    const arr = await res.json();
    DEX_LIST = arr;
    DEX_BY_POKEDEX = new Map(arr.map(e => [String(e.Pokedex), e]));
    DEX_BY_ID      = new Map(arr.map(e => [String(e.ID),       e]));
  } catch (e) {
    console.warn("Não consegui carregar pokemons.json", e);
    DEX_LIST = [];
    DEX_BY_POKEDEX = new Map();
    DEX_BY_ID      = new Map();
  }
}

/* ====== DERIVADAS (Total, IV, CP) ====== */
const DERIVED_KEYS = ["HP","Attack","Defense","Sp. Atk","Sp. Def","Speed"];
const CP_PER_POINT = 2.5;

function maxTotalFromDex(dexEntry){
  if (!dexEntry) return 0;
  if (dexEntry.Total != null) return Number(dexEntry.Total);
  return DERIVED_KEYS.reduce((s,k)=> s + Number(dexEntry[k] || 0), 0);
}

// CP real a partir dos atributos (sua fórmula)
function computeCPFromStats(p) {
  const HP = +p.HP||0, ATK = +p.Attack||0, DEF = +p.Defense||0;
  const SPA = +p["Sp. Atk"]||0, SPDf = +p["Sp. Def"]||0, SPE = +p.Speed||0;

  const avg1 = (HP + DEF + SPDf) / 3;
  const avg2 = (ATK + SPA + SPE) / 3;
  const avg3 = (HP + ATK + DEF) / 3;
  const avg4 = (SPA + SPDf + SPE) / 3;

  // =ARRED( ((avg1 + avg2*avg3 + avg4)/3) * 1,1 ; 0 )
  return Math.round(((avg1 + avg2 * avg3 + avg4) / 3) * 1.1);
}

function recalcDerived(pokemon){
  // 1) Total ainda é útil para outras coisas
  const total = ["HP","Attack","Defense","Sp. Atk","Sp. Def","Speed"]
    .reduce((s,k)=> s + Number(pokemon[k] || 0), 0);
  pokemon.Total = total;

  // 2) Dex atual
  const dex = (DEX_BY_ID && DEX_BY_ID.get(String(pokemon.ID))) ||
              (DEX_BY_POKEDEX && DEX_BY_POKEDEX.get(String(pokemon.Pokedex)));

  // 3) CP com a fórmula “forte”
  const cpNow = computeCPFromStats(pokemon);   // CP atual
  pokemon.CP = cpNow;

  // 4) CP máximo da espécie (recalculado pelos caps da espécie)
  let cpMax = 1;
  if (dex) {
    cpMax = computeCPFromStats({
      HP: +dex.HP || 0,
      Attack: +dex.Attack || 0,
      Defense: +dex.Defense || 0,
      "Sp. Atk": +dex["Sp. Atk"] || 0,
      "Sp. Def": +dex["Sp. Def"] || 0,
      Speed: +dex.Speed || 0,
    });
  }

  // 5) IV baseado em CP (0..1)
  pokemon.IV = +(cpNow / (cpMax || 1)).toFixed(4);
}

/* ====== CAP POR ATRIBUTO (para exibir X / max) ====== */
const DEFAULT_STAT_CAP = 125;
function statMaxFor(pokemon, key) {
  const dex = DEX_BY_ID?.get(String(pokemon.ID)) || DEX_BY_POKEDEX?.get(String(pokemon.Pokedex));
  if (dex && dex[key] != null) return Number(dex[key]);
  return DEFAULT_STAT_CAP;
}

/* ====== EVOLUÇÃO / MEGA ====== */
function cpMaxFromDex(dex) {
  if (!dex) return 1;
  const v = Number(dex.CP);
  return Number.isFinite(v) && v > 0 ? v : Math.round(maxTotalFromDex(dex) * CP_PER_POINT);
}
function findEvoCandidatesByID(currentID, isMega = false) {
  const key = isMega ? "Previous megaform" : "Previous form";
  const me = String(currentID);
  return DEX_LIST.filter(d => String(d[key]) === me);
}
function coinCostForEvolution(curDex, targetDex) {
  const cur = cpMaxFromDex(curDex);
  const tgt = cpMaxFromDex(targetDex);
  return Math.max(1, Math.ceil(120 - (cur / tgt) * 100));
}
function rockCostForMega(curDex, targetDex) {
  return Math.max(1, Math.ceil(coinCostForEvolution(curDex, targetDex) / 10));
}
function applyEvolution(pokemon, targetDex) {
  const keys = ["HP","Attack","Defense","Sp. Atk","Sp. Def","Speed"];
  const curDex = DEX_BY_ID.get(String(pokemon.ID));

  // % atual por atributo na forma atual
  const ratios = Object.fromEntries(keys.map(k => {
    const curVal = Number(pokemon[k] || 0);
    const curMax = Number(curDex?.[k] || 1);
    const frac = curMax > 0 ? curVal / curMax : 0;
    return [k, Math.min(1, Math.max(0, frac))];
  }));

  // aplica o mesmo % nos caps da forma nova
  const newStats = Object.fromEntries(keys.map(k => {
    const tgtMax = Number(targetDex?.[k] || 0);
    return [k, Math.max(1, Math.round((ratios[k] || 0) * tgtMax))];
  }));

  // aplica espécie nova
  pokemon.ID        = String(targetDex.ID);
  pokemon.Pokedex   = String(targetDex.Pokedex);
  pokemon.Name      = targetDex.Name;
  pokemon["Type 1"] = targetDex["Type 1"];
  pokemon["Type 2"] = targetDex["Type 2"] || "";

  // aplica os novos atributos
  keys.forEach(k => { pokemon[k] = newStats[k]; });

  // recalcula Total, IV e CP com a fórmula nova
  recalcDerived(pokemon);
}

/* ====== POPUP DE CONFIRMAÇÃO ====== */
function openConfirm(text, confirmLabel, onConfirm) {
  const wrapper = document.getElementById("details-screen");
  const box = document.createElement("div");
  box.className = "confirm-box";
  box.innerHTML = `
    <div class="confirm-card">
      <p>${text}</p>
      <div class="confirm-actions">
        <button class="btn btn-gray" id="canc">Cancelar</button>
        <button class="btn btn-blue" id="ok">${confirmLabel}</button>
      </div>
    </div>`;
  wrapper.appendChild(box);
  box.querySelector("#canc").onclick = () => box.remove();
  box.querySelector("#ok").onclick = () => { box.remove(); onConfirm?.(); };
}

/* ====== GRID / FILTROS / ORDENAÇÃO ====== */
const grid = document.getElementById("pokemon-grid");
const typeFiltersEl = document.getElementById("type-filters");
const sortSelect = document.getElementById("sort-select");
const pokemons = JSON.parse(localStorage.getItem("pokemons")) || [];

pokecoinsEl.textContent = localStorage.getItem("Pokemoedas") || 0;
megarocksEl.textContent = localStorage.getItem("Mega Rock") || 0;

function renderPokemons(list) {
  grid.innerHTML = "";
  list.forEach(p => {
    const div = document.createElement("div");
    div.classList.add("pokemon-card");
    if (p.Shiny === "Sim") div.classList.add("shiny-card");

    const imagePath = p.Shiny === "Sim"
      ? `pokemons/shiny/${p.ID.padStart(4, '0')}-shiny.png`
      : `pokemons/normal/${p.ID.padStart(4, '0')}.png`;

    div.innerHTML = `
      <div class="pokemon-inner">
        <img class="pokemon-image" src="${imagePath}" alt="${p.Name}">
        <div class="pokemon-name">${p.Name}</div>
        ${p.Shiny === "Sim" ? `<div class="shiny-label">✨ Shiny</div>` : ""}
        <div class="pokemon-bottom">
          <div class="types">
            <img src="types/${p["Type 1"]}.png" alt="${p["Type 1"]}" class="type-icon">
            ${p["Type 2"] ? `<img src="types/${p["Type 2"]}.png" alt="${p["Type 2"]}" class="type-icon">` : ""}
          </div>
          <div class="cp-label">CP: ${p.CP}</div>
        </div>
      </div>
    `;
    div.addEventListener("click", () => openDetails(p));
    grid.appendChild(div);
  });
}

function applyFiltersAndSort() {
  let filtered = [...pokemons];
  const selectedTypes = [...typeFiltersEl.querySelectorAll("img.selected")].map(img => img.alt);

  if (selectedTypes.length > 0) {
    filtered = filtered.filter(p =>
      selectedTypes.includes(p["Type 1"]) || selectedTypes.includes(p["Type 2"])
    );
  }

  const criterio = sortSelect.value;
  filtered.sort((a, b) => {
    if (criterio === "CP") return b.CP - a.CP;
    if (criterio === "IV") return b.IV - a.IV;
    if (criterio === "ID") return Number(a.ID) - Number(b.ID);
  });

  renderPokemons(filtered);
}

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

sortSelect.addEventListener("change", applyFiltersAndSort);
applyFiltersAndSort();

/* ====== BOTÃO CONTINUAR ====== */
const continueBtn = document.getElementById("continue-btn");
if (continueBtn) {
  continueBtn.addEventListener("click", () => {
    const rodadas = parseInt(localStorage.getItem("rodadas_finalizadas")) || 0;
    if (rodadas > 19) window.location.href = "time.html";
    else window.location.href = "explorar.html";
  });
}

/* ====== DETALHES ====== */
async function openDetails(pokemon) {
  await Promise.all([ ensureMovesLoaded(), ensureDexLoaded() ]);

  const details = document.getElementById("details-screen");
  const isShiny = pokemon.Shiny === "Sim";
  const imgPath = isShiny
    ? `pokemons/shiny/${pokemon.ID.padStart(4, "0")}-shiny.png`
    : `pokemons/normal/${pokemon.ID.padStart(4, "0")}.png`;

  const g1 = MOVES_BY_NAME.get(pokemon["Golpe 1"]);
  const g2 = MOVES_BY_NAME.get(pokemon["Golpe 2"]);

  const typeIconFor = (meta) => {
    const t = meta?.Type;
    return t ? `types/${t}.png` : `types/${pokemon["Type 1"]}.png`;
  };

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
    const max = statMaxFor(pokemon, key);
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
      <div class="base-stats">${statsHtml}</div>

      <div class="details-footer">
        <button class="btn btn-gray" id="btn-close">VOLTAR</button>
      </div>
    </article>
  `;

  details.classList.remove("hidden");

  /* '+' — custo 2 Pokemoedas, respeita o máximo e recalcula derivados */
  details.querySelectorAll(".stat-add").forEach((btn, idx) => {
    const [, key] = statDefs[idx];
    const max = statMaxFor(pokemon, key);
    const current = Number(pokemon[key] ?? 0);
    if (current >= max) btn.disabled = true;

    btn.onclick = () => {
      const cur = Number(pokemon[key] ?? 0);
      const cap = statMaxFor(pokemon, key);
      if (cur >= cap) { btn.disabled = true; return; }
      if (!trySpendCoins(COST_PER_POINT)) {
        btn.classList.add("deny");
        setTimeout(() => btn.classList.remove("deny"), 350);
        return;
      }
      pokemon[key] = cur + 1;
      recalcDerived(pokemon);
      localStorage.setItem("pokemons", JSON.stringify(pokemons));
      applyFiltersAndSort();
      openDetails(pokemon);
    };
  });

  /* Fechar */
  details.querySelector("#btn-close").onclick = () => details.classList.add("hidden");

  /* EVOLUIR */
  const evolveBtn = details.querySelector("#btn-evolve");
  evolveBtn.onclick = () => {
    const curDex = DEX_BY_ID.get(String(pokemon.ID));
    const candidates = findEvoCandidatesByID(pokemon.ID, false);
    if (!candidates.length) { evolveBtn.classList.add("deny"); setTimeout(()=>evolveBtn.classList.remove("deny"), 350); return; }

    const target = candidates[Math.floor(Math.random()*candidates.length)];
    const cost = coinCostForEvolution(curDex, target);
    if (getCoins() < cost) { evolveBtn.classList.add("deny"); setTimeout(()=>evolveBtn.classList.remove("deny"), 350); return; }

    openConfirm(
      `Deseja evoluir o seu <b>${pokemon.Name}</b> para <b>${target.Name}</b> por <b>${cost}</b> Pokemoedas?`,
      "Evoluir",
      () => {
        if (!trySpendCoins(cost)) return;
        applyEvolution(pokemon, target);
        // recalcDerived já foi chamado dentro de applyEvolution
        localStorage.setItem("pokemons", JSON.stringify(pokemons));
        applyFiltersAndSort();
        openDetails(pokemon);
      }
    );
  };

  /* MEGA EVOLUIR */
  const megaBtn = details.querySelector("#btn-mega");
  megaBtn.onclick = () => {
    const curDex = DEX_BY_ID.get(String(pokemon.ID));
    const candidates = findEvoCandidatesByID(pokemon.ID, true);
    if (!candidates.length) { megaBtn.classList.add("deny"); setTimeout(()=>megaBtn.classList.remove("deny"), 350); return; }

    const target = candidates[Math.floor(Math.random()*candidates.length)];
    const cost = rockCostForMega(curDex, target);
    const rocks = parseInt(localStorage.getItem("Mega Rock") || "0", 10);
    if (rocks < cost) { megaBtn.classList.add("deny"); setTimeout(()=>megaBtn.classList.remove("deny"), 350); return; }

    openConfirm(
      `Deseja mega evoluir o seu <b>${pokemon.Name}</b> para <b>${target.Name}</b> por <b>${cost}</b> Mega Rocks?`,
      "Mega Evoluir",
      () => {
        localStorage.setItem("Mega Rock", String(rocks - cost));
        megarocksEl.textContent = (rocks - cost);
        applyEvolution(pokemon, target);
        // recalcDerived já foi chamado dentro de applyEvolution
        localStorage.setItem("pokemons", JSON.stringify(pokemons));
        applyFiltersAndSort();
        openDetails(pokemon);
      }
    );
  };

  /* Troca de golpes (abre seletor) */
  details.querySelectorAll(".move-change").forEach(btn=>{
    btn.addEventListener("click", ()=> openMovePicker(pokemon, Number(btn.dataset.slot)));
  });

  /* Fechar clicando fora */
  details.onclick = (e)=>{ if(e.target === details) details.classList.add("hidden"); };
}

/* ====== SELETOR DE GOLPES ====== */
function openMovePicker(pokemon, slot) {
  const wrapper = document.getElementById("details-screen");
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

  const renderList = (q = "") => {
    const term = q.trim().toLowerCase();
    const src = term ? MOVES_LIST.filter(m => (m.Attack || "").toLowerCase().includes(term)) : MOVES_LIST;

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

    listEl.querySelectorAll(".move-select").forEach(btn => {
      btn.onclick = () => {
        const name = btn.dataset.name;
        const cost = Number(btn.dataset.cost);

        if (!trySpendCoins(cost)) {
          btn.classList.add("deny");
          setTimeout(() => btn.classList.remove("deny"), 350);
          return;
        }

        if (slot === 1) pokemon["Golpe 1"] = name;
        else            pokemon["Golpe 2"] = name;

        localStorage.setItem("pokemons", JSON.stringify(pokemons));
        applyFiltersAndSort();
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
