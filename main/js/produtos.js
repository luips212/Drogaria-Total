// DROGARIA TOTAL | produtos.js: catálogo, busca e filtro
const produtos = () => { let p = ler('produtos_drogaria'); if (!p) { p = SEED; gravar('produtos_drogaria', p); } return p; };

// 1. CATÁLOGO (RF01) - busca por nome e filtro por categoria
function renderCatalogo() {
  const lista = $('lista-produtos'); if (!lista) return;
  const cats = ['Todas', ...new Set(produtos().map(p => p.cat))];
  if (!$('filtro-cat').options.length) $('filtro-cat').innerHTML = cats.map(c => `<option>${c}</option>`).join('');
  const q = $('busca').value.toLowerCase().trim(), c = $('filtro-cat').value;
  const r = produtos().filter(p => (c === 'Todas' || p.cat === c) && p.nome.toLowerCase().includes(q));
  lista.innerHTML = r.length ? r.map(p => `<article class="produto">
    <span class="tag">${esc(p.cat)}</span>${p.receita ? '<span class="tag receita">Exige receita</span>' : ''}
    <h3>${esc(p.nome)}</h3><p>${brl(p.preco)}</p>
    <small>${p.estoque > 0 ? p.estoque + ' em estoque' : 'Indisponível'}</small>
    <button type="button" ${p.estoque < 1 ? 'disabled' : ''} onclick="adicionarAoCarrinho(${p.id})">Adicionar ao Carrinho</button>
  </article>`).join('') : '<p>Nenhum produto encontrado.</p>';
}
