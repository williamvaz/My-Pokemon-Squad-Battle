/* ==============================
   INICIALIZAÇÃO DA PÁGINA
   ============================== */
document.addEventListener("DOMContentLoaded", () => {

  /* -------- HUD (pokecoins e megarocks) -------- */
  const pokecoinsEl = document.getElementById("pokecoins"); // span/div que mostra quantidade de Pokemoedas
  const megarocksEl = document.getElementById("megarocks"); // span/div que mostra quantidade de Mega Rocks

  /* -------- GRID DE POKÉMONS -------- */
  const grid = document.getElementById("pokemon-grid"); // container (grid) onde os cards serão inseridos

  /* -------- CARREGAR DADOS DO LOCALSTORAGE -------- */
  // Busca a lista de pokémons salvos (ou cria array vazio caso não tenha nada)
  const pokemons = JSON.parse(localStorage.getItem("pokemons")) || [];

  // Atualiza HUD com valores salvos ou inicia com 0
  pokecoinsEl.textContent = localStorage.getItem("Pokemoedas") || 0;
  megarocksEl.textContent = localStorage.getItem("Mega Rock") || 0;

  /* -------- EXIBIR POKÉMONS NA TELA -------- */
  pokemons.forEach(p => {
    // Criar elemento div para cada card
    const div = document.createElement("div");
    div.classList.add("pokemon-card");

// Estrutura interna do card (HTML montado dinamicamente)
div.innerHTML = `
  <div class="pokemon-inner">
    <!-- Imagem do Pokémon -->
    <img class="pokemon-image" 
         src="pokemons/${p.Shiny === 'Sim' ? 'shiny' : 'normal'}/${p.ID.padStart(4, '0')}.png" 
         alt="${p.Name}">
    
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


    // Inserir card pronto dentro do grid
    grid.appendChild(div);
  });

});
