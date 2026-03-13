const usuarioAtual = localStorage.getItem("usuarioQR");

if (!usuarioAtual) {
  window.location.replace("index.html");
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#nome-operador").innerText = usuarioAtual;
  iniciarCamera();
});

document.querySelector("#btn-logout").addEventListener("click", () => {
  localStorage.removeItem("usuarioQR");
  window.location.replace("index.html");
});

let scanner;
let cameraAtiva = false;
let codigoPendente = "";
const modalMovimento = document.querySelector("#modal-movimento");

document
  .querySelector("#btn-ligar-camera")
  .addEventListener("click", iniciarCamera);
document
  .querySelector("#btn-parar-camera")
  .addEventListener("click", pararCamera);

function iniciarCamera() {
  if (cameraAtiva) return;
  if (!scanner) scanner = new Html5Qrcode("reader");

  scanner
    .start(
      { facingMode: "environment" },
      { fps: 10, qrbox: { width: 250, height: 250 } },
      sucessoLeitura,
    )
    .then(() => {
      cameraAtiva = true;
    })
    .catch((err) => console.error(err));
}

function pararCamera() {
  if (scanner && cameraAtiva) {
    scanner
      .stop()
      .then(() => {
        cameraAtiva = false;
      })
      .catch((err) => console.error(err));
  }
}

function sucessoLeitura(decodedText) {
  pararCamera();
  codigoPendente = decodedText;
  document.querySelector("#modal-codigo-lido").innerText = codigoPendente;
  document.querySelector("#movimento-qtd").value = 1;
  modalMovimento.showModal();
}

document
  .querySelector("#form-movimento")
  .addEventListener("submit", (event) => {
    event.preventDefault();

    const nomeProduto = document.querySelector("#movimento-nome-produto").value;
    const origem = document.querySelector("#movimento-origem").value;
    const destino = document.querySelector("#movimento-destino").value;

    const tipo = document.querySelector("#movimento-tipo").value;
    const qtd = parseInt(document.querySelector("#movimento-qtd").value);
    const dataAtual = new Date().toLocaleString("pt-PT");

    let estoque = JSON.parse(localStorage.getItem("estoqueQR")) || [];

    estoque.push({
      codigo: codigoPendente,
      nomeProduto: nomeProduto,
      origem: origem,
      destino: destino,
      tipo: tipo,
      quantidade: qtd,
      data: dataAtual,
      operador: usuarioAtual,
    });

    localStorage.setItem("estoqueQR", JSON.stringify(estoque));

    document.querySelector("#movimento-nome-produto").value = "";
    document.querySelector("#movimento-origem").value = "";
    document.querySelector("#movimento-destino").value = "";

    modalMovimento.close();
    iniciarCamera();
  });

document.querySelector("#cancelar-movimento").addEventListener("click", () => {
  modalMovimento.close();
  iniciarCamera();
});
