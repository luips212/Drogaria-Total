// DROGARIA TOTAL - Beta 1.1.0 | config.js: configurações editáveis e produtos iniciais
// (protótipo: dados no navegador via localStorage)
const AREA_ENTREGA = ['cesário lange', 'cesario lange', 'tatuí', 'tatui']; // RN02 - confirmar com o dono
const FRETE = 6, FRETE_GRATIS = 80;
const WHATSAPP = '5515000000000'; // trocar pelo número real da farmácia
const PIN_ADMIN = 'farmacia123'; // apenas protótipo
const STATUS = ['Confirmado', 'Em separação', 'Saiu para entrega', 'Entregue', 'Cancelado'];
const SEED = [
 [1,'Dipirona Sódica 500mg','Medicamentos',8.9,40,0],[2,'Vitamina C 1000mg','Vitaminas',19.9,30,0],
 [3,'Paracetamol 750mg','Medicamentos',11.5,35,0],[4,'Ibuprofeno 400mg','Medicamentos',14.9,25,0],
 [5,'Amoxicilina 500mg','Medicamentos',32,15,1],[6,'Omeprazol 20mg','Medicamentos',18.9,20,0],
 [7,'Vitamina D 2000UI','Vitaminas',29.9,18,0],[8,'Soro Fisiológico 500ml','Higiene',7.5,50,0],
 [9,'Álcool em Gel 70% 500ml','Higiene',9.9,45,0],[10,'Sabonete Líquido 250ml','Higiene',12.9,30,0],
 [11,'Protetor Solar FPS 50','Beleza',42.9,20,0],[12,'Shampoo Anticaspa 200ml','Beleza',24.9,22,0],
 [13,'Fralda Infantil M (30un)','Infantil',49.9,16,0],[14,'Termômetro Digital','Saúde',22,12,0]
].map(([id,nome,cat,preco,estoque,receita]) => ({id,nome,cat,preco,estoque,receita:!!receita}));
