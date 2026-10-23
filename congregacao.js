const SUPABASE_URL="https://SEU_PROJETO.supabase.co"; 
const SUPABASE_ANON="SUA_ANON_KEY";
const supabaseClient=supabase.createClient(SUPABASE_URL,SUPABASE_ANON);

const campos=[
"cod","congregacao","classe","setor","endereco","numero","bairro","cidade","uf",
"pastor_dirigente","cpfpr","contato_pr",
"matsec1","sec1","cpfsec1","contato_sec1","matsec2","sec2","cpfsec2","contato_sec2",
"mattes1","tes1","cpftes1","contato_tes1","mattes2","tes2","cpftes2","contato_tes2",
"jd_mat_sec1","jd_sec1","jd_cpf_sec1","jd_cont_sec1","jd_mat_sec2","jd_sec2","jd_cpf_sec2","jd_cont_sec2","jd_mat_tes1","jd_tes1","jd_cpf_tes1","jd_cont_tes1","jd_mat_tes2","jd_tes2","jd_cpf_tes2","jd_cont_tes2",
"sh_mat_sec1","sh_sec1","sh_cpf_sec1","sh_cont_sec1","sh_mat_sec2","sh_sec2","sh_cpf_sec2","sh_cont_sec2","sh_mat_tes1","sh_tes1","sh_cpf_tes1","sh_cont_tes1","sh_mat_tes2","sh_tes2","sh_cpf_tes2","sh_cont_tes2",
"bv_mat_sec1","bv_sec1","bv_cpf_sec1","bv_cont_sec1","bv_mat_sec2","bv_sec2","bv_cpf_sec2","bv_cont_sec2","bv_mat_tes1","bv_tes1","bv_cpf_tes1","bv_cont_tes1","bv_mat_tes2","bv_tes2","bv_cpf_tes2","bv_cont_tes2",
"he_mat_sec1","he_sec1","he_cpf_sec1","he_cont_sec1","he_mat_sec2","he_sec2","he_cpf_sec2","he_cont_sec2","he_mat_tes1","he_tes1","he_cpf_tes1","he_cont_tes1","he_mat_tes2","he_tes2","he_cpf_tes2","he_cont_tes2",
"hr_mat_sec1","hr_sec1","hr_cpf_sec1","hr_cont_sec1","hr_mat_sec2","hr_sec2","hr_cpf_sec2","hr_cont_sec2","hr_mat_tes1","hr_tes1","hr_cpf_tes1","hr_cont_tes1","hr_mat_tes2","hr_tes2","hr_cpf_tes2","hr_cont_tes2",
"ebd_mat_sec1","ebd_sec1","ebd_cpf_sec1","ebd_cont_sec1","ebd_mat_sec2","ebd_sec2","ebd_cpf_sec2","ebd_cont_sec2","ebd_mat_tes1","ebd_tes1","ebd_cpf_tes1","ebd_cont_tes1","ebd_mat_tes2","ebd_tes2","ebd_cpf_tes2","ebd_cont_tes2",
"tv_mat_sec1","tv_sec1","tv_cpf_sec1","tv_cont_sec1","tv_mat_sec2","tv_sec2","tv_cpf_sec2","tv_cont_sec2","tv_mat_tes1","tv_tes1","tv_cpf_tes1","tv_cont_tes1","tv_mat_tes2","tv_tes2","tv_cpf_tes2","tv_cont_tes2",
"mis_mat_sec1","mis_sec1","mis_cpf_sec1","mis_cont_sec1","mis_mat_sec2","mis_sec2","mis_cpf_sec2","mis_cont_sec2","mis_mat_tes1","mis_tes1","mis_cpf_tes1","mis_cont_tes1","mis_mat_tes2","mis_tes2","mis_cpf_tes2","mis_cont_tes2"
];
const checks=["sec","tes","jd","sh","bv","he","hr","ebd","tv","mis"];

