function toFloat(v){ return parseFloat(v) || 0; }
function fmt(v){ return v.toLocaleString('pt-BR',{minimumFractionDigits:2, maximumFractionDigits:2}); }
function getVal(id){ let el=document.getElementById(id); if(!el) return '0,00'; let v=el.value; if(!v) return '0,00'; if(v.includes(',')) return v; let n=parseFloat(v); return isNaN(n)?'0,00':n.toLocaleString('pt-BR',{minimumFractionDigits:2}); }

function calcular(){
  let entradas = 0;
  document.querySelectorAll('.entrada').forEach(i => entradas += toFloat(i.value));
  let dizimo = entradas * 0.10;
  let repasse = entradas * 0.20;
  if(document.getElementById('dizimo10')) document.getElementById('dizimo10').value = dizimo > 0 ? dizimo.toFixed(2) : '';
  if(document.getElementById('repasse20')) document.getElementById('repasse20').value = repasse > 0 ? repasse.toFixed(2) : '';
  let saidas = 0;
  document.querySelectorAll('.saida').forEach(i => saidas += toFloat(i.value));
  let caixaAnt = toFloat(document.getElementById('caixaAnterior').value);
  document.getElementById('totalEntradas').value = fmt(entradas);
  document.getElementById('totalSaidas').value = fmt(saidas);
  document.getElementById('confEntradas').value = fmt(entradas);
  document.getElementById('confSaidas').value = fmt(saidas);
  document.getElementById('somaConf').value = fmt(caixaAnt + entradas);
  document.getElementById('saldoCaixa').value = fmt((caixaAnt + entradas) - saidas);
}
function mascaraAoDigitar(e){
  let v = e.target.value.replace(/\D/g,'');
  if(v === ''){ calcular(); return; }
  v = (parseInt(v) / 100).toFixed(2);
  e.target.value = v;
  calcular();
}
function mascaraDecimal(input){
  let val = input.value.replace(',', '.');
  val = parseFloat(val);
  if(!isNaN(val)) input.value = val.toFixed(2);
}
function preencherDatas(){
  let campo = document.getElementById('mesAno');
  if(!campo || !campo.value) return;
  let [ano, mes] = campo.value.split('-');
  ano = parseInt(ano); mes = parseInt(mes);
  if(!ano || !mes) return;
  let primeiroDia = `${ano}-${String(mes).padStart(2,'0')}-01`;
  let ultimoDiaNum = new Date(ano, mes, 0).getDate();
  let ultimoDia = `${ano}-${String(mes).padStart(2,'0')}-${String(ultimoDiaNum).padStart(2,'0')}`;
  let de = document.getElementById('periodoDe');
  let ate = document.getElementById('periodoAte');
  if(de) de.value = primeiroDia;
  if(ate) ate.value = ultimoDia;
}

