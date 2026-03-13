document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("usuarioQR")) {
    window.location.replace("scanner.html");
  }
});

document.querySelector("#form-login").addEventListener("submit", (event) => {
  event.preventDefault(); 
  const nome = document.querySelector("#input-nome").value.trim();
  
  if (nome !== "") {
    localStorage.setItem("usuarioQR", nome);
    window.location.replace("scanner.html");
  }
});