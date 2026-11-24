'use strict';
// Pause outside the viewport or in a hidden tab; resume the same journey on return.
(()=>{
 const section=document.querySelector('.home-manifesto');
 if(!section)return;
 let visible=false,ready=false;
 function sync(){section.classList.toggle('manifesto-motion-on',visible&&ready&&!document.hidden);}
 const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:.05});
 observer.observe(section);
 document.addEventListener('visibilitychange',sync);
 Promise.all([...section.querySelectorAll('.manifesto-art')].map(img=>img.decode().catch(()=>{}))).then(()=>{ready=true;sync();});
})();
