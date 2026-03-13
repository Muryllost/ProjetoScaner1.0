document.querySelector("#btn-voltar-login").addEventListener("click", () => {
  window.location.replace("home.html");
});

document.querySelector("#form-cadastro").addEventListener("submit", (event) => {
  event.preventDefault();

  const nome = document.querySelector("#novo-nome").value.trim();

  if (nome !== "") {
    let operadores = JSON.parse(localStorage.getItem("listaOperadores")) || [];
    operadores.push(nome);
    localStorage.setItem("listaOperadores", JSON.stringify(operadores));

    alert("Operador registado com sucesso!");
    window.location.replace("home.html");
  }
});
