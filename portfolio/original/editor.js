'use strict';
// Color themes only. Changing a theme never changes the task or game score.
(()=>{
 const editor=document.querySelector('.task-editor');if(!editor)return;
 const themes={'deep-sea':'Deep Sea',midnight:'Midnight',neon:'Neon'};
 const buttons=[...editor.querySelectorAll('[data-code-theme]')];
 function applyTheme(id){
  if(!Object.prototype.hasOwnProperty.call(themes,id))return;
  editor.dataset.editorTheme=id;
  buttons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.codeTheme===id)));
  try{localStorage.setItem('axel-code-theme',id);}catch{/* The theme still works when local storage is unavailable. */}
 }
 let saved;try{saved=localStorage.getItem('axel-code-theme');}catch{}
 applyTheme(Object.prototype.hasOwnProperty.call(themes,saved)?saved:'deep-sea');
 buttons.forEach(button=>button.addEventListener('click',()=>applyTheme(button.dataset.codeTheme)));
 const card=document.querySelector('#task-card'),text=document.querySelector('#task-text'),state=document.querySelector('#editor-state');
 function syncTask(){
  card.setAttribute('aria-label','Select task: '+text.textContent);
  state.textContent=card.disabled?(card.classList.contains('task-delivered')?'connected':'round restarting'):card.getAttribute('aria-pressed')==='true'?'choose its team':'ready to assign';
 }
 new MutationObserver(syncTask).observe(card,{attributes:true,attributeFilter:['disabled','aria-pressed','class'],childList:true,subtree:true,characterData:true});
 syncTask();
})();
