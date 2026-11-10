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
    if(typeof prepareNextScene==='function')prepareNextScene(index);
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

  // Native swipes: gestures are passive and never block scrolling or pinch-to-zoom.
  function bindTouchNavigation(){
    const stage=document.getElementById('presentation');
    if(!stage)return;
    let start=null;
    const ignore='button,a,input,textarea,select,[role="button"],.bottom-ui';
    stage.addEventListener('touchstart',event=>{
      start=null;
      if(event.touches.length!==1)return;
      if(event.target instanceof Element && event.target.closest(ignore))return;
      const t=event.touches[0];
      if(t.clientX<24||t.clientX>window.innerWidth-24)return; // browser back gesture
      start={id:t.identifier,x:t.clientX,y:t.clientY,at:performance.now(),scene:current};
    },{passive:true});
    stage.addEventListener('touchend',event=>{
      if(!start)return;
      if(event.touches.length>0){start=null;return;} // Ignore pinch/multitouch.
      const from=start;
      start=null;
      if(current!==from.scene)return;
      const t=Array.from(event.changedTouches).find(x=>x.identifier===from.id);
      if(!t)return;
      const dx=t.clientX-from.x,dy=t.clientY-from.y;
      const threshold=Math.max(48,Math.min(84,window.innerWidth*.13));
      if(performance.now()-from.at>1100||Math.abs(dx)<threshold||Math.abs(dx)<Math.abs(dy)*1.3)return;
      go(current+(dx<0?1:-1));
    },{passive:true});
    stage.addEventListener('touchcancel',()=>{start=null;},{passive:true});
    stage.addEventListener('touchmove',event=>{if(event.touches.length>1)start=null;},{passive:true});
  }

  // Pointer events on the five individual nodes. No repeated geometry reads.
  function setupOrbitHover(){
    const scene=scenes[0];
    const nodes=[...scene.querySelectorAll('.orbit-node')];
    const clear=()=>nodes.forEach(node=>node.classList.remove('is-near'));
    nodes.forEach(node=>{
      node.addEventListener('pointerenter',()=>{
        if(current===0 && window.matchMedia('(pointer:fine)').matches)node.classList.add('is-near');
      },{passive:true});
      node.addEventListener('pointerleave',()=>node.classList.remove('is-near'),{passive:true});
    });
    scene.addEventListener('pointerleave',clear,{passive:true});
  }
  document.addEventListener('visibilitychange',()=>{
    document.documentElement.classList.toggle('page-hidden',document.hidden);
  });


  // Progressive quality tiers. Device hints are optional; no tracking or telemetry.
  function setupAdaptiveEffects(){
    const root=document.documentElement;
    const coarse=window.matchMedia('(pointer: coarse)');
    const setQuality=()=>{
      const saveData=navigator.connection?.saveData===true;
      const ram=Number(navigator.deviceMemory)||0;
      const cores=Number(navigator.hardwareConcurrency)||0;
      const lite=saveData||(ram>0&&ram<=2)||(coarse.matches&&cores>0&&cores<=4);
      root.dataset.effects=lite?'lite':coarse.matches?'balanced':'full';
    };
    setQuality();
    coarse.addEventListener?.('change',setQuality);
  }

  // Warm only the following scene's images during idle time, not the entire deck.
  function setupImagePreparation(){
    let scheduled=null;
    const prepared=new WeakSet();
    const prepare=index=>{
      const scene=scenes[index];
      if(!scene)return;
      for(const img of scene.querySelectorAll('img')){
        if(prepared.has(img))continue;
        prepared.add(img);
        if(img.loading==='lazy')img.loading='eager';
        if(typeof img.decode==='function')img.decode().catch(()=>{});
      }
    };
    const request=fn=>window.requestIdleCallback
      ?window.requestIdleCallback(fn,{timeout:1200})
      :window.setTimeout(fn,220);
    const cancel=id=>{
      if(id===null)return;
      if(window.cancelIdleCallback)window.cancelIdleCallback(id);
      else window.clearTimeout(id);
    };
    return index=>{
      cancel(scheduled);
      scheduled=request(()=>{
        scheduled=null;
        prepare(index+1);
      });
    };
  }
  setupAdaptiveEffects();
  const prepareNextScene=setupImagePreparation();

  buildDots();
  bindKeys();
  bindUi();
  bindTouchNavigation();
  const requested=Number(new URLSearchParams(location.search).get('scene'));
  go(Number.isInteger(requested) && requested>=0 && requested<scenes.length?requested:0);
  setupOrbitHover();
})();
