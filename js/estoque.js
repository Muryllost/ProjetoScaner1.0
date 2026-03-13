const usuarioAtual = localStorage.getItem("usuarioQR");

if (!usuarioAtual) {
  window.location.replace("index.html");
}

document.addEventListener("DOMContentLoaded", () => {
  carregarEstoque();
});

document.querySelector("#btn-logout").addEventListener("click", () => {
  localStorage.removeItem("usuarioQR");
  window.location.replace("home.html");
});

document.querySelector("#btn-limpar-estoque").addEventListener("click", () => {
  if (confirm("Tens a certeza que desejas apagar todo o histórico?")) {
    localStorage.removeItem("estoqueQR");
    carregarEstoque();
  }
});

function carregarEstoque() {
  const lista = document.querySelector("#lista-produtos");
  lista.innerHTML = "";

  const estoque = JSON.parse(localStorage.getItem("estoqueQR")) || [];

  if (estoque.length === 0) {
    lista.innerHTML =
      "<p style='text-align:center; color:#888;'>Nenhum histórico ainda.</p>";
    return;
  }

  estoque.forEach((item) => {
    const li = document.createElement("li");
    li.classList.add("item-estoque");

    li.style.borderLeftColor = item.tipo === "ENTRADA" ? "#00ffcc" : "#ff4c4c";

    const classeTipo = item.tipo === "ENTRADA" ? "tag-entrada" : "tag-saida";
    const iconeTipo =
      item.tipo === "ENTRADA" ? "arrow_downward" : "arrow_upward";

    // Aqui renderizamos o Nome, Origem e Destino do produto
    li.innerHTML = `
      <div>
        <span class="codigo">${item.nomeProduto} (${item.codigo})</span> <br>
        <span class="rota-tag">🛫 De: <strong>${item.origem}</strong> | 🛬 Para: <strong>${item.destino}</strong></span>
        <span class="${classeTipo}">
          <span class="material-symbols-outlined" style="font-size: 16px;">${iconeTipo}</span> 
          ${item.tipo}
        </span>
        <span class="operador-tag">👤 Por: ${item.operador} | 🕒 ${item.data}</span>
      </div>
      <div class="quantidade-tag">
        ${item.quantidade}x
      </div>
    `;
    lista.appendChild(li);
  });
}
