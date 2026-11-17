import {photos} from './content.js';
import {services,themes,experiences,themeStories,references} from './campaign.js?v=27';
import {serviceMedia,serviceFacts} from './presentation.js';

const $=selector=>document.querySelector(selector);
const outerTrack=$('#serviceTrack'),innerTrack=$('#themeTrack');
const mobileServices=$('#mobileServices'),mobileThemes=$('#mobileThemes');
const dialog=$('#detailDialog'),command=$('.command');
const connection=$('#orbitConnection'),connectionLine=$('#connectionLine');
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
let activeType='service',activeIndex=0,lastTrigger=null,manualPause=false;
let selectedStep=0,hovered=null,stageVisible=true;
const outerNodes=[],innerNodes=[];
const accents=['#ce1747','#e66b16','#207caa','#255caa','#aa2366','#aa2366','#80532f'];
const displayTitle=s=>s.id==='campaign1'?'Tu campaña institucional':s.title;

const iconPaths={
 chess:`<path d="M10 3.3 13 6l-1.5 3 3.8 2.8-2.6 3.1H5.6l-.8-2.6 3.5-3.1-1.2-3 1-2.8"/><path d="M5 17h11M4 20h13"/>`,
 camera:`<rect x="3" y="6" width="12" height="12" rx="2"/><path d="m15 10 6-3v10l-6-3"/>`,
 database:`<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v7c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12v7c0 1.7 3 3 8 3s8-1.3 8-3v-7"/>`,
 ai:`<rect x="5" y="5" width="14" height="14" rx="2"/><path d="M9 1v4m6-4v4M9 19v4m6-4v4M1 9h4m-4 6h4m14-6h4m-4 6h4"/><path d="m9 15 2.7-6 2.7 6m-4.5-2h3.6M16 9v6"/>`,
 nodes:`<circle cx="5" cy="6" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="12" cy="18" r="2"/><path d="M7 6h10M5 8v3l7 5m7-8v3l-7 5"/>`,
 document:`<path d="M7 2h7l5 5v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h1z"/><path d="M14 2v6h5M8 12h8M8 16h8"/>`,
 layers:`<path d="m12 2 10 5-10 5L2 7l10-5zM2 12l10 5 10-5M2 17l10 5 10-5"/>`,
 bridge:`<path d="M3 20h18M6 20V5m12 15V5M6 7h12M3 16c4-10 14-10 18 0M9 9v11m6-11v11"/>`,
 chart:`<path d="M4 20h17M5 15l5-5 4 2 6-8M16 4h4v4"/>`,
 spark:`<path d="M12 2 9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2z"/>`,
 people:`<circle cx="12" cy="7" r="3"/><path d="M5 21v-2a7 7 0 0 1 14 0v2M4 9a2.5 2.5 0 1 0 0 5M20 9a2.5 2.5 0 1 1 0 5"/>`
};
const icon=(name,cls='')=>`<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[name]||iconPaths.layers}</svg>`;

