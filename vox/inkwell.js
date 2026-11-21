(() => {
  'use strict';
  const PALETTE={
    'women-es':['#4977a7','#1e3a4c','#a8c5db'],
    'women-en':['#9daebf','#2f6ea2','#344759'],
    'men-es':['#173d73','#718ca4','#c1d8e6'],
    'men-en':['#b2c6d7','#40598e','#427c8d']
  };
  const tint=v=>PALETTE[v.gender+'-'+v.lang]?.[v.seq-1]??'#2f6ea2';
  const rgb=hex=>[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16));
  const mix=(a,b,p)=>a.map((c,i)=>Math.round(c*(1-p)+b[i]*p));
  const color=(a,alpha=1)=>'rgba('+a.join(',')+','+alpha+')';
  const clock=()=>performance.now();
  const ICE=[228,243,251], LIGHT=[251,248,239], NIGHT=[9,25,39], PAPER=[233,234,224];
  const profile=[[-.66,-1],[.66,-1],[1,-.66],[1,.66],[.66,1],[-.66,1],[-1,.66],[-1,-.66]];
  const circle=n=>Array.from({length:n},(_,i)=>{const a=(i+.5)*Math.PI*2/n;return [Math.cos(a),Math.sin(a)]});
  function mesh(slices,outline,id){
    const q=[], rings=slices.map(([y,x,z])=>outline.map(([u,v])=>[u*x,y,v*z]));
    for(let i=0;i<rings.length-1;i++){
      for(let j=0;j<outline.length;j++){
        const k=(j+1)%outline.length;
        q.push({p:[rings[i][j],rings[i][k],rings[i+1][k],rings[i+1][j]],nx:(outline[j][0]+outline[k][0])/2,nz:(outline[j][1]+outline[k][1])/2,layer:slices[i][3]??id,face:j});
      }
    }
    q.push({p:rings.at(-1),nx:0,nz:0,layer:id+'top',top:true,face:-1});
    return q;
  }
  const bodies=[
    [[0,.59,.40,'foot'],[.055,.65,.45,'base'],[.145,.65,.45,'inkLow'],[.52,.64,.44,'inkTop'],[.64,.63,.44,'glass'],[.72,.63,.44,'shoulder'],[.88,.30,.27,'neck'],[1.005,.215,.18,'neck'],[1.07,.216,.185]],
    [[0,.55,.43,'foot'],[.06,.62,.47,'base'],[.15,.63,.48,'inkLow'],[.58,.60,.46,'inkTop'],[.69,.59,.46,'glass'],[.81,.58,.44,'shoulder'],[.98,.27,.23,'neck'],[1.075,.225,.185,'neck'],[1.12,.225,.185]],
    [[0,.57,.42,'foot'],[.06,.65,.48,'base'],[.155,.66,.48,'inkLow'],[.53,.65,.47,'inkTop'],[.68,.65,.46,'glass'],[.76,.62,.45,'shoulder'],[.91,.29,.26,'neck'],[1.005,.218,.18,'neck'],[1.08,.218,.18]]
  ];
  const MODEL=bodies.map((body,i)=>{
    const t=body.at(-1)[0], bodyFaces=mesh(body,profile,'body');
    const cap=mesh([[t-.026,.255,.233,'rim'],[t+.03,.295,.255,'cap'],[t+.12,.295,.255,'cap'],[t+.206,.274,.233,'captop'],[t+.23,.21,.18]],circle(i===0?10:12),'cap');
    return [...bodyFaces,...cap];
  });
  function create(canvas){
    const ctx=canvas.getContext('2d',{alpha:true});
    if(!ctx)return null;
    const reduced=matchMedia('(prefers-reduced-motion: reduce)');
    let frame=0,w=0,h=0,dpr=1,last=0,time=0;
    let focus=-1, focal=0, focalTo=0, models=[], boxShifts=[], entered=0, previous=[];
    function sync(cards){
      const next=cards.map((c,i)=>({id:c.v.id,t:tint(c.v),c,i}));
      if(next.some((m,i)=>m.id!==models[i]?.id)||next.length!==models.length){
        previous=models.map(m=>rgb(m.t));
        entered=clock();
        models=next;
        boxShifts=models.map((_,i)=>boxShifts[i]??0);
      }else models=next;
      trigger();
    }
    function focusOn(i){
      if(focus===i)return;
      focus=i;
      focalTo=i===-1?0:(i-1)*.155;trigger();
    }
    function measure(){
      const r=canvas.getBoundingClientRect();
      if(!r.width||!r.height)return;
      w=r.width;h=r.height;dpr=Math.min(devicePixelRatio||1,1.6);
      canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);
      trigger();
    }
    new ResizeObserver(measure).observe(canvas);
    measure();
    function trigger(){if(!frame)frame=requestAnimationFrame(draw)}
    function draw(ms){
      frame=0;
      if(!w||!h||!models.length)return;
      const dt=Math.min(45,ms-(last||ms));last=ms;
      const diff=1-Math.pow(.82,dt/16);
      if(reduced.matches){focal=0;boxShifts=boxShifts.map(()=>0)}else focal+=(focalTo-focal)*diff;
      const elapsed=Math.min(1,Math.max(0,(ms-entered)/460));
      const transition=reduced.matches?1:elapsed*elapsed*(3-2*elapsed);
      const playing=models.some(o=>o.c.el.dataset.playing==='true');
      if(playing&&!reduced.matches)time+=dt*.001;
      ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
      const wide=Math.max(0,Math.min(1,(w-950)/90));
      const unit=Math.min(h*.595,w*.205,164+16*wide);
      const gap=Math.min(w*.311,285+24*wide);
      const ground=h*.884;
      for(const m of models){
        const i=m.i, current=rgb(m.t);
        const dye=previous[i]?mix(previous[i],current,transition):current;
        const playing=m.c.el.dataset.playing==='true';
        const target=(i===focus?1:0)+(playing?.39:0);
        const shift=boxShifts[i];
        const changed=reduced.matches?0:shift+(target-shift)*diff;
        boxShifts[i]=changed;
        const side=i-1;
        const size=unit*(i===1?1.06:.96);
        const x=w*.5+side*gap-(reduced.matches?0:focal*w*.10);
        const lift=changed*(playing?8:6)+(playing&&!reduced.matches?Math.sin(time*2.3)*1.6:0);
        const baseline=ground-lift;
        const yaw=[-.255,.08,.29][i]+focal*.65+changed*.105+(playing&&!reduced.matches?Math.sin(time*2)*.028:0);
        const pitch=.22+changed*.023, cy=Math.cos(yaw), sy=Math.sin(yaw), cp=Math.cos(pitch), sp=Math.sin(pitch);
        function vp([a,b,c]){
          const ax=a*cy+c*sy, az=c*cy-a*sy, depth=az*cp+b*sp;
          return [x+ax*size, baseline+(-b*cp+az*sp)*size,depth];
        }
        ctx.save();
        ctx.translate(x+size*.12,ground+size*.004);ctx.scale(1,.21);
        const halo=ctx.createRadialGradient(0,0,0,0,0,size*.94);
        halo.addColorStop(0,'rgba(20,30,43,.31)');halo.addColorStop(.49,'rgba(20,30,43,.15)');halo.addColorStop(1,'rgba(20,30,43,0)');
        ctx.fillStyle=halo; ctx.fillRect(-size,-size,size*2,size*2);ctx.restore();
        const list=MODEL[i].flatMap(face=>{
          const nz=face.nz*cy-face.nx*sy;
          if(!face.top&&nz<-.025)return [];
          const p=face.p.map(vp);
          return [{...face,p,z:p.reduce((a,v)=>a+v[2],0)/p.length,nz}];
        }).sort((a,b)=>a.z-b.z);
        for(const face of list){
          const edge=face.face%2===0;
          const rotatedX=face.nx*cy+face.nz*sy;
          const light=face.top?.7:Math.max(0,.29-rotatedX*.53+face.nz*.12);
          let a,b,line,alpha=.98;
          if(face.layer==='cap'||face.layer==='captop'||face.layer==='rim'){
            const dark=mix(NIGHT,dye,.12);
            a=mix(dark,ICE,face.top?.40:.045+light*.22);
            b=mix(dark,NIGHT,.22);
            line=mix(dark,ICE,face.top?.54:.28);
          }else if(face.layer==='inkLow'||face.layer==='inkTop'){
            a=mix(dye,ICE,.08+light*.27);
            b=mix(dye,NIGHT,.31+((1-light)*.13));
            line=mix(dye,ICE,.25+light*.2);
          }else if(face.layer==='base'||face.layer==='foot'){
            a=mix(dye,ICE,.49+light*.24);
            b=mix(dye,NIGHT,.28+.17*(1-light));
            line=mix(dye,ICE,.50);
          }else{
            a=mix(dye,ICE,.38+light*.27);
            b=mix(dye,NIGHT,.19+.17*(1-light));
            line=mix(dye,ICE,.46+light*.26);
          }
          if(!edge&&!face.top){a=mix(a,ICE,.12);b=mix(b,NIGHT,.10)}
          const top=face.p.reduce((a,p)=>Math.min(a,p[1]),Infinity),bottom=face.p.reduce((a,p)=>Math.max(a,p[1]),-Infinity);
          const right=face.p.reduce((a,p)=>Math.max(a,p[0]),-Infinity),left=face.p.reduce((a,p)=>Math.min(a,p[0]),Infinity);
          const gradient=ctx.createLinearGradient(left,top,right+.01,bottom+.01);
          gradient.addColorStop(0,color(a,alpha));gradient.addColorStop(.56,color(mix(a,b,.41),alpha));gradient.addColorStop(1,color(b,alpha));
          ctx.beginPath();face.p.forEach(([vx,vy],ix)=>ix===0?ctx.moveTo(vx,vy):ctx.lineTo(vx,vy));ctx.closePath();
          ctx.fillStyle=gradient;ctx.fill();ctx.lineWidth=face.top?.8:.65;ctx.strokeStyle=color(line,face.top?.69:.48);ctx.stroke();
          if((face.layer==='inkLow'||face.layer==='base')&&face.nz>.52&&face.p.length===4){
            const [p0,p1,p2,p3]=face.p;const f=face.layer==='base'?.22:.16;
            const lerp=(a,b,p)=>a.map((x,i)=>x+(b[i]-x)*p);
            const x1=lerp(p0,p1,f),x2=lerp(p3,p2,f);
            ctx.strokeStyle=color(ICE,.15+light*.33);ctx.lineWidth=Math.max(1,size*.012);
            ctx.beginPath();ctx.moveTo(x1[0],x1[1]);ctx.lineTo(x2[0],x2[1]);ctx.stroke();
          }
        }
        const mm=bodies[i], faceZ=mm[2][2], label=vp([0,.435,faceZ+.015]), joint=vp([.60,.22,faceZ-.012]);
        const theta=Math.atan2(vp([.4,.435,faceZ])[1]-label[1],vp([.4,.435,faceZ])[0]-label[0])*180/Math.PI;
        m.c.el.style.setProperty('--label-x',label[0]+'px');m.c.el.style.setProperty('--label-y',label[1]+'px');
        m.c.el.style.setProperty('--label-w',Math.max(40,size*.67*cy)+'px');m.c.el.style.setProperty('--label-h',Math.max(44,size*.47)+'px');
        m.c.el.style.setProperty('--label-skew',theta+'deg');
        m.c.el.style.setProperty('--pick-x',(joint[0]+size*.068)+'px');m.c.el.style.setProperty('--pick-y',(joint[1]-size*.045)+'px');
        m.c.el.style.setProperty('--hit-x',x+'px');m.c.el.style.setProperty('--hit-y',(baseline-size*.58)+'px');
        m.c.el.style.setProperty('--hit-w',(size*1.43)+'px');m.c.el.style.setProperty('--hit-h',(size*1.32)+'px');
      }
      if((!reduced.matches&&(playing||Math.abs(focalTo-focal)>.0004||boxShifts.some((a,i)=>Math.abs(a-((i===focus?1:0)+(models[i]?.c.el.dataset.playing==='true'?.39:0)))>.003)))||transition<1)trigger();
    }
    return {sync,focus:focusOn,redraw:trigger};
  }
  globalThis.VOX_INK={create,tint};
})();
