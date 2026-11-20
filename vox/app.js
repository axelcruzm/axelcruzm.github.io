/* VOX ET VERITAS / Interactive studio landing. No third-party tracking. */
(() => {
  'use strict';
  const colors={
    women:{en:['#477daa','#315b7c','#b6d0e0'],es:['#568ab1','#1e3a4c','#b2ccdf']},
    men:{en:['#426784','#213e53','#9bb9ce'],es:['#6d97b5','#2d506a','#c1d5e3']}
  };
  const services=[
    {title:'Writing',glyph:'✒',description:'Every memorable sound begins with language. We develop scripts that are clear, purposeful, and shaped for their audience — with the cadence and intention of spoken words in mind.'},
    {title:'Editing',glyph:'≋',description:'Precision brings a story into focus. We refine structure, rhythm, and language to give each message clarity before production begins.'},
    {title:'Translation',glyph:'A·Á',description:'Meaning matters as much as words. Our approach considers language, context, and cultural nuance across English and Spanish so the intended message stays intact.'},
    {title:'Audio Production',glyph:'◉',description:'From casting and direction to recording and post-production, sound is shaped with care. We connect the right performance with the technical finish a project deserves.'}
  ];
  const state={gender:'women',lang:'es',selected:null,service:0,requestType:'quote'};
  const $=s=>document.querySelector(s);
  const $$=s=>[...document.querySelectorAll(s)];
  function clamp(n){return Math.max(0,Math.min(255,Math.round(n)));}
  function shade(hex,m){const c=hex.replace('#','');return '#'+[0,2,4].map(i=>clamp(parseInt(c.slice(i,i+2),16)*m).toString(16).padStart(2,'0')).join('');}
  function bottleSVG(tone,key){
    const dark=shade(tone,.70),light=shade(tone,1.38);
    return [
      '<svg viewBox="0 0 220 245" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Low-poly ink bottle"><defs>',
      '<linearGradient id="glass-'+key+'" x1="0" y1="0" x2="1" y2="1"><stop stop-color="'+light+'"/><stop offset=".52" stop-color="'+tone+'"/><stop offset="1" stop-color="'+dark+'"/></linearGradient>',
      '<linearGradient id="cap-'+key+'" x1="0" y1="0" x2="1" y2=".9"><stop stop-color="#627c8d"/><stop offset=".5" stop-color="#1e3a4c"/><stop offset="1" stop-color="#132c3d"/></linearGradient>',
      '</defs><ellipse cx="109" cy="230" rx="79" ry="8" fill="#153448" opacity=".08"/>',
      '<path d="M70 57L149 57L170 86L191 110L193 208L179 221L41 221L27 208L29 110L50 85Z" fill="url(#glass-'+key+')" stroke="'+dark+'" stroke-opacity=".45"/>',
      '<path d="M29 111L51 86L74 60L63 122L48 215L40 221L27 208Z" fill="'+light+'" opacity=".55"/>',
      '<path d="M191 110L171 87L145 59L156 123L172 216L180 221L193 208Z" fill="'+dark+'" opacity=".76"/>',
      '<path d="M63 122L73 59L145 59L156 123L156 220L63 220Z" fill="'+tone+'" opacity=".24"/>',
      '<path d="M50 86L69 60L61 113L43 192L29 202L30 113Z" fill="'+light+'" opacity=".16"/>',
      '<path d="M72 59L89 65L77 117L64 125Z" fill="#fff" opacity=".13"/>',
      '<path d="M142 59L154 63L173 93L187 112L157 123Z" fill="'+dark+'" opacity=".43"/>',
      '<path d="M157 124L191 110L191 201L178 219L158 219Z" fill="'+dark+'" opacity=".32"/>',
      '<path d="M65 123L76 115L144 115L157 123L153 213L67 213Z" fill="'+light+'" opacity=".075"/>',
      '<path d="M30 112L51 91L62 112L52 210L29 206Z" fill="#fff" opacity=".075"/>',
      '<path d="M52 91L76 62L85 65L65 118L52 130Z" fill="#fff" opacity=".10"/>',
      '<path d="M86 65L107 70L107 119L79 122Z" fill="#eaf7ff" opacity=".065"/>',
      '<path d="M111 69L141 64L154 114L111 120Z" fill="#13364b" opacity=".07"/>',
      '<path d="M169 87L184 104L169 125L153 119Z" fill="#163247" opacity=".15"/>',
      '<path d="M28 201L45 214L50 220L40 220L29 209Z" fill="#102f48" opacity=".20"/>',
      '<path d="M31 112L57 89L72 59L146 59L169 85L189 110" stroke="#f0f8ff" stroke-width="2" stroke-opacity=".33" fill="none"/>',
      '<path d="M42 221L53 202L169 202L181 221Z" fill="'+dark+'" opacity=".4"/>',
      '<path d="M29 111L63 122H156L191 110" stroke="'+light+'" stroke-opacity=".55" fill="none"/>',
      '<path d="M74 57L74 43L146 43L146 57Z" fill="'+dark+'"/>',
      '<path d="M65 23L76 16L143 16L154 24L156 59L144 66L75 66L63 57Z" fill="url(#cap-'+key+')" stroke="#233a4b"/>',
      '<path d="M65 24L82 27L83 62L74 65L63 57Z" fill="#284456" opacity=".68"/>',
      '<path d="M85 28L94 28L94 65L85 65ZM110 28L119 28L119 65L110 65ZM136 27L145 25L145 63L136 65Z" fill="#102838" opacity=".26"/>',
      '<path d="M64 23L75 17L89 14L130 14L146 17L156 24L153 47L146 53L74 53L63 46Z" fill="#2e4758"/>',
      '<path d="M65 25L81 30L81 52L64 45Z" fill="#496375" opacity=".73"/>',
      '<path d="M81 30L94 27L94 53L81 52Z" fill="#2d495d"/>',
      '<path d="M94 27L112 27L112 53L94 53Z" fill="#213b4e"/>',
      '<path d="M112 27L133 26L133 53L112 53Z" fill="#294456"/>',
      '<path d="M133 26L146 29L146 52L133 53Z" fill="#213747"/>',
      '<path d="M146 29L156 24L153 47L146 52Z" fill="#102c3e"/>',
      '<path d="M64 23L76 17L90 13L130 13L145 17L156 24L145 28L131 30L89 30L74 27Z" fill="#345064" stroke="#1c3545" stroke-width=".7"/>',
      '<path d="M76 18L92 20L103 17L117 17L130 18L144 17L135 25L86 26Z" fill="#3e5868" opacity=".35"/>',
      '<path d="M76 53L89 58L132 58L147 53L143 62L76 62Z" fill="#172f40" opacity=".5"/>',
      '<path d="M66 35L81 40L143 39L153 35M66 47L81 51L143 50L154 47" stroke="#98b2c2" stroke-width="1.2" stroke-opacity=".16" fill="none"/>',
      '<path d="M76 64L84 69L140 69L146 64" stroke="'+dark+'" stroke-width="2" stroke-opacity=".5" fill="none"/>',
      '<path d="M68 127L152 126L156 196L65 198Z" fill="#172d3d" opacity=".13"/>',
      '<path d="M69 128L151 127L153 194L66 196Z" fill="#f8f7ed" stroke="#8d9b9f" stroke-width="2"/>',
      '<path d="M74 134L146 133L148 187L72 190Z" fill="none" stroke="#c4c1b4"/>',
      '<path d="M77 138L145 137" stroke="#fff" stroke-width="1.3" stroke-opacity=".8"/>',
      '<path d="M71 192L152 190" stroke="#9ea9a7" stroke-width=".7" stroke-opacity=".45"/>',
      '<path d="M76 145L76 177M144 143L145 177" stroke="#aeb9b7" stroke-width=".7" opacity=".4"/>',
      '<path d="M78 132L81 190" stroke="#fff" stroke-opacity=".75" stroke-width="2"/>',
      '<path d="M163 101L174 112L173 179" fill="none" stroke="#fff" stroke-width="4" stroke-opacity=".17"/></svg>'
    ].join('');
  }
  function toast(message){
    const t=$('#toast');t.textContent=message;t.classList.add('visible');
    clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove('visible'),3500);
  }
  function sampleId(i){
    const bucket=(state.gender==='women'?0:6)+(state.lang==='en'?0:3);
    return 'V'+String(bucket+i+1).padStart(2,'0');
  }
  function renderBottles(){
    const root=$('#bottles');root.replaceChildren();
    colors[state.gender][state.lang].forEach((tone,i)=>{
      const id=sampleId(i),wrap=document.createElement('div');
      wrap.className='ink-bottle'+(state.selected&&state.selected.id===id?' is-selected':'');
      wrap.dataset.tone=tone;
      wrap.dataset.voiceId=id;
      wrap.innerHTML=bottleSVG(tone,id)+
        '<button type="button" class="play-ink" aria-label="Play voice sample '+(i+1)+'" title="Listen to sample">▶</button>'+
        '<button type="button" class="select-ink" aria-label="Select voice '+(i+1)+'" aria-pressed="'+String(state.selected?.id===id)+'" title="Select voice">♢</button>';
      wrap.querySelector('.play-ink').addEventListener('click',()=>{
        // Official VOX audio is pending; never present a generated tone as authentic VOX talent.
        const audio=new Audio('assets/audio/'+id+'.mp3');
        if(window.__voxAudio)window.__voxAudio.pause();
        window.__voxAudio=audio;
        audio.addEventListener('error',()=>toast('This VOX voice sample is being prepared.'),{once:true});
        audio.play().catch(()=>toast('This VOX voice sample is being prepared.'));
      });
      wrap.querySelector('.select-ink').addEventListener('click',()=>{
        state.selected=state.selected?.id===id?null:{id,tone,gender:state.gender,lang:state.lang};
        renderBottles();updateSelection();
      });
      wrap.addEventListener('pointermove',e=>{
        if(e.pointerType==='touch')return;
        const r=wrap.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
        wrap.style.setProperty('--rot-y',(x*7).toFixed(2)+'deg');
        wrap.style.setProperty('--rot-x',(-y*5).toFixed(2)+'deg');
      });
      wrap.addEventListener('pointerleave',()=>{
        wrap.style.removeProperty('--rot-y');wrap.style.removeProperty('--rot-x');
      });
      root.appendChild(wrap);
    });
    window.dispatchEvent(new Event('vox:bottles-render'));
  }
  function updateSelection(){
    const b=$('#selected-voice'),choice=$('#request-choice'),item=state.selected;
    b.classList.toggle('filled',!!item);b.style.setProperty('--selection-color',item?.tone||'#2f6ea2');
    b.querySelector('span').textContent=item?'✓':'+';
    b.setAttribute('aria-label',item?'Selected voice '+item.id+'. Click to remove.':'No voice selected. Choose an ink bottle.');
    choice.hidden=!item;
    if(item){choice.style.setProperty('--selection-color',item.tone);$('#request-choice-copy').textContent='Voice reference '+item.id+' · '+(item.lang==='es'?'Esp.':'Eng.');}
  }
  function letterCenter(el,i){
    const node=[...el.childNodes].find(n=>n.nodeType===Node.TEXT_NODE);if(!node)return null;
    const range=document.createRange();range.setStart(node,i);range.setEnd(node,i+1);
    const r=range.getBoundingClientRect();return r.left+r.width/2;
  }
  function alignTitle(){
    const h=$('#hero-title');h.style.setProperty('--offset','0px');
    const a=letterCenter($('[data-vox-word="voiceover"]'),2),b=letterCenter($('[data-vox-word="production"]'),7);
    if(a===null||b===null)return;
    const lim=Math.min(220,Math.max(40,innerWidth*.13));
    h.style.setProperty('--offset',Math.max(-lim,Math.min(lim,a-b)).toFixed(1)+'px');
  }
  function close(dialog){if(dialog.open)dialog.close();}
  function showService(index){
    state.service=index;const s=services[index];
    $('#service-title').textContent=s.title;$('#service-description').textContent=s.description;
    $('#service-glyph').textContent=s.glyph;$('#service-count').textContent='0'+(index+1)+' / 04';
    $('#service-next').textContent=index===3?'↗':'→';
    $('#service-next').setAttribute('aria-label',index===3?'Request a meeting':'Next service');
    if(!$('#service-modal').open)$('#service-modal').showModal();
  }
  function openRequest(type){
    state.requestType=type;close($('#service-modal'));
    $('#request-kicker').textContent=type==='meeting'?'VOX ET VERITAS / LET’S TALK':'VOX ET VERITAS / NEW PROJECT';
    $('#request-heading').textContent=type==='meeting'?'Request a Virtual Meeting':'What You have in mind';
    $('#copy-request').textContent=type==='meeting'?'Copy meeting request ↗':'Copy request ↗';
    $('#form-status').textContent='';updateSelection();
    if(!$('#request-modal').open)$('#request-modal').showModal();
  }
  $$('[data-gender]').forEach(b=>b.addEventListener('click',()=>{
    state.gender=b.dataset.gender;
    $$('[data-gender]').forEach(c=>c.setAttribute('aria-pressed',String(b===c)));renderBottles();
  }));
  $$('[data-lang]').forEach(b=>b.addEventListener('click',()=>{
    state.lang=b.dataset.lang;
    $$('[data-lang]').forEach(c=>c.setAttribute('aria-pressed',String(b===c)));renderBottles();
  }));
  $$('[data-service]').forEach(b=>b.addEventListener('click',()=>showService(Number(b.dataset.service))));
  $('#service-prev').addEventListener('click',()=>showService(Math.max(0,state.service-1)));
  $('#service-next').addEventListener('click',()=>state.service===3?openRequest('meeting'):showService(state.service+1));
  $('#meeting-open').addEventListener('click',()=>openRequest('meeting'));
  $('#quote-open').addEventListener('click',()=>openRequest('quote'));
  $('#selected-voice').addEventListener('click',()=>{
    if(state.selected){state.selected=null;updateSelection();renderBottles();}
    else toast('Choose a voice with the droplet beside an ink bottle.');
  });
  $('#clear-choice').addEventListener('click',()=>{state.selected=null;updateSelection();renderBottles();});
  $$('[data-close]').forEach(b=>b.addEventListener('click',()=>close(b.closest('dialog'))));
  $$('.dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d)close(d);}));
  $('#request-form').addEventListener('submit',async e=>{
    e.preventDefault();const d=new FormData(e.currentTarget);
    const lines=[
      'VOX ET VERITAS — '+(state.requestType==='meeting'?'Virtual Meeting':'Quote Request'),
      'Name: '+(d.get('name')||''),'Email: '+(d.get('email')||''),
      'Company: '+(d.get('company')||'—'),'Project type: '+(d.get('type')||'—')
    ];
    if(state.selected)lines.push('Voice reference: '+state.selected.id+' / '+state.selected.gender+' / '+state.selected.lang);
    lines.push('Project notes: '+(d.get('brief')||'—'));
    const text=lines.join('\n');
    try{await navigator.clipboard.writeText(text);$('#form-status').textContent='Request copied. It has not been sent to VOX.';}
    catch(err){$('#form-status').textContent='Copy unavailable here. Please copy your brief manually.';}
  });
  const v=$('#feather-video'),stage=$('.feather-stage');
  v.addEventListener('loadeddata',()=>{stage.classList.add('has-video');v.play().catch(()=>{});});
  v.addEventListener('error',()=>stage.classList.remove('has-video'));
  // Forty-five original pencil frames, 3 seconds, transparent VP9.
  (async function loadOriginalQuill(){
    try{
      const response=await fetch('assets/vox-feather-video.base64',{cache:'force-cache'});
      if(!response.ok)throw new Error('Media unavailable');
      const encoded=(await response.text()).trim();
      const data=Uint8Array.from(atob(encoded),char=>char.charCodeAt(0));
      if(data.length!==6580)throw new Error('Invalid animation size');
      v.src=URL.createObjectURL(new Blob([data],{type:'video/webm'}));
      v.load();
    }catch(error){stage.classList.remove('has-video');}
  })();
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){
    v.addEventListener('loadeddata',()=>{v.pause();v.currentTime=0;},{once:true});
  }
  window.addEventListener('resize',()=>requestAnimationFrame(alignTitle),{passive:true});
  document.fonts?.ready?.then(()=>requestAnimationFrame(alignTitle));
  renderBottles();updateSelection();requestAnimationFrame(alignTitle);
})();
