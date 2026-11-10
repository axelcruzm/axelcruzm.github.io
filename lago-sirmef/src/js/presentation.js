(()=>{
  'use strict';
  const scenes=[...document.querySelectorAll('.scene')];
  const labels=['DISTANCIA','SIRMEF','SERVICIOS','LAGO CONSULTORES'];
  const total=scenes.length-1;
  const el={
    back:document.getElementById('back'),
    next:document.getElementById('next'),
    dots:document.getElementById('nav-dots'),
    label:document.getElementById('scene-label'),
    num:document.getElementById('scene-number'),
    progress:document.getElementById('progress'),
    full:document.getElementById('fullscreen')
  };
  let current=0;

  function buildDots(){
    scenes.forEach((_,i)=>{
      const b=document.createElement('button');
      b.type='button';
      b.className='dot'+(i===0?' is-active':'');
      b.setAttribute('aria-label','Ir a escena '+String(i).padStart(2,'0'));
      b.addEventListener('click',()=>go(i));
      el.dots.appendChild(b);
    });
  }

  function go(index){
    index=Math.max(0,Math.min(scenes.length-1,index));
    current=index;
    document.body.dataset.scene=String(index);
    scenes.forEach((scene,i)=>{
      const active=i===index;
      scene.classList.toggle('is-active',active);
      scene.setAttribute('aria-hidden',String(!active));
    });
    [...el.dots.children].forEach((d,i)=>{
      d.classList.toggle('is-active',i===index);
      d.setAttribute('aria-current',i===index?'step':'false');
    });
    el.back.disabled=index===0;
    el.next.disabled=index===scenes.length-1;
    el.label.textContent=labels[index]||'';
    el.num.textContent=String(index).padStart(2,'0')+' / '+String(total).padStart(2,'0');
    el.progress.style.width=((index+1)/scenes.length*100)+'%';
  }

  function bindKeys(){
    document.addEventListener('keydown',(ev)=>{
      if(['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName)) return;
      if(ev.key==='ArrowRight' || ev.key==='PageDown' || ev.key===' '){ev.preventDefault();go(current+1)}
      if(ev.key==='ArrowLeft' || ev.key==='PageUp'){ev.preventDefault();go(current-1)}
      if(ev.key.toLowerCase()==='f'){toggleFullscreen()}
      if(ev.key==='Home'){go(0)}
      if(ev.key==='End'){go(scenes.length-1)}
    });
  }

  async function toggleFullscreen(){
    try{
      if(!document.fullscreenElement){await document.documentElement.requestFullscreen()}
      else{await document.exitFullscreen()}
    }catch(err){console.warn('Fullscreen unavailable',err)}
  }

  function bindUi(){
    el.back.addEventListener('click',()=>go(current-1));
    el.next.addEventListener('click',()=>go(current+1));
    el.full.addEventListener('click',toggleFullscreen);
  }

  function setupOrbit(){
    const shell=document.querySelector('.scene--0 .orbit-shell');
    if(!shell)return;
    const nodes=[...shell.querySelectorAll('.orbit-node')];
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
    const duration=78000;
    const offset=-Math.PI/2;
    const place=(time)=>{
      const rect=shell.getBoundingClientRect();
      const rx=Math.max(0,(rect.width-150)/2);
      const ry=Math.max(0,(rect.height-155)/2);
      const phase=reduced.matches?0:(time % duration)/duration*Math.PI*2;
      nodes.forEach((node,i)=>{
        const angle=offset+2*Math.PI*i/nodes.length+phase;
        const x=rect.width/2+Math.cos(angle)*rx;
        const y=rect.height/2+Math.sin(angle)*ry;
        node.style.left=x+'px';
        node.style.top=y+'px';
      });
    };
    let last=0;
    const animate=(time)=>{
      if(current===0 && time-last>28){place(time);last=time;}
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
    window.addEventListener('resize',()=>place(performance.now()),{passive:true});
    const canvas=document.querySelector('.scene--0');
    canvas?.addEventListener('pointermove',event=>{
      if(current!==0)return;
      nodes.forEach(node=>{
        const r=node.getBoundingClientRect();
        const distance=Math.hypot((r.left+r.width/2)-event.clientX,(r.top+r.height/2)-event.clientY);
        node.classList.toggle('is-near',distance<110);
      });
    },{passive:true});
  }

  buildDots();
  bindKeys();
  bindUi();
  const requested=Number(new URLSearchParams(location.search).get('scene'));
  go(Number.isInteger(requested) && requested>=0 && requested<scenes.length?requested:0);
  setupOrbit();
})();
