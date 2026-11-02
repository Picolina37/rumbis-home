/* ================================================================
   RUMBIS · CARRITO DE COSTADO CON DISEÑO PROPIO · v1.2 (02/11/2026)
   v1.2: abre el carrito con clic nativo (antes no abría) y, si hay envío
         gratis, muestra solo las opciones gratis (CONFIG.soloEnvioGratis).
   v1.1: al agregar CUALQUIER producto se cierra el aviso "¡Agregado al carrito!"
         del tema y se abre este carrito de costado (CONFIG.abrirAlAgregar).
   Se carga en TODA la tienda desde Google Tag Manager (como la home).
   Trabaja sobre el carrito del tema Amazonas (#modal-cart): no lo
   reemplaza, le suma diseño y bloques.
 
   Qué hace:
   1. Barra de envío gratis arriba ("Te faltan $X…" / "¡Tenés envío gratis!")
   2. Aviso del descuento por cantidad (5% llevando 2 · 10% llevando 3)
   3. Botones − + con el estilo de Rumbis
   4. "Completá el paseo": productos sugeridos con "+ Sumar" adentro del carrito
   5. Total, "Ahorrás $X" (solo si hay descuento real aplicado),
      botón de pago en bordó y precio con transferencia debajo
 
   ⚙️ Lo único que se edita es el bloque CONFIG de acá abajo.
   ================================================================ */
