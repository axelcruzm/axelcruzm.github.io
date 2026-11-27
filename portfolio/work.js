const resultList=document.getElementById('results');
const filterButtons=[...document.querySelectorAll('[data-filter]')];
for(const button of filterButtons){
  button.addEventListener('click',()=>{
    const filter=portfolio.filters.find(f=>f.id===button.dataset.filter);
    if(!filter) return;
    filterButtons.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    const template=resultList.firstElementChild;
    const fragment=document.createDocumentFragment();
    for(const metric of filter.items){
      const card=template.cloneNode(true);
      card.dataset.case=metric.case;
      card.querySelector('use').setAttribute('href','assets/icons.svg#'+metric.icon);
      card.querySelector('strong').textContent=metric.value;
      card.querySelector('span').textContent=metric.label;
      card.querySelector('p').textContent=metric.detail;
      fragment.append(card);
    }
    resultList.replaceChildren(fragment);
    resultList.classList.remove('change');
    requestAnimationFrame(()=>resultList.classList.add('change'));
    document.getElementById('filter-status').textContent='Showing five achievements in '+filter.label+'.';
  });
}

// Shared case links open the same details as the two compact controls.
function openLinkedCase() {
  if (['#hino-recovery', '#costco-projects'].includes(location.hash)) {
    document.getElementById(location.hash.slice(1))?.click();
  }
}
window.addEventListener('hashchange',openLinkedCase);
window.addEventListener('load',openLinkedCase,{once:true});
