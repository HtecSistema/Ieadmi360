// FORMATAÇÃO E CÁLCULO
function toFloat(v){ return parseFloat(v) || 0; }
function fmt(v){ return v.toLocaleString('pt-BR',{minimumFractionDigits:2, maximumFractionDigits:2}); }

function calcular(){
  let entradas = 0;
  document.querySelectorAll('.entrada').forEach(i => entradas += toFloat(i.value));
  
  // Calcula 10% e 20% automático
  let dizimo = entradas * 0.10;
  let repasse = entradas * 0.20;
  
  if(document.getElementById('dizimo10')){
    document.getElementById('dizimo10').value = dizimo > 0 ? dizimo.toFixed(2) : '';
  }
  if(document.getElementById('repasse20')){
    document.getElementById('repasse20').value = repasse > 0 ? repasse.toFixed(2) : '';
  }

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

// Eventos - DECIMAL SEMPRE
function mascaraDecimal(input){
  let valor = input.value.replace(',', '.');
  valor = parseFloat(valor);
  if(isNaN(valor)) return;
  input.value = valor.toFixed(2);
}

function mascaraAoDigitar(e){
  let v = e.target.value.replace(/\D/g,'');
  if(v === ''){ calcular(); return; }
  v = (parseInt(v) / 100).toFixed(2);
  e.target.value = v;
  calcular();
}

document.querySelectorAll('input[type="number"]').forEach(input => {
  input.addEventListener('input', mascaraAoDigitar);
  input.addEventListener('blur', function(){
    if(this.value !== '') mascaraDecimal(this);
    calcular();
  });
  input.addEventListener('focus', function(){
    setTimeout(() => this.select(), 50);
  });
  input.addEventListener('wheel', function(e){
    e.preventDefault();
    this.blur();
  }, {passive: false});
});

// Pra campos de texto (Departamento etc) continuar calculando
document.querySelectorAll('input[type="text"], input[type="month"], input[type="date"]').forEach(input => {
  input.addEventListener('input', calcular);
});


// ENTER FUNCIONA COMO TAB
document.addEventListener('keydown', function(e) {
  if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
    e.preventDefault();
    let inputs = Array.from(document.querySelectorAll('input:not([readonly])'));
    let index = inputs.indexOf(document.activeElement);
    if (index > -1 && index + 1 < inputs.length) {
      inputs[index + 1].focus();
    }
  }
});

document.getElementById('btnPrint').addEventListener('click', () => window.print());

document.getElementById('btnLimpar').addEventListener('click', () => {
  if(!confirm('Limpar tudo?')) return;
  document.querySelectorAll('input[type="number"], input[type="text"].espec').forEach(i => i.value = '');
  document.getElementById('depto').value = 'DEPARTAMENTO DE JOVENS';
  document.getElementById('congregacao').value = 'SEDE - PARAGOMINAS';
  calcular();
});


// MÊS/ANO AUTOMÁTICO -> PREENCHE AS DATAS
document.getElementById('mesAno').addEventListener('change', function(){
  let val = this.value; // vem tipo "2026-10"
  if(!val) return;
  
  let [ano, mes] = val.split('-');
  mes = parseInt(mes);
  ano = parseInt(ano);
  
  // Primeiro dia
  let primeiroDia = `${ano}-${String(mes).padStart(2,'0')}-01`;
  
  // Último dia do mês
  let ultimoDiaNum = new Date(ano, mes, 0).getDate();
  let ultimoDia = `${ano}-${String(mes).padStart(2,'0')}-${String(ultimoDiaNum).padStart(2,'0')}`;
  
  document.getElementById('periodoDe').value = primeiroDia;
  document.getElementById('periodoAte').value = ultimoDia;
  
  calcular();
});

// Inicia
calcular();

// BLOQUEIA O SCROLL DO MOUSE MUDAR O NÚMERO
document.querySelectorAll('input[type="number"]').forEach(input => {
  input.addEventListener('wheel', function(e){
    e.preventDefault();
    this.blur();
  }, {passive: false});
  
  input.addEventListener('focus', function(){
    this.addEventListener('wheel', e => e.preventDefault(), {passive: false});
  });
});

// ENTER FUNCIONA COMO TAB
document.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    let inputs = Array.from(document.querySelectorAll('input'));
    let index = inputs.indexOf(document.activeElement);
    if (index > -1 && index + 1 < inputs.length) {
      inputs[index + 1].focus();
    }
  }
});