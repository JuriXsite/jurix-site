
// app.js — JuriX (captura de leads via WhatsApp + redireciona MP/Pix)

const $ = (id) => document.getElementById(id);

const WHATSAPP_NUM = "5511921004554";
const SUPPORT_EMAIL = "advogadosinteligentes00@gmail.com";
const PIX_KEY = "8fdc8bd8-e9a8-42f0-9f8e-c8f474133416";

function v(id){
  const el = $(id);
  return (el?.value || "").trim();
}

function openWhatsApp(msg){
  window.open(
    `https://wa.me/${WHATSAPP_NUM}?text=${encodeURIComponent(msg)}`,
    "_blank"
  );
}

function copyText(text){
  navigator.clipboard.writeText(text).then(()=> {
    alert("Copiado!");
  }).catch(()=> {
    alert("Não deu pra copiar automaticamente. Copie manualmente.");
  });
}

function ensureLeadFilled(){
  const nome = v("leadNome");
  const email = v("leadEmail");
  const wpp = v("leadWpp");

  if(!nome || !email || !wpp){
    alert("Preencha Nome, E-mail e WhatsApp antes de assinar.");
    // tenta levar a pessoa até o formulário
    $("leadNome")?.scrollIntoView({ behavior: "smooth", block: "center" });
    $("leadNome")?.focus();
    return null;
  }
  return { nome, email, wpp };
}

function wireMercadoPago(btnId, planName){
  const btn = $(btnId);
  if(!btn) return;

  btn.addEventListener("click", (e) => {
    e.preventDefault();

    const lead = ensureLeadFilled();
    if(!lead) return;

    const link = btn.dataset.mp || "";
    if(!link){
      alert("Link do Mercado Pago não configurado.");
      return;
    }

    // 1) Envia os dados pra você via WhatsApp (você RECEBE isso)
    const msg =
`Olá! Quero assinar o JuriX (${planName}).

Nome: ${lead.nome}
E-mail: ${lead.email}
WhatsApp: ${lead.wpp}

Vou pagar agora pelo Mercado Pago.
Após confirmar, pode me enviar a licença por e-mail/WhatsApp?`;

    openWhatsApp(msg);

    // 2) Redireciona pro checkout do Mercado Pago
    // pequeno delay pra garantir que o clique abriu o WhatsApp
    setTimeout(() => {
      window.location.href = link;
    }, 150);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // Ano no footer
  if($("year")) $("year").textContent = new Date().getFullYear();

  // Mercado Pago (SEMPRE abre WhatsApp com dados + redireciona)
  wireMercadoPago("btnMensal", "Mensal");
  wireMercadoPago("btnAnual", "Anual");

  // Pix (manual) -> abre WhatsApp com dados + chave Pix
  const btnPix = $("btnPixWA");
  if(btnPix){
    btnPix.addEventListener("click", (e) => {
      e.preventDefault();

      const lead = ensureLeadFilled();
      if(!lead) return;

      const msg =
`Olá! Quero assinar o JuriX (Pix manual).

Nome: ${lead.nome}
E-mail: ${lead.email}
WhatsApp: ${lead.wpp}

Vou pagar no Pix e enviar o comprovante.
Pode me mandar a licença após confirmar?

Chave Pix:
${PIX_KEY}`;

      openWhatsApp(msg);
    });
  }

  // Copiar Pix
  const btnCopy = $("btnCopyPix");
  if(btnCopy){
    btnCopy.addEventListener("click", () => copyText(PIX_KEY));
  }
});
