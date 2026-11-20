/**
 * VOX ET VERITAS — low-poly ink bottles.
 * Actual WebGL geometry; SVG bottles remain as graceful fallback.
 * Does not render on demand until Three.js is available.
 */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

const bottleInstances = [];
const mediaMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function paletteColor(hex, factor) {
  return new THREE.Color(hex).multiplyScalar(factor);
}

function ring(width, depth, clip, height) {
  return [
    [-width + clip, height,  depth],
    [ width - clip, height,  depth],
    [ width, height,  depth - clip],
    [ width, height, -depth + clip],
    [ width - clip, height, -depth],
    [-width + clip, height, -depth],
    [-width, height, -depth + clip],
    [-width, height,  depth - clip]
  ];
}

function facetedShell(tone) {
  // Shape designed around the original VOX low-poly squat glass inkwell.
  const rings = [
    ring(.90,.58,.17,-1.12),
    ring(1.02,.65,.20,-.94),
    ring(1.02,.65,.20,-.08),
    ring(.78,.56,.18,.19),
    ring(.58,.43,.11,.47),
    ring(.56,.42,.11,.62)
  ];
  const positions=[],colors=[];
  const surface = [1.12,1.0,.84,.74,.88,1.05,1.18,1.29];
  const base = new THREE.Color(tone);
  const triangle=(a,b,c,col)=>{
    positions.push(...a,...b,...c);
    for(let n=0;n<3;n++) colors.push(col.r,col.g,col.b);
  };
  for(let h=0;h<rings.length-1;h++) {
    for(let i=0;i<8;i++) {
      const j=(i+1)%8, a=rings[h][i], b=rings[h][j],
        c=rings[h+1][i],d=rings[h+1][j];
      const variation=(h===2?1.09:h===3?1.11:h===0?.82:1);
      const color=base.clone().multiplyScalar(surface[i]*variation);
      triangle(a,b,c,color);
      triangle(c,b,d,color);
    }
  }
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
  geo.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));
  geo.computeVertexNormals();
  const mat=new THREE.MeshPhysicalMaterial({
    vertexColors:true,roughness:.27,metalness:.08,clearcoat:.45,
    clearcoatRoughness:.17,flatShading:true,side:THREE.DoubleSide
  });
  return new THREE.Mesh(geo,mat);
}
function labelTexture() {
  const canvas=document.createElement('canvas');
  canvas.width=512;canvas.height=360;
  const ctx=canvas.getContext('2d');
  const grd=ctx.createLinearGradient(0,0,512,360);
  grd.addColorStop(0,'#fbfaf3');grd.addColorStop(1,'#e8e6db');
  ctx.fillStyle=grd;ctx.fillRect(0,0,512,360);
  ctx.strokeStyle='#bcbdb4';ctx.lineWidth=15;ctx.strokeRect(10,10,492,340);
  ctx.strokeStyle='#d5d2c6';ctx.lineWidth=2;ctx.strokeRect(37,34,438,289);
  // The original play button remains an accessible HTML control above this label.
  const texture=new THREE.CanvasTexture(canvas);
  texture.colorSpace=THREE.SRGBColorSpace;
  texture.anisotropy=4;
  return texture;
}
const labelMap=labelTexture();
function createBottle(tone) {
  const obj=new THREE.Group();
  const shell=facetedShell(tone);obj.add(shell);
  // Low-poly graphite cap with subtle ribbing.
  const cap=new THREE.Mesh(
    new THREE.CylinderGeometry(.64,.65,.45,10,1),
    new THREE.MeshStandardMaterial({color:'#213b4c',roughness:.49,metalness:.16,flatShading:true})
  );
  cap.position.y=.78;
  obj.add(cap);
  const capTop=new THREE.Mesh(
    new THREE.CylinderGeometry(.605,.65,.075,10,1),
    new THREE.MeshStandardMaterial({color:'#324f60',roughness:.40,metalness:.13,flatShading:true})
  );
  capTop.position.y=1.045;
  obj.add(capTop);
  const neck=new THREE.Mesh(
    new THREE.CylinderGeometry(.49,.50,.15,10),
    new THREE.MeshStandardMaterial({color:paletteColor(tone,.7),roughness:.38,metalness:.12,flatShading:true})
  );
  neck.position.y=.53;
  obj.add(neck);
  const label=new THREE.Mesh(
    new THREE.PlaneGeometry(1.32,.81),
    new THREE.MeshStandardMaterial({map:labelMap,roughness:1,metalness:0,side:THREE.DoubleSide})
  );
  label.position.set(0,-.60,.663);
  label.rotation.x=-.013;
  obj.add(label);
  // The paper label casts a minimal shadow on the faceted glass.
  const trim=new THREE.Mesh(new THREE.PlaneGeometry(1.39,.87),
    new THREE.MeshBasicMaterial({color:'#99a4a8',transparent:true,opacity:.33,side:THREE.DoubleSide}));
  trim.position.set(0,-.61,.658);trim.rotation.x=-.013;
  obj.add(trim);
  obj.rotation.y=-.1;
  return obj;
}

