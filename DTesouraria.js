// FORMATAÇÃO E CÁLCULO
function toFloat(v){ return parseFloat(v) || 0; }
function fmt(v){ return v.toLocaleString('pt-BR',{minimumFractionDigits:2, maximumFractionDigits:2}); }

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
  console.log('Preenchido:', primeiroDia, ate ? ultimoDia : '');
}

document.addEventListener('DOMContentLoaded', function(){
  // DECIMAL, SEM SCROLL, SEM SETA
  document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('input', mascaraAoDigitar);
    input.addEventListener('blur', function(){ if(this.value !== '') mascaraDecimal(this); calcular(); });
    input.addEventListener('focus', function(){ setTimeout(()=>this.select(),50); });
    input.addEventListener('wheel', e => { e.preventDefault(); input.blur(); }, {passive:false});
    input.addEventListener('keydown', e => { if(e.key==='ArrowUp'||e.key==='ArrowDown') e.preventDefault(); });
  });

  // ENTER COMO TAB
  document.addEventListener('keydown', function(e){
    if(e.key==='Enter' && e.target.tagName==='INPUT'){
      e.preventDefault();
      let inputs = Array.from(document.querySelectorAll('input:not([readonly]):not([disabled])'));
      let idx = inputs.indexOf(document.activeElement);
      if(idx>-1 && idx+1<inputs.length) inputs[idx+1].focus();
    }
  });

  // MÊS -> DATA
  let mesAnoEl = document.getElementById('mesAno');
  if(mesAnoEl){
    mesAnoEl.addEventListener('change', preencherDatas);
    mesAnoEl.addEventListener('input', preencherDatas);
  }

  calcular();
});
