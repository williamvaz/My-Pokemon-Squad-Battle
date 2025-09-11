// ======= CONFIG =======
const TEAM_SIZE = 6;
const TEAM_KEY  = "equipe_ids";     // ids únicos dos pokémons na equipe
const POKES_KEY = "pokemons";       // array de pokémons do jogador

// ======= DOM =======
const pokecoinsEl = document.getElementById("pokecoins");
const megarocksEl = document.getElementById("megarocks");
const teamEl      = document.getElementById("team");
const invEl       = document.getElementById("inventory");
const searchEl    = document.getElementById("search");
const sortEl      = document.getElementById("sort");
const saveBtn     = document.getElementById("save");
const backBtn     = document.getElementById("back");

// ======= Estado =======
let allMons = [];         // todos do localStorage (com _uid garantido)
let teamIds = [];         // array de _uid (tamanho <= TEAM_SIZE)
let dragUid = null;       // para DnD (drag and drop)

// ======= Helpers =======
function getCoins() { return Number(localStorage.getItem("Pokemoedas")) || 0; }
function getRocks() { return Number(localStorage.getItem("Mega Rock")) || 0; }
function setCoins(v) { localStorage.setItem("Pokemoedas", v); }
function setRocks(v) { localStorage.setItem("Mega Rock", v); }

function uid() {
  return "u" + Date.now().toString(36) + Math.random().toString(36).slice(2,8);
}

// garante _uid para cada mon e salva de volta se necessário
function loadMons() {
  const arr = JSON.parse(localStorage.getItem(POKES_KEY)) || [];
  let changed = false;
  for (const p of arr) {
    if (!p._uid) { p._uid = uid(); changed = true; }
  }
  if (changed) localStorage.setItem(POKES_KEY, JSON.stringify(arr));
  return arr;
}

function loadTeam() {
  const ids = JSON.parse(localStorage.getItem(TEAM_KEY)) || [];
  return Array.isArray(ids) ? ids.slice(0, TEAM_SIZE) : [];
}
function saveTeam() {
  localStorage.setItem(TEAM_KEY, JSON.stringify(teamIds));
}

// caminho da imagem (respeita shiny)
function pokeImg(p) {
  const id4 = String(p.ID).padStart(4, "0");
  return p.Shiny === "Sim"
    ? `pokemons/shiny/${id4}-shiny.png`
    : `pokemons/normal/${id4}.png`;
}

// tipos
function typeIcons(p) {
  const t1 = p["Type 1"], t2 = p["Type 2"];
  return `
    ${t1 ? `<img class="type-icon" src="types/${t1}.png" alt="${t1}">` : ""}
    ${t2 ? `<img class="type-icon" src="types/${t2}.png" alt="${t2}">` : ""}
  `;
}

// ======= Render =======
function renderHUD() {
  pokecoinsEl.textContent = getCoins();
  megarocksEl.textContent = getRocks();
}

function renderTeam() {
  teamEl.innerHTML = "";
  const map = new Map(allMons.map(m => [m._uid, m]));

  for (let i = 0; i < TEAM_SIZE; i++) {
    const uid = teamIds[i];
    if (!uid || !map.has(uid)) {
      const slot = document.createElement("div");
      slot.className = "slot";
      // permite soltar em slots vazios
      slot.addEventListener("dragover", ev => ev.preventDefault());
      slot.addEventListener("drop", () => dropOnIndex(i));
      teamEl.appendChild(slot);
      continue;
    }
    const mon = map.get(uid);

    const card = document.createElement("div");
    card.className = "team-card";
    card.setAttribute("draggable", "true");
    card.dataset.uid = uid;

    card.innerHTML = `
      <button class="remove-btn">×</button>
      <img src="${pokeImg(mon)}" alt="${mon.Name}">
      <div class="team-name">${mon.Name}</div>
      <div class="team-meta">
        <span>CP: ${mon.CP}</span>
      </div>
      <div class="team-meta">${typeIcons(mon)}</div>
    `;

    // drag start
    card.addEventListener("dragstart", () => { dragUid = uid; });
    // permitir soltar em cima de outro card (swap)
    card.addEventListener("dragover", ev => ev.preventDefault());
    card.addEventListener("drop", () => dropOnIndex(i));

    // remover
    card.querySelector(".remove-btn").onclick = () => {
      teamIds = teamIds.filter(id => id !== uid);
      renderTeam(); renderInventory(); saveTeam();
    };

    teamEl.appendChild(card);
  }
}

function dropOnIndex(targetIndex) {
  if (!dragUid) return;
  const fromIndex = teamIds.indexOf(dragUid);
  if (fromIndex === -1) return;

  // se soltou em slot vazio e já existe, move para posição
  // se soltou em card, faz swap
  const toUid = teamIds[targetIndex];
  if (!toUid) {
    teamIds.splice(fromIndex, 1);
    teamIds.splice(targetIndex, 0, dragUid);
  } else {
    teamIds[fromIndex] = toUid;
    teamIds[targetIndex] = dragUid;
  }
  dragUid = null;
  renderTeam(); saveTeam();
}

// inventário (fora da equipe)
function renderInventory() {
  invEl.innerHTML = "";

  const term = (searchEl.value || "").trim().toLowerCase();
  const notInTeam = allMons.filter(m => !teamIds.includes(m._uid));

  // ordenar
  const key = sortEl.value;
  notInTeam.sort((a,b) => {
    if (key === "CP")  return b.CP - a.CP;                       // desc
    if (key === "IV")  return (b.IV||0) - (a.IV||0);             // desc
    if (key === "ID")  return Number(a.ID) - Number(b.ID);       // asc

    return 0;
  });

  // filtrar por nome
  const list = term ? notInTeam.filter(m => m.Name.toLowerCase().includes(term)) : notInTeam;

  for (const p of list) {
    const card = document.createElement("div");
    card.className = "inv-card";
    card.innerHTML = `
  <img src="${pokeImg(p)}" alt="${p.Name}">
  <div class="inv-name">${p.Name}</div>

  <!-- Tipos (agora aparece no inventário também) -->
  <div class="card-types">
    ${typeIcons(p)}
  </div>

  <div class="inv-meta">CP: ${p.CP} • ${Math.round((p.IV||0)*100)}%</div>
  <button class="add-btn">Adicionar</button>
`;
    const btn = card.querySelector(".add-btn");
    btn.disabled = teamIds.length >= TEAM_SIZE;
    btn.onclick = () => {
      if (teamIds.length >= TEAM_SIZE) return;
      teamIds.push(p._uid);
      renderTeam(); renderInventory(); saveTeam();
    };

    invEl.appendChild(card);
  }
}

// ======= Init =======
function init() {
  // HUD
  renderHUD();

  // dados
  allMons = loadMons();
  teamIds = loadTeam();

  // preencher área da equipe
  renderTeam();
  // preencher inventário
  renderInventory();

  // eventos
  searchEl.addEventListener("input", renderInventory);
  sortEl.addEventListener("change", renderInventory);

  saveBtn.onclick = () => {
    saveTeam();
    // Vai para batalha:
    window.location.href = "ginasios.html";
  };
  backBtn.onclick = () => history.back();
}

document.addEventListener("DOMContentLoaded", init);