function validarCPF(cpf){cpf=cpf.replace(/\D/g,"");if(!cpf||cpf.length!==11)return false;if(/^(\d)\1{10}$/.test(cpf))return false;let soma=0;for(let i=1;i<=9;i++)soma+=parseInt(cpf.substring(i-1,i))*(11-i);let resto=(soma*10)%11;if(resto==10||resto==11)resto=0;if(resto!=parseInt(cpf.substring(9,10)))return false;soma=0;for(let i=1;i<=10;i++)soma+=parseInt(cpf.substring(i-1,i))*(12-i);resto=(soma*10)%11;if(resto==10||resto==11)resto=0;if(resto!=parseInt(cpf.substring(10,11)))return false;return true;}
function validarCampoCPF(input){let v=input.value.replace(/\D/g,"");if(v===""||v.length<11){input.classList.remove("cpf-invalido");return true;}if(!validarCPF(v)){input.classList.add("cpf-invalido");return false;}input.classList.remove("cpf-invalido");return true;}
function validarTodosCPFs(){let inv=[];document.querySelectorAll('input.cpf').forEach(el=>{if(el.value.trim()!==""&&!validarCampoCPF(el))inv.push(el.id);});return inv;}
function validarTodasMatriculas(){let inv=[];document.querySelectorAll('input.matricula').forEach(el=>{let v=el.value.trim();if(v!==""&&v!=="00000"&&!/^\d{5}$/.test(v)){el.classList.add("matricula-invalida");inv.push(el.id);}else el.classList.remove("matricula-invalida");});return inv;}
function toggleDept(id){const chk=document.getElementById('chk_'+id);const box=document.getElementById('dept_'+id);const item=document.getElementById('ci_'+id);if(chk.checked){box.classList.add('show');item.classList.add('ativo');}else{box.classList.remove('show');item.classList.remove('ativo');}}
let editIndex=null;
function getDados(){const d={};campos.forEach(id=>{let el=document.getElementById(id);if(el)d[id]=el.value.trim();});checks.forEach(c=>{let el=document.getElementById('chk_'+c);if(el)d['chk_'+c]=el.checked;});return d;}
function setDados(d){
  campos.forEach(id=>{
    let el=document.getElementById(id);
    if(el){
      if(el.classList.contains('matricula')){
        let val = d[id]||"00000";
        el.value = val;
        el.dataset.raw = val.replace(/^0+/,"").slice(0,5);
      }else{
        el.value=d[id]||"";
      }
    }
  });
  checks.forEach(c=>{let el=document.getElementById('chk_'+c);if(el){el.checked=!!d['chk_'+c];toggleDept(c);}});
}
function loadLocal(){try{return JSON.parse(localStorage.getItem('congregacoes')||'[]')}catch{return []}}
function saveLocal(a){localStorage.setItem('congregacoes',JSON.stringify(a))}
function maskCPF(v){v=v.replace(/\D/g,"").slice(0,11);v=v.replace(/(\d{3})(\d)/,"$1.$2");v=v.replace(/(\d{3})(\d)/,"$1.$2");v=v.replace(/(\d{3})(\d{1,2})$/,"$1-$2");return v}
function maskPhone(v){v=v.replace(/\D/g,"").slice(0,11);v=v.replace(/(\d{2})(\d)/,"($1) $2");v=v.replace(/(\d{5})(\d)/,"$1-$2");return v}

document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('input.cpf').forEach(el=>{
    el.addEventListener('input',e=>{e.target.value=maskCPF(e.target.value);validarCampoCPF(e.target);});
  });

  // ===== MATRÍCULA 5 DÍGITOS - FUNCIONA PARA TODAS =====
  document.querySelectorAll('input.matricula').forEach(el=>{
    if(!el.value) el.value="00000";
    el.dataset.raw = el.value.replace(/^0+/,"").slice(0,5);
    el.setAttribute('inputmode','numeric');

    el.addEventListener('focus',()=>{ el.select(); });

    el.addEventListener('keydown',e=>{
      // deixa TAB passar
      if(e.key==="Tab" || e.key==="Enter") return;

      // BACKSPACE / DELETE = apaga último dígito
      if(e.key==="Backspace" || e.key==="Delete"){
        e.preventDefault();
        let raw = el.dataset.raw || "";
        raw = raw.slice(0,-1);
        el.dataset.raw = raw;
        el.value = raw==="" ? "00000" : raw.padStart(5,"0");
        return;
      }

      // NÚMERO = adiciona
      if(/^\d$/.test(e.key)){
        e.preventDefault();
        let raw = el.dataset.raw || "";
        if(raw.length < 5){
          raw = (raw + e.key).slice(0,5);
          el.dataset.raw = raw;
          el.value = raw.padStart(5,"0");
        }
        return;
      }

      // bloqueia qualquer outra tecla (letras, símbolos)
      if(e.key.length===1){
        e.preventDefault();
      }
    });

    // bloqueia colar texto com letra
    el.addEventListener('paste',e=>{
      e.preventDefault();
      let pasted = (e.clipboardData.getData('text')||"").replace(/\D/g,"").slice(0,5);
      if(pasted){
        el.dataset.raw = pasted;
        el.value = pasted.padStart(5,"0");
      }
    });

    // impede que o input nativo mude o valor
    el.addEventListener('input',e=>{
      // se por algum motivo mudou, corrige
      let raw = el.dataset.raw || "";
      let esperado = raw==="" ? "00000" : raw.padStart(5,"0");
      if(e.target.value !== esperado){
        e.target.value = esperado;
      }
    });
  });

  document.querySelectorAll('input[id*="cont"]').forEach(el=>el.addEventListener('input',e=>e.target.value=maskPhone(e.target.value)));
  renderTabela();
});

