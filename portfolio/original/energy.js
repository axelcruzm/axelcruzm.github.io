'use strict';
// Procedural frame-by-frame animation. A shared morph, eight distinct animated motifs.
// Runs only while the specialty dialog is open; no third-party animation dependency.
let specialtyEnergyFrame=0;
const energySystemMotion=matchMedia('(prefers-reduced-motion: reduce)');
const energyReduced=new EventTarget();
try{if(localStorage.getItem('command-reduce-motion')==='true')document.documentElement.classList.add('reduce-motion');}catch{}
Object.defineProperty(energyReduced,'matches',{get:()=>energySystemMotion.matches||document.documentElement.classList.contains('reduce-motion')});
energySystemMotion.addEventListener('change',()=>energyReduced.dispatchEvent(new Event('change')));
function setCommandMotion(reduce){document.documentElement.classList.toggle('reduce-motion',reduce);try{localStorage.setItem('command-reduce-motion',String(reduce));}catch{}energyReduced.dispatchEvent(new Event('change'));}

function stopSpecialtyEnergy(){cancelAnimationFrame(specialtyEnergyFrame);}
function energyRGBA(hex,a){const rgb=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16));return 'rgba('+rgb.join(',')+','+a+')';}
function energyLerp(a,b,t){return a+(b-a)*t;}
function energyEase(t){return 1-Math.pow(1-t,4);}
function energySignature(c,time,a,r){
 c.save();c.beginPath();c.arc(0,0,r*.83,0,7);c.clip();
 const pale=a.id==='people'||a.id==='content'||a.id==='enablement'?'#13232d':'#f5f1e8';
 c.strokeStyle=pale;c.fillStyle=pale;c.lineWidth=1.5;c.globalAlpha=.8;
 const phase=time*.00045;
 if(a.id==='engineering'){
  for(let i=0;i<4;i++){const y=(i-1.5)*r*.34;c.beginPath();c.moveTo(-r,y);c.lineTo(-r*.2,y);c.lineTo(r*.1,y+r*.2);c.lineTo(r,y+r*.2);c.stroke();const x=((phase+i*.27)%1)*2*r-r;c.beginPath();c.arc(x,y+(x>0?r*.2:0),2.8,0,7);c.fill();}
 }else if(a.id==='design'){
  c.rotate(Math.sin(phase)*.12);c.strokeRect(-r*.45,-r*.45,r*.9,r*.9);
  [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(v=>c.fillRect(v[0]*r*.45-3,v[1]*r*.45-3,6,6));
  c.beginPath();c.moveTo(-r*.65,r*.2);c.bezierCurveTo(-r*.2,-r*.8,r*.2,r*.8,r*.65,-r*.2);c.stroke();
 }else if(a.id==='content'){
  for(let i=0;i<5;i++){const yy=(i-2)*r*.23,xx=Math.sin(phase+i*.4)*4;c.beginPath();c.moveTo(-r*.5+xx,yy);c.lineTo(r*(i===4?.12:.5)+xx,yy);c.stroke();}
  c.lineWidth=2.5;c.beginPath();c.arc(0,0,r*.69,-Math.PI*.7+phase*.4,Math.PI*.7+phase*.4);c.stroke();
 }else if(a.id==='production'){
  c.rotate(phase*.22);for(let i=0;i<6;i++){c.rotate(Math.PI/3);c.beginPath();c.moveTo(r*.12,0);c.lineTo(r*.7,r*.16);c.lineTo(r*.32,r*.58);c.closePath();c.stroke();}
  c.beginPath();c.arc(0,0,r*.22,0,7);c.stroke();
 }else if(a.id==='quality'){
  const y=Math.sin(phase)*r*.6;c.globalAlpha=.25;c.fillRect(-r,y,r*2,2);c.globalAlpha=.9;c.lineWidth=2;
  c.beginPath();c.moveTo(-r*.28,0);c.lineTo(-r*.04,r*.22);c.lineTo(r*.36,-r*.26);c.stroke();
  c.beginPath();c.arc(0,0,r*.65,-Math.PI*.5,Math.PI*1.5);c.setLineDash([3,8]);c.stroke();
 }else if(a.id==='people'){
  for(let i=0;i<3;i++){const angle=phase*.2+i*Math.PI*2/3,x=Math.cos(angle)*r*.48,y=Math.sin(angle)*r*.48;c.beginPath();c.moveTo(0,0);c.lineTo(x,y);c.stroke();c.beginPath();c.arc(x,y,r*.11,0,7);c.fill();}
  c.beginPath();c.arc(0,0,r*.16,0,7);c.fill();
 }else if(a.id==='enablement'){
  // Learning path: three milestones above an open book, with a travelling signal.
  c.beginPath();c.moveTo(-r*.6,r*.34);c.quadraticCurveTo(-r*.3,r*.2,0,r*.39);c.quadraticCurveTo(r*.3,r*.2,r*.6,r*.34);c.lineTo(r*.6,r*.58);c.quadraticCurveTo(r*.3,r*.44,0,r*.62);c.quadraticCurveTo(-r*.3,r*.44,-r*.6,r*.58);c.closePath();c.stroke();
  c.beginPath();c.moveTo(0,r*.39);c.lineTo(0,r*.62);c.stroke();
  const steps=[[-.48,.05],[0,-.24],[.46,-.51]];
  c.beginPath();steps.forEach((v,i)=>{if(i===0)c.moveTo(v[0]*r,v[1]*r);else c.lineTo(v[0]*r,v[1]*r);});c.stroke();
  steps.forEach((v,i)=>{c.beginPath();c.arc(v[0]*r,v[1]*r,r*(.06+.025*(1+Math.sin(phase*2-i))/.5),0,7);c.fill();});
  const progress=(phase*.32)%1,segment=progress<.5?0:1,t=progress<.5?progress*2:(progress-.5)*2;
  const from=steps[segment],to=steps[segment+1];c.beginPath();c.arc((from[0]+(to[0]-from[0])*t)*r,(from[1]+(to[1]-from[1])*t)*r,r*.035,0,7);c.fill();
 }else{
  for(let i=0;i<5;i++){const x=(i-2)*r*.24,h=(.25+(.5+.5*Math.sin(i*1.8+phase))*.55)*r;c.globalAlpha=.65+i*.06;c.fillRect(x-3,r*.4-h,6,h);}
  c.globalAlpha=.7;c.beginPath();c.moveTo(-r*.68,r*.48);c.lineTo(r*.68,r*.48);c.stroke();
 }
 c.restore();
}
function drawSpecialtyEnergy(c,x,y,size,p,time,a){
 c.save();c.translate(x,y);const r=size/2,orb=energyEase(Math.max(0,Math.min(1,(p-.16)/.84)));
 if(orb<.98){
  c.save();c.globalAlpha=1-orb;c.translate(-r*.66,-r*.5);c.rotate(-.04+orb*.2);
  c.fillStyle=a.color;c.beginPath();c.moveTo(0,0);c.lineTo(r*.35,-r*.2);c.lineTo(r*1.65,0);c.lineTo(r*1.3,r*.2);c.closePath();c.fill();
  c.fillStyle=a.light;c.globalAlpha*=.8;c.fillRect(0,0,r*1.3,r*1.25);c.strokeStyle=energyRGBA('#f5f1e8',.5);c.strokeRect(0,0,r*1.3,r*1.25);c.restore();
 }
 const pulse=energyReduced.matches?1:1+Math.sin(time*.0012)*.018;c.scale(pulse,pulse);c.globalAlpha=Math.min(1,p*3+.06);
 const radius=r*energyLerp(.72,1,orb),round=energyLerp(8,r,orb);
 c.shadowColor=energyRGBA(a.color,.24);c.shadowBlur=energyLerp(0,30,orb);
 const g=c.createRadialGradient(-r*.4,-r*.5,0,r*.1,r*.2,r*1.3);g.addColorStop(0,a.light);g.addColorStop(.46,a.color);g.addColorStop(1,'#0b131b');
 c.fillStyle=g;c.beginPath();c.roundRect(-radius,-radius,radius*2,radius*2,Math.min(radius,round));c.fill();c.shadowBlur=0;
 c.strokeStyle=energyRGBA(a.light,.8);c.lineWidth=1;c.stroke();c.globalAlpha=orb;energySignature(c,time,a,radius);
 c.strokeStyle=energyRGBA(a.light,.5);c.lineWidth=1;c.beginPath();c.arc(-r*.06,-r*.06,r*.91,Math.PI*1.04,Math.PI*1.66);c.stroke();c.restore();
}
function startSpecialtyEnergy(area,origin){
 stopSpecialtyEnergy();const canvas=document.querySelector('#specialty-energy'),c=canvas.getContext('2d'),modal=document.querySelector('#specialty-modal'),start=performance.now();
 function frame(now){
  if(!modal.open||modal.dataset.area!==area.id)return;
  const w=innerWidth,h=innerHeight,dpr=Math.min(devicePixelRatio||1,2);
  if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);}
  c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,w,h);
  const slot=document.querySelector('#energy-slot').getBoundingClientRect(),target={x:slot.x+slot.width/2,y:slot.y+slot.height/2};
  const p=energyReduced.matches?1:Math.min(1,(now-start)/1050),q=energyEase(p),from=origin||target;
  const x=energyLerp(from.x,target.x,q),y=energyLerp(from.y,target.y,q)-Math.sin(p*Math.PI)*50,size=energyLerp(82,Math.min(slot.width,slot.height)*.72,q);
  c.save();if(p>=1){const m=modal.getBoundingClientRect();c.beginPath();c.rect(m.x,m.y,m.width,m.height);c.clip();}drawSpecialtyEnergy(c,x,y,size,p,now,area);c.restore();
  if(!energyReduced.matches)specialtyEnergyFrame=requestAnimationFrame(frame);
 }
 specialtyEnergyFrame=requestAnimationFrame(frame);
}

