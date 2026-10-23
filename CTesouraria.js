function parseBR(v){
  if(!v) return 0;
  let s = v.toString().replace(/\./g,'').replace(',', '.').replace(/[^0-9.-]/g,'');
  const n = parseFloat(s);
  return isNaN(n) ? 0 : n;
}
function formatBR(n){
  if(!n || n === 0) return '0,00';
  return n.toLocaleString('pt-BR', {minimumFractionDigits:2, maximumFractionDigits:2});
}
function formatInputBR(n){
  if(!n || n === 0) return '';
  return n.toLocaleString('pt-BR', {minimumFractionDigits:2, maximumFractionDigits:2});
}
function formatarInput(el){ calcular(); }

// ===== MODAL BONITO IGUAL DA IMAGEM =====
function criarModalSeNaoExiste(){
  if(document.getElementById('modalBonito')) return;
  const html = `
  <div id="modalBonito" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:99999; justify-content:center; align-items:center; padding:20px;">
    <div style="background:#fff; width:100%; max-width:360px; border-radius:16px; padding:22px 18px 16px; text-align:center; box-shadow:0 10px 30px rgba(0,0,0,0.3);">
      <div id="modalTitulo" style="color:#1e5cc6; font-weight:900; font-size:17px; margin-bottom:8px;">Atenção</div>
      <div id="modalTexto" style="color:#111; font-size:13px; font-weight:600; line-height:1.4; white-space:pre-line;"></div>
      <div id="modalBotoes" style="margin-top:18px; display:flex; gap:10px; justify-content:center;">
        <button id="btnModalOk" style="background:#1e5cc6; color:#fff; border:none; border-radius:20px; padding:8px 28px; font-weight:900; font-size:13px; cursor:pointer;">OK</button>
        <button id="btnModalCancel" style="display:none; background:#e5e7eb; color:#111; border:none; border-radius:20px; padding:8px 28px; font-weight:900; font-size:13px; cursor:pointer;">Cancelar</button>
      </div>
    </div>
  </div>`;
  document.body.insertAdjacentHTML('beforeend', html);
}
function fecharModal(){
  const m = document.getElementById('modalBonito');
  if(m) m.style.display='none';
}
function abrirModal(titulo, texto, comCancelar=false, onOk=null){
  criarModalSeNaoExiste();
  document.getElementById('modalTitulo').innerText = titulo;
  document.getElementById('modalTexto').innerText = texto;
  const modal = document.getElementById('modalBonito');
  const btnOk = document.getElementById('btnModalOk');
  const btnCancel = document.getElementById('btnModalCancel');
  
  btnCancel.style.display = comCancelar ? 'block' : 'none';
  modal.style.display='flex';
  
  btnOk.onclick = function(){
    fecharModal();
    if(onOk) onOk();
  };
  btnCancel.onclick = fecharModal;
  modal.onclick = function(e){ if(e.target===modal) fecharModal(); };
}

