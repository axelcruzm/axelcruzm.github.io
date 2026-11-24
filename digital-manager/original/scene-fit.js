'use strict';
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Fit actual font metrics to the viewport, keeping both complete words legible.
// COMMAND naturally uses a larger type size because it has fewer letters.
let manifestoFitFrame=0;
function fitManifesto(){
 if($('#home').hidden)return;
 const frame=$('.home-manifesto'),title=$('#home-title'),viewport=document.documentElement.clientWidth;
 frame.style.setProperty('--manifesto-viewport',viewport+'px');
 const available=title.clientWidth-parseFloat(getComputedStyle(title).paddingLeft);
 if(available<=0)return;
 for(const line of title.children){
  const word=line.querySelector('.manifesto-word'),last=line.querySelector('.manifesto-last');
  const width=word.getBoundingClientRect().width,glyph=last.getBoundingClientRect().width;
  if(width<=0||glyph<=0)continue;
  const visibleWidth=width,size=parseFloat(getComputedStyle(line).fontSize);
  line.style.fontSize=(size*available*.975/visibleWidth).toFixed(3)+'px';
 }
}
function scheduleManifestoFit(){cancelAnimationFrame(manifestoFitFrame);manifestoFitFrame=requestAnimationFrame(fitManifesto);}
window.addEventListener('resize',scheduleManifestoFit);
window.addEventListener('command-route',e=>{if(e.detail.page==='home')scheduleManifestoFit();});
if(document.fonts){document.fonts.ready.then(scheduleManifestoFit);document.fonts.addEventListener('loadingdone',scheduleManifestoFit);}
scheduleManifestoFit();

// Match the embedding window to the original section's intrinsic height.
if (window.frameElement) {
  const section = document.querySelector('.home-manifesto');
  new ResizeObserver(() => {
    window.frameElement.style.height = Math.ceil(section.getBoundingClientRect().height) + 'px';
  }).observe(section);
}
