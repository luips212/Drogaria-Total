// DROGARIA TOTAL | cadastro.js: cadastro do cliente e endereço
// 3. CADASTRO (RF03, RN01, RNF02) - senha guardada só como hash; sem dados na URL
async function hash(s) {
  if (!crypto.subtle) return 'indisponivel';
  const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('');
}
function configurarCadastroCliente() {
  const f = $('form-cliente'); if (!f) return;
  document.querySelectorAll('input[name="tipo_cadastro"]').forEach(r => r.addEventListener('change', e => {
    $('container-email').style.display = e.target.value === 'email' ? 'block' : 'none';
    $('container-telefone').style.display = e.target.value === 'email' ? 'none' : 'block';
  }));
  f.addEventListener('submit', async e => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(f)), tel = d.tipo_cadastro === 'telefone';
    const contato = (tel ? d.telefone : d.email || '').trim();
    if (!contato) return alert(tel ? 'Informe o telefone.' : 'Informe o e-mail.');
    if (d.senha.length < 6) return alert('A senha deve ter pelo menos 6 caracteres.');
    gravar('cliente_drogaria', {nome: d.nome.trim(), tipo: d.tipo_cadastro, contato, senha: await hash(d.senha)});
    location.href = 'cadastro-endereco.html';
  });
}
function configurarEndereco() {
  const f = $('form-endereco'); if (!f) return;
  $('cep').addEventListener('blur', async () => { // preenchimento automático (ViaCEP)
    const c = $('cep').value.replace(/\D/g, ''); if (c.length !== 8) return;
    try { const r = await (await fetch(`https://viacep.com.br/ws/${c}/json/`)).json();
      if (!r.erro) { $('rua').value = r.logradouro; $('bairro').value = r.bairro; $('cidade').value = r.localidade; $('estado').value = r.uf; }
    } catch {}
  });
  f.addEventListener('submit', e => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(f));
    if (!AREA_ENTREGA.includes(d.cidade.trim().toLowerCase())) return alert('Desculpe, ainda não entregamos nessa cidade (RN02).');
    gravar('endereco_drogaria', d); location.href = 'pagamento.html';
  });
}
