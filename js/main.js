/* ==========================================================
   SITE CONTENT: edit this block to update the whole website
   ========================================================== */
var EMAIL = "vgelessvibes.studios@gmail.com";

/* Paste your BeatStars store link here (e.g. the address of your Vgeless.Vibes BeatStars page).
   While it is empty, Buy buttons open an email to you instead. */
var BEATSTARS_URL = "";

/* Upcoming drop / pre-order. Set price + dropDate when ready.
   dropDate format: "2026-12-01T00:00:00" (or null for "Date TBA")
   price: number (e.g. 9.99) or null for "Price TBA" */
var NEXT_DROP = {
  title: "New Project (Title TBA)",
  type: "Album",
  dropDate: null,
  price: null,
  earlyAccess: "Pre-order to listen early, before the public drop date."
};

var RELEASES = [
  { title: "Better Days Ahead", type: "Album", year: 2026, note: "Featuring \"The Giving Tree,\" \"Warfare,\" and \"Encore.\"", tone: "" },
  { title: "Trap Phone Freestyle", type: "Single", year: 2026, note: "Freestyle single.", tone: "b" },
  { title: "Opp Pack Freestyle", type: "Single", year: 2026, note: "Freestyle single.", tone: "d" },
  { title: "QUEST", type: "Single", year: "", note: "Single.", tone: "c" }
];

/* Beats (from the Vgeless.Vibes BeatStars store). price: number, or null to show "Price on BeatStars".
   Add a preview by putting an audio file URL in "audio".
   Add a direct link to that beat's own BeatStars page in "url" once you have one —
   until then, Buy buttons fall back to the general BEATSTARS_URL above. */
var BEATS = [
  { title: "Snakes",             price: null },
  { title: "First Pop",          price: null },
  { title: "The Move",           price: 15 },
  { title: "LSD OUTLAW",         price: 50 },
  { title: "Natural Mystic",     price: 15 },
  { title: "Roland (ROLLING)",   price: 15 },
  { title: "Feed The Love",      price: 15 },
  { title: "Howling At The Moon",price: 15 },
  { title: "Angels Speaking",    price: 15 }
];

/* ---------- helpers ---------- */
function el(tag, cls, text){ var e=document.createElement(tag); if(cls) e.className=cls; if(text!==undefined) e.textContent=text; return e; }
function mail(subject, body){ return "mailto:"+EMAIL+"?subject="+encodeURIComponent(subject)+"&body="+encodeURIComponent(body||""); }
function money(n){ return n==null ? "Price TBA" : "$"+Number(n).toFixed(2).replace(/\.00$/,""); }
document.getElementById("yr").textContent = new Date().getFullYear();

/* ---------- cart ---------- */
var CART_KEY = "vgelessvibes_cart_v1";
var cart = [];
try { var _savedCart = localStorage.getItem(CART_KEY); if(_savedCart) cart = JSON.parse(_savedCart) || []; } catch(e){ cart = []; }
var cartView = "cart";

function saveCart(){ try{ localStorage.setItem(CART_KEY, JSON.stringify(cart)); }catch(e){} }
function findCartItem(key){ for(var i=0;i<cart.length;i++){ if(cart[i].key===key) return cart[i]; } return null; }
function cartCount(){ return cart.reduce(function(n,i){return n+i.qty;},0); }
function cartSubtotal(){ return cart.reduce(function(t,i){return t+(i.price||0)*i.qty;},0); }

function addToCart(item){
  var existing = findCartItem(item.key);
  if(existing){ existing.qty = Math.min(99, existing.qty+1); }
  else { cart.push({ key:item.key, title:item.title, price:item.price, kind:item.kind, url:item.url||null, qty:1 }); }
  saveCart(); cartView="cart"; renderCartPanel(); openCart();
}
function removeCartItem(key){ cart = cart.filter(function(i){ return i.key!==key; }); saveCart(); renderCartPanel(); }
function setCartQty(key, qty){
  var it=findCartItem(key); if(!it) return;
  it.qty = Math.max(1, Math.min(99, qty|0));
  saveCart(); renderCartPanel();
}

