import { references } from './corpus.mjs';
import { MAX_FILE_BYTES, publicSources, indexSources, retrieve, readDocument, promptFor, displayAnswer } from './retrieval.mjs';

const copy = {
  en: {
    portfolio:'Portfolio', title:'Ask the case files.', intro:'Explore Axel’s projects, roles and skills. Each answer links back to a passage from his professional record.',
    ask:'Ask a question', placeholder:'What happened with Hino?', search:'Search', examples:'Example questions',
    samples:['How long did Hino’s recovery take?', 'How did the Costco work grow?', 'What tools did Axel use for KPMG?'],
    matches:'Source passages', sources:'Sources', choose:'Add a document', replace:'Replace document', remove:'Remove',
    fileHint:'TXT or MD, up to 100 KB. Stays in this tab.', fileType:'Choose a .txt or .md file.', fileSize:'Choose a file of 100 KB or less.',
    fileText:'This file must contain UTF-8 plain text.', fileEmpty:'This file has no readable text.', fileRead:'This file could not be read.',
    added:'Available in this tab.', removed:'Local document removed.', close:'Close source', previous:'Previous', next:'Next',
    localAnswer:'Local AI answer', modelInfo:'Optional. First use downloads about 95 MB of model weights, plus the runtime. Documents are processed on this device.',
    generate:'Load model & answer', generateAgain:'Generate answer', cancel:'Cancel', none:'No passage answers that question in the available sources.',
    unavailable:'Local generation is unavailable on this device. The matching source passages are shown above.',
    failed:'The local model could not run. You can still use the source passages or retry.',
    unsupported:'The model draft could not be verified. Showing the matching source.',
    loading:'Loading the model on this device…', generating:'Generating from the selected passages…', cancelled:'Generation cancelled.',
    generated:'Generated on this device. Quantities are checked against the source and formatted in your language.', passage:'Passage', of:'of', selected:'Source', processed:'Downloaded',
    enter:'Enter a question.', wait:'Processing...', references:'Evidence for this answer'
  },
  es: {
    portfolio:'Portafolio', title:'Pregunta a los casos.', intro:'Consulta los proyectos, la trayectoria y las herramientas de Axel. Cada respuesta te lleva al pasaje que la respalda.',
    ask:'Haz una pregunta', placeholder:'¿Qué ocurrió con Hino?', search:'Buscar', examples:'Preguntas de ejemplo',
    samples:['¿Cuánto duró el rescate de Hino?', '¿Cómo creció el trabajo con Costco?', '¿Qué herramientas usó Axel en KPMG?'],
    matches:'Pasajes de las fuentes', sources:'Fuentes', choose:'Agregar documento', replace:'Reemplazar documento', remove:'Quitar',
    fileHint:'TXT o MD, hasta 100 KB. Se conserva en esta pestaña.', fileType:'Elige un archivo .txt o .md.', fileSize:'Elige un archivo de hasta 100 KB.',
    fileText:'El archivo debe contener texto UTF-8.', fileEmpty:'El archivo no contiene texto legible.', fileRead:'No se pudo leer el archivo.',
    added:'Disponible en esta pestaña.', removed:'Documento local retirado.', close:'Cerrar fuente', previous:'Anterior', next:'Siguiente',
    localAnswer:'Respuesta con IA local', modelInfo:'Opcional. El primer uso descarga unos 95 MB de pesos del modelo, más el motor. Los documentos se procesan en este dispositivo.',
    generate:'Cargar modelo y responder', generateAgain:'Generar respuesta', cancel:'Cancelar', none:'Ningún pasaje de las fuentes disponibles responde esa pregunta.',
    unavailable:'La generación local no está disponible en este dispositivo. Arriba puedes consultar los pasajes de las fuentes.',
    failed:'El modelo local no pudo ejecutarse. Puedes usar los pasajes o volver a intentarlo.',
    unsupported:'La respuesta generada no pudo verificarse. Se muestra el pasaje de la fuente.',
    loading:'Cargando el modelo en este dispositivo…', generating:'Generando a partir de los pasajes seleccionados…', cancelled:'Generación cancelada.',
    generated:'Generada en este dispositivo. Las cantidades se comprueban contra la fuente y se presentan en tu idioma.', passage:'Pasaje', of:'de', selected:'Fuente', processed:'Descargados',
    enter:'Escribe una pregunta.', wait:'Procesando...', references:'Evidencia de esta respuesta'
  }
};