function calcular(){
  const dizimos = parseBR(document.getElementById('dizimos')?.value);
  const ofertas = parseBR(document.getElementById('ofertas')?.value);
  const saldoAnt = parseBR(document.getElementById('confSaldoAnt')?.value);
  const totalEntradas = dizimos + ofertas;
  const elTotalE = document.getElementById('totalEntradas');
  if(elTotalE) elTotalE.value = totalEntradas === 0 ? '0,00' : formatBR(totalEntradas);

  const obra25 = totalEntradas * 0.25;
  const repasse35 = totalEntradas * 0.35;
  const gratif20 = totalEntradas * 0.20;
  const prebenda10 = gratif20 * 0.10;
  const carneMissoes = parseBR(document.getElementById('carneMissoes')?.value);
  const ofertaMilho = parseBR(document.getElementById('ofertaMilho')?.value);
  const liquido = gratif20 - prebenda10 - carneMissoes - ofertaMilho;

  const elObra = document.getElementById('obra25');
  if(elObra) elObra.value = formatBR(obra25);
  const elGratif = document.getElementById('gratif20');
  if(elGratif) elGratif.value = formatBR(gratif20);
  const elPreb = document.getElementById('prebenda10');
  if(elPreb) elPreb.value = formatBR(prebenda10);
  const elRep35 = document.getElementById('repasse35');
  if(elRep35) elRep35.value = formatBR(repasse35);
  const elCx = document.getElementById('cxGratif');
  if(elCx) elCx.value = formatBR(liquido);

  let somaOutras = 0;
  for(let i=1;i<=14;i++){
    const el = document.getElementById('s'+i);
    if(el) somaOutras += parseBR(el.value);
  }
  
  const totalRepasse = gratif20 + obra25 + repasse35;
  const totalDespesas = somaOutras;
  const totalGeralSaida = totalRepasse + totalDespesas;

  const elTotalS = document.getElementById('totalSaidas');
  if(elTotalS) elTotalS.value = formatBR(totalDespesas);
  
  const elConfSai = document.getElementById('confSaida');
  if(elConfSai) elConfSai.value = formatBR(totalGeralSaida);

  const elConfEnt = document.getElementById('confEntrada');
  if(elConfEnt) elConfEnt.value = formatBR(totalEntradas);
  const elSoma = document.getElementById('somaConf');
  if(elSoma) elSoma.value = formatBR(saldoAnt + totalEntradas);
  const elRepasse = document.getElementById('confRepasse');
  if(elRepasse) elRepasse.value = formatBR(totalRepasse);
  const elSaldo = document.getElementById('saldoCaixa');
  if(elSaldo) elSaldo.value = formatBR((saldoAnt + totalEntradas) - totalGeralSaida);
}

function gerarDatasAutomatico(){
  const mesInput = document.getElementById('deMes')?.value;
  if(!mesInput) return;
  const [ano, mes] = mesInput.split('-').map(Number);
  const primeiro = new Date(ano, mes-1, 1);
  const ultimo = new Date(ano, mes, 0);
  const fmt = d => d.toISOString().split('T')[0];
  const elDo = document.getElementById('doDia');
  const elA = document.getElementById('aDia');
  if(elDo) elDo.value = fmt(primeiro);
  if(elA) elA.value = fmt(ultimo);
}
function limparTudo(){
  document.querySelectorAll('input.valor').forEach(i=> i.value='');
  const elDizDir = document.getElementById('dizimoDirigente');
  if(elDizDir) elDizDir.value='';
  calcular();
  localStorage.removeItem('tesCong');
  for(let i=1;i<=14;i++){ 
    localStorage.removeItem('nome_s'+i);
    localStorage.removeItem('fechado_s'+i);
  }
  abrirModal('Limpo!', 'Todos os campos foram limpos com sucesso.');
}
function salvar(mostrarAlerta = true){
  const dados = {};
  document.querySelectorAll('input').forEach(i=> { if(i.id) dados[i.id]=i.value; });
  localStorage.setItem('tesCong', JSON.stringify(dados));
  if(mostrarAlerta){
    abrirModal('Salvo!', 'Projeção financeira salvo com sucesso!');
  }
}
function salvarSilencioso(){ salvar(false); }
function fecharCaixaComprovante(id){
  const box = document.getElementById('box_'+id);
  if(box) box.style.display='none';
  localStorage.setItem('fechado_'+id, '1');
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
  // FUNÇÃO REAL DE EXCLUIR
  localStorage.removeItem('tesCong');
  for(let i=1;i<=14;i++){ 
    localStorage.removeItem('nome_s'+i);
    localStorage.removeItem('fechado_s'+i);
  }
  document.querySelectorAll('input.valor').forEach(i=> i.value='');
  const elDizDir = document.getElementById('dizimoDirigente');
  if(elDizDir) elDizDir.value='';
  calcular();
  abrirModal('Excluído!', 'Dados excluídos com sucesso!');
}
function imprimir(){
  const cong = document.getElementById('congregacao')?.value || '';
  const dir = document.getElementById('dirigente')?.value || '';
  const tes = document.getElementById('tesoureiro')?.value || '';
  const doDia = document.getElementById('doDia')?.value || '';
  const aDia = document.getElementById('aDia')?.value || '';
  const deMes = document.getElementById('deMes')?.value || '';
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
  if(pDiz) pDiz.innerText = document.getElementById('dizimos')?.value || '0,00';
  const pOfer = document.getElementById('p-ofer');
  if(pOfer) pOfer.innerText = document.getElementById('ofertas')?.value || '0,00';
  const pTotalE = document.getElementById('p-totalE');
  if(pTotalE) pTotalE.innerText = document.getElementById('totalEntradas')?.value;
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
  if(elTotalS) elTotalS.innerText = document.getElementById('totalSaidas')?.value;
  const el1 = document.getElementById('p-saldoAnt');
  if(el1) el1.innerText = document.getElementById('confSaldoAnt')?.value;
  const el2 = document.getElementById('p-confE');
  if(el2) el2.innerText = document.getElementById('confEntrada')?.value;
  const el3 = document.getElementById('p-soma');
  if(el3) el3.innerText = document.getElementById('somaConf')?.value;
  const el4 = document.getElementById('p-confS');
  if(el4) el4.innerText = document.getElementById('confSaida')?.value;
  const el5 = document.getElementById('p-saldo');
  if(el5) el5.innerText = document.getElementById('saldoCaixa')?.value;
  const el6 = document.getElementById('p-dizDir');
  if(el6) el6.innerText = document.getElementById('dizimoDirigente')?.value || '0,00';
  const el7 = document.getElementById('p-repasse');
  if(el7) el7.innerText = document.getElementById('confRepasse')?.value || '0,00';
  window.print();
}

