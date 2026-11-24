'use strict';
// A compact invitation opens the full game without moving the page beneath it.
(()=>{
 const dialog=document.querySelector('#game-dialog'),launch=document.querySelector('#launch-game');
 const channels=launch.querySelector('.launch-channels');
 if(channels)channels.innerHTML=gameTeams.map((team,i)=>'<span class="launch-channel" data-launch-area="'+team.id+'" style="--channel:'+team.color+';--channel-light:'+team.light+';--channel-index:'+i+'"><svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+team.icon+'</svg></span>').join('');
 function openGame(){if(dialog.open)return;dialog.showModal();document.body.classList.add('game-open');launch.querySelector('.launch-action').textContent='RESUME PLAY';launch.setAttribute('aria-expanded','true');}
 launch.addEventListener('click',openGame);
 document.querySelector('#close-game').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('close',()=>{document.body.classList.remove('game-open');launch.setAttribute('aria-expanded','false');if(typeof setSelected==='function')setSelected(false);});
 window.addEventListener('command-route',e=>{if(e.detail.page!=='home'&&dialog.open)dialog.close();});
 if(location.hash==='#pm-simulator')openGame();
 window.addEventListener('hashchange',()=>{if(location.hash==='#pm-simulator')openGame();});
})();