!function(){
  if(window.RMB_CART) return; window.RMB_CART=!0;
 
  /* ======================= ⚙️ CONFIG ======================= */
  var CONFIG={
    /* true = al agregar un producto se abre el carrito de costado (en vez del aviso del tema) */
    abrirAlAgregar:true,
    /* true = si alguna opción de envío sale gratis, en el carrito se muestran solo las gratis
       (con un link para ver las demás) */
    soloEnvioGratis:true,
    /* ENVÍO GRATIS
       modo "doble" = dos montos (AMBA y resto del país), como hoy.
       modo "unico" = un solo monto para todos (usa envio.unico). */
    envio:{ modo:"doble", amba:120000, resto:180000, unico:120000 },
    /* DESCUENTO POR CANTIDAD (tiene que coincidir con la promo de Tiendanube) */
    escalones:[ {desde:2, off:5}, {desde:3, off:10} ],
    /* TRANSFERENCIA */
    transferencia:10,
    /* "COMPLETÁ EL PASEO": productos sugeridos.
       url = link del producto · buscar = si no hay link, lo busca en la tienda.
       Los que ya están en el carrito no se muestran. */
    sugeridos:{
      titulo:"Completá el paseo",
      items:[
        { nombre:"Arnés Rumbis Balance", url:"/productos/arnes-formato-h-rumbis-balance-copia-161ic/", buscar:"Rumbis Balance" },
        { nombre:"Arnés Rumbis Fit Control", url:"", buscar:"Rumbis Fit Control" },
        { nombre:"Correa Rumbis de 3 Metros", url:"/productos/correa-rumbis-3-metros-paseos-con-libertad-control-y-seguridad-tager/", buscar:"" }
      ]
    },
    textos:{
      titulo:"Tu carrito",
      faltaUnico:"Te faltan <b>{falta}</b> para el envío gratis",
      faltaAmba:"Te faltan <b>{falta}</b> para el envío gratis en AMBA",
      notaResto:"Al resto del país, envío gratis desde {resto}.",
      okAmba:"¡Tenés envío gratis en AMBA! 🎉",
      okAmbaNota:"Al resto del país te faltan {falta}.",
      ok:"¡Tenés envío gratis! 🎉",
      okTodo:"¡Tenés envío gratis a todo el país! 🎉",
      promoFalta:"Sumá <b>{n} producto{s} más</b> y tenés <b>{off}% OFF</b> en todo",
      promoOk:"Ya tenés <b>{off}% OFF</b> por llevar {n} productos",
      promoMax:"Tenés el descuento máximo: <b>{off}% OFF</b> 🎉",
      ahorras:"Ahorrás {monto}",
      transfer:"o <b>{monto}</b> pagando con transferencia ({pct}% OFF)",
      pagar:"Iniciar compra",
      sumar:"+ Sumar",
      sumando:"Sumando…",
      otrosEnvios:"Ver otras opciones de envío ({n})",
      menosEnvios:"Mostrar solo las gratis"
    }
  };
  /* ===================== FIN CONFIG ======================== */
 
  var T=CONFIG.textos;
  var CSS=
   "@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500..700;1,9..144,500&family=Manrope:wght@400;500;600;700;800&display=swap');"
  +"#modal-cart{--c-vino:#944654;--c-vino-dk:#6E313C;--c-verde:#1B5F54;--c-tinta:#373435;--c-muted:#6F6A68;--c-hueso:#FDFCF7;--c-arena:#F0CDB7;--c-coral:#F9776A;--c-line:rgba(55,52,53,.12);background:var(--c-hueso)!important;font-family:Manrope,system-ui,sans-serif!important;color:var(--c-tinta)}"
  /* encabezado */
  +"#modal-cart .modal-header{font-family:Fraunces,Georgia,serif!important;font-size:0!important;font-weight:600!important;color:var(--c-vino)!important;text-align:center!important;padding:20px 52px 14px!important;border-bottom:1px solid var(--c-line)!important;background:var(--c-hueso)!important;position:relative}"
  +"#modal-cart .modal-header:after{content:attr(data-rc-titulo);font-size:22px;letter-spacing:.01em}"
  +"#modal-cart .modal-header .modal-close{position:absolute!important;right:16px;top:50%;transform:translateY(-50%);width:34px;height:34px;border:1.5px solid rgba(148,70,84,.35);border-radius:50%;display:flex!important;align-items:center;justify-content:center;font-size:14px}"
  +"#modal-cart .modal-header .modal-close svg{fill:var(--c-vino)!important;width:11px}"
  +"#modal-cart .modal-body{padding:14px 16px 0!important}"
  /* barra de envío propia (la del tema se oculta) */
  +"#modal-cart .js-ship-free-rest{display:none!important}"
  +"#rc-envio{border-radius:16px;padding:13px 15px 14px;margin:0 0 14px;background:#fff;border:1px solid rgba(27,95,84,.22)}"
  +"#rc-envio.ok{background:#EEF6F3;border-color:rgba(27,95,84,.35)}"
  +"#rc-envio .rc-et{display:flex;gap:10px;align-items:flex-start;font-size:14.5px;line-height:1.35;font-weight:600;color:var(--c-tinta)}"
  +"#rc-envio .rc-et b{color:var(--c-vino);font-weight:800}"
  +"#rc-envio .rc-ic{flex:0 0 auto;color:var(--c-verde);margin-top:1px}"
  +"#rc-envio .rc-bar{height:8px;border-radius:99px;background:#EDEAE6;margin-top:10px;overflow:hidden}"
  +"#rc-envio .rc-bar i{display:block;height:100%;border-radius:99px;background:linear-gradient(90deg,#8FB3AB,var(--c-verde));transition:width .6s cubic-bezier(.22,1,.36,1)}"
  +"#rc-envio .rc-en{margin:7px 0 0;font-size:12px;color:var(--c-muted)}"
  /* productos del carrito */
  +"#modal-cart .js-ajax-cart-list{display:flex;flex-direction:column;gap:10px}"
  +"#modal-cart .js-cart-item{position:relative;margin:0!important;padding:12px 40px 12px 12px!important;background:#fff;border:1px solid var(--c-line);border-radius:16px;align-items:center;display:flex!important;flex-wrap:nowrap!important}"
  +"#modal-cart .js-cart-item>[class*='col-2']{flex:0 0 76px!important;max-width:76px!important;padding:0!important}"
  +"#modal-cart .js-cart-item>[class*='col-2'] img{width:76px;height:76px;object-fit:cover;border-radius:12px;background:#F4F0EA}"
  +"#modal-cart .js-cart-item>[class*='col-10'],#modal-cart .js-cart-item>.col{flex:1 1 auto!important;max-width:none!important;padding:0 0 0 12px!important}"
  +"#modal-cart .cart-item-name{font-family:Manrope,sans-serif!important;font-size:14px!important;font-weight:700!important;line-height:1.3!important;margin:0 0 4px!important}"
  +"#modal-cart .cart-item-name a{color:var(--c-tinta)!important}"
  +"#modal-cart .cart-item-name small{display:block;font-size:12px;font-weight:500;color:var(--c-muted);margin-top:2px}"
  +"#modal-cart .cart-item-name .label{background:rgba(249,119,106,.14)!important;color:#C2483D!important;border-radius:99px!important;font-weight:800!important;font-size:10px!important;letter-spacing:.04em;padding:4px 9px!important;border:0!important}"
  +"#modal-cart .cart-item-quantity{display:inline-block;margin-top:6px}"
  +"#modal-cart .cart-item-quantity .form-quantity,#modal-cart .cart-item-quantity .form-group{margin:0!important;border:1.5px solid rgba(148,70,84,.28)!important;border-radius:99px!important;background:#fff!important;padding:2px 4px!important}"
  +"#modal-cart .cart-item-quantity .row{flex-wrap:nowrap;align-items:center}"
  +"#modal-cart .js-cart-quantity-btn{width:30px;height:30px;padding:0!important;border-radius:50%!important;display:inline-flex!important;align-items:center;justify-content:center;border:0!important;background:transparent!important}"
  +"#modal-cart .js-cart-quantity-btn:hover{background:rgba(148,70,84,.08)!important}"
  +"#modal-cart .js-cart-quantity-btn svg{fill:var(--c-vino)!important;width:11px;height:11px}"
  +"#modal-cart .js-cart-quantity-input{width:30px!important;min-width:0!important;border:0!important;background:transparent!important;text-align:center;font-family:Fraunces,serif!important;font-size:17px!important;font-weight:600;color:var(--c-vino)!important;padding:0!important;box-shadow:none!important;-moz-appearance:textfield}"
  +"#modal-cart .js-cart-quantity-input::-webkit-inner-spin-button,#modal-cart .js-cart-quantity-input::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}"
  +"#modal-cart .js-cart-item-subtotal{position:absolute;right:14px;bottom:14px;margin:0!important;font-family:Fraunces,serif!important;font-size:17px!important;font-weight:600!important;color:var(--c-vino)!important}"
  +"#modal-cart .cart-item-delete{position:absolute!important;top:8px;right:6px;width:auto!important;max-width:none!important;flex:none!important;padding:0!important}"
  +"#modal-cart .cart-item-delete .btn{border:0!important;background:transparent!important;padding:4px 6px!important;box-shadow:none!important}"
  +"#modal-cart .cart-item-delete svg{fill:var(--c-muted)!important;width:14px}"
  /* aviso de cantidad */
  +"#rc-promo{display:flex;align-items:center;gap:8px;margin:10px 0 0;padding:9px 13px;border-radius:99px;background:rgba(249,119,106,.12);color:#A63A31;font-size:12.5px;font-weight:600;line-height:1.3}"
  +"#rc-promo b{font-weight:800}"
  +"#rc-promo.ok{background:rgba(27,95,84,.1);color:var(--c-verde)}"
  /* sugeridos */
  +"#rc-sug{margin:22px 0 6px}"
  +"#rc-sug .rc-st{margin:0 0 10px;text-align:center;font-family:Fraunces,Georgia,serif;font-weight:600;font-size:20px;color:var(--c-vino)}"
  +"#rc-sug .rc-rail{display:flex;gap:10px;overflow-x:auto;scroll-snap-type:x mandatory;padding:2px 2px 8px;scrollbar-width:none}"
  +"#rc-sug .rc-rail::-webkit-scrollbar{display:none}"
  +"#rc-sug .rc-it{flex:0 0 150px;scroll-snap-align:start;background:#fff;border:1px solid var(--c-line);border-radius:16px;overflow:hidden;display:flex;flex-direction:column}"
  +"#rc-sug .rc-im{display:block;aspect-ratio:1/1;background:#F4F0EA}"
  +"#rc-sug .rc-im img{width:100%;height:100%;object-fit:cover;display:block}"
  +"#rc-sug .rc-tx{padding:9px 10px 10px;display:flex;flex-direction:column;gap:6px;flex:1 1 auto}"
  +"#rc-sug .rc-n{font-size:12.5px;font-weight:700;line-height:1.25;color:var(--c-tinta)}"
  +"#rc-sug .rc-p{font-family:Fraunces,serif;font-weight:600;font-size:15px;color:var(--c-vino)}"
  +"#rc-sug select{width:100%;font-size:12px;padding:5px 6px;border:1px solid var(--c-line);border-radius:8px;background:#fff;color:var(--c-tinta)}"
  +"#rc-sug .rc-add{margin-top:auto;width:100%;border:1.5px solid var(--c-vino);background:#fff;color:var(--c-vino);border-radius:99px;padding:8px 6px;font-family:Manrope,sans-serif;font-size:12.5px;font-weight:800;cursor:pointer;transition:background .2s,color .2s}"
  +"#rc-sug .rc-add:hover{background:var(--c-vino);color:#fff}"
  +"#rc-sug .rc-add[disabled]{opacity:.6;cursor:wait}"
  /* totales y botón */
  +"#modal-cart .js-shipping-calculator-container,#modal-cart [data-store='coupon-input']{font-size:13px}"
  +"#modal-cart .cart-totals-container{font-family:Manrope,sans-serif!important}"
  +"#modal-cart .cart-subtotal{font-size:14px!important;font-weight:600!important;color:var(--c-muted)!important}"
  +"#modal-cart .cart-total{align-items:baseline;margin-bottom:4px!important}"
  +"#modal-cart .cart-total-label{font-size:13px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--c-tinta)}"
  +"#modal-cart .cart-total .js-cart-total{font-family:Fraunces,serif!important;font-size:26px!important;font-weight:600!important;color:var(--c-vino)!important}"
  +"#rc-ahorro{margin:0 0 12px;font-size:13px;font-weight:800;color:var(--c-verde)}"
  +"#modal-cart .js-ajax-cart-submit input[type='submit'],#modal-cart [data-component='cart.checkout-button']{width:100%!important;border:0!important;border-radius:99px!important;padding:18px 20px!important;font-family:Manrope,sans-serif!important;font-size:15px!important;font-weight:800!important;letter-spacing:.08em!important;text-transform:uppercase!important;color:#FDFCF7!important;background:linear-gradient(135deg,#A9505F,#944654 55%,#6E313C)!important;box-shadow:0 12px 26px rgba(148,70,84,.3)!important}"
  +"#rc-transfer{margin:10px 0 14px;text-align:center;font-size:13px;color:var(--c-muted)}"
  +"#rc-transfer b{color:var(--c-tinta);font-weight:800}"
  +"#rc-otros{display:block;width:100%;margin:8px 0 4px;padding:8px;border:0;background:transparent;color:var(--c-vino);font-family:Manrope,sans-serif;font-size:13px;font-weight:700;text-decoration:underline;text-underline-offset:3px;cursor:pointer}";
 
  var TRUCK='<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="6" width="14" height="11" rx="1.5"/><path d="M15 9h4l3 3.5V17h-7z"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="19" r="2"/></svg>';
  var TAG='<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z"/><circle cx="7.5" cy="7.5" r="1.5"/></svg>';
 
  function $(s,r){ return (r||document).querySelector(s); }
  function $$(s,r){ return [].slice.call((r||document).querySelectorAll(s)); }
  function esc(s){ return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];}); }
  function money(v){ return "$"+String(Math.round(v||0)).replace(/\B(?=(\d{3})+(?!\d))/g,"."); }
  function tpl(s,o){ return String(s||"").replace(/\{(\w+)\}/g,function(m,k){ return o[k]!=null?o[k]:m; }); }
  /* "$52.700,00" -> 52700 */
  function num(t){ t=String(t||"").replace(/[^\d,.]/g,""); if(!t) return 0; t=t.replace(/\./g,"").replace(",","."); return parseFloat(t)||0; }
 
  function datos(){
    var M=$("#modal-cart"); if(!M) return null;
    var n=0; $$(".js-cart-quantity-input",M).forEach(function(i){ n+=parseInt(i.value,10)||0; });
    var sub=0; $$(".js-cart-item-subtotal",M).forEach(function(e){ sub+=num(e.textContent); });
    if(!sub){ var s=$(".js-cart-subtotal",M); if(s) sub=num(s.textContent); }
    var tot=num(($(".cart-total .js-cart-total",M)||{}).textContent);
    var envTxt=(($("#shipping-cost",M)||{}).textContent)||"", env=/\d/.test(envTxt)?num(envTxt):0;
    return {M:M,n:n,sub:sub,tot:tot,env:env};
  }
 
  /* ---------- 1. ENVÍO GRATIS ---------- */
  function envio(D){
    var E=CONFIG.envio, base=D.sub, h="", pct=0, ok=!1, nota="";
    if(E.modo==="unico"){
      var f=E.unico-base; pct=Math.min(100,base/E.unico*100);
      if(f<=0){ ok=!0; h=T.ok; } else h=tpl(T.faltaUnico,{falta:money(f)});
    } else {
      var fa=E.amba-base, fr=E.resto-base;
      if(fr<=0){ ok=!0; pct=100; h=T.okTodo; }
      else if(fa<=0){ ok=!0; pct=Math.min(100,base/E.resto*100); h=T.okAmba; nota=tpl(T.okAmbaNota,{falta:money(fr)}); }
      else { pct=Math.min(100,base/E.amba*100); h=tpl(T.faltaAmba,{falta:money(fa)}); nota=tpl(T.notaResto,{resto:money(E.resto)}); }
    }
    return '<div class="rc-et"><span class="rc-ic">'+TRUCK+'</span><span>'+h+'</span></div>'
      +'<div class="rc-bar"><i style="width:'+pct.toFixed(1)+'%"></i></div>'
      +(nota?'<p class="rc-en">'+nota+'</p>':"")+'<!--'+(ok?"ok":"no")+'-->';
  }
 
  /* ---------- 2. DESCUENTO POR CANTIDAD ---------- */
  function promo(n){
    var ES=CONFIG.escalones.slice().sort(function(a,b){return a.desde-b.desde;}), act=null, sig=null;
    ES.forEach(function(e){ if(n>=e.desde) act=e; else if(!sig) sig=e; });
    if(!sig&&act) return {ok:!0,h:tpl(T.promoMax,{off:act.off})};
    if(sig){ var f=sig.desde-n; return {ok:!1,h:tpl(T.promoFalta,{n:f,s:f>1?"s":"",off:sig.off})+(act?" · hoy: "+act.off+"% OFF":"")}; }
    return null;
  }
 
  /* ---------- 4. SUGERIDOS ---------- */
  var SUG=CONFIG.sugeridos.items.map(function(c){ return {c:c,url:c.url||"",ok:!1,pid:"",grupos:[],precio:0,img:"",busy:!1}; });
  var cargado=!1;
  function leer(x,t){
    var d=new DOMParser().parseFromString(t,"text/html");
    var f=d.querySelector(".js-product-form")||d.getElementById("product_form"); if(!f) return !1;
    var inp=f.querySelector("input[name='add_to_cart']"); if(!inp||!inp.value) return !1;
    x.pid=inp.value; x.act=f.getAttribute("action")||"/comprar/"; x.grupos=[];
    var vis={};
    $$("select.js-variation-option",f).forEach(function(s){
      var nm=s.getAttribute("name"); if(!nm||vis[nm]) return; vis[nm]=1;
      var ops=[].map.call(s.options,function(o){return (o.value||"").trim();}).filter(Boolean);
      var lab=s.id?d.querySelector('label[for="'+s.id+'"]'):null;
      x.grupos.push({name:nm,nombre:((lab&&lab.textContent)||"Opción").replace(/[:\s]+$/,"").trim(),ops:ops,val:(s.value||ops[0]||"").trim()});
    });
    var pp=d.querySelector("[data-product-price]"), c=pp?parseInt(pp.getAttribute("data-product-price"),10):0;
    x.precio=c?c/100:num((d.querySelector(".js-price-display")||{}).textContent);
    var og=d.querySelector('meta[property="og:image"]'); if(og&&og.content) x.img=og.content.replace(/^\/\//,"https://");
    var tt=d.querySelector('meta[property="og:title"]'); if(tt&&tt.content&&!x.c.nombre) x.c.nombre=tt.content;
    x.ok=!0; return !0;
  }
  function cargar(x){
    function traer(u){ return fetch(u,{credentials:"same-origin"}).then(function(r){ if(!r.ok) throw 0; return r.text(); }).then(function(t){ return leer(x,t); }); }
    function buscar(){
      var q=x.c.buscar||x.c.nombre; if(!q) return Promise.resolve(!1);
      return fetch("/search/?q="+encodeURIComponent(q),{credentials:"same-origin"}).then(function(r){return r.text();}).then(function(t){
        var d=new DOMParser().parseFromString(t,"text/html"), P=q.toLowerCase().split(/\s+/).filter(function(w){return w.length>2;}), best=null, bp=0;
        $$('a[href*="/productos/"]',d).forEach(function(a){ var h=a.getAttribute("href")||"", tx=((a.getAttribute("title")||"")+" "+a.textContent+" "+h).toLowerCase(), p=0; P.forEach(function(w){ if(tx.indexOf(w)>-1) p++; }); if(p>bp){ bp=p; best=h; } });
        if(!best) return !1; x.url=best; return traer(best);
      });
    }
    return (x.url?traer(x.url).catch(function(){ x.url=""; return buscar(); }):buscar()).catch(function(){ return !1; });
  }
  function enCarrito(pid){ return !!$('#modal-cart [data-store="cart-item-'+pid+'"]'); }
  function sugeridos(){
    var L=SUG.filter(function(x){ return x.ok&&!enCarrito(x.pid); });
    if(!L.length) return "";
    return '<p class="rc-st">'+esc(CONFIG.sugeridos.titulo)+'</p><div class="rc-rail">'+L.map(function(x){
      var i=SUG.indexOf(x);
      var sel=x.grupos.filter(function(g){return g.ops.length>1;}).map(function(g){
        var j=x.grupos.indexOf(g);
        return '<select data-i="'+i+'" data-j="'+j+'" aria-label="'+esc(g.nombre)+'">'+g.ops.map(function(o){ return '<option'+(o===g.val?" selected":"")+'>'+esc(o)+'</option>'; }).join("")+'</select>';
      }).join("");
      return '<div class="rc-it"><a class="rc-im" href="'+esc(x.url)+'">'+(x.img?'<img src="'+esc(x.img)+'" alt="" loading="lazy">':"")+'</a>'
        +'<div class="rc-tx"><span class="rc-n">'+esc(x.c.nombre)+'</span>'+(x.precio?'<span class="rc-p">'+money(x.precio)+'</span>':"")+sel
        +'<button type="button" class="rc-add" data-i="'+i+'"'+(x.busy?" disabled":"")+'>'+(x.busy?T.sumando:T.sumar)+'</button></div></div>';
    }).join("")+'</div>';
  }
  function sumar(x,btn){
    x.busy=!0; btn.disabled=!0; btn.textContent=T.sumando;
    var f=document.createElement("form"); f.action=x.act; f.method="post"; f.style.display="none"; f.className="js-product-form rc-tmp";
    var h='<input type="hidden" name="add_to_cart" value="'+esc(x.pid)+'"><input type="hidden" name="quantity" value="1">';
    x.grupos.forEach(function(g){ h+='<input type="hidden" name="'+esc(g.name)+'" value="'+esc(g.val)+'">'; });
    h+='<button class="js-addtocart" type="submit"></button>';
    f.innerHTML=h; document.body.appendChild(f);
    var fin=function(){ x.busy=!1; try{ f.remove(); }catch(e){} pintar(!0); };
    try{
      if(window.LS&&LS.addToCartEnhanced){
        var p=LS.addToCartEnhanced(f);
        (p&&p.then?p:Promise.resolve()).then(function(){ setTimeout(fin,300); },function(){ setTimeout(fin,300); });
        return;
      }
    }catch(e){}
    /* respaldo: lo suma y recarga con el carrito abierto */
    var fd=new FormData(f);
    fetch(x.act,{method:"POST",body:fd,credentials:"same-origin"}).then(function(){ try{ sessionStorage.setItem("rc_abrir","1"); }catch(e){} location.reload(); });
  }
 
  /* ---------- PINTAR ---------- */
  var pintando=!1;
  function pintar(forzar){
    var D=datos(); if(!D) return;
    pintando=!0;
    var M=D.M, body=$(".modal-body",M), list=$(".js-ajax-cart-list",M);
    var hd=$(".modal-header",M); if(hd) hd.setAttribute("data-rc-titulo",T.titulo);
    var lleno=D.n>0;
    function bloque(id,donde,ref,html){
      var e=document.getElementById(id);
      if(!html){ if(e) e.remove(); return null; }
      if(!e){ e=document.createElement("div"); e.id=id; }
      if(e.innerHTML!==html) e.innerHTML=html;
      if(ref&&ref.parentNode){ if(donde==="antes"&&e.nextSibling!==ref) ref.parentNode.insertBefore(e,ref); else if(donde==="despues"&&ref.nextSibling!==e) ref.parentNode.insertBefore(e,ref.nextSibling); }
      return e;
    }
    /* 1 */
    var eh=lleno?envio(D):"", eb=bloque("rc-envio","antes",list,eh);
    if(eb) eb.className=eh.indexOf("<!--ok-->")>-1?"ok":"";
    /* 2 */
    var P=lleno?promo(D.n):null;
    var pb=bloque("rc-promo","despues",list,P?TAG+'<span>'+P.h+'</span>':"");
    if(pb) pb.className=P&&P.ok?"ok":"";
    /* 4 */
    bloque("rc-sug","despues",pb||list,lleno?sugeridos():"");
    /* 5 · ahorro y transferencia */
    var tc=$(".js-cart-total-container",M), ah="", base=D.tot-(D.env||0);
    if(lleno&&D.sub&&base>0&&D.sub-base>1) ah=tpl(T.ahorras,{monto:money(D.sub-base)});
    bloque("rc-ahorro","despues",tc&&$(".cart-total",tc),ah);
    var sb=$(".js-ajax-cart-submit",M), pct=CONFIG.transferencia;
    bloque("rc-transfer","despues",sb,lleno&&pct&&base>0?tpl(T.transfer,{monto:money(base*(1-pct/100)),pct:pct}):"");
    var btn=$("[data-component='cart.checkout-button']",M); if(btn&&btn.value!==T.pagar) btn.value=T.pagar;
    envios();
    setTimeout(function(){ pintando=!1; },0);
    if(lleno&&!cargado){ cargado=!0; Promise.all(SUG.map(cargar)).then(function(){ pintar(!0); }); }
  }
 
  /* ---------- v1.2 · ABRIR EL CARRITO AL AGREGAR ----------
     Clic NATIVO (el tema no escucha clics de jQuery). Primero usa el botón
     "Ver carrito" del propio aviso del tema; si no hay aviso, el ícono del
     carrito. Solo esconde el aviso cuando el carrito ya quedó abierto. */
  function visible(e){ if(!e) return !1; var s=getComputedStyle(e); return s.display!=="none"&&s.visibility!=="hidden"&&e.offsetWidth>0&&e.offsetHeight>0; }
  function abierto(){ var m=$("#modal-cart"); return !!m&&(m.classList.contains("modal-show")||visible(m)); }
  function avisos(){
    return $$(".js-alert-added-to-cart,.modal,.js-modal,[class*='notification']").filter(function(m){
      return m.id!=="modal-cart"&&!m.closest("#modal-cart")&&visible(m)&&/agregado al carrito|agregaste|ver carrito/i.test(m.textContent||"");
    });
  }
  function cerrarAvisos(){
    if(!abierto()) return;
    avisos().forEach(function(m){
      var x=m.querySelector(".js-cart-notification-close:not([data-toggle]),.js-notification-close,.modal-close,.close");
      if(x&&visible(x)) try{ x.click(); }catch(e){}
      if(visible(m)) m.style.display="none";
    });
  }
  function abrirDrawer(){
    if(abierto()){ cerrarAvisos(); return !0; }
    var b=null; avisos().some(function(m){ b=m.querySelector("[data-toggle='#modal-cart']"); return !!b; });
    var c=b||$(".js-toggle-cart[data-toggle='#modal-cart']")||$(".js-toggle-cart"); if(!c) return !1;
    try{ c.click(); }catch(e){ return !1; }
    setTimeout(cerrarAvisos,500);
    return !0;
  }
  window.RMB_CART_ABRIR=abrirDrawer;
  if(CONFIG.abrirAlAgregar){
    document.addEventListener("productAddedToCart",function(){
      setTimeout(function(){ if(!abierto()) abrirDrawer(); else cerrarAvisos(); },450);
      setTimeout(function(){ if(!abierto()) abrirDrawer(); cerrarAvisos(); },1300);
    });
  }
 
  /* ---------- v1.2 · SOLO ENVÍOS GRATIS ---------- */
  var verTodos=!1;
  function envios(){
    if(!CONFIG.soloEnvioGratis) return;
    var R=$("#modal-cart .js-shipping-calculator-response"); if(!R) return;
    var filas=[], vis=[];
    $$("input[type='radio']",R).forEach(function(i){
      var f=i.closest("label")||i.closest("li")||i.parentElement; if(f&&vis.indexOf(f)<0){ vis.push(f); filas.push(f); }
    });
    var gratis=filas.filter(function(f){ return /gratis/i.test(f.textContent||""); });
    var otras=filas.filter(function(f){ return gratis.indexOf(f)<0; });
    var L=document.getElementById("rc-otros");
    if(!gratis.length||!otras.length){ otras.concat(gratis).forEach(function(f){ f.style.display=""; }); if(L) L.remove(); return; }
    otras.forEach(function(f){ f.style.display=verTodos?"":"none"; });
    if(!L){ L=document.createElement("button"); L.type="button"; L.id="rc-otros"; }
    var tx=verTodos?T.menosEnvios:tpl(T.otrosEnvios,{n:otras.length});
    if(L.textContent!==tx) L.textContent=tx;
    if(L.parentNode!==R) R.appendChild(L);
  }
 
  function iniciar(){
    var M=$("#modal-cart"); if(!M) return !1;
    if(!document.getElementById("rc-css")){ var s=document.createElement("style"); s.id="rc-css"; s.textContent=CSS; document.head.appendChild(s); }
    pintar();
    var t; new MutationObserver(function(){ if(pintando) return; clearTimeout(t); t=setTimeout(pintar,120); })
      .observe(M,{childList:!0,subtree:!0,characterData:!0});
    M.addEventListener("click",function(e){
      if(e.target.id==="rc-otros"){ e.preventDefault(); verTodos=!verTodos; pintando=!0; envios(); setTimeout(function(){ pintando=!1; },0); return; }
      var b=e.target.closest&&e.target.closest(".rc-add"); if(!b) return;
      e.preventDefault(); var x=SUG[+b.getAttribute("data-i")]; if(x&&!x.busy) sumar(x,b);
    });
    M.addEventListener("change",function(e){
      var s=e.target; if(!s||!s.closest||!s.closest("#rc-sug")||s.tagName!=="SELECT") return;
      var x=SUG[+s.getAttribute("data-i")], g=x&&x.grupos[+s.getAttribute("data-j")]; if(g) g.val=s.value;
    });
    /* respaldo: volver a abrir el carrito después de recargar */
    try{ if(sessionStorage.getItem("rc_abrir")){ sessionStorage.removeItem("rc_abrir"); var c=$(".js-toggle-cart"); if(c) setTimeout(function(){ c.click(); },400); } }catch(e){}
    return !0;
  }
  if(!iniciar()){
    var k=0, iv=setInterval(function(){ if(iniciar()||++k>60) clearInterval(iv); },250);
  }
}();
 
