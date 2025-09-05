/* ==============================
   INICIALIZAÇÃO DA PÁGINA
   ============================== */
document.addEventListener("DOMContentLoaded", () => {

/* BARRA SUPERIOR DE MOEDAS */
  const pokecoinsEl = document.getElementById("pokecoins"); // span/div que mostra quantidade de Pokemoedas
  const megarocksEl = document.getElementById("megarocks"); // span/div que mostra quantidade de Mega Rocks

/* GRID DE POKEMONS */
  const grid = document.getElementById("pokemon-grid"); // container (grid) onde os cards serão inseridos

/* CARREGAR POKEMONS DO LOCALSTORAGE */
  const pokemons = JSON.parse(localStorage.getItem("pokemons")) || [];

/* ATUALIZAR QUANTIDADE DE MOEDAS */
  pokecoinsEl.textContent = localStorage.getItem("Pokemoedas") || 0;
  megarocksEl.textContent = localStorage.getItem("Mega Rock") || 0;

/* EXIBIR POKEMONS NA TELA */
  pokemons.forEach(p => {
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
        <!-- Imagem do Pokémon -->
        <img class="pokemon-image" src="${imagePath}" alt="${p.Name}">
        
        <!-- Nome do Pokémon -->
        <div class="pokemon-name">${p.Name}</div>
        
        <!-- Parte inferior do card (tipos + CP) -->
        <div class="pokemon-bottom">
          <div class="types">
            <!-- Tipo principal -->
            <img src="types/${p["Type 1"]}.png" alt="${p["Type 1"]}" class="type-icon">
            
            <!-- Tipo secundário (só aparece se existir) -->
            ${p["Type 2"] && p["Type 2"] !== "" 
              ? `<img src="types/${p["Type 2"]}.png" alt="${p["Type 2"]}" class="type-icon">` 
              : ""}
          </div>
          
          <!-- CP do Pokémon -->
          <div class="cp-label">CP: ${p.CP}</div>
        </div>
      </div>
    `;

    grid.appendChild(div);
  });

});
