// DROGARIA TOTAL | carrinho.js: carrinho, quantidades, frete e resumo
const carrinho = () => ler('carrinho_v2', []);
const frete = sub => (sub === 0 || sub >= FRETE_GRATIS) ? 0 : FRETE;
function totais() {
  const itens = carrinho().map(i => ({...produtos().find(p => p.id === i.id), qtd: i.qtd})).filter(i => i.nome);
  const subtotal = itens.reduce((a, i) => a + i.preco * i.qtd, 0);
  return { itens, subtotal, frete: frete(subtotal), total: subtotal + frete(subtotal) };
}

// 2. CARRINHO (RF02) - quantidades respeitando o estoque
function adicionarAoCarrinho(id) { alterarQtd(id, 1, true); }
function alterarQtd(id, d, novo) {
  const c = carrinho(), p = produtos().find(x => x.id === id); let it = c.find(i => i.id === id);
  if (!it) { if (!novo) return; it = {id, qtd: 0}; c.push(it); }
  if (it.qtd + d > p.estoque) return aviso('Estoque máximo atingido.');
  it.qtd += d; gravar('carrinho_v2', c.filter(i => i.qtd > 0));
  if (novo) aviso(p.nome + ' adicionado ao carrinho'); carregarCarrinho();
}
function removerDoCarrinho(id) { gravar('carrinho_v2', carrinho().filter(i => i.id !== id)); carregarCarrinho(); }
function carregarCarrinho() {
  const tb = $('itens-carrinho'); if (!tb) return;
  const t = totais();
  tb.innerHTML = t.itens.length ? t.itens.map(i => `<tr><td>${esc(i.nome)}</td>
    <td><button type="button" class="mini" onclick="alterarQtd(${i.id},-1)">−</button> ${i.qtd} <button type="button" class="mini" onclick="alterarQtd(${i.id},1)">+</button></td>
    <td>${brl(i.preco)}</td><td>${brl(i.preco * i.qtd)}</td>
    <td><button type="button" onclick="removerDoCarrinho(${i.id})">Remover</button></td></tr>`).join('')
    : '<tr><td colspan="5" style="text-align:center;">Seu carrinho está vazio.</td></tr>';
  $('total-carrinho').innerHTML = `Subtotal: ${brl(t.subtotal)}<br>Entrega: ${t.frete ? brl(t.frete) : 'Grátis'} (grátis acima de ${brl(FRETE_GRATIS)})<br><strong>Total: ${brl(t.total)}</strong>`;
}
function carregarResumoCompra() {
  const el = $('resumo-compra'); if (!el) return;
  const t = totais();
  el.innerHTML = t.itens.length ? `<li>Total de itens: ${t.itens.reduce((a, i) => a + i.qtd, 0)}</li><li>Subtotal: ${brl(t.subtotal)}</li>
    <li>Entrega: ${t.frete ? brl(t.frete) : 'Grátis'}</li><li><strong>Valor final: ${brl(t.total)}</strong></li>
    ${t.itens.some(i => i.receita) ? '<li class="aviso">Há itens que exigem receita médica: apresente-a ao entregador/farmacêutico.</li>' : ''}`
    : '<li>Seu carrinho está vazio. <a href="../index.html">Ver produtos</a></li>';
}
