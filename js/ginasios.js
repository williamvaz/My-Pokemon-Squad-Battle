/* ==========================
   Torre dos Ginásios — Lógica
   ========================== */

const PATH_POKEMONS  = "JSON/pokemons.json";
const PATH_INSIGNIAS = "JSON/insignias.json";
const PATH_GOLPES    = "JSON/golpes.json";

const STORAGE_KEY   = "gymTower_v1";
const STORAGE_STAGE = "gym_current_stage_v1";

const CP_RANGES = [
  { min: 600,  max: 1000 },   // Nível 1
  { min: 800,  max: 1200 },   // 2
  { min: 1000, max: 1400 },   // 3
  { min: 1200, max: 1600 },   // 4
  { min: 1400, max: 1800 },   // 5
  { min: 1600, max: 2000 },   // 6
  { min: 1800, max: 2200 },   // 7
  { min: 2000, max: 2500 },   // 8
];
const BOSS_RANGE = { min: 2500, max: 3500 };

const PROB_SHINY = 0.01; // 1%

/* Normalização de tipos */
const TYPE_FIX = new Map([
  ["Eletric", "Electric"],
  ["Psyquic", "Psychic"],
  ["ice",     "Ice"],
]);

/* Estado em memória */
let tower = null;
let pokemons = [];
let insignias = [];
let golpesDB = [];

/* Utilidades */
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const pickRandom = (arr) => arr[Math.floor(Math.random()*arr.length)];
const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);

function normType(t) {
  if (!t) return "";
  const fixed = TYPE_FIX.get(t) || t;
  return String(fixed).trim();
}
function hasType(p, t) {
  if (t === "All") return true;
  const t1 = String(p["Type 1"] ?? "").trim();
  const t2 = String(p["Type 2"] ?? "").trim();
  return normType(t1) === t || normType(t2) === t;
}
function avg(arr) {
  return arr.reduce((s,n) => s + n, 0) / (arr.length || 1);
}

/* Calcula CP com base nos atributos */
function calcCP(p) {
  const atk  = Number(p.Attack)   || 0;
  const def  = Number(p.Defense)  || 0;
  const spA  = Number(p["Sp. Atk"]) || 0;
  const spD  = Number(p["Sp. Def"]) || 0;
  const hp   = Number(p.HP)       || 0;
  const spd  = Number(p.Speed)    || 0;
  const tier = Number(p.Tierlist) || 0;

  let cp = ((atk + spA) * 2 + (def + spD) * 1.5 + hp * 2 + spd) / 6;
  cp *= 1 + (tier / 10);

  return Math.round(cp);
}

/* Movimentos */
function moveType(m)  { return normType(m.Type || ""); }
function moveName(m)  { return String(m.Name || "").trim(); }

function pickMovesForPokemon(p, golpes) {
  const t1 = normType(p["Type 1"] ?? "");
  const t2 = normType(p["Type 2"] ?? "");
  const valid = (golpes || []).filter(g => moveName(g));

  const stab = valid.filter(g => {
    const gt = moveType(g);
    return gt && (gt === t1 || gt === t2);
  });
  const rest = valid.filter(g => !stab.includes(g));

  let g1 = null, g2 = null;
  if (stab.length) g1 = pickRandom(stab);
  if (stab.length > 1) g2 = pickRandom(stab.filter(x => x !== g1));
  if (!g2) g2 = rest.length ? pickRandom(rest) : g1;

  return {
    golpe1: moveName(g1 || {}),
    golpe2: moveName(g2 || {})
  };
}

/* Converte Pokémon do JSON para formato de batalha */
function toBattlePokemon(p, level, golpes) {
  const cpReal = calcCP(p);
  const baseCP = Number(p.CP ?? p["CP Base"] ?? cpReal);
  const ivCalc = baseCP > 0 ? Number((cpReal / baseCP).toFixed(2)) : 1;
  const shiny = Math.random() < PROB_SHINY ? "Sim" : "Não";
  const { golpe1, golpe2 } = pickMovesForPokemon(p, golpes);

  return {
    ID: p.ID ?? p.Pokedex,
    Pokedex: p.Pokedex ?? "",
    Name: p.Name ?? "",
    "Type 1": p["Type 1"] ?? "",
    "Type 2": p["Type 2"] ?? "",
    CP: cpReal,
    IV: ivCalc,
    Total: p.Total ? Number(p.Total) : null,
    HP: p.HP ? Number(p.HP) : null,
    Attack: p.Attack ? Number(p.Attack) : null,
    Defense: p.Defense ? Number(p.Defense) : null,
    "Sp. Atk": p["Sp. Atk"] ? Number(p["Sp. Atk"]) : null,
    "Sp. Def": p["Sp. Def"] ? Number(p["Sp. Def"]) : null,
    Speed: p.Speed ? Number(p.Speed) : null,
    Tierlist: p.Tierlist ?? null,
    "Golpe 1": golpe1,
    "Golpe 2": golpe2,
    Shiny: shiny,
    _uid: p._uid ?? null
  };
}