function field(id, label, opts){
  opts = opts || {};
  var d=el("div");
  var lb=el("label", null, label); lb.setAttribute("for", id);
  var input = opts.textarea ? el("textarea") : el("input");
  input.id = id;
  if(opts.type) input.type = opts.type;
  if(opts.required) input.required = true;
  d.appendChild(lb); d.appendChild(input);
  return d;
}

function buildCheckoutView(){
  var wrap=el("div");
  wrap.appendChild(el("h3",null,"Review & Submit Order"));
  var sum=el("div"); sum.style.margin="10px 0";
  cart.forEach(function(i){
    var line=el("div","summaryLine");
    line.appendChild(el("span",null, i.qty+"\u00d7 "+i.title));
    line.appendChild(el("span",null, money(i.price*i.qty)));
    sum.appendChild(line);
  });
  var total=el("div","summaryLine");
  total.style.fontWeight="700"; total.style.borderTop="1px solid var(--line)"; total.style.marginTop="6px"; total.style.paddingTop="8px";
  total.appendChild(el("span",null,"Total"));
  total.appendChild(el("span",null, money(cartSubtotal())));
  sum.appendChild(total);
  wrap.appendChild(sum);

  var form=el("form"); form.id="cartCheckoutForm";
  form.appendChild(field("ckName","Your name",{required:true}));
  form.appendChild(field("ckEmail","Your email",{type:"email",required:true}));
  form.appendChild(field("ckNotes","Notes (optional)",{textarea:true}));
  var placeBtn=el("button","btn primary","Place Order"); placeBtn.type="submit"; placeBtn.style.width="100%";
  var backBtn=el("button","btn ghost","Back to Cart"); backBtn.type="button"; backBtn.style.width="100%"; backBtn.style.marginTop="8px";
  backBtn.onclick=function(){ cartView="cart"; renderCartPanel(); };
  form.appendChild(placeBtn);
  form.appendChild(backBtn);
  form.addEventListener("submit", submitOrder);
  wrap.appendChild(form);
  var note=el("p","emailnote","Submitting opens an email with your order to VGELESS VIBES. We'll reply to arrange payment \u2014 card checkout via Stripe is coming soon.");
  note.style.padding="0"; note.style.marginTop="8px";
  wrap.appendChild(note);
  return wrap;
}

function submitOrder(e){
  e.preventDefault();
  var name=document.getElementById("ckName").value.trim();
  var email=document.getElementById("ckEmail").value.trim();
  var notes=document.getElementById("ckNotes").value.trim();
  var lines = cart.map(function(i){ return i.qty+"x "+i.title+" ("+i.kind+") \u2014 "+money(i.price)+" each = "+money(i.price*i.qty); }).join("\n");
  var body = "New order from the website:\n\n"+lines+"\n\nTotal: "+money(cartSubtotal())+
             "\n\nName: "+name+"\nEmail: "+email+(notes?("\nNotes: "+notes):"");
  window.location.href = mail("New order from "+name, body);
  cart = []; saveCart();
  cartView = "success";
  renderCartPanel();
}

function buildSuccessView(){
  var wrap=el("div","successBox");
  wrap.appendChild(el("div","big","\u2713"));
  wrap.appendChild(el("div",null,"Your order email is ready."));
  var note=el("p","emailnote","Hit Send in your email app and we'll follow up to arrange payment. Card checkout via Stripe is coming soon.");
  note.style.padding="0"; note.style.marginTop="6px";
  wrap.appendChild(note);
  var btn=el("button","btn primary","Start New Order"); btn.type="button"; btn.style.width="100%"; btn.style.marginTop="14px";
  btn.onclick=function(){ cartView="cart"; renderCartPanel(); };
  wrap.appendChild(btn);
  return wrap;
}