function renderNavigation(){
  services.forEach((s,i)=>{
    const button=document.createElement('button');
    button.type='button';button.className='orbital-anchor';button.style.setProperty('--service-accent',accents[i]);button.setAttribute('aria-label',`Abrir ${s.title}. Capítulo ${s.number} de siete`);
    button.innerHTML=`<span class="service-pill"><span class="service-number">${s.number}</span><span class="service-icon">${icon(s.icon)}</span><span class="service-copy"><strong class="service-label">${displayTitle(s)}</strong></span><span class="service-open">↗</span></span>`;
    button.addEventListener('click',()=>openService(i,button));
    button.addEventListener('pointerenter',()=>{hovered={kind:'outer',i};button.classList.add('is-near');connection.classList.add('is-visible');});
    button.addEventListener('pointerleave',()=>{if(hovered?.kind==='outer'&&hovered.i===i)hovered=null;button.classList.remove('is-near');connection.classList.remove('is-visible');});
    outerTrack.append(button);outerNodes.push(button);
    const mobile=document.createElement('button');mobile.type='button';mobile.className='mobile-service';mobile.style.setProperty('--service-accent',accents[i]);
    mobile.innerHTML=`<span class="mobile-service-number">${s.number}</span><span class="mobile-icon">${icon(s.icon)}</span><span class="mobile-service-copy"><strong>${displayTitle(s)}</strong></span><span class="mobile-forward">↗</span>`;
    mobile.addEventListener('click',()=>openService(i,mobile));mobileServices.append(mobile);
  });
  themes.forEach((t,i)=>{
    const button=document.createElement('button');button.type='button';button.className='thematic-anchor';
    button.setAttribute('aria-label',`Explorar eje de Durango: ${t.name}`);
    button.innerHTML=`<span class="theme-node">${icon(t.icon,'theme-icon')}<strong>${t.short}</strong></span>`;
    button.addEventListener('click',()=>openTheme(i,button));
    button.addEventListener('pointerenter',()=>{hovered={kind:'inner',i};button.classList.add('is-near');connection.classList.add('is-visible');});
    button.addEventListener('pointerleave',()=>{if(hovered?.kind==='inner'&&hovered.i===i)hovered=null;button.classList.remove('is-near');connection.classList.remove('is-visible');});
    innerTrack.append(button);innerNodes.push(button);
    const mobile=document.createElement('button');mobile.type='button';mobile.className='mobile-theme';
    mobile.innerHTML=`${icon(t.icon)}<span>${t.name}</span><span class="mobile-theme-arrow">↗</span>`;
    mobile.addEventListener('click',()=>openTheme(i,mobile));mobileThemes.append(mobile);
  });
}

// A single, capped animation clock positions 11 nodes using compositor-friendly transforms.
// No per-frame DOM measurements; a ResizeObserver updates geometry only when the stage resizes.
const geometry={w:1200,h:620,outerX:470,outerY:240,innerX:280,innerY:148};
let elapsed=0,last=0,renderTime=0,frame=0,running=false;
const angleAt=(kind,index,time)=>{
  const outer=kind==='outer';
  return -Math.PI/2+(outer?Math.PI/7:Math.PI/4)+index*2*Math.PI/(outer?7:4)+(outer?1:-1)*time/(outer?174000:232000)*2*Math.PI;
};
function recalcGeometry(){
  const w=command.clientWidth,h=command.clientHeight;
  if(!w||!h)return;
  geometry.w=w;geometry.h=h;
  const mobile=window.matchMedia('(max-width: 1100px)').matches;
  const card=w>=1500?286:264;
  // The wide ellipse uses the empty horizontal space while reserving a fixed
  // lane between the inner and outer orbit capsules at 720p/768p/900p.
  geometry.outerX=Math.max(0,Math.min(720,(w-card-44)/2));
  geometry.outerY=Math.max(0,Math.min(300,(h-120)/2));
  // Smaller screens use a narrower inner ellipse rather than overlapping nodes.
  geometry.innerX=mobile?Math.min(w*.36,153):Math.min(265,geometry.outerX*(w<1100?.37:w<1200?.4:.48));
  geometry.innerY=mobile?Math.min(h*.38,138):h>=720?156:h>=650?140:131;
  command.style.setProperty('--outer-rx',`${geometry.outerX}px`);
  command.style.setProperty('--outer-ry',`${geometry.outerY}px`);
  command.style.setProperty('--inner-rx',`${geometry.innerX}px`);
  command.style.setProperty('--inner-ry',`${geometry.innerY}px`);
  connection.setAttribute('viewBox',`0 0 ${w} ${h}`);
  paint();
}
function position(kind,node,i,time){
  const a=angleAt(kind,i,time);
  const rx=kind==='outer'?geometry.outerX:geometry.innerX;
  const ry=kind==='outer'?geometry.outerY:geometry.innerY;
  const x=geometry.w/2+Math.cos(a)*rx;
  const y=geometry.h/2+Math.sin(a)*ry;
  node.style.transform=`translate3d(${(x-geometry.w/2).toFixed(2)}px,${(y-geometry.h/2).toFixed(2)}px,0) translate(-50%,-50%)`;
  return {x,y};
}
function paint(){
  const outerPoints=outerNodes.map((n,i)=>position('outer',n,i,elapsed));
  const innerPoints=innerNodes.map((n,i)=>position('inner',n,i,elapsed));
  if(hovered){
    const p=(hovered.kind==='outer'?outerPoints:innerPoints)[hovered.i];
    if(p){connectionLine.setAttribute('x1',geometry.w/2);connectionLine.setAttribute('y1',geometry.h/2);connectionLine.setAttribute('x2',p.x);connectionLine.setAttribute('y2',p.y);}
  }
}
function animationPaused(){return manualPause||dialog.open||document.hidden||reducedMotion.matches||!stageVisible;}
function stopClock(){
  if(frame)cancelAnimationFrame(frame);
  frame=0;running=false;last=0;
}
function startClock(){
  if(running||animationPaused())return;
  running=true;last=performance.now();frame=requestAnimationFrame(tick);
}
function tick(now){
  if(animationPaused()){stopClock();return;}
  const dt=Math.min(250,now-last);last=now;
  elapsed+=dt;
  const interval=matchMedia('(pointer:coarse)').matches?1000/30:1000/45;
  if(now-renderTime>=interval){renderTime=now;paint();}
  frame=requestAnimationFrame(tick);
}

