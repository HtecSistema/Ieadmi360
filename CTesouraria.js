function parseBR(v){
  if(!v) return 0;
  v = v.toString().replace(/[^0-9,-]/g,'').replace(',', '.');
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
}
function formatBR(n){
  return n.toLocaleString('pt-BR', {minimumFractionDigits:2, maximumFractionDigits:2});
}
function formatarInput(el){
  let v = el.value.replace(/\D/g,'');
  if(!v) { el.value=''; calcular(); return; }
  let num = parseInt(v,10)/100;
  el.value = formatBR(num);
  calcular();
}

function calcular(){
  const dizimos = parseBR(document.getElementById('dizimos').value);
  const ofertas = parseBR(document.getElementById('ofertas').value);
  const saldoAnt = parseBR(document.getElementById('saldoAnterior').value);
  const totalEntradas = dizimos + ofertas;
  document.getElementById('totalEntradas').value = formatBR(totalEntradas);

  const obra25 = totalEntradas * 0.25;
  const repasse35 = totalEntradas * 0.35;
  const gratif20 = totalEntradas * 0.20;
  const prebenda10 = gratif20 * 0.10;
  const carneMissoes = parseBR(document.getElementById('carneMissoes')?.value);
  const ofertaMilho = parseBR(document.getElementById('ofertaMilho')?.value);
  const liquido = gratif20 - prebenda10 - carneMissoes - ofertaMilho;

  document.getElementById('obra25').value = formatBR(obra25);
  document.getElementById('gratif20').value = formatBR(gratif20);
  document.getElementById('prebenda10').value = formatBR(prebenda10);
  document.getElementById('repasse35').value = formatBR(repasse35);
  document.getElementById('cxGratif').value = formatBR(liquido);

  let somaOutras = 0;
  for(let i=1;i<=14;i++){
    const el = document.getElementById('s'+i);
    if(el) somaOutras += parseBR(el.value);
  }
  const totalSaidas = obra25 + repasse35 + gratif20 + somaOutras;
  const totalRepasse = obra25 + repasse35 + prebenda10 + carneMissoes + ofertaMilho;

  document.getElementById('totalSaidas').value = formatBR(totalSaidas);
  document.getElementById('confSaldoAnt').value = formatBR(saldoAnt);
  document.getElementById('confEntrada').value = formatBR(totalEntradas);
  document.getElementById('somaConf').value = formatBR(saldoAnt + totalEntradas);
  document.getElementById('confSaida').value = formatBR(totalSaidas);
  const elRepasse = document.getElementById('confRepasse');
  if(elRepasse) elRepasse.value = formatBR(totalRepasse);
  document.getElementById('saldoCaixa').value = formatBR((saldoAnt + totalEntradas) - totalSaidas);
}