/* Seleciona time dentro de um range de CP médio */
function pickTeamByTypeAndRange(all, t, range, tries = 600) {
  const pool = all.filter(p => hasType(p, t));
  if (pool.length < 6) return all.slice(0,6);

  const target = (range.min + range.max) / 2;
  let best = null;
  let bestDelta = Infinity;

  for (let i=0; i<tries; i++) {
    const sample = shuffle(pool.slice()).slice(0, 6);
    const m = avg(sample.map(calcCP));
    const delta = Math.abs(m - target);

    if (m >= range.min && m <= range.max && delta < bestDelta) {
      best = sample;
      bestDelta = delta;
    }
  }
  return best || pool.slice(0,6);
}

/* Sorteia insígnias */
function drawEightBadges(list) {
  const unique = list.slice();
  shuffle(unique);
  return unique.slice(0, 8).map((it, i) => ({
    level: i+1,
    badgeId: it.ID,
    type: normType(it.Type),
  }));
}

/* Inicializa torre */
async function initTower() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try { tower = JSON.parse(saved); }
    catch { localStorage.removeItem(STORAGE_KEY); }
  }

  if (!tower) {
    const eight = drawEightBadges(insignias);
    const levels = [];

    for (let i=0; i<8; i++) {
      const { level, badgeId, type } = eight[i];
      const range = CP_RANGES[i];
      const team  = pickTeamByTypeAndRange(pokemons, type, range);
      const teamFull = team.map(p => toBattlePokemon(p, level, golpesDB));
      const avgCP    = Math.round(avg(teamFull.map(p => p.CP)));
      levels.push({ level, badgeId, type, range, team: teamFull, avgCP });
    }

    // Boss
    {
      const team  = pickTeamByTypeAndRange(pokemons, "All", BOSS_RANGE);
      const teamFull = team.map(p => toBattlePokemon(p, 9, golpesDB));
      const avgCP    = Math.round(avg(teamFull.map(p => p.CP)));
      levels.push({ boss: true, level: 9, type: "All", range: BOSS_RANGE, team: teamFull, avgCP });
    }

    tower = { levels, current: 1 };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tower));
  }
}

/* Renderiza torre */
function renderTower() {
  const el = document.getElementById("tower");
  el.innerHTML = "";

  const levelsDesc = [
    "Iniciante", "Aprendiz", "Desafiante", "Avançado",
    "Veterano", "Elite", "Mestre", "Campeão"
  ];

  tower.levels.forEach((node, idx) => {
    const isBoss   = !!node.boss;
    const status   = (idx+1 < tower.current) ? "done" :
                     (idx+1 === tower.current) ? "current" : "locked";

    const stage = document.createElement("div");
    stage.className = "stage" + (isBoss ? " boss" : "");

    let badgeHTML = "";
    if (!isBoss) {
      const src = `insignias/${node.badgeId}.png`;
      badgeHTML = `
        <div class="badge">
          <img src="${src}" alt="Insígnia ${node.type}">
        </div>`;
    } else {
      badgeHTML = `<div class="badge" style="background:rgba(0,0,0,.18);">
        <span style="font-weight:900; font-size:clamp(12px,2dvh,18px); opacity:.8;">★</span>
      </div>`;
    }

    const title = isBoss ? "BOSS FINAL" : `Nível ${node.level} — ${levelsDesc[node.level-1] || ""}`;
    const sub   = ""; // não exibe CP médio nem tipo

    const stateClass = `state ${status}`;

    stage.innerHTML = `
      ${badgeHTML}
      <div class="info">
        <h3 class="level-title">${title}</h3>
        <p class="level-sub">${sub}</p>
      </div>
      <div class="${stateClass}">${status === "done" ? "Vencido" : status === "current" ? "Próximo" : "Bloqueado"}</div>
    `;

    el.appendChild(stage);
  });

  document.getElementById("btnStart").disabled = (tower.current > tower.levels.length);
}

/* Botões */
function wireButtons() {
  document.getElementById("btnTeam").addEventListener("click", () => {
    window.location.href = "equipe.html";
  });
  document.getElementById("btnPowerUp").addEventListener("click", () => {
    window.location.href = "intervalo.html";
  });
  document.getElementById("btnStart").addEventListener("click", () => {
    const idx = tower.current - 1;
    if (idx < 0 || idx >= tower.levels.length) return;
    const stage = tower.levels[idx];
    localStorage.setItem(STORAGE_STAGE, JSON.stringify(stage));
    window.location.href = "batalha.html";
  });
}

/* Áudio */
function setupAudio() {
  const audio = document.getElementById("bgm");
  const start = () => { audio.volume = 0.75; audio.play().catch(()=>{}); };
  audio.play().catch(() => {
    document.addEventListener("click", start, { once: true });
  });
}

/* Carregamento */
async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Falha ao carregar ${path}`);
  return res.json();
}

/* Boot */
(async function main() {
  try {
    [pokemons, insignias, golpesDB] = await Promise.all([
      loadJSON(PATH_POKEMONS),
      loadJSON(PATH_INSIGNIAS),
      loadJSON(PATH_GOLPES),
    ]);

    insignias = insignias.map(it => ({ ...it, Type: normType(it.Type) }));

    await initTower();
    renderTower();
    wireButtons();
    setupAudio();
  } catch (err) {
    console.error(err);
    alert("Erro ao carregar dados dos ginásios.");
  }
})();