document.addEventListener('DOMContentLoaded', ()=>{
  criarModalSeNaoExiste();
  const campos = document.querySelectorAll('input.valor');
  campos.forEach((el, idx)=>{
    el.addEventListener('input', ()=> formatarInput(el));
    el.addEventListener('focus', ()=> el.select());
    el.addEventListener('blur', ()=>{
      if(el.value.trim() === ''){
        el.value = '';
      } else {
        const n = parseBR(el.value);
        el.value = formatInputBR(n);
      }
      calcular();
    });
    el.addEventListener('keydown', (e)=>{
      if(e.key === 'Enter'){
        e.preventDefault();
        const n = parseBR(el.value);
        el.value = formatInputBR(n);
        calcular();
        let next = null;
        for(let j=idx+1;j<campos.length;j++){
          if(!campos[j].readOnly && campos[j].offsetParent !== null){ next = campos[j]; break; }
        }
        if(next){ next.focus(); next.select(); }
      }
    });
  });
  const btnVerMais = document.getElementById('btnVerMais');
  const despesasExtras = document.getElementById('despesasExtras');
  if(btnVerMais && despesasExtras){
    btnVerMais.addEventListener('click', ()=>{
      const aberto = despesasExtras.style.display !== 'none';
      despesasExtras.style.display = aberto ? 'none' : 'block';
      btnVerMais.innerText = aberto ? '▼ Mais despesas' : '▲ Ocultar despesas';
    });
  }
  const deMesEl = document.getElementById('deMes');
  if(deMesEl){
    deMesEl.addEventListener('change', gerarDatasAutomatico);
    deMesEl.addEventListener('input', gerarDatasAutomatico);
  }
  carregar();
  calcular();

  // BOTÕES COM MODAL BONITO
  document.getElementById('btnSalvar')?.addEventListener('click', ()=> salvar(true));
  
  document.getElementById('btnLimpar')?.addEventListener('click', ()=>{
    abrirModal('Atenção', 'Desejas limpar o formulario?', true, ()=> limparTudo());
  });
  
  document.getElementById('btnExcluir')?.addEventListener('click', ()=>{
    abrirModal('Atenção', 'Desejas excluir os dados?\nEsta ação não poderá ser desfeita.', true, ()=> excluir());
  });
  
  document.getElementById('btnPrint')?.addEventListener('click', imprimir);
});