function imprimirRelatorio(){
  // PEGA DADOS PRA NOME DO ARQUIVO
  let cong = document.getElementById('congregacao').value || 'CONG';
  cong = cong.replace(/[^a-zA-Z0-9\- ]/g,'').trim().replace(/\s+/g,' - ');
  let mesAno = document.getElementById('mesAno').value;
  let mesNome = 'MES';
  let ano = 'ANO';
  if(mesAno){
    let [a,m]=mesAno.split('-');
    let meses=['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
    mesNome = meses[parseInt(m)-1];
    ano = a;
  }
  // NUMERO DO RELATORIO - SALVA AUTOMATICO E VAI INCREMENTANDO
  let num = localStorage.getItem('numRelatorio');
  if(!num) num = 1; else num = parseInt(num)+1;
  localStorage.setItem('numRelatorio', num);
  let numFormat = String(num).padStart(3,'0');

  // NOME DO PDF: Ts - nome da cong - mes - ano - numero
  let nomeArquivo = `Ts - ${cong} - ${mesNome} - ${ano} - ${numFormat}`;

  // PREENCHE O MODELO DA FOTO COM OS VALORES
  document.getElementById('p-depto').innerText = document.getElementById('depto').value || '________________';
  document.getElementById('p-cong').innerText = document.getElementById('congregacao').value || '________________';
  let de = document.getElementById('periodoDe').value;
  let ate = document.getElementById('periodoAte').value;
  if(de){ let d=de.split('-'); document.getElementById('p-de').innerText = `${d[2]}/${d[1]}/${d[0]}`; }
  if(ate){ let d=ate.split('-'); document.getElementById('p-ate').innerText = `${d[2]}/${d[1]}/${d[0]}`; }
  if(mesAno){
    let [a,m]=mesAno.split('-');
    let meses=['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
    document.getElementById('p-mes').innerText = meses[parseInt(m)-1];
    document.getElementById('p-ano').innerText = a;
  }
  document.getElementById('p-e1').innerText = getVal('e1');
  document.getElementById('p-e2').innerText = getVal('e2');
  document.getElementById('p-e3').innerText = getVal('e3');
  document.getElementById('p-totalE').innerText = getVal('totalEntradas');
  document.getElementById('p-dizimo').innerText = getVal('dizimo10');
  document.getElementById('p-repasse').innerText = getVal('repasse20');
  document.getElementById('p-s1').innerText = getVal('s1');
  document.getElementById('p-s2').innerText = getVal('s2');
  document.getElementById('p-s3').innerText = getVal('s3');
  document.getElementById('p-s4').innerText = getVal('s4');
  document.getElementById('p-s5').innerText = getVal('s5');
  document.getElementById('p-s6').innerText = getVal('s6');
  document.getElementById('p-totalS').innerText = getVal('totalSaidas');
  document.getElementById('p-caixaAnt').innerText = getVal('caixaAnterior');
  document.getElementById('p-confE').innerText = getVal('confEntradas');
  document.getElementById('p-somaConf').innerText = getVal('somaConf');
  document.getElementById('p-confS').innerText = getVal('confSaidas');
  document.getElementById('p-saldo').innerText = getVal('saldoCaixa');

  // DEFINE O NOME DO PDF AUTOMATICO
  let tituloOriginal = document.title;
  document.title = nomeArquivo;

  window.print();

  // VOLTA O TITULO DEPOIS
  setTimeout(()=>{ document.title = tituloOriginal; }, 1000);
}

document.addEventListener('DOMContentLoaded', function(){
  document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('input', mascaraAoDigitar);
    input.addEventListener('blur', function(){ if(this.value !== '') mascaraDecimal(this); calcular(); });
    input.addEventListener('focus', function(){ setTimeout(()=>this.select(),50); });
    input.addEventListener('wheel', e => { e.preventDefault(); input.blur(); }, {passive:false});
    input.addEventListener('keydown', e => { if(e.key==='ArrowUp'||e.key==='ArrowDown') e.preventDefault(); });
  });
  document.addEventListener('keydown', function(e){
    if(e.key==='Enter' && e.target.tagName==='INPUT'){
      e.preventDefault();
      let inputs = Array.from(document.querySelectorAll('input:not([readonly]):not([disabled])'));
      let idx = inputs.indexOf(document.activeElement);
      if(idx>-1 && idx+1<inputs.length) inputs[idx+1].focus();
    }
  });
  let mesAnoEl = document.getElementById('mesAno');
  if(mesAnoEl){
    mesAnoEl.addEventListener('change', preencherDatas);
    mesAnoEl.addEventListener('input', preencherDatas);
  }
  let btnPrint = document.getElementById('btnPrintTop');
  if(btnPrint) btnPrint.addEventListener('click', imprimirRelatorio);
  let btnLimpar = document.getElementById('btnLimparTop');
  if(btnLimpar) btnLimpar.addEventListener('click', ()=>{ document.querySelectorAll('input[type="number"]').forEach(i=>i.value=''); calcular(); });
  calcular();
});
