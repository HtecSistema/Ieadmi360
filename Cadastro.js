const CONGREGACOES=["Sede Central - Eixo W1 Centro","Betel - Promissão I","Boas Novas - Promissão II","Monte Sião - Jardim Bela Vista","Jerusalém - Cão de Guarda","Ebenézer - Morada do Sol","Monte das Oliveiras - Sidney Rosa","Nova Jerusalém - Nagibão","Pão da Vida - Camboatã","Peniel - Jaderlândia","Vale da Benção - Rondônia","Adonai - Paragonorte","Filadélfia"];
const MESES=["","JANEIRO","FEVEREIRO","MARCO","ABRIL","MAIO","JUNHO","JULHO","AGOSTO","SETEMBRO","OUTUBRO","NOVEMBRO","DEZEMBRO"];

const BODAS_MESES={
  1:"BODAS DE BEIJINHOS",2:"BODAS DE SORVETE",3:"BODAS DE ALGODAO-DOCE",4:"BODAS DE PIPOCA",5:"BODAS DE CHOCOLATE",
  6:"BODAS DE PLUMINHA",7:"BODAS DE PURPURINA",8:"BODAS DE POMPOM",9:"BODAS DE MATERNIDADE",10:"BODAS DE PINTINHOS",11:"BODAS DE CHICLETES"
};
const BODAS_ANOS={
  1:"BODAS DE PAPEL",2:"BODAS DE ALGODAO",3:"BODAS DE TRIGO",4:"BODAS DE FLORES E FRUTAS OU CERA",5:"BODAS DE MADEIRA OU FERRO",
  6:"BODAS DE PERFUME OU ACUCAR",7:"BODAS DE LATAO OU LA",8:"BODAS DE PAPOULA OU BARRO",9:"BODAS DE CERAMICA OU VIME",10:"BODAS DE ESTANHO",
  11:"BODAS DE ACO",12:"BODAS DE SEDA OU ONIX",13:"BODAS DE LINHO OU RENDA",14:"BODAS DE MARFIM",15:"BODAS DE CRISTAL",
  16:"BODAS DE TURMALINA",17:"BODAS DE ROSA",18:"BODAS DE TURQUESA",19:"BODAS DE CRETONE",20:"BODAS DE PORCELANA",
  21:"BODAS DE ZIRCAO",22:"BODAS DE LOUÇA",23:"BODAS DE PALHA",24:"BODAS DE OPALA",25:"BODAS DE PRATA",
  26:"BODAS DE ALEXANDRITA",27:"BODAS DE CRISOPAZIO",28:"BODAS DE HEMATITA",29:"BODAS DE ERVA",30:"BODAS DE PEROLA",
  31:"BODAS DE NACAR",32:"BODAS DE PINHO",33:"BODAS DE CRIZO",34:"BODAS DE OLIVEIRA",35:"BODAS DE CORAL",
  36:"BODAS DE CEDRO",37:"BODAS DE AVENTURINA",38:"BODAS DE CARVALHO",39:"BODAS DE MARMORE",40:"BODAS DE RUBI OU ESMERALDA",
  41:"BODAS DE SEDA",42:"BODAS DE PRATA DOURADA",43:"BODAS DE AZEVICHE",44:"BODAS DE CARBONATO",45:"BODAS DE PLATINA OU SAFIRA",
  46:"BODAS DE ALABASTRO",47:"BODAS DE JASPE",48:"BODAS DE GRANITO",49:"BODAS DE HELIOTROPIO",50:"BODAS DE OURO",
  51:"BODAS DE BRONZE",52:"BODAS DE ARGILA",53:"BODAS DE ANTIMONIO",54:"BODAS DE NIQUEL",55:"BODAS DE AMETISTA",
  56:"BODAS DE MALAQUITA",57:"BODAS DE LAPIS LAZULI",58:"BODAS DE VIDRO",59:"BODAS DE CEREJA",60:"BODAS DE DIAMANTE OU JADE",
  61:"BODAS DE COBRE",62:"BODAS DE TELURITA",63:"BODAS DE SANDALO OU LILAS",64:"BODAS DE FABULITA",65:"BODAS DE FERRO",
  66:"BODAS DE EBANO",67:"BODAS DE NEVE",68:"BODAS DE CHUMBO",69:"BODAS DE MERCURIO",70:"BODAS DE VINHO",
  71:"BODAS DE ZINCO",72:"BODAS DE AVEIA",73:"BODAS DE MANJERONA",74:"BODAS DE MACIEIRA",75:"BODAS DE BRILHANTE OU ALABASTRO",
  76:"BODAS DE CIPRESTE",77:"BODAS DE ALFAZEMA",78:"BODAS DE BENJOIM",79:"BODAS DE CAFE",80:"BODAS DE NOGUEIRA OU CARVALHO",
  81:"BODAS DE CACAU",82:"BODAS DE CRAVO",83:"BODAS DE BEGONIA",84:"BODAS DE CRISANTEMO",85:"BODAS DE GIRASSOL",
  86:"BODAS DE HORTENSIA",87:"BODAS DE NOGUEIRA",88:"BODAS DE PERA",89:"BODAS DE FIGUEIRA",90:"BODAS DE ALAMO",
  91:"BODAS DE PINHEIRO",92:"BODAS DE SALGUEIRO",93:"BODAS DE IMBUIA",94:"BODAS DE PALMEIRA",95:"BODAS DE SANDALO",
  96:"BODAS DE OLIVEIRA",97:"BODAS DE ABETO",98:"BODAS DE PINHEIRO",99:"BODAS DE SALGUEIRO",100:"BODAS DE JEQUITIBA OU CANHAMO"
};

