document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("usuarioQR")) {
    window.location.replace("scanner.html");
  }
});

document.querySelector("#btn-ir-cadastro").addEventListener("click", () => {
  window.location.replace("cadastro.html");
});

document.querySelector("#form-login").addEventListener("submit", (event) => {
  event.preventDefault();
  const nome = document.querySelector("#input-nome").value.trim();

  let operadores = JSON.parse(localStorage.getItem("listaOperadores")) || [];

  if (operadores.includes(nome) || operadores.length === 0) {
    localStorage.setItem("usuarioQR", nome);
    window.location.replace("scanner.html");
  } else {
    alert("Operador não encontrado! Por favor, efetua o registo primeiro.");
  }
});
