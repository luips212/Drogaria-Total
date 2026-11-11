// DROGARIA TOTAL | pedido.js: pagamento, geração do pedido e status
// 4. PAGAMENTO E PEDIDO (RF04, RF05)
function configurarPagamento() {
  const f = $('form-pagamento'); if (!f) return;
  if (!ler('cliente_drogaria') || !ler('endereco_drogaria') || !totais().itens.length) {
    alert('Para concluir, mantenha itens no carrinho e preencha cadastro e endereço (RN01).'); return location.href = '../index.html';
  }
  document.querySelectorAll('input[name="forma_pagamento"]').forEach(r => r.addEventListener('change', e =>
    $('secao-dinheiro').style.display = e.target.value === 'dinheiro' ? 'block' : 'none'));
  document.querySelectorAll('input[name="precisa_troco"]').forEach(r => r.addEventListener('change', e =>
    $('container-valor-troco').style.display = e.target.value === 'sim' ? 'block' : 'none'));
  f.addEventListener('submit', e => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(f)), t = totais(), ped = ler('pedidos_drogaria', []);
    const id = 1000 + ped.length + 1, cli = ler('cliente_drogaria');
    const msg = s => ({quando: new Date().toLocaleString('pt-BR'), texto: `Drogaria Total: ${s} (pedido #${id}).`});
    ped.push({id, data: new Date().toLocaleString('pt-BR'), cliente: cli, endereco: ler('endereco_drogaria'),
      itens: t.itens.map(i => ({nome: i.nome, preco: i.preco, qtd: i.qtd})), subtotal: t.subtotal, frete: t.frete, total: t.total,
      pagamento: d.forma_pagamento, troco: d.precisa_troco === 'sim' ? d.valor_troco : '', status: 'Confirmado',
      msgs: [msg(`compra confirmada, pagamento via ${d.forma_pagamento}, total ${brl(t.total)}`)]});
    gravar('pedidos_drogaria', ped);
    gravar('produtos_drogaria', produtos().map(p => { const i = t.itens.find(x => x.id === p.id); return i ? {...p, estoque: p.estoque - i.qtd} : p; }));
    localStorage.removeItem('carrinho_v2'); gravar('ultimo_pedido', id); location.href = 'statusped.html';
  });
}
function carregarStatus() {
  const el = $('detalhe-pedido'); if (!el) return;
  const p = ler('pedidos_drogaria', []).find(x => x.id === ler('ultimo_pedido'));
  if (!p) return el.innerHTML = '<p>Nenhum pedido recente. <a href="../index.html">Ver produtos</a></p>';
  const txt = `Olá! Pedido #${p.id} - ${p.itens.map(i => i.qtd + 'x ' + i.nome).join(', ')} - Total ${brl(p.total)}`;
  el.innerHTML = `<article><h3>Pedido #${p.id} registrado!</h3><p>${esc(p.data)} · ${brl(p.total)} · ${esc(p.pagamento)}</p></article>
    <article><h3>Acompanhamento</h3><p><strong>Status atual: ${esc(p.status)}</strong></p>
    <ul>${STATUS.slice(0, 4).map(s => `<li>${s}${s === p.status ? ' ◀' : ''}</li>`).join('')}</ul></article>
    <article><h3>Mensagens enviadas ao cliente (simulação da API)</h3><ul>${p.msgs.map(m => `<li>${esc(m.quando)} — ${esc(m.texto)}</li>`).join('')}</ul>
    <a href="https://wa.me/${WHATSAPP}?text=${encodeURIComponent(txt)}" target="_blank"><button type="button">Falar com a farmácia no WhatsApp</button></a></article>`;
}