function renderCartPanel(){
  document.getElementById("cartBadge").textContent = String(cartCount());
  var body=document.getElementById("cartBody"); body.textContent="";
  var footer=document.getElementById("cartFooter");

  if(cartView==="checkout"){ footer.style.display="none"; body.appendChild(buildCheckoutView()); return; }
  if(cartView==="success"){ footer.style.display="none"; body.appendChild(buildSuccessView()); return; }

  footer.style.display="";
  if(cart.length===0){
    body.appendChild(el("div","cartEmpty","Your cart is empty. Add a beat, or the next drop pre-order once it's priced."));
  } else {
    cart.forEach(function(i){
      var row=el("div","cartItem");
      var main=el("div"); main.style.flex="1"; main.style.minWidth="0";
      main.appendChild(el("div","ci-kind", i.kind));
      main.appendChild(el("div","ci-title", i.title));
      main.appendChild(el("div","ci-price", money(i.price)+" each"));
      var qr=el("div","qtyRow");
      var minus=el("button",null,"\u2212"); minus.type="button";
      minus.onclick=function(){ if(i.qty<=1) removeCartItem(i.key); else setCartQty(i.key, i.qty-1); };
      var qs=el("span",null,String(i.qty));
      var plus=el("button",null,"+"); plus.type="button"; plus.onclick=function(){ setCartQty(i.key, i.qty+1); };
      var rm=el("button","ci-remove","Remove"); rm.type="button"; rm.onclick=function(){ removeCartItem(i.key); };
      qr.appendChild(minus); qr.appendChild(qs); qr.appendChild(plus); qr.appendChild(rm);
      main.appendChild(qr);
      row.appendChild(main);
      var lineTotal=el("div",null, money(i.price*i.qty)); lineTotal.style.fontWeight="600"; lineTotal.style.whiteSpace="nowrap";
      row.appendChild(lineTotal);
      body.appendChild(row);
    });
  }
  document.getElementById("cartSubtotal").textContent = money(cartSubtotal());
  var btn=document.getElementById("cartCheckoutBtn");
  btn.disabled = cart.length===0;
  btn.style.opacity = cart.length===0 ? .5 : 1;
}

function openCart(){ document.getElementById("cartPanel").classList.add("open"); document.getElementById("cartBtn").setAttribute("aria-expanded","true"); }
function closeCart(){ document.getElementById("cartPanel").classList.remove("open"); document.getElementById("cartBtn").setAttribute("aria-expanded","false"); }
document.getElementById("cartBtn").addEventListener("click", function(){
  document.getElementById("cartPanel").classList.contains("open") ? closeCart() : openCart();
});
document.getElementById("cartClose").addEventListener("click", closeCart);
document.getElementById("cartCheckoutBtn").addEventListener("click", function(){
  if(cart.length===0) return;
  cartView="checkout"; renderCartPanel();
});
renderCartPanel();

/* ---------- next drop ---------- */
(function(){
  var box = document.getElementById("dropBox");
  var cover = el("div","cover a", NEXT_DROP.title);
  box.appendChild(cover);
  var right = el("div");
  right.appendChild(el("span","pill","Coming Soon \u2022 " + NEXT_DROP.type));
  var h = el("h3", null, NEXT_DROP.title); h.style.fontSize="2.2rem"; h.style.marginTop="8px";
  right.appendChild(h);
  right.appendChild(el("p","meta", NEXT_DROP.earlyAccess));
  var cd = el("div","count"); right.appendChild(cd);
  right.appendChild(el("div","price","Pre-order price: " + money(NEXT_DROP.price)));
  var row = el("div","cta");
  if(NEXT_DROP.price!=null){
    var addDrop=el("button","btn primary","Add Pre-Order to Cart"); addDrop.type="button";
    addDrop.onclick=function(){ addToCart({ key:"drop:"+NEXT_DROP.title, title:NEXT_DROP.title+" (Pre-Order)", price:NEXT_DROP.price, kind:"Pre-order" }); };
    row.appendChild(addDrop);
  }
  var a = el("a", NEXT_DROP.price!=null ? "btn ghost" : "btn primary", "Email Us About Early Access");
  a.href = mail("Pre-order: " + NEXT_DROP.title, "Hi! I'd like to pre-order " + NEXT_DROP.title + ".\n\nName:\n");
  row.appendChild(a);
  right.appendChild(row);
  box.appendChild(right);

  function tick(){
    cd.textContent = "";
    if(!NEXT_DROP.dropDate){ cd.appendChild(el("p","meta","Drop date TBA. Email us to be first in line.")); return; }
    var ms = new Date(NEXT_DROP.dropDate) - new Date();
    if(ms <= 0){ cd.appendChild(el("p","meta","It's out now! Stream it below.")); return; }
    var d=Math.floor(ms/864e5), hh=Math.floor(ms%864e5/36e5), m=Math.floor(ms%36e5/6e4), s=Math.floor(ms%6e4/1e3);
    [["Days",d],["Hrs",hh],["Min",m],["Sec",s]].forEach(function(p){
      var x=el("div"); x.appendChild(el("b",null,String(p[1]))); x.appendChild(el("small",null,p[0])); cd.appendChild(x);
    });
  }
  tick(); setInterval(tick,1000);
})();

