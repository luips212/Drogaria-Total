// DROGARIA TOTAL | utils.js: funções auxiliares (armazenamento, moeda, avisos)
const ler = (k, v) => { try { return JSON.parse(localStorage.getItem(k)) ?? v; } catch { return v; } };
const gravar = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const brl = n => 'R$ ' + Number(n).toFixed(2).replace('.', ',');
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const $ = id => document.getElementById(id);
function aviso(msg) {
  const d = document.createElement('div'); d.className = 'aviso-flutuante'; d.textContent = msg;
  document.body.appendChild(d); setTimeout(() => d.remove(), 2200);
}