async function salvar(){
  const dados=getDados();
  if(!dados.cod||!dados.congregacao){abrirModal('OBRIGATÓRIO','PREENCHA COD E CONGREGAÇÃO.');return;}
  let invCPF=validarTodosCPFs(); if(invCPF.length>0){abrirModal('CPF INVÁLIDO','CORRIJA: '+invCPF.join(', ').toUpperCase());return;}
  let lista=loadLocal(); if(editIndex!==null)lista[editIndex]=dados;else lista.push(dados);
  saveLocal(lista);limpar();renderTabela();
  try{await supabaseClient.from('congregacoes').upsert([{cod:dados.cod,congregacao:dados.congregacao,dados:dados}],{onConflict:'cod'});abrirModal('SALVO!','SALVO COM SUCESSO.')}catch(e){abrirModal('BACKUP LOCAL','SALVO LOCAL. ERRO: '+e.message);}
}
function renderTabela(){const lista=loadLocal();const q=document.getElementById('busca').value.toLowerCase();let filtrada=lista.filter(d=>Object.values(d).join(' ').toLowerCase().includes(q));const tbody=document.querySelector('#tabela tbody');tbody.innerHTML='';document.getElementById('empty').style.display=filtrada.length?'none':'block';filtrada.forEach(d=>{const real=lista.indexOf(d);const tr=document.createElement('tr');tr.innerHTML=`<td><span class="badge">${d.cod}</span></td><td>${d.congregacao}</td><td>${d.pastor_dirigente||''}</td><td><button class="icon-btn" onclick="editar(${real})">✏️</button> <button class="icon-btn" onclick="pedirExcluir(${real})">🗑️</button></td>`;tbody.appendChild(tr);});}
function editar(i){const lista=loadLocal();setDados(lista[i]);editIndex=i;document.getElementById('btnCancelarEdit').style.display='block';window.scrollTo({top:0,behavior:'smooth'});}
function cancelarEdicao(){limpar();editIndex=null;document.getElementById('btnCancelarEdit').style.display='none';}
function limpar(){
  campos.forEach(id=>{
    let el=document.getElementById(id);
    if(el){
      if(el.classList.contains('matricula')){ el.value='00000'; el.dataset.raw=""; }
      else{ el.value=''; }
      el.classList.remove('cpf-invalido'); el.classList.remove('matricula-invalida');
    }
  });
  checks.forEach(c=>{let el=document.getElementById('chk_'+c);if(el){el.checked=false;toggleDept(c);}});
  document.getElementById('cidade').value='Paragominas';document.getElementById('uf').value='PA';
}
function pedirExcluir(i){abrirModal('EXCLUIR?','ESTA AÇÃO NÃO PODE SER DESFEITA.',()=>{let lista=loadLocal();lista.splice(i,1);saveLocal(lista);renderTabela();fecharModal();},true);}
function abrirModal(t,m,fn,isExcluir){document.getElementById('modalTitle').textContent=t;document.getElementById('modalMsg').textContent=m;document.getElementById('modal').classList.add('show');const b=document.getElementById('modalConfirm');if(fn&&isExcluir){b.style.display='block';b.onclick=fn;document.querySelector('#modal .btn-ghost').textContent='CANCELAR';}else if(fn){b.style.display='block';b.onclick=()=>{fecharModal();fn();};b.textContent='OK';b.style.background='#ff8c00';b.style.color='#000';}else{b.style.display='none';document.querySelector('#modal .btn-ghost').textContent='OK';}}
function fecharModal(){document.getElementById('modal').classList.remove('show');}