function gerarDatasAutomatico(){
  const mesInput = document.getElementById('deMes').value;
  if(!mesInput) return;
  const [ano, mes] = mesInput.split('-').map(Number);
  const primeiro = new Date(ano, mes-1, 1);
  const ultimo = new Date(ano, mes, 0);
  const fmt = d => d.toISOString().split('T')[0];
  document.getElementById('doDia').value = fmt(primeiro);
  document.getElementById('aDia').value = fmt(ultimo);
}
function limparTudo(){
  if(!confirm('Limpar todos os campos?')) return;
  document.querySelectorAll('input.valor').forEach(i=> i.value='');
  document.getElementById('dizimoDirigente').value='';
  calcular();
  localStorage.removeItem('tesCong');
}
function salvar(){
  const dados = {};
  document.querySelectorAll('input').forEach(i=> dados[i.id]=i.value);
  localStorage.setItem('tesCong', JSON.stringify(dados));
  alert('Salvo com sucesso!');
}
function carregar(){
  const raw = localStorage.getItem('tesCong');
  if(!raw) return;
  try{
    const dados = JSON.parse(raw);
    Object.keys(dados).forEach(k=>{
      const el = document.getElementById(k);
      if(el) el.value = dados[k];
    });
    calcular();
  }catch(e){}
}
function excluir(){
  if(!confirm('Excluir dados salvos?')) return;
  localStorage.removeItem('tesCong');
  limparTudo();
}
function imprimir(){
  const cong = document.getElementById('congregacao').value || '';
  const dir = document.getElementById('dirigente').value || '';
  const tes = document.getElementById('tesoureiro').value || '';
  const doDia = document.getElementById('doDia').value || '';
  const aDia = document.getElementById('aDia').value || '';
  const deMes = document.getElementById('deMes').value || '';
  const pCongH = document.getElementById('p-cong-header');
  if(pCongH) pCongH.innerText = cong;
  const pPer = document.getElementById('p-periodo');
  if(pPer) pPer.innerText = 'De '+doDia+' a '+aDia+' de '+deMes;
  const pCong = document.getElementById('p-cong');
  if(pCong) pCong.innerText = cong;
  const pDir = document.getElementById('p-dirig');
  if(pDir) pDir.innerText = dir;
  const pTes = document.getElementById('p-tes');
  if(pTes) pTes.innerText = tes;
  const pDiz = document.getElementById('p-diz');
  if(pDiz) pDiz.innerText = document.getElementById('dizimos').value || '0,00';
  const pOfer = document.getElementById('p-ofer');
  if(pOfer) pOfer.innerText = document.getElementById('ofertas').value || '0,00';
  const pTotalE = document.getElementById('p-totalE');
  if(pTotalE) pTotalE.innerText = document.getElementById('totalEntradas').value;
  
  const lista = [
    ['Obra Missionaria 25%', 'obra25'],
    ['Repasse Regional 35%', 'repasse35'],
    ['Gratificacao 20% da Soma', 'gratif20'],
    ['(-) Dizimo de Prebenda 10%', 'prebenda10'],
    ['(-) Carne de Missoes', 'carneMissoes'],
    ['(-) Oferta do Milho', 'ofertaMilho'],
    ['Liquido Dirigente', 'cxGratif'],
    ['Luz, Agua e Telefone', 's1'],
    ['Material de Limpeza', 's2'],
    ['Material de Escritorio', 's3'],
    ['Material de Ceia', 's4'],
    ['Despesa com Construcao', 's5'],
    ['Despesa com Eventos', 's6'],
    ['Combustivel', 's7'],
    ['Consertos em Geral', 's8'],
    ['Frete e Correios', 's9'],
    ['Prestacao de Servicos', 's10'],
    ['Viagem Brasilia', 's11'],
    ['Contador', 's12'],
    ['Prestacao de Terreno', 's13'],
    ['Assistencia Social', 's14'],
  ];
  const pSaidas = document.getElementById('p-saidas');
  if(pSaidas){
    pSaidas.innerHTML='';
    lista.forEach(pair=>{
      const el = document.getElementById(pair[1]);
      const v = el ? el.value : '0,00';
      pSaidas.innerHTML+='<div class="print-row">'+pair[0]+': <span class="dots"></span> <b>'+v+'</b></div>';
    });
  }
  const elTotalS = document.getElementById('p-totalS');
  if(elTotalS) elTotalS.innerText = document.getElementById('totalSaidas').value;
  const el1 = document.getElementById('p-saldoAnt');
  if(el1) el1.innerText = document.getElementById('confSaldoAnt').value;
  const el2 = document.getElementById('p-confE');
  if(el2) el2.innerText = document.getElementById('confEntrada').value;
  const el3 = document.getElementById('p-soma');
  if(el3) el3.innerText = document.getElementById('somaConf').value;
  const el4 = document.getElementById('p-confS');
  if(el4) el4.innerText = document.getElementById('confSaida').value;
  const el5 = document.getElementById('p-saldo');
  if(el5) el5.innerText = document.getElementById('saldoCaixa').value;
  const el6 = document.getElementById('p-dizDir');
  if(el6) el6.innerText = document.getElementById('dizimoDirigente').value || '0,00';
  const el7 = document.getElementById('p-repasse');
  if(el7) el7.innerText = document.getElementById('confRepasse')?.value || '0,00';

  window.print();
}
document.addEventListener('DOMContentLoaded', ()=>{
  document.querySelectorAll('input.valor').forEach(el=>{
    el.addEventListener('input', ()=> formatarInput(el));
    el.addEventListener('focus', ()=> el.select());
  });

  const btnVerMais = document.getElementById('btnVerMais');
  const despesasExtras = document.getElementById('despesasExtras');
  if(btnVerMais && despesasExtras){
    btnVerMais.addEventListener('click', ()=>{
      const aberto = despesasExtras.style.display !== 'none';
      despesasExtras.style.display = aberto ? 'none' : 'block';
      btnVerMais.innerText = aberto ? '▼ Ver mais despesas (Luz até Assistência)' : '▲ Ocultar despesas';
    });
  }

  const deMesEl = document.getElementById('deMes');
  if(deMesEl){
    deMesEl.addEventListener('change', gerarDatasAutomatico);
    deMesEl.addEventListener('input', gerarDatasAutomatico);
  }
  carregar();
  calcular();
  document.getElementById('btnSalvar').addEventListener('click', salvar);
  document.getElementById('btnLimpar').addEventListener('click', limparTudo);
  document.getElementById('btnExcluir').addEventListener('click', excluir);
  document.getElementById('btnPrint').addEventListener('click', imprimir);
});
