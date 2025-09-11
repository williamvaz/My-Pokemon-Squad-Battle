/* ==========================
   Torre dos Ginásios — Lógica
   ========================== */

const PATH_POKEMONS  = "JSON/pokemons.json";   // ajuste se seu caminho for diferente
const PATH_INSIGNIAS = "JSON/insignias.json";  // já anexado por você
const PATH_GOLPES    = "JSON/golpes.json"; // <-- novo
const PROB_SHINY     = 0.01;               // 1% de chance
const BADGE_IMG_PATH = "insignias/";           // 1.png ... 59.png

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

/* Normalização de tipos com grafia diferente no insignias.json */
const TYPE_FIX = new Map([
  ["Eletric", "Electric"],
  ["Psyquic", "Psychic"],
  ["ice",     "Ice"],
]);

/* Estado em memória */
let tower = null; // { levels: [ {level,badgeId,type,teamIds,avgCP,range}, ... , {boss:true,teamIds,...} ], current: 1..9 }
let pokemons = [];
let insignias = [];
let golpesDB = []; // <- lista de golpes carregada do JSON

/* Utilidades */
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const pickRandom = (arr) => arr[Math.floor(Math.random()*arr.length)];
const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);

function normType(t) {
  if (!t) return "";
  const fixed = TYPE_FIX.get(t) || t;
  return String(fixed).trim();
}
function getCP(p) {
  // Usamos as chaves mais comuns do teu projeto
  return Number(p.CP ?? p.cp ?? p["Cp"] ?? p["CP Base"] ?? p["CPBase"]);
}
function hasType(p, t) {
  if (t === "All") return true;
  const t1 = String(p["Type 1"] ?? p.type1 ?? "").trim();
  const t2 = String(p["Type 2"] ?? p.type2 ?? "").trim();
  return normType(t1) === t || normType(t2) === t;
}
function avg(arr) {
  return arr.reduce((s,n) => s + n, 0) / (arr.length || 1);
}

// ---- Aleatório / chances ----
function chance(p) { return Math.random() < p; }
function rand(min, max) { return min + Math.random() * (max - min); }

// ---- Faixas de IV por estágio (0–1) ----
const IV_TABLE = {
  1: [0.35, 0.55],
  2: [0.40, 0.60],
  3: [0.45, 0.65],
  4: [0.50, 0.70],
  5: [0.55, 0.75],
  6: [0.60, 0.80],
  7: [0.65, 0.85],
  8: [0.70, 0.90],
  9: [0.85, 0.98], // Boss
};
function calcIVForStage(level) {
  const [a, b] = IV_TABLE[level] || [0.5, 0.8];
  return Number(rand(a, b).toFixed(2));
}

// ---- Normalizadores para golpes ----
function moveType(m)  { return normType(m.Type || m["Tipo"] || m["Tp"] || ""); }
function moveName(m)  { return String(m.Name || m["Golpe"] || m["Move"] || "").trim(); }

// Escolhe 2 golpes: prioriza STAB; se faltar, completa com qualquer outro
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

function toBattlePokemon(p, level, golpes) {
  const iv = calcIVForStage(level);                 // IV calculado pela dificuldade
  const shiny = chance(PROB_SHINY) ? "Sim" : "Não"; // 1% de chance
  const { golpe1, golpe2 } = pickMovesForPokemon(p, golpes);

  return {
    ID: p.ID ?? p.id ?? p.Pokedex,
    Pokedex: p.Pokedex ?? "",
    Name: p.Name ?? "",
    "Type 1": p["Type 1"] ?? "",
    "Type 2": p["Type 2"] ?? "",
    CP: getCP(p),
    IV: iv,
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


/* Seleciona um time de 6 Pokémon cujo CP médio caia no range
   - t: tipo (ou "All" para qualquer um)
   - range: {min,max}
   - tries: nº de tentativas aleatórias para aproximar a média
*/
function pickTeamByTypeAndRange(all, t, range, tries = 600) {
  const pool = all.filter(p => hasType(p, t) && Number.isFinite(getCP(p)));
  const poolUnique = Array.from(new Map(pool.map(p => [p.ID ?? p.id ?? p.Pokedex ?? p.Name, p])).values());
  if (poolUnique.length < 6) {
    // se o tipo for raro, usa todos os pokés como fallback
    return pickTeamByTypeAndRange(all, "All", range, tries);
  }

  const target = (range.min + range.max) / 2;
  let best = null;
  let bestDelta = Infinity;

  for (let i=0; i<tries; i++) {
    const sample = shuffle(poolUnique.slice()).slice(0, 6);
    const m = avg(sample.map(getCP));
    const delta = Math.abs(m - target);

    const inside = (m >= range.min && m <= range.max);
    if (inside && delta < bestDelta) { best = sample; bestDelta = delta; if (delta < 1) break; }
    else if (!best || delta < bestDelta) { best = sample; bestDelta = delta; }
  }
  return best;
}

/* Sorteia 8 insígnias (sem repetir) e gera o Boss */
function drawEightBadges(list) {
  const unique = list.slice();
  shuffle(unique);
  // pega as 8 primeiras
  return unique.slice(0, 8).map((it, i) => ({
    level: i+1,
    badgeId: it.ID,
    type: normType(it.Type),
  }));
}

/* Cria/Carrega torre do localStorage */
async function initTower() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try { tower = JSON.parse(saved); }
    catch { localStorage.removeItem(STORAGE_KEY); }
  }

  if (!tower) {
    // desenha 8 insígnias
    const eight = drawEightBadges(insignias);

    // monta níveis
    const levels = [];
    for (let i=0; i<8; i++) {
    const { level, badgeId, type } = eight[i];
    const range = CP_RANGES[i];
    const team  = pickTeamByTypeAndRange(pokemons, type, range);
    const teamFull = team.map(p => toBattlePokemon(p, level, golpesDB)); // <- passa level e golpes
    const avgCP    = Math.round(avg(teamFull.map(p => p.CP)));
    levels.push({ level, badgeId, type, range, team: teamFull, avgCP });


    }

    // Boss (sem tipo → All)
    {
      const team  = pickTeamByTypeAndRange(pokemons, "All", BOSS_RANGE);
    const teamFull = team.map(p => toBattlePokemon(p, 9, golpesDB)); // 9 = Boss
    const avgCP    = Math.round(avg(teamFull.map(p => p.CP)));
    levels.push({ boss: true, level: 9, type: "All", range: BOSS_RANGE, team: teamFull, avgCP });

    }

    tower = { levels, current: 1 }; // current = 1º desafio ainda não vencido
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tower));
  }
}