let selKey=null;

document.addEventListener("DOMContentLoaded",()=>{
  const sel=document.getElementById("congregacao");
  CONGREGACOES.forEach(c=>{let o=document.createElement("option");o.value=c;o.textContent=c;sel.appendChild(o)});
  document.getElementById("cpf")?.addEventListener("input",e=>e.target.value=maskCPF(e.target.value));
  document.getElementById("fonea")?.addEventListener("input",e=>e.target.value=maskPhone(e.target.value));
  document.getElementById("cep")?.addEventListener("input",e=>{let v=e.target.value.replace(/\D/g,"").slice(0,8);v=v.replace(/(\d{5})(\d)/,"$1-$2");e.target.value=v;if(v.replace(/\D/g,"").length==8)buscarCEP(v)});
  
  document.getElementById("nascito")?.addEventListener("change",()=>{
    let v=document.getElementById("nascito").value;
    let badge=document.getElementById("mes_nascimento_badge");
    let hidden=document.getElementById("mes_nascimento");
    if(!v){if(hidden)hidden.value="";if(badge)badge.textContent="-";return;}
    let d=new Date(v+"T12:00:00");
    let mes=MESES[d.getMonth()+1];
    if(hidden)hidden.value=mes;
    if(badge)badge.textContent=mes;
  });

  document.getElementById("data_casam")?.addEventListener("change",()=>{
    let v=document.getElementById("data_casam").value;
    let mesEl=document.getElementById("casamento_mes");
    let bodaEl=document.getElementById("boda");
    if(!v){mesEl.value="";bodaEl.value="";return;}
    let d=new Date(v+"T12:00:00");
    mesEl.value=MESES[d.getMonth()+1];

    let hoje=new Date();
    let anos=hoje.getFullYear()-d.getFullYear();
    let mesesTot=(hoje.getFullYear()-d.getFullYear())*12 + (hoje.getMonth()-d.getMonth());
    if(hoje.getDate()<d.getDate()){mesesTot--;}
    if(mesesTot<0)mesesTot=0;
    if(hoje.getMonth()<d.getMonth() || (hoje.getMonth()==d.getMonth() && hoje.getDate()<d.getDate())) anos--;
    if(anos<0)anos=0;

    let txt="";
    if(anos<1){
      let m=mesesTot;
      if(m<=0)m=1;
      if(m>=1 && m<=11) txt=m+" meses - "+(BODAS_MESES[m]||"");
      else txt="11 meses - "+BODAS_MESES[11];
    }else{
      if(anos>100)anos=100;
      txt=anos+" anos - "+(BODAS_ANOS[anos]||"BODAS DE "+anos+" ANOS");
    }
    bodaEl.value=txt;
  });

  document.getElementById("funcao_eclesiastica")?.addEventListener("change",()=>{let f=document.getElementById("funcao_eclesiastica").value;if(["Diácono","Presbítero","Evangelista","Missionário","Pastor"].includes(f)){document.getElementById("membro").value="SIM";document.getElementById("espirito_santo").value="SIM";toast("Acima de Auxiliar → Membro e Espírito travado SIM")}});
  document.getElementById("busca")?.addEventListener("input",renderLista);
  renderLista();
});

