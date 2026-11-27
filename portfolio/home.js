const soundButton=document.getElementById('sound');
document.querySelector('.footer-inner > div').append(soundButton);
let audioContext;
let enabled=false;
let lastNote=0;
const tiles=[...document.querySelectorAll('.tile')];
function note(index,confirmed=false){
  if(!enabled||!audioContext||audioContext.state!=='running') return;
  const now=audioContext.currentTime;
  if(now-lastNote<.08) return;
  lastNote=now;
  const tones=[261.63,329.63,392,440,523.25,659.25];
  for(const [multiple,volume] of [[1,.036],[2,.009]]){
    const osc=audioContext.createOscillator(),env=audioContext.createGain();
    osc.type='sine';osc.frequency.value=tones[index%6]*multiple*(confirmed?1.5:1);
    env.gain.setValueAtTime(.00001,now);
    env.gain.exponentialRampToValueAtTime(volume,now+.008);
    env.gain.exponentialRampToValueAtTime(.00001,now+.25);
    osc.connect(env).connect(audioContext.destination);osc.start(now);osc.stop(now+.27);
    osc.onended=()=>{osc.disconnect();env.disconnect()};
  }
}
soundButton.addEventListener('click',async()=>{
  const Audio=window.AudioContext||window.webkitAudioContext;
  if(!Audio) return;
  try{
    audioContext ||= new Audio();
    if(!enabled) await audioContext.resume();
    enabled=!enabled;
    soundButton.setAttribute('aria-pressed',String(enabled));
    soundButton.setAttribute('aria-label',(enabled?'Disable':'Enable')+' interaction sounds');
    soundButton.querySelector('span').textContent=enabled?'Sound on':'Sound off';
    note(3,true);
  }catch{enabled=false;}
});
tiles.forEach((tile,index)=>{
  tile.addEventListener('pointerenter',event=>{if(event.pointerType!=='touch') note(index)});
  tile.addEventListener('focus',()=>note(index));
  tile.addEventListener('click',()=>note(index,true));
});
