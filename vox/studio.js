(() => {
  'use strict';
  const catalog=globalThis.VOX_VOICES;
  const $=id=>document.getElementById(id);
  const audio=$('audio'), grid=$('spheres'), dialog=$('quote-dialog');
  const status=$('audio-status'), quoteStatus=$('quote-status');
  const holder=$('ink-controls'), scene=globalThis.VOX_INK.create($('ink-scene'));
  if(!scene)grid.classList.add('ink-fallback');
  let requestMode='quote';
  const languageNames={es:'Spanish',en:'English'};
  const genderNames={women:'woman',men:'man'};

  let filters={gender:'women',language:'es'}, active=null, selected=null, speech=null, spokenAt=0, spokenDuration=0, serial=0, anim=0, drawing=0, cards=[];
  function tag(s,a={}){const e=document.createElement(s);for(const [k,v] of Object.entries(a))e.setAttribute(k,v);return e}
  function svgtag(s,a={}){const e=document.createElementNS('http://www.w3.org/2000/svg',s);for(const [k,v] of Object.entries(a))e.setAttribute(k,v);return e}
  function icon(s){const e=svgtag('svg',{'aria-hidden':'true'});e.append(svgtag('use',{href:'#i-'+s}));return e}
  function setIcon(e,s){e.querySelector('use').setAttribute('href','#i-'+s)}
  function note(s){status.textContent=s}
  function currentList(){return catalog[filters.gender+'-'+filters.language]??[]}
  function sayLabel(v){return languageNames[v.lang]+' · '+genderNames[v.gender]+' · sample '+String(v.seq).padStart(2,'0')}
  function updateCaption(extra=''){
    const provisional=currentList().some(c=>c.prototype);
    $('sample-note').textContent=extra||(provisional?'Prototype audio · Not VOX talent':'');
    $('sample-note').hidden=!(extra||provisional);
  }
  function inkText(hex){
    const [r,g,b]=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16));
    return .2126*r+.7152*g+.0722*b>142?'#1e3a4c':'#fff';
  }
  function identity(v){return v&&v.id}
  function currentIs(v){return identity(active)===identity(v)}
  function enginePlaying(){return !!(active&&(speech?(!speech.paused):!audio.paused))}
  function clearEngine(){
    serial++; cancelAnimationFrame(anim);
    if(speech && 'speechSynthesis' in window)speechSynthesis.cancel();
    speech=null;spokenAt=0;spokenDuration=0;
    audio.pause();
    if(audio.hasAttribute('src')){audio.removeAttribute('src');audio.load()}
    active=null;
    paint();
  }
  function progress(){
    if(speech){return speech.paused?speech.progress:Math.min(.99,Math.max(0,(performance.now()-spokenAt)/spokenDuration))}
    return Number.isFinite(audio.duration)&&audio.duration>0?Math.min(1,audio.currentTime/audio.duration):0;
  }
  function paint(){
    const playing=enginePlaying();
    let sceneChanged=false;
    for(const {v,el,play,pick,ring} of cards){
      const activeHere=currentIs(v), playingHere=activeHere&&playing, picked=identity(selected)===v.id;
      if(el.dataset.playing!==String(playingHere)){el.dataset.playing=String(playingHere);sceneChanged=true}
      play.dataset.progress=String(activeHere&&progress()>0);
      if(activeHere)el.style.setProperty('--progress',Math.round(progress()*100)+'%');
      else el.style.setProperty('--progress','0%');
      play.setAttribute('aria-label',(playingHere?'Pause':'Play')+' '+sayLabel(v));
      pick.setAttribute('aria-label',(picked?'Remove':'Select')+' '+sayLabel(v));
      pick.setAttribute('aria-pressed',String(picked));
      setIcon(play,playingHere?'pause':'play');setIcon(pick,picked?'check':'drop');
    }
    if(sceneChanged)scene?.redraw();
  }
  function tick(){
    cancelAnimationFrame(anim);
    paint();
    if(enginePlaying())anim=requestAnimationFrame(tick);
  }
  function refreshDock(){
    const text=$('dock-text'), remove=$('clear-voice'), mount=$('dock-reference');
    text.textContent=selected?languageNames[selected.lang]+' · '+selected.id:'';
    if(selected){const t=VOX_INK.tint(selected);mount.style.setProperty('--selected-ink',t);mount.style.setProperty('--selected-ink-text',inkText(t))}
    mount.classList.toggle('filled',!!selected);
    remove.disabled=!selected;
    paint();
    scene?.redraw();
  }
  function select(v){
    selected=identity(selected)===v.id?null:v;
    refreshDock();
    note(selected?sayLabel(v)+' added to the quote.':'Voice reference removed.');
  }
  function makeCard(v,slot){
    const el=tag('div',{class:'capsule'}), hit=tag('span',{class:'ink-hit','aria-hidden':'true'}), play=tag('button',{type:'button',class:'play'}), pick=tag('button',{type:'button',class:'pick'});
    play.append(icon('play'));pick.append(icon('drop'));el.append(hit,play,pick);
    const card={v,el,play,pick};
    play.onclick=()=>{toggle(card.v);scene?.redraw()};pick.onclick=()=>select(card.v);
    for(const item of [hit,play,pick]){
      item.addEventListener('pointerenter',()=>scene?.focus(slot));
      item.addEventListener('pointerleave',()=>scene?.focus(-1));
    }
    el.addEventListener('focusin',()=>scene?.focus(slot));
    el.addEventListener('focusout',e=>{if(!el.contains(e.relatedTarget))scene?.focus(-1)});
    return card;
  }
  function render(animation=false){
    cancelAnimationFrame(drawing);
    grid.dataset.tone=filters.gender+'-'+filters.language;
    const list=currentList();
    if(cards.length===list.length){cards.forEach((c,i)=>{c.el.classList.remove('changing');c.v=list[i]})}
    else{cards=list.map(makeCard);holder.replaceChildren(...cards.map(c=>c.el))}
    if(animation)drawing=requestAnimationFrame(()=>cards.forEach(c=>c.el.classList.add('changing')));
    cards.forEach(c=>{const t=VOX_INK.tint(c.v);c.el.style.setProperty('--ink-color',t);c.el.style.setProperty('--ink-text',inkText(t))});
    updateCaption();
    paint();
    scene?.sync(cards);
  }
  function deviceSpanish(v,run){
    if(!v.speech||!('speechSynthesis' in window)||typeof SpeechSynthesisUtterance==='undefined')return false;
    const voices=speechSynthesis.getVoices().filter(voice=>voice.localService&&/^es(?:-|_)/i.test(voice.lang));
    if(!voices.length)return false;
    const names=v.gender==='women'?/paulina|helena|elena|m[oó]nica|sabina|ximena|isabela|maria/i:/jorge|[áa]lvaro|pablo|diego|raul|carlos|juan/i;
    const suitable=voices.filter(voice=>names.test(voice.name));
    const batch=suitable.length?suitable:voices;
    const utt=new SpeechSynthesisUtterance(v.speech);
    utt.voice=batch[(v.seq-1)%batch.length];
    utt.lang=utt.voice.lang;
    utt.rate=.81+(v.seq-1)*.04;
    utt.pitch=v.gender==='women'?1.08:.87;
    speech={utt,paused:false,progress:0};
    spokenDuration=62000;
    spokenAt=performance.now();
    const startWatch=setTimeout(()=>{
      if(serial!==run||!speech||speech.started)return;
      speech=null;speechSynthesis.cancel();playFile(v,run,true);
    },1600);
    utt.onstart=()=>{if(serial===run&&speech){clearTimeout(startWatch);speech.started=true;spokenAt=performance.now();tick()}};
    utt.onend=()=>{clearTimeout(startWatch);if(serial===run&&speech){clearEngine();note('Sample ended.')}};
    utt.onerror=()=>{clearTimeout(startWatch);if(serial===run&&speech){speech=null;playFile(v,run,true)}};
    speechSynthesis.speak(utt);
    updateCaption();
    tick();return true;
  }
  async function playFile(v,run,tone=false){
    try{
      audio.src=v.src;
      await audio.play();
      if(run!==serial)return;
      updateCaption();
      note(tone?'Playing prototype audio.':'Playing '+sayLabel(v)+'.');
      tick();
    }catch(e){
      if(run!==serial)return;
      clearEngine();
      updateCaption('Audio could not play. You can still request a quote.');
      note('This audio could not play.');
    }
  }
  function toggle(v){
    if(currentIs(v)){
      if(speech){
        const synth=speechSynthesis;
        if(speech.paused){spokenAt=performance.now()-speech.progress*spokenDuration;speech.paused=false;synth.resume()}
        else{speech.progress=progress();speech.paused=true;synth.pause()}
        tick();return;
      }
      if(!audio.paused){audio.pause();tick();return}
      audio.play().then(tick).catch(()=>note('Playback could not resume.'));
      return;
    }
    clearEngine();
    active=v;
    const run=serial;
    const isSpanishTest=v.lang==='es'&&v.prototype&&!!v.speech;
    if(isSpanishTest&&deviceSpanish(v,run))return;
    playFile(v,run,isSpanishTest);
  }
  audio.addEventListener('pause',paint);
  audio.addEventListener('ended',()=>{clearEngine();note('Sample ended.')});
  for(const input of document.querySelectorAll('.segments input')){
    input.onchange=()=>{
      if(!input.checked)return;
      const old=filters[input.name];
      filters[input.name]=input.value;
      if(old!==input.value){clearEngine();render(true);note(currentList().length+' samples. '+languageNames[filters.language]+', '+filters.gender+'.')}
    };
  }
  $('clear-voice').onclick=()=>{
    selected=null;
    refreshDock();$('quote-button').focus();note('Voice reference removed.');
  };
  function describeSelection(forSending=false){
    if(!selected)return '';
    if(selected.prototype){
      return forSending?'Voice preference: '+languageNames[selected.lang]+', '+genderNames[selected.gender]+'.':'Prototype reference · '+languageNames[selected.lang]+' · '+selected.id;
    }
    return 'Voice reference: '+selected.id+' · '+languageNames[selected.lang]+' · '+genderNames[selected.gender]+'.';
  }
  function openRequest(mode){
    requestMode=mode;
    if(active){clearEngine();updateCaption()}
    const meeting=mode==='meeting';
    $('quote-title').textContent=meeting?'Request a Virtual Meeting':'Request a Quote';
    $('prepare-brief').textContent=meeting?'Prepare Meeting Request':'Prepare Quote Brief';
    const voiceRef=describeSelection();
    const reference=$('quote-reference');
    reference.textContent=voiceRef;reference.hidden=!voiceRef;
    $('quote-language').value=languageNames[selected?.lang??filters.language];
    $('brief-result').hidden=true;quoteStatus.textContent='';
    dialog.showModal();
  }
  $('quote-button').onclick=()=>openRequest('quote');
  document.addEventListener('vox:meeting',()=>openRequest('meeting'));
  document.addEventListener('vox:services',()=>{if(active){clearEngine();updateCaption()}});
  $('close-quote').onclick=()=>dialog.close();
  dialog.onclick=e=>{if(e.target===dialog)dialog.close()};
  $('quote-form').onsubmit=e=>{
    e.preventDefault();
    const about=$('project').value.trim();
    if(!about){$('project').focus();quoteStatus.textContent='Enter a short description before preparing your request.';return;}
    const deadline=$('deadline').value.trim()||'Flexible';
    const meeting=requestMode==='meeting', voiceRef=describeSelection(true);
    const brief=['Hello VOX ET VERITAS,','',meeting?'I’d like to arrange a virtual meeting to discuss this project:':'I’d like a quote for this project:',about,'','Project language: '+$('quote-language').value,'Target delivery: '+deadline,...(voiceRef?[voiceRef]:[]),'','Thank you.'].join('\n');
    $('prepared-brief').value=brief;
    $('email-draft').href='mailto:jnichols@voxetveritas.com?subject='+encodeURIComponent(meeting?'VOX · Virtual meeting request':'VOX · Quote request')+'&body='+encodeURIComponent(brief);
    $('brief-result').hidden=false;
    quoteStatus.textContent='Brief ready. Nothing has been sent.';
    $('prepared-brief').focus();
  };
  $('copy-brief').onclick=async()=>{
    const box=$('prepared-brief');
    try{await navigator.clipboard.writeText(box.value);quoteStatus.textContent='Brief copied.';}
    catch{box.focus();box.select();quoteStatus.textContent='Use your device’s Copy command.';}
  };
  const decorativeQuill=$('studio-quill');
  if(decorativeQuill){
    const motion=matchMedia('(prefers-reduced-motion: reduce)');
    const syncMotion=()=>{
      if(motion.matches){decorativeQuill.pause();decorativeQuill.currentTime=0}
      else decorativeQuill.play().catch(()=>{});
    };
    motion.addEventListener('change',syncMotion);
    syncMotion();
  }
  render();refreshDock();
})();
