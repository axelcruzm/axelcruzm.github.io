import { publicSources } from './corpus.mjs';
export { publicSources };
export const MAX_FILE_BYTES = 100_000;

const stops = new Set(('a an and are as at be been by can could de del desde did do does el ella en es esta este fue fueron ha haga hay how i in is it la las le lo los many mas me mi much my of on or o para por que se su sus the their them to un una unas unos was were what when which who whom why will with y you your al como cual cuales cuanto cuanta cuantos cuantas dime acerca sobre please tell about information informacion caso case casos cases show muestra share dame axel hizo hace did hacer had has is very get her his its there we our can they them know saber happened happen happens paso ocurrio sucede sucedio cuentame overview describe explain explicame resume summarize result resultado resultados logró logro work trabajo caso ficha usaron uso usan used use using fue included include hubo hay tiene have es son were its atendia atendio serve served the').split(/\s+/));
const terms = {};
function aliases(key, words) {
  for (const word of [key, ...words.split(' ')]) terms[word] = key;
}
aliases('duration', 'time timeline deadline turnaround days day fast long lasted took take duration tiempo plazo cuanto-tardo tarda tardo tardaron tardaste duro duracion demoro terminar dias dia rapidez');
aliases('recovery', 'recover recovered rescue rescued emergency crisis restored restore rescato rescate rescatar recupero recuperaron recuperacion recuperar emergencia restablecio');
aliases('platform', 'platforms plataforma plataformas sistema sistemas');
aliases('training', 'learning capacitacion entrenamiento');
aliases('project', 'projects proyectos proyecto encargos');
aliases('growth', 'grew grow expand expanded grew growth expansion crecio crecieron crecer crecimiento evolucion evoluciono amplio ampliar');
aliases('dealer', 'dealership dealerships dealers distributors distribuidores distribuidor concesionarios agencias');
aliases('user', 'users usuarios usuario');
aliases('reach', 'scope scale audience size alcance escala publico');
aliases('format', 'formats formatos formato entregables piezas');
aliases('first', 'initial began start started original primer primera inicio empezo comenzo');
aliases('location', 'locations ubicacion ubicaciones');
aliases('proposal', 'proposals propuesta propuestas');
aliases('renovation', 'renovacion remodelacion');
aliases('incident', 'incidents issues incidence incidencias incidentes fallas problemas');
aliases('qa', 'pruebas quality calidad qa');
aliases('approach', 'approach actions steps hizo proceso pasos metodo');
aliases('cost', 'costs price prices budget costo costos precio precios valio presupuesto presupuestos cobro cobrado');
aliases('savings', 'saved save savings ahorro ahorros ahorrado ahorraron deuda deudas debt debts');
aliases('income', 'income revenue ingresos facturacion');
aliases('techstack', 'languages programming tecnologia tecnologias framework stack codigo');
aliases('tool', 'tools tooling herramientas herramienta software toolkit');
aliases('experience','experiencia background trayectoria profesional experience career');
aliases('education','formacion educacion estudios estudio study studied degree carrera universidad university');
aliases('language','idioma idiomas languages ingles english spanish espanol');
aliases('qa','quality calidad pruebas testing qa');
aliases('course','cursos cursos curso courses curricula');
aliases('team','equipo equipos team teams equipos especialistas specialists');
aliases('distribution','remote distributed distribuidos remoto nearshore');
aliases('coordination','coordino coordinar coordinated coordinate managed gestiona coordina lidero liderar');
aliases('release','liberacion liberaciones estrenos releases');
aliases('audiovisual','video videos multimedia audiovisual');
aliases('reference','reference references');
for (const word of ['for','he','does','do','speak','habla','hablar','use','at','edad','realizo','cual','cuales','sobre','did','incluye','con','can','you','with','been']) if (word!=='edad') stops.add(word);
const genericExperience = new Set(['experience','coordination','profesional']);
const subjectAliases = publicSources.flatMap(source => source.names.map(name => ({name, id:source.id})));
const countTopics = new Set(['duration','user','dealer','project','incident','location','format','platform']);
const exactTopics = new Set(['savings','cost','income','techstack','duration','dealer','user']);
const weak = new Set(['project','platform','first','format','training','approach']);

