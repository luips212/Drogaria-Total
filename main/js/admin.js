// DROGARIA TOTAL | admin.js: Área da Farmácia
// 5. PAINEL DA FARMÁCIA (RF06) - pedidos, estoque, produtos e Curva ABC
function iniciarAdmin() {
  const raiz = $('admin-root'); if (!raiz) return;
  if (sessionStorage.getItem('admin_ok') !== '1') {
    if (prompt('Senha da Área da Farmácia:') !== PIN_ADMIN) return raiz.innerHTML = '<p>Acesso negado. Recarregue a página para tentar de novo.</p>';
    sessionStorage.setItem('admin_ok', '1');
  }
  const ped = ler('pedidos_drogaria', []), prods = produtos();
  const venda = {}; ped.filter(p => p.status !== 'Cancelado').forEach(p => p.itens.forEach(i => venda[i.nome] = (venda[i.nome] || 0) + i.preco * i.qtd));
  const ord = Object.entries(venda).sort((a, b) => b[1] - a[1]), tot = ord.reduce((a, x) => a + x[1], 0); let ac = 0;
  const abc = ord.map(([n, v]) => { ac += v; return `<tr><td>${esc(n)}</td><td>${brl(v)}</td><td>${ac / tot <= 0.8 ? 'A' : ac / tot <= 0.95 ? 'B' : 'C'}</td></tr>`; }).join('');
  raiz.innerHTML = `<section><h2>Pedidos (${ped.length})</h2><div class="rolagem"><table><thead><tr><th>Nº</th><th>Cliente</th><th>Entrega</th><th>Total</th><th>Status</th></tr></thead><tbody>
    ${ped.slice().reverse().map(p => `<tr><td>#${p.id}</td><td>${esc(p.cliente.nome)}<br><small>${esc(p.cliente.contato)}</small></td>
    <td>${esc(p.endereco.rua)}, ${esc(p.endereco.numero)} - ${esc(p.endereco.bairro || '')}, ${esc(p.endereco.cidade)}</td><td>${brl(p.total)}</td>
    <td><select onchange="mudarStatus(${p.id}, this.value)">${STATUS.map(s => `<option ${s === p.status ? 'selected' : ''}>${s}</option>`).join('')}</select></td></tr>`).join('')
    || '<tr><td colspan="5">Nenhum pedido ainda.</td></tr>'}</tbody></table></div></section>
  <section><h2>Estoque e produtos</h2><div class="rolagem"><table><thead><tr><th>Produto</th><th>Preço (R$)</th><th>Estoque</th><th></th></tr></thead><tbody>
    ${prods.map(p => `<tr class="${p.estoque <= 10 ? 'baixo' : ''}"><td>${esc(p.nome)}${p.estoque <= 10 ? ' ⚠ estoque baixo' : ''}</td>
    <td><input type="text" id="pr${p.id}" value="${p.preco.toFixed(2)}" size="6"></td><td><input type="text" id="es${p.id}" value="${p.estoque}" size="4"></td>
    <td><button type="button" onclick="salvarProduto(${p.id})">Salvar</button> <button type="button" onclick="excluirProduto(${p.id})">Excluir</button></td></tr>`).join('')}</tbody></table></div>
    <h3>Novo produto</h3><div class="toolbar"><input type="text" id="n-nome" placeholder="Nome"><input type="text" id="n-cat" placeholder="Categoria"><input type="text" id="n-preco" placeholder="Preço"><input type="text" id="n-est" placeholder="Estoque">
    <label><input type="checkbox" id="n-rec"> Exige receita</label><button type="button" onclick="novoProduto()">Adicionar</button></div></section>
  <section><h2>Curva ABC (por faturamento)</h2><table><thead><tr><th>Produto</th><th>Faturado</th><th>Classe</th></tr></thead><tbody>${abc || '<tr><td colspan="3">Sem vendas ainda.</td></tr>'}</tbody></table></section>`;
}
function mudarStatus(id, s) {
  const ped = ler('pedidos_drogaria', []), p = ped.find(x => x.id === id); p.status = s;
  if (['Saiu para entrega', 'Entregue', 'Cancelado'].includes(s))
    p.msgs.push({quando: new Date().toLocaleString('pt-BR'), texto: `Drogaria Total: seu pedido #${id} está "${s}".`});
  gravar('pedidos_drogaria', ped); aviso('Status atualizado');
}
const num = v => parseFloat(String(v).replace(',', '.'));
function salvarProduto(id) {
  const pr = num($('pr' + id).value), es = parseInt($('es' + id).value);
  if (isNaN(pr) || isNaN(es) || pr < 0 || es < 0) return alert('Valores inválidos.');
  gravar('produtos_drogaria', produtos().map(p => p.id === id ? {...p, preco: pr, estoque: es} : p)); iniciarAdmin(); aviso('Produto salvo');
}
function excluirProduto(id) { if (confirm('Excluir este produto?')) { gravar('produtos_drogaria', produtos().filter(p => p.id !== id)); iniciarAdmin(); } }
function novoProduto() {
  const nome = $('n-nome').value.trim(), cat = $('n-cat').value.trim(), preco = num($('n-preco').value), est = parseInt($('n-est').value);
  if (!nome || !cat || isNaN(preco) || isNaN(est)) return alert('Preencha nome, categoria, preço e estoque.');
  gravar('produtos_drogaria', [...produtos(), {id: Date.now(), nome, cat, preco, estoque: est, receita: $('n-rec').checked}]); iniciarAdmin();
}