/* Renderiza a torre (sem revelar os times!) */
function renderTower() {
  const el = document.getElementById("tower");
  el.innerHTML = "";

  const levelsDesc = [
    "1ª INSIGNIA", "2ª INSIGNIA", "3ª INSIGNIA", "4ª INSIGNIA",
    "5ª INSIGNIA", "6ª INSIGNIA", "7ª INSIGNIA", "8ª INSIGNIA"
  ];

  tower.levels.forEach((node, idx) => {
    const isBoss   = !!node.boss;
    const status   = (idx+1 < tower.current) ? "done" :
                     (idx+1 === tower.current) ? "current" : "locked";

    const stage = document.createElement("div");
    stage.className = "stage" + (isBoss ? " boss" : "");

    // Coluna 1: badge (apenas níveis 1–8). Boss não mostra badge.
    let badgeHTML = "";
    if (!isBoss) {
      const src = `${BADGE_IMG_PATH}${node.badgeId}.png`;
      badgeHTML = `
        <div class="badge">
          <img src="${src}" alt="Insígnia ${node.type}">
        </div>`;
    } else {
      badgeHTML = `<div class="badge" style="background:rgba(0,0,0,.18);">
        <span style="font-weight:900; font-size:clamp(12px,2dvh,18px); opacity:.8;">★</span>
      </div>`;
    }

    // Coluna 2: info
    const title = isBoss ? "TORNEIO POKEMON" : `Nível ${node.level} — ${levelsDesc[node.level-1] || ""}`;
    const sub = ""; // não mostra nada abaixo do título

    // Coluna 3: selo de estado
    const label = isBoss ? "BOSS" : `Lv ${node.level}`;
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

  // Habilita botão iniciar apenas se houver desafio atual
  document.getElementById("btnStart").disabled = (tower.current > tower.levels.length);
}

/* Navegação dos botões */
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

    // Salva o desafio atual (sem revelar nada na UI)
    const stage = tower.levels[idx];
    localStorage.setItem(STORAGE_STAGE, JSON.stringify(stage));

    // Vai pra batalha
    window.location.href = "batalha.html";
  });
}

/* Quando vencer uma batalha, outra tela deve fazer:
   const t = JSON.parse(localStorage.getItem("gymTower_v1"));
   t.current += 1;
   localStorage.setItem("gymTower_v1", JSON.stringify(t));
   // e voltar para ginasios.html para ver a progressão
*/

/* Áudio: iniciar ao primeiro clique (autoplay seguro em mobile) */
function setupAudio() {
  const audio = document.getElementById("bgm");
  const start = () => { audio.volume = 0.75; audio.play().catch(()=>{}); };
  // tenta auto-start; se o navegador bloquear, liga no primeiro clique
  audio.play().catch(() => {
    document.addEventListener("click", start, { once: true });
  });
}

/* Carrega JSONs */
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


    // normaliza tipos das insígnias
    insignias = insignias.map(it => ({ ...it, Type: normType(it.Type) }));

    await initTower();
    renderTower();
    wireButtons();
    setupAudio();
  } catch (err) {
    console.error(err);
    alert("Erro ao carregar dados dos ginásios. Verifique os arquivos JSON no projeto.");
  }
})();