/* ---------- music ---------- */
var mFilter="all";
function renderMusic(){
  var g=document.getElementById("musicGrid"); g.textContent="";
  RELEASES.filter(function(r){return mFilter==="all"||r.type===mFilter;}).forEach(function(r){
    var c=el("div","card");
    c.appendChild(el("div","cover "+r.tone, r.title));
    c.appendChild(el("span","pill", r.type + (r.year? " \u2022 "+r.year : "")));
    c.appendChild(el("h3",null,r.title));
    c.appendChild(el("div","meta",r.note));
    var row=el("div","row");
    var s=el("a","btn primary small","Spotify"); s.href="https://open.spotify.com/artist/4nJQ6BOYyBf3po4MYMtqpH"; s.target="_blank"; s.rel="noopener";
    var ap=el("a","btn ghost small","Apple Music"); ap.href="https://music.apple.com/us/artist/bomoney/1493883500"; ap.target="_blank"; ap.rel="noopener";
    row.appendChild(s); row.appendChild(ap); c.appendChild(row);
    g.appendChild(c);
  });
}
document.getElementById("musicFilters").addEventListener("click",function(e){
  var b=e.target.closest(".chip"); if(!b) return;
  mFilter=b.dataset.f;
  [].forEach.call(this.children,function(x){x.classList.toggle("on",x===b);});
  renderMusic();
});
renderMusic();

/* ---------- beats ---------- */
function renderBeats(){
  var g=document.getElementById("beatGrid"); g.textContent="";
  var tones=["","b","c","d"];
  BEATS.forEach(function(b,i){
    var c=el("div","card");
    c.appendChild(el("div","cover "+tones[i%4], b.title));
    c.appendChild(el("span","pill","Prod. Vgeless.vibes"));
    c.appendChild(el("h3",null,b.title));
    var directUrl = b.url || BEATSTARS_URL;
    if(b.audio){ var au=el("audio"); au.controls=true; au.preload="none"; au.src=b.audio; c.appendChild(au); }
    else c.appendChild(el("div","nopreview", directUrl ? "Preview on BeatStars" : "Preview coming soon"));
    c.appendChild(el("div","price", b.price==null ? "Price on BeatStars" : money(b.price)));
    var row=el("div","row");
    if(b.price!=null){
      var add=el("button","btn primary small","Add to Cart"); add.type="button";
      add.onclick=function(){ addToCart({ key:"beat:"+b.title, title:b.title, price:b.price, kind:"Beat", url:directUrl }); };
      row.appendChild(add);
    }
    if(directUrl){
      var buy=el("a", b.price!=null ? "btn ghost small" : "btn primary small", b.price!=null ? "Buy on BeatStars" : "View on BeatStars");
      buy.href=directUrl; buy.target="_blank"; buy.rel="noopener";
      row.appendChild(buy);
    } else {
      var q=el("a", b.price!=null ? "btn ghost small" : "btn primary small", b.price!=null ? "Ask by email" : "Ask about price");
      q.href=mail("Beat inquiry: "+b.title,"Hi! I'm interested in the beat \""+b.title+"\".\n\nName:\nArtist name:\n");
      row.appendChild(q);
    }
    c.appendChild(row); g.appendChild(c);
  });
}
renderBeats();
(function(){
  var s=document.getElementById("beatStore");
  if(BEATSTARS_URL){
    var a=el("a","btn primary","See the full catalog on BeatStars"); a.href=BEATSTARS_URL; a.target="_blank"; a.rel="noopener"; s.appendChild(a);
  }
})();

