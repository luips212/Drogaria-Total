// DROGARIA TOTAL | main.js: inicialização
// Inicialização: roda as telas que existirem na página atual
document.addEventListener('DOMContentLoaded', () => {
  renderCatalogo(); carregarCarrinho(); carregarResumoCompra(); configurarCadastroCliente();
  configurarEndereco(); configurarPagamento(); carregarStatus(); iniciarAdmin();
});
