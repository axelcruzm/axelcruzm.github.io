const dialog = document.getElementById('case-dialog');
const caseIndex = new Map(portfolio.cases.map(c=>[c.id,c]));
const groups = new Map(portfolio.expertise.map(g=>[g.id,g]));
function showCases(title, ids, metric) {
  const section = document.createDocumentFragment();
  for(const id of ids){
    const c = caseIndex.get(id);
    if(!c) continue;
    const row=document.createElement('article');
    row.className='case-row';
    row.innerHTML='<figure class="case-pic"><img alt=""></figure><div class="case-text"><h3></h3><strong></strong><p class="unit"></p><p class="story"></p></div>';
    row.querySelector('img').src=c.asset;
    if(/(brand.webp|fentec.svg)$/.test(c.asset)) row.querySelector('figure').classList.add('logo-pic');
    row.querySelector('h3').textContent=c.name;
    row.querySelector('strong').textContent=metric?.value ?? c.value;
    row.querySelector('.unit').textContent=metric?.unit ?? c.unit;
    row.querySelector('.story').textContent=c.story;
    if (c.link) {
      const link = document.createElement('a');
      link.href = c.link.href;
      link.textContent = c.link.label;
      link.className = 'case-link';
      row.querySelector('.case-text').append(link);
    }
    section.append(row);
  }
  dialog.querySelector('.case-body').replaceChildren(section);
  dialog.querySelector('h2').textContent=title;
  dialog.showModal();
  dialog.scrollTop=0;
}
if(dialog){
  document.addEventListener('click',event=>{
    const target=event.target.closest('[data-expertise],[data-case]');
    if(!target) return;
    const group=groups.get(target.dataset.expertise);
    const project=caseIndex.get(target.dataset.case);
    if(group) showCases(group.label,group.cases);
    else if(project){
      const metric=target.matches('.result') ? {value:target.querySelector('strong').textContent,unit:target.querySelector('span').textContent} : null;
      showCases(project.name,[project.id],metric);
    }
  });
  dialog.querySelector('.close-dialog').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{
    if(event.target!==dialog) return;
    const r=dialog.getBoundingClientRect();
    if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom) dialog.close();
  });
}