export function normalize(text) {
  return String(text).toLowerCase().normalize('NFD').replace(/\p{M}/gu, '')
    .replace(/['’]s\b/g, '').replace(/(\d)[.,](?=\d{3}(?:\D|$))/g, '$1');
}
function tokens(text) {
  const words = normalize(text).match(/[\p{L}\d]+/gu) || [];
  return [...new Set(words.filter(w => !stops.has(w)).map(w => terms[w] || w))];
}
function cleanText(value) {
  return value.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n')
    .replace(/[\u0001-\u0008\u000b\u000c\u000e-\u001f\u007f\u202a-\u202e\u2066-\u2069]/g, '').trim();
}
function splitPassages(text) {
  const pieces = [];
  for (const block of text.split(/\n\s*\n/)) {
    let rest = block.trim();
    while (rest.length > 620) {
      const head = rest.slice(0, 620);
      const at = Math.max(head.lastIndexOf('. '), head.lastIndexOf('! '), head.lastIndexOf('? '), head.lastIndexOf('\n'));
      let cut = at >= 250 ? at + 1 : head.lastIndexOf(' ');
      if (cut < 150) cut = 620;
      pieces.push(rest.slice(0, cut).trim()); rest = rest.slice(cut).trim();
    }
    if (rest) pieces.push(rest);
  }
  return pieces;
}
export function readDocument(name, bytes) {
  if (!/\.(txt|md)$/i.test(name)) throw new Error('fileType');
  if (bytes.byteLength > MAX_FILE_BYTES) throw new Error('fileSize');
  let decoded;
  try { decoded = new TextDecoder('utf-8', {fatal: true}).decode(bytes); } catch { throw new Error('fileText'); }
  if (decoded.includes('\u0000')) throw new Error('fileText');
  const text = cleanText(decoded);
  if (!text) throw new Error('fileEmpty');
  const filename = cleanText(name).replace(/[\r\n\t]/g, ' ').slice(0, 100);
  return { id: 'user', title: filename, label: { en: 'Your local document', es: 'Tu documento local' },
    passages: splitPassages(text).map((body, i) => ({id: 'D' + (i + 1), en: body, es: body, topics: []})) };
}
export function indexSources(sources) {
  return sources.flatMap(source => source.passages.map((passage, offset) => ({
    source, passage, offset, terms: new Set([...tokens(passage.en + ' ' + passage.es + ' ' + (passage.keywords || '')), ...passage.topics, ...(/ClickUp|Adobe Creative Cloud|PostgreSQL/.test(passage.en) ? ['tool'] : [])]),
  })));
}

export function retrieve(index, question, limit = 3) {
  const plain = ' ' + normalize(question).replace(/[^\p{L}\d]+/gu,' ').trim() + ' ';
  const subjects = subjectAliases.filter(({name}) => plain.includes(' ' + name + ' '));
  const sourceIds = new Set(subjects.map(s => s.id));
  const namedWords = new Set(subjects.flatMap(s => tokens(s.name)));
  let words = tokens(question).filter(t => !namedWords.has(t) && !['quien','who','cruz','tell','hablame','did','tienes','backgrounds','acerca','laboral','professional','profesional','herramientas','utiliza','utilizo','usa','trabaja'].includes(t));
  const isProfile = !sourceIds.size && (!words.length || words.every(t=>genericExperience.has(t))) && /\b(axel|cruz|trayectoria|experience|experiencia|career|background)\b/.test(plain);
  if (isProfile) return index.filter(row => row.passage.id === 'P1');
  if (words.length > 1) words = words.filter(t=>!genericExperience.has(t));
  if (!words.length && !sourceIds.size) return [];
  const must = words.filter(t => exactTopics.has(t));
  const countQuestion = /\bhow (?:many|much)|\bcuant[oa]s?\b|\bnumero de\b|\bnumber of\b/.test(normalize(question));
  const measured = countQuestion ? words.find(t => countTopics.has(t)) : null;
  const ranked = [];
  for (const row of index) {
    if (sourceIds.size && !sourceIds.has(row.source.id)) continue;
    if (must.some(t => !row.terms.has(t))) continue;
    if (measured && row.passage.measures && !row.passage.measures.includes(measured)) continue;
    const matched = words.filter(t => row.terms.has(t));
    if (words.length && (!matched.length || matched.length / words.length < 0.45)) continue;
    if (words.length > 1 && matched.every(t => weak.has(t)) && matched.length < words.length) continue;

    const score = matched.reduce((sum, t) => sum + (weak.has(t) ? 1 : 3), 0) +
      (row.source.id === 'skills' && words.includes('tool') ? 2 : 0) + (row.source.id === 'profile' && (words.includes('education') || words.includes('language')) ? 4 : 0) + (row.passage.id === 'S5' && words.includes('qa') ? 2 : 0);
    ranked.push({ ...row, score });
  }
  ranked.sort((a, b) => b.score - a.score || a.offset - b.offset);
  return ranked.slice(0, limit);
}
// Small encoder-decoder models handle short English QA prompts more reliably. For
// the bilingual references, translate only an identified metric or growth intent.
function publicIntent(question, rows) {
  if (!rows.length || rows[0].source.id === 'user') return null;
  const words = tokens(question), first = rows[0].passage.id;
  if (first === 'H1' && words.includes('duration')) return {ask:'How many days did the recovery take?', unit:'duration'};
  if (first === 'H2' && words.includes('user')) return {ask:'How many users did the training platform serve?', unit:'user'};
  if (first === 'H3' && words.includes('dealer')) return {ask:'How many dealerships did the platform serve?', unit:'dealer'};
  if (first === 'C1' && (words.includes('growth') || (words.includes('project') && /cuant|how many|number of|numero de/.test(normalize(question))))) {
    return {ask:'How many projects did the engagement grow to?', unit:'project'};
  }
  return null;
}
export function promptFor(question, rows, lang) {
  const intent = publicIntent(question, rows);
  const entries = intent ? rows.slice(0,1) : rows.slice(0,2);
  const passages = entries.map(r => r.passage[intent ? 'en' : lang].slice(0,570)).join(' ');
  return 'Answer the question based on the context below.\nContext: ' + passages +
    '\nQuestion: ' + (intent?.ask || question.trim().slice(0,220));
}

// Format a generated numeric answer in the reader's language only if the model
// itself returned the documented value for the requested measurement.
export function displayAnswer(output, rows, lang, question) {
  const raw = String(output || '').trim();
  if (!raw || /[?¿]/.test(raw) || /^(question|pregunta|context|contexto)\s*:/i.test(raw)) return '';
  const lexicalText = s => normalize(s).replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  if (lexicalText(raw) === lexicalText(question)) return '';
  const intent = publicIntent(question, rows);
  if (!intent) {
    if (!supportedAnswer(raw, rows, lang)) return '';
    // Use a verified excerpt in the selected language if the model mixed languages.
    if (rows[0].source.id !== 'user' && !rows.some(row=>normalize(row.passage[lang]).includes(normalize(raw).replace(/[.!]$/,'')))) return '';
    return raw;
  }
  const evidence = rows[0].passage[lang];
  const patterns = {
    duration: /[\d,.]+\s+(?:days|días)/i,
    user: /(?:more than |más de )[\d,.]+\s+(?:users|usuarios)/i,
    dealer: /[\d,.]+\s+(?:Hino\s+)?(?:dealerships|distribuidores)/i,
    project: /[\d,.]+\s+(?:projects linked to locations|proyectos vinculados con ubicaciones)/i
  };
  const phrase = evidence.match(patterns[intent.unit])?.[0];
  if (!phrase) return '';
  const expected = normalize(phrase).match(/\d+/)?.[0];
  const returned = normalize(raw).match(/\d+/g) || [];
  if (!returned.length || returned.some(n => n !== expected)) return '';
  if (!supportedAnswer(raw,rows,'en')) return '';
  return phrase.charAt(0).toUpperCase() + phrase.slice(1) + '.';
}

// A deterministic guard for obviously ungrounded output. The excerpts remain visible.
export function supportedAnswer(output, rows, lang) {
  const answer = String(output || '').trim();
  if (!answer || answer.length > 1000 || /sin evidencia|insufficient evidence/i.test(answer)) return false;
  const evidence = rows.slice(0, 2).map(r => r.passage[lang].slice(0, 570)).join(' ');
  const digits = s => normalize(s).match(/\d+/g) || [];
  const allowedNumbers = new Set(digits(evidence));
  if (digits(answer).some(n => !allowedNumbers.has(n))) return false;
  // A source may contain both 2,000 users and 38 dealers. Check units as well as numbers.
  const measures = s => [...normalize(s).matchAll(/\b(\d+)\s*\+?\s+(dias?|days?|usuarios?|users?|distribuidores?|dealers?|dealerships?|proyectos?|projects?|ubicaciones?|locations?|tiendas?|stores?|incidencias?|incidents?|plataformas?|platforms?)\b/g)]
    .map(match => match[1] + '/' + (terms[match[2]] || match[2]));
  const sourceMeasures = new Set(measures(evidence));
  if (measures(answer).some(metric => !sourceMeasures.has(metric))) return false;
  const termsAvailable = new Set(tokens(evidence));
  const words = tokens(answer);
  return words.length > 0 && words.filter(t => termsAvailable.has(t)).length / words.length >= 0.55;
}