function disposeAll() {
  while(bottleInstances.length) {
    const item=bottleInstances.pop();
    item.resizeObserver.disconnect();
    item.renderer.dispose();
    item.renderer.domElement.remove();
    item.bottle.traverse(node => {
      if(node.geometry && node.geometry.dispose)node.geometry.dispose();
      if(node.material && node.material.dispose && !node.material.map)node.material.dispose();
    });
  }
}
function mountBottles() {
  if(!window.WebGLRenderingContext)return;
  disposeAll();
  document.querySelectorAll('#bottles .ink-bottle').forEach((element,index)=>{
    const tone=element.dataset.tone || ['#6c96b4','#294b60','#a6c2d4'][index];
    const scene=new THREE.Scene();
    const camera=new THREE.PerspectiveCamera(31,1,.1,50);
    camera.position.set(2.1,1.56,5.45);
    camera.lookAt(0,-.04,0);
    const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1,1.75));
    renderer.setClearColor('#ffffff',0);
    renderer.outputColorSpace=THREE.SRGBColorSpace;
    renderer.toneMapping=THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure=1.30;
    renderer.domElement.className='bottle-3d';
    renderer.domElement.setAttribute('aria-hidden','true');
    element.prepend(renderer.domElement);
    element.classList.add('webgl-ready');
    scene.add(new THREE.AmbientLight('#c7ddf1',2.55));
    const key=new THREE.DirectionalLight('#ffffff',4.5);key.position.set(-3,7,7);scene.add(key);
    const rim=new THREE.DirectionalLight('#a2c3e7',1.9);rim.position.set(6,2,-5);scene.add(rim);
    const fill=new THREE.DirectionalLight('#ffffff',1.25);fill.position.set(0,-2,6);scene.add(fill);
    const bottle=createBottle(tone);scene.add(bottle);
    const shadow=new THREE.Mesh(
      new THREE.CircleGeometry(.94,24),
      new THREE.MeshBasicMaterial({color:'#1e3a4c',transparent:true,opacity:.09,depthWrite:false})
    );
    shadow.rotation.x=-Math.PI/2;shadow.position.y=-1.20;shadow.scale.set(1.05,.7,1);scene.add(shadow);
    const instance={element,scene,camera,renderer,bottle,resizeObserver:null,needsRender:true};
    const resize=()=>{
      const w=Math.max(1,Math.round(element.clientWidth)),h=Math.max(1,Math.round(element.clientHeight));
      renderer.setSize(w,h,false);
      camera.aspect=w/h;camera.updateProjectionMatrix();
      instance.needsRender=true;
    };
    instance.resizeObserver=new ResizeObserver(resize);
    instance.resizeObserver.observe(element);
    element.addEventListener('pointermove',ev=>{
      if(ev.pointerType==='touch')return;
      const box=element.getBoundingClientRect();
      const dx=(ev.clientX-box.left)/box.width-.5,dy=(ev.clientY-box.top)/box.height-.5;
      bottle.rotation.y=-.12+dx*.20;
      bottle.rotation.x=dy*.08;
      instance.needsRender=true;
    });
    element.addEventListener('pointerleave',()=>{
      bottle.rotation.y=-.1;bottle.rotation.x=0;instance.needsRender=true;
    });
    bottleInstances.push(instance);
    resize();
  });
}
window.addEventListener('vox:bottles-render',mountBottles);
window.addEventListener('resize',()=>{for(const e of bottleInstances)e.needsRender=true;},{passive:true});
let prev=0;
function renderLoop(now) {
  if(now-prev>34 && !document.hidden){
    prev=now;
    for(const instance of bottleInstances){
      if(!instance.needsRender)continue;
      instance.renderer.render(instance.scene,instance.camera);
      instance.needsRender=false;
    }
  }
  requestAnimationFrame(renderLoop);
}
requestAnimationFrame(renderLoop);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mountBottles,{once:true});
else mountBottles();
