(() => {
  'use strict';
  // Set to VOX's approved Google appointment schedule (or another hosted booking page).
  const BOOKING_URL='';
  const founder={src:'jhoana-nichols.jpg',alt:'Portrait of Jhoana Nichols, founder of Vox et Veritas',kind:'portrait'};
  const services=[
    {title:'Writing',summary:'Turn an idea into a script that sounds natural out loud and gives the audience a reason to listen.',
      facts:[['You bring','Your goal, audience and anything already on the page.'],['We shape','The message, structure and voice for the format.'],['You get','A script ready to review and take into production.']],media:{src:'writing.png',kind:'art'}},
    {title:'Editing',summary:'Keep what makes the writing yours. Tighten what gets in the way.',
      facts:[['We refine','Structure, clarity, rhythm and consistency.'],['We check','Grammar, tone and how the copy reads aloud.'],['You get','A polished text that keeps your point of view.']],media:{src:'editing.png',kind:'art'}},
    {title:'Translation',summary:'Carry the meaning, tone and intent across Spanish and English so the message feels at home in both.',
      facts:[['We adapt','Idioms, cultural references and phrasing for the audience.'],['For audio','We check how the translated script reads and sounds.'],['You get','A script ready for review, recording or publication.']],media:{src:'translation.png',kind:'art'}},
    {title:'Audio Production',summary:'Take your script from the right voice to a finished track in Spanish, English or both.',
      facts:[['Before recording','Cast and direct the voice to fit the brief.'],['In the studio','Record the read and agreed variations.'],['Before delivery','Edit, mix and check the final audio for its intended use.']],media:founder},
    {title:'Let’s talk.',summary:'Tell us what you’re making and where you need a hand. We’ll figure out the next step together.',
      facts:[],media:{src:'assets/vox-mark.png',alt:'',kind:'seal'}}
  ];
  const $=id=>document.getElementById(id);
  const dialog=$('services-dialog'), book=$('service-book');
  let index=0;
  function render(){
    const last=index===services.length-1, service=services[index];
    $('service-title').textContent=service.title;
    $('service-index').textContent=last?'VOX ET VERITAS / STUDIO':'VOX SERVICES';
    $('service-summary').textContent=service.summary;
    const data=$('service-data');
    data.replaceChildren(...service.facts.map(([name,copy])=>{
      const row=document.createElement('div'), term=document.createElement('dt'), value=document.createElement('dd');
      term.textContent=name;value.textContent=copy;row.append(term,value);return row;
    }));
    const media=service.media, image=$('service-image');
    $('service-photo').dataset.media=media.kind;
    image.alt=media.alt??'';
    image.src=media.kind==='seal'?media.src:'services-media/'+media.src;
    $('service-caption').hidden=media.kind!=='portrait';
    $('service-prev').disabled=index===0;
    $('service-next').disabled=last;
    $('service-progress').textContent=String(index+1).padStart(2,'0')+' / '+String(services.length).padStart(2,'0');
    book.hidden=!last;book.textContent=BOOKING_URL?'Book a Virtual Meeting':'Request a Virtual Meeting';
    $('service-story').classList.remove('arriving');
    requestAnimationFrame(()=>$('service-story').classList.add('arriving'));
  }
  function step(dir){
    const next=index+dir;
    if(next<0||next>=services.length)return;
    index=next;render();$('service-title').focus({preventScroll:true});
  }
  for(const button of document.querySelectorAll('[data-service]')){
    button.onclick=()=>{
      document.dispatchEvent(new Event('vox:services'));
      index=Number(button.dataset.service);render();dialog.showModal();$('service-title').focus({preventScroll:true});
    };
  }
  $('service-prev').onclick=()=>step(-1);$('service-next').onclick=()=>step(1);
  $('close-services').onclick=()=>dialog.close();
  dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
  dialog.addEventListener('keydown',e=>{
    if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();step(e.key==='ArrowLeft'?-1:1)}
  });
  book.onclick=()=>{
    if(BOOKING_URL){
      window.open(BOOKING_URL,'_blank','noopener,noreferrer');
      return;
    }
    dialog.close();document.dispatchEvent(new Event('vox:meeting'));
  };
})();
