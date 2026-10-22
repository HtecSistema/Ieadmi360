function toFloat(v){
  if(!v) return 0;
  // transforma 1.000,00 -> 1000.00
  v = v.toString().replace(/\./g,'').replace(',','.');
  return parseFloat(v)||0;
}
function fmt(v){
  return v.toLocaleString('pt-BR',{minimumFractionDigits:2, maximumFractionDigits:2});
}
function mascaraAoDigitar(e){
  let v=e.target.value.replace(/\D/g,'');
  if(v===''){
    calcular();
    return;
  }
  v=(parseInt(v,10)/100).toFixed(2);
  v=v.replace('.',',');
  v=v.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
  e.target.value=v;
  calcular();
}
function calcular(){
  let t=0;
  document.querySelectorAll('.valor').forEach(i=>{
    t+=toFloat(i.value);
  });
  document.getElementById('totalEntrada').value=t>0?fmt(t):'';
}

function preencherAuto(){
  let dataVal=document.getElementById('dataDia').value;
  if(!dataVal) return;
  let d=new Date(dataVal+'T12:00:00');
  let meses=['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  let dias=['Domingo','Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sábado'];
  document.getElementById('mesLanc').value = `${meses[d.getMonth()]} de ${d.getFullYear()}`;
  document.getElementById('diaSemana').value = dias[d.getDay()];
}

document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('.valor').forEach(inp=>{
    inp.addEventListener('input',mascaraAoDigitar);
    inp.addEventListener('blur',function(){calcular();});
    inp.addEventListener('focus',function(){setTimeout(()=>this.select(),50);});
    inp.addEventListener('wheel',e=>{e.preventDefault(); inp.blur();},{passive:false});
    inp.addEventListener('keydown',e=>{if(e.key==='ArrowUp'||e.key==='ArrowDown') e.preventDefault();});
  });
  document.addEventListener('keydown',e=>{
    if(e.key==='Enter' && e.target.tagName==='INPUT'){
      e.preventDefault();
      let inputs=Array.from(document.querySelectorAll('input:not([readonly])'));
      let idx=inputs.indexOf(document.activeElement);
      if(idx>-1 && idx+1<inputs.length) inputs[idx+1].focus();
    }
  });
  document.getElementById('dataDia').addEventListener('change',preencherAuto);
  document.getElementById('dataDia').addEventListener('input',preencherAuto);
  document.getElementById('btnSalvar').addEventListener('click',()=>{
    let dados={};
    document.querySelectorAll('input').forEach(i=>dados[i.id]=i.value);
    localStorage.setItem('relSemanal',JSON.stringify(dados));
    alert('Salvo!');
  });
  document.getElementById('btnLimpar').addEventListener('click',()=>{
    if(confirm('Limpar valores?')){
      document.querySelectorAll('.valor').forEach(i=>i.value='');
      calcular();
    }
  });
  document.getElementById('btnEnviar').addEventListener('click',()=>{
    let cong=document.getElementById('congregacao').value||'CONG';
    let data=document.getElementById('dataDia').value||'data';
    let num=localStorage.getItem('numSemanal'); if(!num) num=1; else num=parseInt(num)+1; localStorage.setItem('numSemanal',num);
    let nome=`Ts - ${cong} - ${data} - ${String(num).padStart(3,'0')}`;
    let tit=document.title; document.title=nome; window.print(); setTimeout(()=>document.title=tit,1000);
  });
  calcular();
});
