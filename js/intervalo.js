/* INICIALIZAÇÃO DA PÁGINA */
document.addEventListener("DOMContentLoaded", () => {

/* BARRA SUPERIOR DE MOEDAS */
  const pokecoinsEl = document.getElementById("pokecoins"); // span/div que mostra quantidade de Pokemoedas
  const megarocksEl = document.getElementById("megarocks"); // span/div que mostra quantidade de Mega Rocks

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

/* FUNÇÃO PARA RENDERIZAR CARDS */
function renderPokemons(list) {
  grid.innerHTML = ""; // limpa grid

/* EXIBIR POKEMONS NA TELA */
  list.forEach(p => {
    const div = document.createElement("div");
    div.classList.add("pokemon-card");

/* EXIBIR POKEMONS SHINY NA TELA */
    if (p.Shiny === "Sim") {
      div.classList.add("shiny-card");
    }

/* DEFINIÇÃO DA IMAGEM DO POKEMON */
    const imagePath = p.Shiny === "Sim"
      ? `pokemons/shiny/${p.ID.padStart(4, '0')}-shiny.png`
      : `pokemons/normal/${p.ID.padStart(4, '0')}.png`;

/* ESTRUTURA INTERNA DO CARD */
    div.innerHTML = `
      <div class="pokemon-inner">
        <img class="pokemon-image" src="${imagePath}" alt="${p.Name}">
        <div class="pokemon-name">${p.Name}</div>
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

});