const $ = id => document.getElementById(id);
const guess = new URLSearchParams(location.search).get('lang') || navigator.language || 'en';
let lang = guess.toLowerCase().startsWith('es') ? 'es' : 'en';
let languageChosen = false;
let uploaded = null, searchIndex = indexSources(publicSources), rows = [], currentQuestion = '';
let viewer = null, worker = null, busy = false, ready = false, sequence = 0, timeout, fileVersion = 0;
const t = key => copy[lang][key];
const sources = () => uploaded ? [...publicSources, uploaded] : publicSources;
function el(tag, text, className) {
  const item = document.createElement(tag);
  if (className) item.className = className;
  if (text !== undefined) item.textContent = text;
  return item;
}
function chooseLanguage(nextLang) {
  const previousSamples = t('samples'), sampleIndex = previousSamples.indexOf(currentQuestion);
  lang = nextLang;
  document.documentElement.lang = lang;
  document.title = lang === 'es' ? 'Casos · Axel Cruz' : 'Case files · Axel Cruz';
  document.querySelectorAll('[data-t]').forEach(node => { node.textContent = t(node.dataset.t); });
  document.querySelectorAll('[data-ph]').forEach(node => { node.placeholder = t(node.dataset.ph); });
  document.querySelectorAll('[data-lang]').forEach(btn => { btn.setAttribute('aria-pressed', String(btn.dataset.lang === lang)); });
  $('examples').setAttribute('aria-label', t('examples')); $('close-source').setAttribute('aria-label', t('close'));
  $('examples').replaceChildren(...t('samples').map(sample => {
    const b = el('button', sample); b.type = 'button'; b.onclick = () => { $('question').value = sample; runSearch(sample); }; return b;
  }));
  $('file-status').textContent = ''; renderSources();
  if (viewer) showSource(viewer.sourceId, viewer.offset);
  if (currentQuestion) {
    const question = sampleIndex >= 0 ? t('samples')[sampleIndex] : currentQuestion;
    $('question').value = question; runSearch(question);
  }
}
function renderSources() {
  const docs = sources();
  $('source-count').textContent = String(docs.length);
  $('source-list').replaceChildren(...docs.map(doc => {
    const button = el('button', undefined, 'source-entry'), label = el('span');
    button.type = 'button'; label.append(el('span', doc.title, 'entry-title'), el('span', doc.label[lang], 'entry-label'));
    const count = el('span', String(doc.passages.length), 'entry-count');
    count.setAttribute('aria-label', String(doc.passages.length) + ' ' + t('matches'));
    button.append(label,count); button.onclick = () => showSource(doc.id, 0, true); return button;
  }));
  document.querySelector('.file-label [data-t]').textContent = t(uploaded ? 'replace' : 'choose');
  $('remove').hidden = !uploaded;
}
function showSource(sourceId, offset, focus = false) {
  const doc = sources().find(d => d.id === sourceId), p = doc?.passages[offset];
  if (!p) return;
  viewer = {sourceId, offset};
  $('source-view').hidden = false; $('view-title').textContent = doc.title; $('passage-id').textContent = p.id;
  $('passage-pos').textContent = t('passage') + ' ' + (offset + 1) + ' ' + t('of') + ' ' + doc.passages.length;
  $('passage-text').textContent = p[lang]; $('previous').disabled = offset === 0; $('next').disabled = offset === doc.passages.length - 1;
  if (focus) {
    try { history.replaceState(null,'','#cite-' + p.id); } catch { /* Plain file preview. */ }
    $('source-view').focus({preventScroll:true}); $('source-view').scrollIntoView({block:'nearest'});
  }
}
function closeSource() {
  viewer = null; $('source-view').hidden = true;
  if (location.hash.startsWith('#cite-')) { try { history.replaceState(null, '', location.pathname + location.search); } catch {} }
}
function openHash() {
  const match = location.hash.match(/^#cite-([A-Z]+\d+)$/);
  if (!match) return;
  const hit = searchIndex.find(r => r.passage.id === match[1]);
  if (hit) showSource(hit.source.id, hit.offset);
}
function cite(row) {
  const a = el('a', '[' + row.passage.id + ']', 'match-link'); a.href = '#cite-' + row.passage.id;
  a.setAttribute('aria-label', t('selected') + ' ' + row.source.title + ', ' + t('passage') + ' ' + (row.offset + 1));
  a.onclick = e => { e.preventDefault(); showSource(row.source.id,row.offset,true); }; return a;
}
function resetAnswer() {
  if (busy) stopWorker();
  $('answer').hidden = true; $('answer').textContent = ''; $('answer-cites').replaceChildren(); $('model-status').textContent = '';
  $('generate').disabled = false; $('generate').textContent = t(ready ? 'generateAgain' : 'generate'); $('cancel').hidden = true;
}
function runSearch(question) {
  question = question.trim().slice(0,220); if (!question) return;
  currentQuestion = question;
  resetAnswer(); rows = retrieve(searchIndex, question);
  $('result-area').hidden = false; $('result-count').textContent = String(rows.length);
  $('result-status').textContent = rows.length ? '' : t('none');
  $('results').replaceChildren(...rows.map(row => {
    const article = el('article',undefined,'match'), h = el('div',undefined,'match-head');
    h.append(cite(row),el('span',[row.source.title,references[row.passage.reference]?.[lang === 'es' ? 1 : 0]].filter(Boolean).join(' · ')));
    article.append(h,el('p',row.passage[lang])); return article;
  }));
  $('generator').hidden = !rows.length;
}
function stopWorker() {
  clearTimeout(timeout); sequence++;
  worker?.terminate(); worker = null; busy = false; ready = false;
}
function handleFailure(message) {
  stopWorker(); $('model-status').textContent = t(message); $('generate').disabled = false; $('generate').textContent = t('generate');
  $('cancel').hidden = true;
}
function armTimer() {
  clearTimeout(timeout); timeout = setTimeout(() => { if (busy) handleFailure('failed'); }, 180000);
}
function generate() {
  if (busy || !rows.length) return;
  if (!window.Worker || !window.WebAssembly) { handleFailure('unavailable'); return; }
  resetAnswer(); busy = true; $('generate').disabled = true; $('cancel').hidden = false;
  $('model-status').textContent = t(ready ? 'generating' : 'loading');
  const request = ++sequence;
  try {
    if (!worker) worker = new Worker(new URL('./worker.mjs', import.meta.url), {type:'module'});
    worker.onerror = () => { if (request === sequence) handleFailure('failed'); };
    worker.onmessage = ({data}) => {
      if (data.request !== request || request !== sequence) return;
      if (data.kind === 'loading') {
        armTimer();
        $('model-status').textContent = t('loading') + (data.mb > 0 ? ' ' + t('processed') + ': ' + data.mb + ' MB.' : '');
      } else if (data.kind === 'generating') {
        ready = true; armTimer(); $('model-status').textContent = t('generating');
      } else if (data.kind === 'failed') {
        handleFailure('failed');
      } else if (data.kind === 'answer') {
        clearTimeout(timeout); busy = false; ready = true; $('cancel').hidden = true; $('generate').disabled = false;
        $('generate').textContent = t('generateAgain');
        const answer = displayAnswer(data.answer, rows, lang, currentQuestion);
        if (answer) {
          $('model-status').textContent = t('generated'); $('answer').textContent = answer; $('answer').hidden = false;
          $('answer-cites').setAttribute('aria-label', t('references'));
          $('answer-cites').replaceChildren(...rows.slice(0,2).map(cite));
        } else {
          $('model-status').textContent = t('unsupported');
          if (rows[0].source.id !== 'user') {
            $('answer').textContent = rows[0].passage[lang]; $('answer').hidden = false;
            $('answer-cites').replaceChildren(cite(rows[0]));
          }
        }
      }
    };
    armTimer(); worker.postMessage({request, prompt:promptFor(currentQuestion,rows,lang)});
  } catch { handleFailure('failed'); }
}
document.querySelectorAll('[data-lang]').forEach(button => { button.onclick = () => { languageChosen = true; chooseLanguage(button.dataset.lang); }; });
$('question-form').onsubmit = e => {
  e.preventDefault();
  const q = $('question'); if (!q.value.trim()) { q.setCustomValidity(t('enter')); q.reportValidity(); return; }
  const question = q.value.trim();
  if (!languageChosen) {
    const es = /[¿¡]|\b(cu[aá]nt[oa]s?|qu[eé]|qui[eé]n|c[oó]mo|herramientas|formaci[oó]n|experiencia|proyectos?|idiomas)\b/i.test(question);
    const en = /\b(what|which|how|who|where|when|does|did|tools|experience|projects?|languages)\b/i.test(question);
    if ((es && !en && lang !== 'es') || (en && !es && lang !== 'en')) chooseLanguage(es ? 'es' : 'en');
  }
  q.value=question; runSearch(question);
};
$('question').oninput = () => {
  $('question').setCustomValidity('');
  if (currentQuestion && $('question').value.trim() !== currentQuestion) {
    resetAnswer(); rows = []; currentQuestion = ''; $('result-area').hidden = true;
  }
};
$('generate').onclick = generate; $('cancel').onclick = () => handleFailure('cancelled');
$('previous').onclick = () => { if (viewer) showSource(viewer.sourceId, viewer.offset - 1, true); };
$('next').onclick = () => { if (viewer) showSource(viewer.sourceId, viewer.offset + 1, true); };
$('close-source').onclick = () => { closeSource(); $('source-list').querySelector('button')?.focus(); };
$('file').onchange = async e => {
  const version = ++fileVersion, file = e.currentTarget.files[0]; e.currentTarget.value = '';
  if (!file) return;
  try {
    if (file.size > MAX_FILE_BYTES) throw new Error('fileSize');
    const doc = readDocument(file.name, await file.arrayBuffer());
    if (version !== fileVersion) return;
    uploaded = doc; searchIndex = indexSources(sources()); if (viewer?.sourceId === 'user') closeSource();
    renderSources(); $('file-status').textContent = t('added'); if (currentQuestion) runSearch(currentQuestion);
  } catch (ex) { if (version === fileVersion) $('file-status').textContent = t(ex.message) || t('fileRead'); }
};
$('remove').onclick = () => {
  fileVersion++; uploaded = null; if (viewer?.sourceId === 'user') closeSource();
  searchIndex = indexSources(sources()); renderSources(); $('file-status').textContent = t('removed'); if (currentQuestion) runSearch(currentQuestion);
};
chooseLanguage(lang); openHash(); window.addEventListener('hashchange',openHash);
