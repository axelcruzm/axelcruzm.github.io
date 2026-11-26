'use strict';
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopSpecialtyEnergy();else if(specialtyModal.open&&activeArea)startSpecialtyEnergy(activeArea,null);});


function syncMotionControl(){const b=$('#motion-toggle');b.setAttribute('aria-pressed',String(energyReduced.matches));b.disabled=energySystemMotion.matches;b.textContent=energySystemMotion.matches?'SYSTEM: REDUCED MOTION':'REDUCE MOTION';}
$('#motion-toggle').addEventListener('click',()=>{setCommandMotion(!energyReduced.matches);syncMotionControl();});
energySystemMotion.addEventListener('change',syncMotionControl);
syncMotionControl();

specialtyModal.addEventListener('scroll',()=>{if(energyReduced.matches&&activeArea)startSpecialtyEnergy(activeArea,null);});
window.addEventListener('resize',()=>{if(energyReduced.matches&&specialtyModal.open&&activeArea)startSpecialtyEnergy(activeArea,null);});


// The original simulator's case and chapter exits now open their portfolio pages.
document.addEventListener('click', event => {
  const link = event.target.closest('a[href^="#"]');
  if (!link) return;
  event.preventDefault();
  const [chapter, target] = link.hash.slice(1).split('/');
  const workPage = new URL('../work.html', location.href);
  workPage.hash = chapter === 'client' && target ? 'projects' : 'how';
  window.top.location.href = workPage.href;
});
