'use strict';
const gameTeams=[
 {id:'engineering',name:'Engineering',color:'#2e557c',light:'#85bace',icon:'<path d="m17 16-9 8 9 8m14-16 9 8-9 8M28 11l-8 26"/>',title:'Good systems start with shared understanding.',intro:'I connect client needs with engineering work: requirements, dependencies, estimates, QA and releases.',actions:['Make scope, API dependencies and acceptance criteria explicit.','Coordinate backend, frontend, web and native mobile specialists.','Keep trade-offs and client decisions visible through release and support.'],proof:'Hino LMS · 2,000+ users / 38 dealers',case:'hino',route:'#systems/hino/architecture',cta:'EXPLORE THE ARCHITECTURE',reason:'Engineering implements system behaviour and integrations.'},
 {id:'design',name:'Design',color:'#b94a40',light:'#efaa96',icon:'<path d="M12 12h24v24H12zM16 31l7-15 9 15M19 26h10"/><rect x="8" y="8" width="7" height="7"/><rect x="33" y="33" width="7" height="7"/>',title:'A clear experience. A strong point of view.',intro:'I connect UX/UI, branding and business needs so creative intent survives implementation and review.',actions:['Translate the need into a useful brief and a clear user journey.','Connect designers with implementation constraints and stakeholder feedback.','Protect consistency, review quality and actionable decisions.'],proof:'Kia Sales Enablement · 170+ national training materials',case:'kia',route:'#client/kia',cta:'SEE DESIGN THROUGH DELIVERY',reason:'Design shapes the user journey, interface and visual decisions.'},
 {id:'content',name:'Content',color:'#ad7d37',light:'#ecd096',icon:'<path d="M12 7h19l7 8v26H12zM30 7v10h8M18 23h14M18 29h14M18 35h8"/>',title:'Make the story useful to someone.',intro:'I connect source material, narrative, audience needs and review so a message becomes usable content.',actions:['Clarify audience, objective and the information a piece must carry.','Coordinate writers, content creators and subject-matter reviewers.','Keep the narrative clear across scripts, courses and communications.'],proof:'KPMG · recurring enterprise communications',case:'kpmg',route:'#client/kpmg',cta:'EXPLORE THE CONTENT CASE',reason:'Content specialists shape scripts, editorial material and the message.'},
 {id:'production',name:'Production',color:'#ba703f',light:'#edac78',icon:'<rect x="6" y="13" width="36" height="28" rx="3"/><path d="M7 22h34M13 8l6 8m3-8 6 8m3-8 6 8m-17 11 10 5-10 5z"/>',title:'From the first version to the final cut.',intro:'I coordinate creative production across the people, inputs, versions and approvals needed to finish the work.',actions:['Make preproduction inputs, responsibilities and review cycles clear.','Connect video, audio, animation, VFX, design and content workstreams.','Track scope, quality, client decisions and final delivery requirements.'],proof:'Kia Sales Enablement · video, animation, infographics and presentations',case:'kia',route:'#delivery',cta:'FOLLOW A DELIVERY',reason:'Production turns approved material into the final audiovisual piece.'},
 {id:'quality',name:'QA',color:'#4f6c45',light:'#a8c183',icon:'<path d="m24 5 16 7v11c0 9-8 15-16 20C16 38 8 32 8 23V12z"/><path d="m15 24 7 7 13-15"/>',title:'Check the result against the need.',intro:'I connect requirements, specialist testing and client acceptance, with clear issue priorities and follow-through.',actions:['Turn requirements into testable acceptance criteria.','Coordinate QA/UAT, defects, specialist fixes and verification.','Keep release readiness and operational follow-up visible.'],proof:'Hino + Edenred · documented 14-day service restoration',case:'recovery',route:'#client/recovery',cta:'EXPLORE THE RECOVERY CASE',reason:'QA checks the build against the agreed acceptance criteria.'},
 {id:'people',name:'HR',color:'#ebe9df',light:'#fff9ee',icon:'<circle cx="24" cy="15" r="6"/><path d="M12 40v-5c0-7 5-11 12-11s12 4 12 11v5"/><circle cx="8" cy="20" r="4"/><circle cx="40" cy="20" r="4"/><path d="M3 37v-5c0-3 2-6 5-6m37 11v-5c0-3-2-6-5-6"/>',title:'Help specialists find the right place.',intro:'I support HR with project and role context, respecting the expertise behind recruiting and candidate experience.',actions:['Contribute specialist context to CV reviews, assessments and interviews.','Connect staffing needs with project requirements and team readiness.','Bring founder experience at Fentec and direct HR/operations experience at TOCA.'],proof:'TOCA · recruitment, onboarding and growth from 3 to 50+ agents',case:null,route:'#team/hiring',cta:'MEET YOUR TEAMMATE',reason:'HR connects role requirements with candidates, interviews and hiring coordination.'},
 {id:'enablement',name:'Enablement / Training',color:'#e7c84f',light:'#fff0a0',icon:'<path d="M24 15c-5-4-11-5-18-3v24c7-2 13-1 18 3 5-4 11-5 18-3V12c-7-2-13-1-18 3v24"/><path d="M12 20h6m-6 6h6M29 29l5-7 4 2"/><circle cx="34" cy="8" r="3"/>',title:'From learning goals to readiness in the field.',intro:'I connect training and enablement goals with learning content, digital platforms and the operational conditions people need to use them.',actions:['Connect learning needs and job tasks with learning paths, practice and assessment criteria.','Coordinate instructional designers, subject-matter experts, content production and LMS specialists with training stakeholders.','Make rollout readiness, learner access, reporting and support clear.'],proof:'Hino / Edenred · platforms supporting 2,000+ / 5,000+ users',case:'hino',route:'#systems/hino',cta:'EXPLORE THE LEARNING PLATFORM',reason:'Enablement / Training defines learning objectives, learning paths, practice and the readiness a programme needs to support.'},
 {id:'data',name:'Data',color:'#3b887f',light:'#a3d5c3',icon:'<path d="M7 7v34h35M16 34V23M26 34V12M36 34V18"/><circle cx="36" cy="10" r="2"/>',title:'A useful metric starts with a question.',intro:'I connect reporting needs, definitions and operational decisions. A number needs context before it becomes a recommendation.',actions:['Clarify the question, denominator and relevant comparison.','Connect training and platform reporting with stakeholder needs.','Separate observed outcomes, assumptions and possible causes.'],proof:'Synthetic cohort example · completion, assessment and interpretation',case:null,route:'#systems/analytics',cta:'EXPLORE THE ANALYTICS LAB',reason:'Data specialists prepare reports and definitions that support a decision.'}
];
const taskDeck=[
 {text:'Run the acceptance tests on the new Android build.',team:'quality'},
 {text:'Implement the password-reset endpoint.',team:'engineering'},
 {text:'Design the mobile onboarding screens.',team:'design'},
 {text:'Write the voice-over script for a training video.',team:'content'},
 {text:'Edit the approved footage into a 30-second video.',team:'production'},
 {text:'Schedule interviews with the shortlisted developers.',team:'people'},
 {text:'Prepare a report of course completion by dealer.',team:'data'},
 {text:'Test SCORM score tracking before the release.',team:'quality'},
 {text:'Map the checkout experience before development.',team:'design'},
 {text:'Connect the CRM API to the learning platform.',team:'engineering'},
 {text:'Review the CVs received for the video-editor role.',team:'people'},
 {text:'Clean the source data for the monthly dashboard.',team:'data'},
 {text:'Mix the narration and music for the final video.',team:'production'},
 {text:'Define the learning objectives for a technical course.',team:'enablement'},
 {text:'Map the learning path for new aftersales advisors.',team:'enablement'},
 {text:'Write the launch announcement for the new platform.',team:'content'}
];
const taskCard=$('#task-card'),specialtyModal=$('#specialty-modal');
let taskIndex=0,taskNumber=1,connections=0,roundErrors=0,roundNumber=1,roundWon=false,roundResetting=false,reminderEarned=false,currentTask={...taskDeck[0]},taskLocked=false,taskSelected=false,nextTimer=0,resetTimer=0,drag=null,ignoreTaskClickUntil=0,activeArea=null,returnTarget=null;
const rewardModal=$('#reward-modal'),supportModal=$('#support-modal');
$('#correct-blocks').innerHTML=Array.from({length:10},()=>'<i></i>').join('');
$('#error-blocks').innerHTML=Array.from({length:3},()=>'<i></i>').join('');
function boxSVG(t){
 const id='box-'+t.id;
 return '<svg class="artifact-svg" viewBox="0 0 160 160" aria-hidden="true"><defs><linearGradient id="'+id+'-face" x1="0" y1="0" x2="1" y2="1"><stop stop-color="'+t.light+'"/><stop offset=".32" stop-color="'+t.color+'"/><stop offset="1" stop-color="'+t.color+'"/></linearGradient><linearGradient id="'+id+'-top"><stop stop-color="'+t.light+'"/><stop offset="1" stop-color="'+t.color+'"/></linearGradient><radialGradient id="'+id+'-halo"><stop stop-color="'+t.color+'" stop-opacity=".28"/><stop offset="1" stop-color="'+t.color+'" stop-opacity="0"/></radialGradient></defs><ellipse class="artifact-floor" cx="82" cy="140" rx="56" ry="9"/><circle class="artifact-halo" cx="80" cy="80" r="73" fill="url(#'+id+'-halo)"/><g class="artifact-solid"><path class="artifact-side-face" d="m119 45 23-12v85l-23 16z" fill="'+t.color+'"/><path class="artifact-top-face" d="m24 31 25-14 93 16-23 15z" fill="url(#'+id+'-top)"/><path class="artifact-front-face" d="m24 31 95 17v86l-95-18z" fill="url(#'+id+'-face)"/><path class="artifact-edge" d="m24 31 95 17 23-15M119 48v86"/><path class="artifact-inset" d="m34 45 74 13v61l-74-14z"/><g class="specialty-glyph" transform="translate(41 54) matrix(1 .17 0 1 0 0) scale(1.28)" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+t.icon+'</g><path class="artifact-ridge" d="m31 35 79 14"/></g><g class="success-mark"><circle cx="126" cy="30" r="15"/><path d="m119 30 5 5 9-10"/></g></svg>';
}
$('#task-teams').innerHTML=gameTeams.map(function(t,i){return '<button type="button" class="team-artifact area-'+t.id+'" data-drop-team="'+t.id+'" aria-label="Explore '+t.name+'" aria-haspopup="dialog" aria-expanded="false" style="--area-color:'+t.color+';--area-light:'+t.light+';--idle-delay:'+(-i*.65)+'s"><span class="artifact-object">'+boxSVG(t)+'</span><span class="artifact-meta"><span class="artifact-number">0'+(i+1)+'</span><span class="artifact-name">'+(t.id==='enablement'?'Enablement<small>/ Training</small>':t.name)+'</span><span class="artifact-arrow" aria-hidden="true">↗</span></span><span class="artifact-action">EXPLORE SPECIALTY</span></button>';}).join('');
function setSelected(selected){
 taskSelected=selected&&!taskLocked;taskCard.setAttribute('aria-pressed',String(taskSelected));taskCard.classList.toggle('task-selected',taskSelected);$('.command-app').classList.toggle('assign-mode',taskSelected);
 $$('.team-artifact').forEach(function(b){const a=gameTeams.find(function(t){return t.id===b.dataset.dropTeam;});b.setAttribute('aria-label',(taskSelected?'Assign selected task to ':'Explore ')+a.name);if(taskSelected)b.removeAttribute('aria-haspopup');else b.setAttribute('aria-haspopup','dialog');});
 $('#task-access').textContent=taskSelected?'TASK SELECTED · Choose its team. Escape cancels.':'Drag to assign. Or select the task, then choose a team.';
}
function setTask(task,fromAI){clearTimeout(nextTimer);currentTask={...task};taskLocked=false;taskCard.disabled=false;setSelected(false);$('#task-text').textContent=task.text;$('#task-count').textContent=String(taskNumber).padStart(2,'0');$('#game-mode').textContent=fromAI?'ON-DEVICE AI / MODEL-SUGGESTED TEAM':'';taskCard.classList.remove('task-delivered','task-arriving');void taskCard.offsetWidth;taskCard.classList.add('task-arriving');}
function nextTask(){if(roundResetting||roundWon)return;taskIndex=(taskIndex+1)%taskDeck.length;taskNumber++;setTask(taskDeck[taskIndex],false);}
function updateProgress(){
 $('#connection-count').textContent=connections+' / 10';$('#error-count').textContent=roundErrors+' / 3';
 $('#correct-blocks').setAttribute('aria-label',connections+' of 10 correct connections');$('#error-blocks').setAttribute('aria-label',roundErrors+' of 3 errors');
 $$('#correct-blocks i').forEach((el,i)=>el.classList.toggle('filled',connections>i));$$('#error-blocks i').forEach((el,i)=>el.classList.toggle('filled',roundErrors>i));
 $('#earned-reminder').hidden=!reminderEarned;
 $('#game-continue').hidden=!reminderEarned;$('#next-task').textContent=roundWon?'NEW ROUND ↻':'NEXT TASK ↻';
 $('#next-task').disabled=roundResetting;$('#ai-task').disabled=roundWon||roundResetting;
}
function screenReaction(kind,box){
 const layer=$('#screen-reaction'),r=box?.getBoundingClientRect();
 layer.style.setProperty('--reaction-x',(r?r.left+r.width/2:innerWidth/2)+'px');layer.style.setProperty('--reaction-y',(r?r.top+r.height/2:innerHeight/2)+'px');
 layer.className='screen-reaction';void layer.offsetWidth;layer.classList.add('react-'+kind);
 document.body.classList.remove('answer-correct','answer-incorrect');void document.body.offsetWidth;document.body.classList.add(kind==='correct'?'answer-correct':kind==='incorrect'?'answer-incorrect':'answer-win');
}
function resetRound(){
 clearTimeout(nextTimer);clearTimeout(resetTimer);roundNumber++;connections=0;roundErrors=0;roundWon=false;roundResetting=false;taskIndex=0;taskNumber=1;
 document.body.classList.remove('simulator-won','answer-correct','answer-incorrect','answer-win');$('#screen-reaction').className='screen-reaction';
 updateProgress();setTask(taskDeck[0],false);$('#task-feedback').textContent='New round. Find the main team for each task.';
}
function winRound(){
 clearTimeout(nextTimer);roundWon=true;reminderEarned=true;document.body.classList.add('simulator-won');screenReaction('win');updateProgress();
 $('.play-handoff').classList.add('handoff-ready');$('#handoff-eyebrow').textContent='YOU’VE CONNECTED THE WORK. NOW MEET YOUR TEAMMATE.';
 $('#handoff-title').innerHTML='You’ve met the teams.<br><em>Now meet Axel.</em>';
 $('#task-feedback').innerHTML='<b>Well played. 10 connections.</b> Don’t forget what matters most: TEAM.';
 rewardModal.showModal();
}
function assignTask(id){
 if(taskLocked||roundWon||roundResetting)return;const area=gameTeams.find(function(t){return t.id===id;}),box=$('[data-drop-team="'+id+'"]');
 if(!area||!box)return;
 box.classList.remove('artifact-success','artifact-nudge');void box.offsetWidth;
 if(id===currentTask.team){taskLocked=true;connections++;taskCard.disabled=true;setSelected(false);taskCard.classList.add('task-delivered');box.classList.add('artifact-success');screenReaction('correct',box);$('#task-feedback').innerHTML='<b>Connected with '+esc(area.name)+'.</b> '+esc(area.reason);updateProgress();if(connections===10)winRound();else nextTimer=setTimeout(nextTask,1800);}
 else{
  roundErrors++;setSelected(false);box.classList.add('artifact-nudge');screenReaction('incorrect',box);updateProgress();
  if(roundErrors===3){roundResetting=true;taskLocked=true;taskCard.disabled=true;updateProgress();$('#task-feedback').innerHTML='<b>Let’s regroup.</b> Try again, or get a little PM backup.';resetTimer=setTimeout(()=>{if($('#game-dialog').open&&!supportModal.open)supportModal.showModal();else resetRound();},600);}
  else{$('#task-feedback').innerHTML='<b>Try another team.</b> '+esc(area.reason)+' '+(3-roundErrors)+' '+(roundErrors===1?'errors':'error')+' before the round restarts.';}
 }
}
$('#task-teams').addEventListener('click',function(e){const b=e.target.closest('[data-drop-team]');if(!b)return;if(taskSelected)assignTask(b.dataset.dropTeam);else openSpecialty(b.dataset.dropTeam,b);});
$('#next-task').addEventListener('click',function(){if(roundWon){resetRound();return;}nextTask();$('#task-feedback').textContent='A fresh task. Find its team, or open a specialty to explore.';});
function closeReward(){if(rewardModal.open)rewardModal.close();$('#earned-reminder').focus({preventScroll:true});}
$('#earned-reminder').addEventListener('click',()=>{if(!rewardModal.open)rewardModal.showModal();});
$('#close-reward').addEventListener('click',closeReward);$('#reward-next').addEventListener('click',closeReward);$('#reward-replay').addEventListener('click',()=>{closeReward();resetRound();taskCard.focus({preventScroll:true});});
rewardModal.addEventListener('cancel',e=>{e.preventDefault();closeReward();});rewardModal.addEventListener('click',e=>{if(e.target===rewardModal)closeReward();});
function closeSupport(focusTask=true){if(supportModal.open)supportModal.close();resetRound();if(focusTask&&$('#game-dialog').open)taskCard.focus({preventScroll:true});}
$('#support-retry').addEventListener('click',()=>closeSupport());$('#close-support').addEventListener('click',()=>closeSupport());$('#support-contact').addEventListener('click',()=>closeSupport(false));
supportModal.addEventListener('cancel',e=>{e.preventDefault();closeSupport();});supportModal.addEventListener('click',e=>{if(e.target===supportModal)closeSupport();});
window.addEventListener('command-route',e=>{if(e.detail.page!=='home'){if(rewardModal.open)rewardModal.close();if(supportModal.open)closeSupport(false);$('#screen-reaction').className='screen-reaction';}});
updateProgress();
taskCard.addEventListener('pointerdown',function(e){if(taskLocked||e.button!==0)return;drag={x:e.clientX,y:e.clientY,moved:false};taskCard.setPointerCapture(e.pointerId);taskCard.classList.add('task-held');});
taskCard.addEventListener('pointermove',function(e){if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.hypot(dx,dy)>7)drag.moved=true;if(!drag.moved)return;taskCard.style.transform='translate3d('+dx+'px,'+dy+'px,0) rotate('+Math.max(-5,Math.min(5,dx/45))+'deg)';$$('.team-artifact').forEach(function(b){const r=b.getBoundingClientRect();b.classList.toggle('drop-target',e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom);});$('.command-app').classList.add('drag-active');});
function finishDrag(e,cancelled){if(!drag)return;const moved=drag.moved;drag=null;if(moved)ignoreTaskClickUntil=performance.now()+350;taskCard.classList.remove('task-held');taskCard.style.transform='';$('.command-app').classList.remove('drag-active');let target=null;$$('.team-artifact').forEach(function(b){const r=b.getBoundingClientRect();if(e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom)target=b.dataset.dropTeam;b.classList.remove('drop-target');});if(moved&&target&&!cancelled)assignTask(target);else if(moved&&!cancelled)$('#task-feedback').textContent='Bring the task to a box, or select the task and then its team.';}
taskCard.addEventListener('pointerup',function(e){finishDrag(e,false);});taskCard.addEventListener('pointercancel',function(e){finishDrag(e,true);});
taskCard.addEventListener('click',function(){if(performance.now()<ignoreTaskClickUntil||taskLocked)return;setSelected(!taskSelected);$('#task-feedback').textContent=taskSelected?'Choose the team responsible for this task.':'Task selection cancelled. Click a box to explore.';});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!specialtyModal.open&&taskSelected)setSelected(false);});
function openSpecialty(id,origin){
 const a=gameTeams.find(function(t){return t.id===id;});if(!a)return;clearTimeout(nextTimer);const wasOpen=specialtyModal.open;returnTarget=returnTarget||origin;activeArea=a;
 const r=origin.getBoundingClientRect(),from={x:r.x+r.width/2,y:r.y+r.height*.4};
 $$('.team-artifact').forEach(function(b){b.setAttribute('aria-expanded',String(b.dataset.dropTeam===id));b.classList.toggle('is-channeling',b.dataset.dropTeam===id);});
 specialtyModal.style.setProperty('--specialty',a.color);specialtyModal.style.setProperty('--specialty-light',a.light);specialtyModal.dataset.area=id;
 $('#specialty-code').textContent='SPECIALTY / 0'+(gameTeams.indexOf(a)+1)+' / '+a.name.toUpperCase();
 $('#specialty-copy').innerHTML='<p class="eyebrow">HOW WE WORK TOGETHER</p><h2 id="specialty-title">'+esc(a.name)+'.</h2><h3>'+esc(a.title)+'</h3><p>'+esc(a.intro)+'</p><ul>'+a.actions.map(function(x){return '<li>'+esc(x)+'</li>';}).join('')+'</ul><div class="specialty-proof">'+esc(a.proof)+'</div><a class="button specialty-cta" href="'+a.route+'" data-specialty-exit>'+esc(a.cta)+' <span>↗</span></a>'+(a.case?'<a class="text-link specialty-case" href="#client/'+a.case+'" data-specialty-exit>Open the project evidence ↗</a>':'');
 if(!wasOpen)specialtyModal.showModal();specialtyModal.classList.remove('energy-arriving');void specialtyModal.offsetWidth;specialtyModal.classList.add('energy-arriving');startSpecialtyEnergy(a,wasOpen?null:from);
}
function closeSpecialty(){stopSpecialtyEnergy();if(specialtyModal.open)specialtyModal.close();$$('.team-artifact').forEach(function(b){b.classList.remove('is-channeling');b.setAttribute('aria-expanded','false');});activeArea=null;const target=returnTarget;returnTarget=null;if(target&&document.contains(target))target.focus({preventScroll:true});if(taskLocked)nextTimer=setTimeout(nextTask,900);}
$('#close-specialty').addEventListener('click',closeSpecialty);$('#specialty-return').addEventListener('click',closeSpecialty);
specialtyModal.addEventListener('cancel',function(e){e.preventDefault();closeSpecialty();});
specialtyModal.addEventListener('click',function(e){if(e.target===specialtyModal||e.target.closest('[data-specialty-exit]'))closeSpecialty();});
window.addEventListener('command-route',function(e){if(e.detail.page!=='home'&&specialtyModal.open)closeSpecialty();});
function updateGameAI(){if(typeof localAIAvailable!=='undefined'&&localAIAvailable){$('#ai-task').hidden=false;$('.game-bottom').hidden=false;}}
window.addEventListener('axel-ai-ready',updateGameAI);updateGameAI();
$('#ai-task').addEventListener('click',async function(){
 if(roundWon||roundResetting)return;
 const button=$('#ai-task');button.disabled=true;button.textContent='MAKING A NEW CONNECTION…';let session;
 try{session=await globalThis.LanguageModel.create({...aiOptions,initialPrompts:[{role:'system',content:'Create one short workplace task for a team-matching game. Return only JSON with keys task and team. Allowed teams: engineering (software implementation), design (UX/UI or branding), content (writing and editorial materials), production (video/audio), quality (testing/QA), people (HR/recruitment), enablement (training needs, learning objectives, learning paths and readiness), data (analytics/reporting). Use one unambiguous owner. Task must be specific, actionable, under 100 characters, and not name its team. No real clients or claims about Axel.'}]});const controller=new AbortController(),timer=setTimeout(function(){controller.abort();},20000);let output;try{output=await session.prompt('Create one task.',{signal:controller.signal});}finally{clearTimeout(timer);}const match=output.match(/\{[\s\S]*\}/),item=JSON.parse(match?match[0]:output);if(typeof item.task!=='string'||item.task.length>120||!gameTeams.some(function(t){return t.id===item.team;}))throw Error('Invalid task');taskNumber++;setTask({text:item.task,team:item.team},true);$('#task-feedback').textContent='Generated on-device. The suggested team is also part of the model output.';}
 catch{nextTask();$('#task-feedback').textContent='On-device AI could not create a task. Here is a curated one.';}
 finally{if(session)session.destroy();button.disabled=false;button.textContent='MAKE AN ON-DEVICE AI TASK ✦';}
});
