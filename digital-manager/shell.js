const pages = [['Home','index.html'],['My Work','work.html'],['My Game','game.html'],['My Webs','webs.html']];
const filename = location.pathname.split('/').pop() || 'index.html';
function mastMarkup(){
  return '<a class="skip" href="#main">Skip to content</a><div class="nav-inner"><a class="brand" href="./" aria-label="Axel Cruz, home"><img src="assets/fentec.svg" alt="" width="33" height="34"><span>Axel Cruz</span></a><nav aria-label="Main navigation">' + pages.map(([name,path]) => '<a href="'+path+'"'+(filename===path?' aria-current="page"':'')+'>'+name+'</a>').join('')+'</nav></div>';
}
const mast = document.getElementById('mast');
if(mast && !mast.querySelector('nav')) mast.innerHTML = mastMarkup();
const foot = document.querySelector('#foot');
if(foot) foot.innerHTML = '<div class="footer-inner"><a class="brand" href="./"><img src="assets/fentec.svg" width="27" height="28" alt="">Axel Cruz</a><span>Mexico City · English / Spanish</span><div><a href="mailto:axelcruzmachado@gmail.com">Email</a><a href="https://www.linkedin.com/in/axeldanielcruzmachado">LinkedIn</a><a href="assets/Axel-Cruz-Resume.pdf" download>Résumé PDF</a></div></div>';