function maskCPF(v){v=v.replace(/\D/g,"").slice(0,11);v=v.replace(/(\d{3})(\d)/,"$1.$2");v=v.replace(/(\d{3})(\d)/,"$1.$2");v=v.replace(/(\d{3})(\d{1,2})$/,"$1-$2");return v}
function maskPhone(v){v=v.replace(/\D/g,"").slice(0,11);v=v.replace(/(\d{2})(\d)/,"($1) $2");v=v.replace(/(\d{5})(\d)/,"$1-$2");return v}
async function buscarCEP(cep){try{cep=cep.replace(/\D/g,"");let r=await fetch(`https://viacep.com.br/ws/${cep}/json/`).then(x=>x.json());if(r.erro)return;document.getElementById("logradouro").value=r.logradouro||"";document.getElementById("bairro").value=r.bairro||"";document.getElementById("cidade").value=r.localidade||"Paragominas";document.getElementById("estado").value=r.uf||"PA";toast("CEP: "+r.logradouro)}catch{}}
window.toggleAcc=function(btn){btn.closest(".acc").classList.toggle("open")};
window.toggleBusca=function(){document.getElementById("searchSheet")?.classList.toggle("open")};

function coletar(){
  let ids=["cod","congregacao","classificacao","cidade_cong","uf_cong","mat_local","cgadb","comadebg","categoria","nome","cpf","fonea","nascito","mes_nascimento","mae","sexo","email","cep","logradouro","numero","bairro","complemento","cidade","estado","sit_conjugal","conjuge","data_casam","casamento_mes","boda","funcao_eclesiastica","funcao_diretoria","funcao_congregacao","membro","espirito_santo","departamento","funcao_departamento","curso_teologico","grau_curso","andamento","termino_curso","observacao"];
  let d={};ids.forEach(id=>{let el=document.getElementById(id);if(el)d[id]=el.value});return d
}
function setDados(d){
  Object.keys(d).forEach(k=>{let el=document.getElementById(k);if(el)el.value=d[k]});
  if(d.mes_nascimento){let badge=document.getElementById("mes_nascimento_badge");if(badge)badge.textContent=d.mes_nascimento;}
}

window.salvar=function(){let d=coletar();if(!d.cod||!d.nome){toast("Preencha COD e NOME");return;}let key="ficha_"+(d.cod+"_"+d.nome).replace(/\s+/g,"_");localStorage.setItem(key,JSON.stringify(d));selKey=key;renderLista();toast("✅ Salvo!")};
window.limparForm=function(){if(!confirm("Limpar?"))return;document.querySelectorAll("#formFicha input, #formFicha select, #formFicha textarea").forEach(el=>{if(!["cidade_cong","cidade"].includes(el.id))el.value=""});let badge=document.getElementById("mes_nascimento_badge");if(badge)badge.textContent="-";selKey=null;toast("Limpo")};
window.excluirSelecionado=function(){if(!selKey){toast("Selecione um registro");return;}if(!confirm("Excluir?"))return;localStorage.removeItem(selKey);selKey=null;renderLista();toast("Excluído")};
window.imprimir=function(){window.print()};
function renderLista(){let lista=Object.keys(localStorage).filter(k=>k.startsWith("ficha_")).map(k=>{try{return{key:k,data:JSON.parse(localStorage.getItem(k))}}catch{return null}}).filter(Boolean);let busca=(document.getElementById("busca")?.value||"").toLowerCase();let filt=lista.filter(o=>Object.values(o.data).join(" ").toLowerCase().includes(busca));let cont=document.getElementById("listaCards");let empty=document.getElementById("empty");if(!cont)return;cont.innerHTML="";empty.style.display=filt.length?"none":"block";document.getElementById("countList")&&(document.getElementById("countList").textContent="("+filt.length+")");filt.reverse().forEach(o=>{let div=document.createElement("div");div.className="card-item"+(o.key==selKey?" selected":"");div.innerHTML=`<div class="card-info"><strong>${o.data.nome||""} <small>${o.data.cod||""}</small></strong><span>${o.data.congregacao||""} • ${o.data.funcao_eclesiastica||""}</span></div><div><button onclick="editarRegistro('${o.key}')" style="width:30px;height:28px;border:1px solid #dee2e6;background:#fff;border-radius:4px">✏️</button> <button onclick="excluirRegistro('${o.key}')" style="width:30px;height:28px;border:1px solid #fecaca;background:#fff;border-radius:4px">🗑️</button></div>`;div.addEventListener("click",e=>{if(e.target.tagName!="BUTTON")editarRegistro(o.key)});cont.appendChild(div)})}
window.editarRegistro=function(key){try{let d=JSON.parse(localStorage.getItem(key));setDados(d);selKey=key;window.scrollTo({top:0,behavior:"smooth"});document.querySelectorAll(".acc").forEach(a=>a.classList.add("open"));toast("Editando: "+d.nome);renderLista()}catch{}};
window.excluirRegistro=function(key){if(!confirm("Excluir?"))return;localStorage.removeItem(key);if(selKey==key)selKey=null;renderLista();toast("Excluído")};
function toast(msg){let t=document.getElementById("toast");t.textContent=msg;t.className="toast show";setTimeout(()=>t.classList.remove("show"),3000)}