function setPhoto(key){
  const p=photos[key]||photos.canyon;
  const image=$('#detailPhoto'),pane=$('#dialogImage');
  pane.style.backgroundImage=`url("${p.fallback}")`;
  pane.classList.remove('is-loaded');
  image.onload=null;image.onerror=null;
  image.removeAttribute('src');
  $('#detailLocation').textContent='DURANGO';
  $('#photoCredit').textContent='Durango · Paisaje e identidad';
  image.onload=()=>{
    pane.classList.add('is-loaded');if(!video.hidden)return;$('#detailLocation').textContent=p.place;
    $('#photoCredit').innerHTML=`Fotografía: <a href="${p.source}" target="_blank" rel="noopener">${p.by}</a> · <a href="${p.licenseUrl}" target="_blank" rel="noopener">${p.license}</a> · Wikimedia Commons`;
  };
  image.onerror=()=>{pane.classList.remove('is-loaded');image.removeAttribute('src');};
  image.alt=p.title;image.src=p.src;
}

function coreGraphic(s){
  const e=experiences[s.id];
  const steps=e.steps;
  const kind=e.kind;
  if(kind==='compare')return `<div class="compare-board" id="compareBoard" style="--compare:52%"><div class="compare-before"><small>ANTES · DOCUMENTO</small><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><div class="compare-after"><small>DESPUÉS · SISTEMA VISUAL</small><div class="after-circle"></div><div class="after-bars"><i></i><i></i><i></i></div><div class="after-labels"><b>IDEA</b><b>ORDEN</b><b>CLARIDAD</b></div></div><div class="compare-divider"><span>↔</span></div></div><label class="compare-control">DESLIZA PARA COMPARAR <input id="compareSlider" type="range" min="0" max="100" value="52" aria-label="Comparar documento original y diseño visual"></label>`;
  if(kind==='ai')return `<div class="visual-ai" aria-label="Esquema conceptual de plataformas e IA"><div class="ai-flowline" aria-hidden="true"></div><span class="ai-hub"><span>REVISIÓN</span><strong>HUMANA</strong><small>DEMO</small></span>${steps.map((st,i)=>`<button type="button" class="ai-satellite ${i===selectedStep?'is-active':''}" data-step="${i}"><small>0${i+1}</small><strong>${st.label}</strong></button>`).join('')}</div>`;
  if(kind==='formats')return `<div class="visual-formats"><div class="format-device format-${selectedStep}"><div class="format-display"><span class="format-play">${selectedStep===2?'≡':'▶'}</span><span class="format-cover">UNA HISTORIA<br>CUATRO FORMAS</span></div></div><div class="format-side">MASTER<br><strong>01 → 04</strong><span>ADAPTACIONES</span></div></div>`;
  if(kind==='film')return `<div class="visual-film"><div class="film-tape">${steps.map((st,i)=>`<button type="button" data-step="${i}" class="film-cell ${i===selectedStep?'is-active':''}"><span>0${i+1}</span><strong>${st.label}</strong><div class="film-image"><span></span></div></button>`).join('')}</div><span class="film-track">◁ ━━━ ● ━━━ ▷</span></div>`;
  if(kind==='pipeline')return `<div class="visual-pipeline"><div class="pipeline-header"><span>FUENTE / DEMO</span><span>CONTROL EDITORIAL</span></div><div class="pipeline-modules">${steps.map((st,i)=>`<button type="button" data-step="${i}" class="pipeline-module ${i===selectedStep?'is-active':''}"><span>0${i+1}</span><strong>${st.label}</strong><i></i></button>`).join('')}</div><div class="pipeline-check"><span>✓</span> NINGUNA CIFRA REAL · FLUJO ILUSTRATIVO</div></div>`;
  if(kind==='rail')return `<div class="visual-rail"><div class="rail-line"></div>${steps.map((st,i)=>`<button type="button" data-step="${i}" class="rail-stop ${i===selectedStep?'is-active':''}"><span class="rail-pin">${i+1}</span><strong>${st.label}</strong></button>`).join('')}</div>`;
  return `<div class="visual-strategy"><div class="strategy-connector"></div>${steps.map((st,i)=>`<button type="button" data-step="${i}" class="strategy-panel ${i===selectedStep?'is-active':''}"><span>0${i+1}</span><strong>${st.label}</strong><div class="strategy-mark"><i></i><i></i><i></i></div></button>`).join('')}</div>`;
}
function renderExperience(service){
 const exp=experiences[service.id], visual=$('#detailVisual');
 visual.innerHTML=`<div class="campaign-process ${activeIndex===0?'campaign-pyramid':''}"><div class="campaign-tabs" role="group" aria-label="Explorar propuesta">${exp.steps.map((st,i)=>`<button type="button" data-step="${i}" aria-pressed="${i===0}"><small>0${i+1}</small>${st.label}</button>`).join('')}</div><p class="campaign-caption" aria-live="polite">${exp.steps[0].caption}</p></div>${exp.refs.length?`<div class="work-references"><span class="work-label">${activeIndex===1?'Campaña de Información Reformas Laborales para Zacatecas:':activeIndex===2?'Campañas de Beneficencia Pública que hemos realizado':activeIndex===4?'EXPERIENCIA ADICIONAL · TOM':'TRABAJOS TOM'}</span>${exp.refs.map(n=>`<button type="button" class="work-reference" data-reference="${n}"><span class="work-play">▶</span><span><small>${references[n].client}</small><strong>${references[n].title}</strong></span><span aria-hidden="true">↗</span></button>`).join('')}</div>`:''}${activeIndex===6?'<p class="scope-note">Propuesta de alcance. Entregables y calendario sujetos a definición conjunta.</p>':''}`;
 visual.querySelectorAll('[data-step]').forEach(b=>b.addEventListener('click',()=>{visual.querySelectorAll('[data-step]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));visual.querySelector('.campaign-caption').textContent=exp.steps[Number(b.dataset.step)].caption;}));
 visual.querySelectorAll('[data-reference]').forEach(b=>b.addEventListener('click',()=>openReference(Number(b.dataset.reference),b)));
}
const screening=document.createElement('dialog');screening.className='screening';screening.setAttribute('aria-labelledby','screeningTitle');document.body.append(screening);
let referenceTrigger=null;
function openReference(n,trigger){
 const r=references[n];referenceTrigger=trigger;
 screening.innerHTML=`<header><div><small>TRABAJO TOM · ${r.client}</small><h2 id="screeningTitle">${r.title}</h2></div><button type="button" class="screening-close" aria-label="Cerrar video">✕</button></header><div class="screening-player"><iframe title="${r.title}" src="https://www.youtube-nocookie.com/embed/${r.id}?rel=0&playsinline=1" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div><footer><p>${r.note}</p><a href="https://youtu.be/${r.id}" target="_blank" rel="noopener">Abrir en YouTube ↗</a></footer>`;
 screening.querySelector('button').addEventListener('click',()=>screening.close());screening.showModal();
}
screening.addEventListener('click',e=>{if(e.target===screening)screening.close();});
screening.addEventListener('close',()=>{screening.replaceChildren();referenceTrigger?.focus();});
function updateStep(service,index){
  const exp=experiences[service.id];selectedStep=Math.max(0,Math.min(exp.steps.length-1,index));
  const visual=$('#detailVisual');
  visual.querySelectorAll('[data-step]').forEach(b=>{const isActive=Number(b.dataset.step)===selectedStep;b.classList.toggle('is-active',isActive);b.setAttribute('aria-pressed',String(isActive));});
  const step=exp.steps[selectedStep];
  $('#vizCaption').textContent=step.caption;$('#vizDetail').textContent=step.detail;
  const format=visual.querySelector('.format-device');if(format)format.className=`format-device format-${selectedStep}`;
  const formatPlay=visual.querySelector('.format-play');if(formatPlay)formatPlay.textContent=selectedStep===2?'≡':'▶';
}
// Video slots stay empty until approved TOM masters arrive. Only the active clip loads.
const video=$('#detailVideo'),videoToggle=$('#videoToggle');
let mediaGeneration=0;
function clearVideo(){
  mediaGeneration++;
  video.onloadeddata=null;video.onerror=null;
  video.pause();video.removeAttribute('src');video.load();
  video.hidden=true;videoToggle.hidden=true;
}
function syncVideoControl(){
  videoToggle.textContent=video.paused?'▶':'Ⅱ';
  videoToggle.setAttribute('aria-label',video.paused?'Reproducir video':'Pausar video');
}
function setMedia(service){
  clearVideo();
  const media=serviceMedia[service.id];
  if(!media?.src)return;
  const generation=mediaGeneration;
  video.poster=media.poster||photos[service.image].fallback;
  video.setAttribute('aria-label',media.label||service.title);
  video.src=media.src;
  video.onloadeddata=()=>{
    if(generation!==mediaGeneration)return;
    video.hidden=false;videoToggle.hidden=false;
    $('#detailLocation').textContent=media.label||'TOM · PRODUCCIÓN';
    $('#photoCredit').textContent=media.credit||'Producción TOM';
    if(!reducedMotion.matches&&dialog.open)video.play().catch(()=>{});
    syncVideoControl();
  };
  video.onerror=()=>{if(generation===mediaGeneration)clearVideo();};
  video.load();
}
videoToggle.addEventListener('click',()=>{if(video.paused)video.play().catch(()=>{});else video.pause();});
video.addEventListener('play',syncVideoControl);video.addEventListener('pause',syncVideoControl);
function renderFacts(id){
  const facts=(serviceFacts[id]||[]).filter(f=>f.verified&&f.value&&f.label&&f.source);
  const container=$('#serviceFacts');container.replaceChildren();container.hidden=!facts.length;
  facts.slice(0,3).forEach(f=>{
    const item=document.createElement('div'),value=document.createElement('strong'),label=document.createElement('span');
    value.textContent=f.value;label.textContent=f.label;item.title=f.source;item.append(value,label);container.append(item);
  });
}
function updatePager(){
  const isService=activeType==='service',total=isService?services.length:themes.length;
  $('#journeyLabel').textContent=isService?'NUESTRA PROPUESTA':'TEMAS DE CAMPAÑA';
  $('#pagerText').textContent=`${String(activeIndex+1).padStart(2,'0')} / ${String(total).padStart(2,'0')}`;
  $('#prevDetail').disabled=activeIndex===0;
  $('#prevDetail').setAttribute('aria-label',isService?'Capítulo anterior':'Área anterior');
  $('#nextDetail').setAttribute('aria-label',activeIndex===total-1?'Terminar recorrido y volver al mapa':isService?'Capítulo siguiente':'Área siguiente');
  $('#nextDetail').title=$('#nextDetail').getAttribute('aria-label');
  $('#nextDetail').textContent=activeIndex===total-1?'✓':'→';
}
function showDialog(){
  if(!dialog.open)dialog.showModal();
  document.body.classList.add('modal-open');
  stopClock();
  connection.classList.remove('is-visible');
  $('.dialog-content-scroll').scrollTop=0;
}
const serviceArtwork=[
 ['culebra-agua','dashboard'],['tortuga-lodo','comunicacion'],
 ['lagartija-bolson','cine-edicion'],['culebra-fox','animacion'],
 ['cachorrito','animacion'],['loro','documento'],['tortuga-bolson','delivery']
];
function setServiceArtwork(index){
 document.querySelectorAll('.animal-gallery img').forEach((img,i)=>{img.hidden=i!==index;});
 const [animal,service]=serviceArtwork[index];
 dialog.dataset.art=String(index+1);
 $('#animalArt').src=`./assets/illustrations/${animal}.webp`;
 $('#serviceArt').src=`./assets/illustrations/${service}.webp`;
 const next=serviceArtwork[index+1];
 if(next)next.forEach(name=>{const img=new Image();img.src=`./assets/illustrations/${name}.webp`;});
}
const chapterLooks=[
 {tag:'ESTRATEGIA INTEGRAL',word:'2026',line:'Un año. Una narrativa.',bottom:'RESULTADOS / CERCANÍA / FUTURO'},
 {tag:'COMUNICACIÓN INSTITUCIONAL',word:'Hacer claro.',line:'Del dato al significado.',ref:4},
 {tag:'HISTORIAS Y TESTIMONIOS',word:'Voces que acercan.',line:'Las personas dan contexto.',ref:0},
 {tag:'DIRECCIÓN CREATIVA',word:'Una voz. Muchas piezas.',line:'Identidad que se reconoce.',ref:4},
 {tag:'SISTEMA DE CONTENIDOS',word:'Una historia, distintos formatos.',line:'Audiovisual / Digital / Gráfico',ref:6},
 {tag:'PRODUCCIÓN Y VALIDACIÓN',word:'De principio a fin.',line:'Un proceso compartido.',bottom:'01 PREPARAR → 02 PRODUCIR → 03 ENTREGAR'},
 {tag:'SIGUIENTE PASO',word:'2027',line:'El futuro empieza con un acuerdo.',bottom:'PRIORIDADES / MATERIALES / ALCANCE'}
];
function stopBrandLoop(){
 const v=document.querySelector('#brandLoop');if(v){v.pause();v.removeAttribute('src');v.load();}
}
function renderGallery(index){
 const items=index===3?[
 ['dashboard','Estrategia'],['cine-edicion','Producción audiovisual'],['comunicacion','Comunicación'],['robot-ia','Tecnología'],['animacion','Movimiento'],['documento','Identidad editorial'],['delivery','Entrega']
 ]:[['documento','Preparar'],['cine-edicion','Producir'],['delivery','Entregar']];
 const pane=$('#chapterCanvas');pane.hidden=false;let current=0;
 pane.innerHTML=`<div class="tom-gallery"><img class="gallery-logo" src="./assets/tom-logo-oficial.png" alt="TOM"><span class="gallery-eyebrow">${index===3?'LENGUAJE VISUAL':'DE PRINCIPIO A FIN'}</span><img class="gallery-image" alt=""><div class="gallery-controls"><button type="button" aria-label="Imagen anterior">←</button><div><strong class="gallery-caption"></strong><small class="gallery-count" aria-live="polite"></small></div><button type="button" aria-label="Imagen siguiente">→</button></div></div>`;
 const show=()=>{const [file,label]=items[current],img=pane.querySelector('.gallery-image');img.src=`./assets/illustrations/${file}.webp`;img.alt=label;pane.querySelector('.gallery-caption').textContent=label;pane.querySelector('.gallery-count').textContent=`${String(current+1).padStart(2,'0')} / ${String(items.length).padStart(2,'0')}`;};
 pane.querySelectorAll('.gallery-controls button').forEach((b,i)=>b.onclick=()=>{current=(current+(i?1:-1)+items.length)%items.length;show();});show();
}
function renderChapterCanvas(index){
 stopBrandLoop();
 dialog.classList.toggle('has-brand-loop',index===0);
 dialog.classList.toggle('is-closing',index===6);
 if(index===3||index===5){renderGallery(index);return;}
 if(index===6){const pane=$('#chapterCanvas');pane.hidden=false;pane.innerHTML='';return;}
 if(index===0){
  const pane=$('#chapterCanvas');pane.hidden=false;
  pane.innerHTML=`<video id="brandLoop" class="brand-loop" src="./assets/video/tom-brand-loop.mp4" loop playsinline preload="auto" aria-label="TOM · Reel de marca"></video><div class="brand-loop-controls"><button type="button" id="brandSound" aria-label="Silenciar música">Sonido: activo</button><button type="button" id="brandPause" aria-label="Pausar video">Ⅱ</button></div>`;
  const v=$('#brandLoop'),sound=$('#brandSound'),pause=$('#brandPause');
  const sync=()=>{sound.textContent=v.muted?'Activar sonido':'Silenciar';sound.setAttribute('aria-label',v.muted?'Activar música':'Silenciar música');pause.textContent=v.paused?'▶':'Ⅱ';pause.setAttribute('aria-label',v.paused?'Reproducir video':'Pausar video');};
  sound.onclick=()=>{v.muted=!v.muted;sync();};pause.onclick=()=>{if(v.paused)v.play().catch(()=>{});else v.pause();};
  v.addEventListener('play',sync);v.addEventListener('pause',sync);
  v.play().catch(()=>{v.muted=true;sync();v.play().catch(()=>{});});return;
 }

 const c=chapterLooks[index],pane=$('#chapterCanvas');pane.hidden=false;
 pane.innerHTML=`<div class="chapter-art chapter-art-${index+1}"><span class="chapter-tag">${c.tag}</span><div class="chapter-headline">${c.word}</div><p class="chapter-line">${c.line}</p>${c.ref!==undefined?`<button type="button" class="chapter-film" data-film="${c.ref}" aria-label="Ver ${references[c.ref].title}"><img src="https://i.ytimg.com/vi/${references[c.ref].id}/hqdefault.jpg" alt="Vista previa: ${references[c.ref].title}"><span class="chapter-film-play">▶</span><span class="chapter-film-caption">${references[c.ref].client} · VER VIDEO ↗</span></button>`:`<div class="chapter-symbol" aria-hidden="true">${icon(index===0?'nodes':index===5?'layers':'chart')}</div>`}<div class="chapter-bottom">${c.bottom||'PRODUCCIÓN TOM'}</div></div>`;
 pane.querySelector('[data-film]')?.addEventListener('click',e=>openReference(c.ref,e.currentTarget));
}
function openService(index,trigger){
  activeType='service';activeIndex=Math.max(0,Math.min(services.length-1,index));
  if(trigger)lastTrigger=trigger;
  const s=services[activeIndex],e=experiences[s.id];selectedStep=0;
  setServiceArtwork(activeIndex);
  dialog.classList.remove('is-theme','is-ai');
  $('#detailKicker').textContent=`TOM / ${s.number}`;
  dialog.style.setProperty('--service-accent',accents[activeIndex]);
  $('#serviceIdentity').hidden=false;
  $('#heroNumber').textContent=s.number;
  $('#heroServiceIcon').innerHTML=icon(s.icon);
  $('#detailServiceName').textContent='';
  $('#detailTitle').textContent=s.title;
  if(activeIndex===0)$('#detailTitle').innerHTML='<span class=tom-signoff>Top of Mind Communication</span>Tu campaña institucional de cierre 2026';
  $('#detailPromise').textContent=e.headline;$('#detailPromise').hidden=!e.headline;
  $('#detailLead').textContent=e.subline;$('#detailLead').hidden=!e.subline;
  $('#detailVisual').hidden=false;$('#themeSupport').hidden=true;
  renderExperience(s);renderFacts(s.id);updatePager();
  if(activeIndex===6){$('#detailTitle').innerHTML='<span class=closing-intro>Construyamos el cierre del año 2026, para comenzar los acuerdos de:</span><span class=closing-year>202<b>7</b></span>';$('#detailPromise').textContent='Acordemos el punto de partida.';$('#detailLead').hidden=true;$('#detailVisual').innerHTML='<button class=areas-cta type=button>Las 4 áreas para potenciar Durango <span aria-hidden=true>→</span></button>';$('#detailVisual button').onclick=()=>openTheme(0);}
  setPhoto(s.image);renderChapterCanvas(activeIndex);showDialog();setMedia(s);
}
function openTheme(index,trigger){
  stopBrandLoop();dialog.classList.remove('has-brand-loop','is-closing');$('#chapterCanvas').hidden=true;
  activeType='theme';activeIndex=Math.max(0,Math.min(themes.length-1,index));
  if(trigger)lastTrigger=trigger;
  clearVideo();
  const theme=themes[activeIndex],story=themeStories[theme.id];
  dialog.classList.remove('is-ai');dialog.classList.add('is-theme');
  $('#detailKicker').textContent=`DURANGO / ${theme.name}`;
  $('#serviceIdentity').hidden=true;$('#detailPromise').hidden=true;
  $('#detailServiceName').textContent=theme.name;
  $('#detailTitle').textContent=story.headline;
  $('#detailLead').hidden=false;$('#detailLead').textContent=story.intro;
  $('#themeSupport').textContent=story.support;$('#themeSupport').hidden=false;
  $('#detailVisual').hidden=true;$('#detailVisual').replaceChildren();$('#serviceFacts').hidden=true;
  updatePager();setPhoto(story.image);showDialog();
}
function navigate(step){
  const total=activeType==='service'?services.length:themes.length;
  if(activeIndex+step<0)return;
  if(activeIndex+step>=total){close();return;}
  if(activeType==='service')openService(activeIndex+step,null);
  else openTheme(activeIndex+step,null);
}
function close(){if(dialog.open)dialog.close();}
function setPaused(next){
  manualPause=next;document.body.classList.toggle('is-paused',next);
  if(next)stopClock();else startClock();
  const button=$('#motionToggle');button.setAttribute('aria-pressed',String(next));
  button.setAttribute('aria-label',next?'Reanudar movimiento orbital':'Pausar movimiento orbital');
  button.title=next?'Reanudar órbitas':'Pausar órbitas';
  button.innerHTML=next?'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 11 7-11 7z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>':'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
}
renderNavigation();
new ResizeObserver(recalcGeometry).observe(command);
new IntersectionObserver(entries=>{stageVisible=entries[0]?.isIntersecting??true;if(stageVisible)startClock();else stopClock();},{threshold:.02}).observe(command);
reducedMotion.addEventListener?.('change',()=>{if(reducedMotion.matches){stopClock();video.pause();}else startClock();paint();});
window.addEventListener('resize',recalcGeometry,{passive:true});
recalcGeometry();startClock();
$('#startJourney')?.addEventListener('click',event=>openService(0,event.currentTarget));
$('#startJourneyMobile').addEventListener('click',event=>openService(0,event.currentTarget));
$('#closeDialog').addEventListener('click',close);
$('#prevDetail').addEventListener('click',()=>navigate(-1));
$('#nextDetail').addEventListener('click',()=>navigate(1));
dialog.addEventListener('click',event=>{if(event.target===dialog)close();});
dialog.addEventListener('close',()=>{
  stopBrandLoop();
  clearVideo();
  document.body.classList.remove('modal-open');
  if(lastTrigger?.isConnected)lastTrigger.focus({preventScroll:true});
  lastTrigger=null;startClock();
});
document.addEventListener('keydown',event=>{
  if(screening.open||!dialog.open||event.target.closest('input,textarea,select,[contenteditable]'))return;
  if(event.key==='ArrowRight'){event.preventDefault();navigate(1);}
  if(event.key==='ArrowLeft'){event.preventDefault();navigate(-1);}
});
$('#motionToggle').addEventListener('click',()=>setPaused(!manualPause));
$('#fullscreenToggle').addEventListener('click',()=>{
  if(!document.fullscreenElement)document.documentElement.requestFullscreen?.().catch(()=>{});
  else document.exitFullscreen?.().catch(()=>{});
});
document.addEventListener('fullscreenchange',()=>$('#fullscreenToggle').setAttribute('aria-label',document.fullscreenElement?'Salir de pantalla completa':'Ver en pantalla completa'));

document.addEventListener('visibilitychange',()=>{if(document.hidden){stopClock();video.pause();}else startClock();});
