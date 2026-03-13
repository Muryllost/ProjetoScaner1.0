document.addEventListener("DOMContentLoaded", () => {
  verificarLogin();
  if (usuarioAtual) iniciarCamera();
});

// Seletores Globais
const abas = document.querySelectorAll("nav button");
const telas = document.querySelectorAll(".tela");
const btnLogin = document.querySelector("#btn-login");
const btnLogout = document.querySelector("#btn-logout");
const modalMovimento = document.querySelector("#modal-movimento");
const btnSalvarMovimento = document.querySelector("#salvar-movimento");
const btnCancelarMovimento = document.querySelector("#cancelar-movimento");

// Variáveis de Estado
let scanner;
let cameraAtiva = false;
let estoque = JSON.parse(localStorage.getItem('estoqueQR')) || [];
let usuarioAtual = localStorage.getItem('usuarioQR') || null;
let codigoPendente = ""; // Guarda o código lido até o usuário confirmar no modal

// --- NAVEGAÇÃO ENTRE TELAS ---
abas.forEach(aba => {
  aba.addEventListener("click", (e) => {
    const targetId = e.currentTarget.id.replace('tab-', '');
    
    telas.forEach(t => t.classList.remove('ativa'));
    abas.forEach(b => b.classList.remove('active'));

    document.querySelector(`#tela-${targetId}`).classList.add('ativa');
    e.currentTarget.classList.add('active');

    if (targetId === 'scanner' && usuarioAtual) {
      iniciarCamera();
    } else {
      pararCamera();
    }

    if (targetId === 'estoque') atualizarListaNaTela();
    if (targetId === 'perfil') verificarLogin();
  });
});

// --- SISTEMA DE LOGIN ---
btnLogin.addEventListener("click", (event) => {
  event.preventDefault();
  const nome = document.querySelector('#input-nome').value.trim();
  
  if (!nome) {
    alert("Por favor, digite seu nome ou matrícula!");
    return;
  }
  
  usuarioAtual = nome;
  localStorage.setItem('usuarioQR', usuarioAtual);
  verificarLogin();
  alert(`Bem-vindo(a), ${nome}!`);
});

btnLogout.addEventListener("click", () => {
  usuarioAtual = null;
  localStorage.removeItem('usuarioQR');
  document.querySelector('#input-nome').value = "";
  pararCamera();
  verificarLogin();
});

function verificarLogin() {
  const areaLogin = document.querySelector('#area-login');
  const areaLogada = document.querySelector('#area-logada');
  const nomeLogado = document.querySelector('#nome-logado');

  if (usuarioAtual) {
    areaLogin.style.display = "none";
    areaLogada.style.display = "block";
    nomeLogado.innerText = usuarioAtual;
    atualizarEstatisticas();
  } else {
    areaLogin.style.display = "block";
    areaLogada.style.display = "none";
  }
}

function atualizarEstatisticas() {
  if (!usuarioAtual) return;
  const minhasLeituras = estoque.filter(item => item.operador === usuarioAtual).length;
  document.querySelector('#total-leituras').innerText = minhasLeituras;
}

// --- LÓGICA DA CÂMERA E LEITURA ---
document.querySelector("#btn-ligar-camera").addEventListener("click", iniciarCamera);
document.querySelector("#btn-parar-camera").addEventListener("click", pararCamera);

function iniciarCamera() {
  if (cameraAtiva || !usuarioAtual) return;
  if (!scanner) scanner = new Html5Qrcode("reader");

  scanner.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: { width: 250, height: 250 } },
    sucessoLeitura
  ).then(() => { cameraAtiva = true; }).catch(err => console.error(err));
}

function pararCamera() {
  if (scanner && cameraAtiva) {
    scanner.stop().then(() => { cameraAtiva = false; }).catch(err => console.error(err));
  }
}

// Quando o leitor achar um QR Code
function sucessoLeitura(decodedText) {
  if (!usuarioAtual) {
    alert("Você precisa fazer login no 'Perfil' antes de escanear!");
    document.querySelector("#tab-perfil").click();
    return;
  }

  pararCamera(); 
  
  // Salva o código na variável global temporária e abre o modal
  codigoPendente = decodedText;
  document.querySelector("#modal-codigo-lido").innerText = codigoPendente;
  document.querySelector("#movimento-qtd").value = 1; // reseta quantidade
  modalMovimento.showModal();
}

// --- MODAL DE REGISTRO ---
btnSalvarMovimento.addEventListener("click", (event) => {
  event.preventDefault();
  
  const tipo = document.querySelector("#movimento-tipo").value;
  const qtd = document.querySelector("#movimento-qtd").value;

  if (qtd <= 0) {
    alert("A quantidade precisa ser maior que zero!");
    return;
  }

  const dataAtual = new Date().toLocaleString('pt-BR');
  
  // Salva o objeto completo (Futuramente esse é o JSON que vai pro Fetch)
  estoque.push({ 
    codigo: codigoPendente, 
    tipo: tipo,
    quantidade: parseInt(qtd),
    data: dataAtual,
    operador: usuarioAtual 
  });
  
  localStorage.setItem('estoqueQR', JSON.stringify(estoque));

  modalMovimento.close();
  codigoPendente = "";
  
  // Religa a câmera automaticamente após salvar
  iniciarCamera();
});

btnCancelarMovimento.addEventListener("click", () => {
  modalMovimento.close();
  codigoPendente = "";
  iniciarCamera();
});

// --- LÓGICA DO ESTOQUE (DOM Dinâmico no seu estilo) ---
document.querySelector("#btn-limpar-estoque").addEventListener("click", () => {
  if (confirm("Tem certeza que deseja apagar todo o estoque?")) {
    estoque = [];
    localStorage.removeItem('estoqueQR');
    atualizarListaNaTela();
  }
});

function atualizarListaNaTela() {
  const lista = document.querySelector('#lista-produtos');
  lista.innerHTML = ""; 
  
  if (estoque.length === 0) {
    lista.innerHTML = "<p style='text-align:center; color:#888;'>Nenhum histórico ainda.</p>";
    return;
  }

  // Usando createElement igual você fez no addQuestionToPage()
  estoque.forEach((item) => {
    const li = document.createElement('li');
    li.classList.add('item-estoque');
    
    // Define cor dependendo se é entrada ou saída
    const classeTipo = item.tipo === 'ENTRADA' ? 'tag-entrada' : 'tag-saida';
    const iconeTipo = item.tipo === 'ENTRADA' ? 'arrow_downward' : 'arrow_upward';

    li.innerHTML = `
      <div>
        <strong style="font-size: 18px;">${item.codigo}</strong> <br>
        <span class="${classeTipo}">
          <span class="material-symbols-outlined" style="font-size: 14px;">${iconeTipo}</span> 
          ${item.tipo} (${item.quantidade}x)
        </span><br>
        <span class="operador-tag">👤 ${item.operador}</span>
        <span class="data-hora">${item.data}</span>
      </div>
    `;
    lista.appendChild(li);
  });
}