/* ---------- contact form ---------- */
document.getElementById("contactForm").addEventListener("submit",function(e){
  e.preventDefault();
  var n=document.getElementById("cName").value, t=document.getElementById("cType").value, m=document.getElementById("cMsg").value;
  window.location.href = mail(t+" - "+n, m+"\n\nFrom: "+n);
});

/* ---------- chat assistant (local, no account needed) ---------- */
var chat=document.getElementById("chat"), log=document.getElementById("log"), input=document.getElementById("chatIn");
function say(text,who){ var m=el("div","msg "+who,text); log.appendChild(m); log.scrollTop=log.scrollHeight; }
var KB=[
  {k:["beat","instrumental","lease","license","exclusive","buy"], a:function(){ return "Beats are in the Beats section, most at $15. Tap Add to Cart on any priced beat, then Checkout in the cart panel to send us the order." + (BEATSTARS_URL ? " You can also buy instantly on BeatStars." : "") + " For exclusives or custom work, email vgelessvibes.studios@gmail.com."; }},
  {k:["cart","checkout","order","my order"], a:"Add items with Add to Cart, then tap Cart up top and hit Checkout. Submitting sends your order straight to us by email, and we'll follow up to arrange payment \u2014 card checkout via Stripe is coming soon."},
  {k:["preorder","pre-order","early","drop","release date","coming"], a:"Upcoming releases live in the Next Drop section. Pre-order there to listen early before the public drop date \u2014 once it's priced you can add it to your cart, or just email us to reserve a spot."},
  {k:["price","cost","how much"], a:"Most beats are $15, shown on each beat card, and your cart total updates automatically as you add items. The Next Drop section shows the pre-order price once it's set."},
  {k:["album","better days","single","quest","trap phone","opp pack","stream","spotify","apple","listen","music","youtube"], a:"Latest album: Better Days Ahead (2026). Singles include Trap Phone Freestyle, Opp Pack Freestyle and QUEST. Stream on Spotify or Apple Music, or watch on YouTube \u2014 @bomoneytwo.o for music, @vgelessvibesstudios for studio sessions."},
  {k:["book","booking","feature","collab","verse","business","press","interview"], a:"For features, collabs, booking or business, please email vgelessvibes.studios@gmail.com. Business/LLC: thewiseonesllc@gmail.com."},
  {k:["email","contact","reach","phone"], a:"Email is the fastest way to get a real reply: vgelessvibes.studios@gmail.com (business: thewiseonesllc@gmail.com)."},
  {k:["who","about","bio","new orleans","bomoney"], a:"BOMONEY is an independent hip-hop and rap artist, producer and creator from the Lower Ninth Ward of New Orleans. Studio name: VGELESS VIBES. Check the About section for the full story."},
  {k:["hello","hi","hey","yo","sup"], a:"Hey! Ask me about beats, your cart, pre-orders, the music, or booking."}
];
function reply(q){
  q=q.toLowerCase();
  for(var i=0;i<KB.length;i++){ for(var j=0;j<KB[i].k.length;j++){ if(q.indexOf(KB[i].k[j])>-1) return (typeof KB[i].a==="function") ? KB[i].a() : KB[i].a; } }
  return "I'm not sure about that one. Please email vgelessvibes.studios@gmail.com and the team will get back to you.";
}
say("Welcome to VGELESS VIBES! Ask me about beats, your cart, pre-orders, or the music. For anything that needs a real reply, email is best.","bot");
var qk=document.getElementById("quick");
["Buy a beat","My Cart","Pre-order","Booking","Contact"].forEach(function(t){
  var b=el("button","chip",t); b.type="button"; b.onclick=function(){ send(t); }; qk.appendChild(b);
});
function send(t){ if(!t.trim()) return; say(t,"me"); setTimeout(function(){ say(reply(t),"bot"); },350); }
document.getElementById("chatForm").addEventListener("submit",function(e){ e.preventDefault(); send(input.value); input.value=""; });
var cb=document.getElementById("chatBtn");
cb.addEventListener("click",function(){
  var o=chat.classList.toggle("open"); cb.setAttribute("aria-expanded",o); cb.textContent=o?"Close":"Chat"; if(o) input.focus();
});
