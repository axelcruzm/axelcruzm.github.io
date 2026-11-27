'use strict';
// A native, lightweight point field: complexity becomes a continuous, ordered surface.
// Only animates while visible; honours both system and site motion preferences.
(()=>{
 const canvas=document.querySelector('#complexity-landscape');if(!canvas)return;
 const context=canvas.getContext('2d');if(!context)return;
 let width=0,height=0,frame=0,visible=false,last=0,phase=0;
 function draw(time){
  const ctx=context;
  ctx.clearRect(0,0,width,height);
  const sky=ctx.createLinearGradient(0,0,0,height);sky.addColorStop(0,'#061b32');sky.addColorStop(1,'#0a3049');ctx.fillStyle=sky;ctx.fillRect(0,0,width,height);
  const cols=width<600?68:125,rows=37;
  for(let z=rows;z>=0;z--){
   const depth=z/rows,perspective=1/(1+depth*3.1),ground=height*(.15+.89*perspective);
   for(let x=0;x<=cols;x++){
    const world=(x/cols-.5)*2;
    const wave=(Math.sin(world*5+depth*3+phase)*.08+Math.cos(world*9-depth*5+phase*.5)*.035)*height*perspective;
    const px=width/2+world*width*.95*perspective,py=ground-wave;
    const flicker=(x*13+z*7)%19,alpha=.24+perspective*.62;
    ctx.fillStyle=flicker<2?'rgba(231,200,79,'+alpha+')':flicker<7?'rgba(133,186,206,'+alpha+')':'rgba(46,121,184,'+alpha+')';
    const radius=.45+perspective*(width<600?.65:1.05);ctx.fillRect(px,py,radius*1.5,radius);
   }
  }
  const fade=ctx.createLinearGradient(0,0,0,height);fade.addColorStop(0,'#061b32cc');fade.addColorStop(.55,'#061b3200');ctx.fillStyle=fade;ctx.fillRect(0,0,width,height);
 }
 function stop(){cancelAnimationFrame(frame);frame=0;last=0;}
 function tick(time){frame=0;if(!visible||document.hidden||energyReduced.matches)return;if(time-last>=50){phase+=.008;draw(time);last=time;}frame=requestAnimationFrame(tick);}
 function sync(){stop();draw(0);if(visible&&!document.hidden&&!energyReduced.matches)frame=requestAnimationFrame(tick);}
 function resize(){const r=canvas.getBoundingClientRect();if(!r.width||!r.height)return;width=r.width;height=r.height;const dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);context.setTransform(dpr,0,0,dpr,0,0);sync();}
 new ResizeObserver(resize).observe(canvas);
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{rootMargin:'60px'}).observe(canvas);
 document.addEventListener('visibilitychange',sync);energyReduced.addEventListener('change',sync);
})();
