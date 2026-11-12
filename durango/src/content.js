// Conceptual commercial content. Validate capabilities, deliverables and scope with TOM before external release.
// Genuine place photographs are linked from Commons; use a licensed local asset pack for final production.
export const themes = [
  { id:'infraestructura', short:'Infraestructura', name:'Infraestructura', icon:'bridge', tag:'Obra, conectividad y territorio', description:'Mostrar el avance de proyectos, explicar intervenciones y conectar información de campo con comunicación verificable.' },
  { id:'economico', short:'Desarrollo económico', name:'Desarrollo económico', icon:'chart', tag:'Inversión, dinamismo y oportunidades', description:'Traducir indicadores, proyectos e iniciativas económicas en mensajes claros y formatos útiles para distintas audiencias.' },
  { id:'cultura', short:'Identidad cultural', name:'Identidad cultural', icon:'spark', tag:'Patrimonio, historias y pertenencia', description:'Dar visibilidad al patrimonio, las comunidades y las historias que construyen la identidad del estado.' },
  { id:'bienestar', short:'Bienestar social', name:'Bienestar social', icon:'people', tag:'Servicios, personas y resultados', description:'Acercar los programas y sus resultados a la ciudadanía mediante contenidos comprensibles, accesibles y oportunos.' }
];

export const photos = {
  canyon: {
    fallback:'./assets/scenery/forest.webp',
    src:'https://upload.wikimedia.org/wikipedia/commons/d/d6/Mexiquillo%2C_Durango.jpg',
    place:'MEXIQUILLO · PUEBLO NUEVO',
    title:'Paisaje natural de Mexiquillo',
    by:'México en Fotos, A.C.',
    license:'CC BY-SA 2.0',
    licenseUrl:'https://creativecommons.org/licenses/by-sa/2.0/',
    source:'https://commons.wikimedia.org/wiki/File:Mexiquillo,_Durango.jpg'
  },
  waterfall: {
    fallback:'./assets/scenery/waterfall.webp',
    src:'https://upload.wikimedia.org/wikipedia/commons/a/a8/Cascada_de_Mexiquillo.jpg',
    place:'CASCADA · MEXIQUILLO',
    title:'Cascada del parque natural Mexiquillo',
    by:'Raer',
    license:'CC BY-SA 4.0',
    licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',
    source:'https://commons.wikimedia.org/wiki/File:Cascada_de_Mexiquillo.jpg'
  },
  catedral: {
    fallback:'./assets/scenery/cathedral.webp',
    src:'https://upload.wikimedia.org/wikipedia/commons/0/01/Catedral_de_durango.jpg',
    place:'CENTRO HISTÓRICO · DURANGO',
    title:'Catedral de Durango',
    by:'Vaquita marina',
    license:'CC BY 4.0',
    licenseUrl:'https://creativecommons.org/licenses/by/4.0/',
    source:'https://commons.wikimedia.org/wiki/File:Catedral_de_durango.jpg'
  },
  ojuela: {
    fallback:'./assets/scenery/bridge.webp',
    src:'https://upload.wikimedia.org/wikipedia/commons/b/bb/Ojuela_25.jpg',
    place:'OJUELA · MAPIMÍ',
    title:'Puente de Ojuela, Mapimí',
    by:'BlatZzz',
    license:'CC BY-SA 3.0',
    licenseUrl:'https://creativecommons.org/licenses/by-sa/3.0/',
    source:'https://commons.wikimedia.org/wiki/File:Ojuela_25.jpg'
  }
};

export const services = [
  {
    id:'estrategia', number:'01', title:'Consultoría estratégica', label:'CONSULTORÍA ESTRATÉGICA', icon:'chess', image:'canyon',
    lead:'La estrategia organiza el mensaje antes de producirlo.',
    tagline:'Diagnóstico, arquitectura narrativa y decisiones mejor informadas.',
    impact:{
      infraestructura:'Prioridades comunicables, hitos verificables y cronogramas editoriales.',
      economico:'Mensajes para audiencias empresariales, ciudadanía y actores institucionales.',
      cultura:'Una narrativa territorial consistente, conectada con sus protagonistas.',
      bienestar:'Arquitectura clara para explicar programas, avances y alcance.'
    },
    deliveries:['Diagnóstico de comunicación','Estrategia editorial','Mapas de audiencias','Plan de contenidos']
  },
  {
    id:'audiovisual', number:'02', title:'Producción audiovisual', label:'PRODUCCIÓN AUDIOVISUAL', icon:'camera', image:'waterfall',
    lead:'Historias capturadas desde el territorio, con calidad de producción.',
    tagline:'Registro en campo, entrevistas, vuelos aéreos y formatos documentales.',
    impact:{
      infraestructura:'Coberturas de proyectos, obra pública y transformación del territorio.',
      economico:'Piezas para comunicar iniciativas, sectores estratégicos e inversión.',
      cultura:'Retratos del patrimonio, los oficios y la diversidad del estado.',
      bienestar:'Testimonios y relatos de personas beneficiadas, sujetos a autorización.'
    },
    deliveries:['Registro terrestre y aéreo','Entrevistas','Cápsulas documentales','Postproducción profesional']
  },
  {
    id:'informacion', number:'03', title:'Tratamiento de información', label:'TRATAMIENTO DE INFORMACIÓN', icon:'database', image:'ojuela',
    lead:'Convertimos fuentes dispersas en información útil para comunicar.',
    tagline:'Organización, verificación, actualización y trazabilidad editorial.',
    impact:{
      infraestructura:'Organización de avances, fichas técnicas y cifras proporcionadas por las áreas responsables.',
      economico:'Sistematización de datos e iniciativas para consulta y difusión.',
      cultura:'Curaduría de archivos, referencias, testimonios y materiales documentales.',
      bienestar:'Seguimiento de mensajes, fuentes y versiones de programas sociales.'
    },
    deliveries:['Matrices de información','Protocolos de validación','Tableros editoriales','Repositorio estructurado']
  },
  {
    id:'ia', number:'04', title:'AI Mastery & Digital Platforms', label:'AI MASTERY & DIGITAL PLATFORMS', icon:'ai', image:'canyon', featured:true,
    lead:'Inteligencia aplicada, ingeniería humana y plataformas digitales para operar mejor.',
    tagline:'La tecnología debe demostrar valor: conectar conocimiento, personas y sistemas.',
    impact:{
      infraestructura:'Asistentes documentales con RAG para consultar expedientes y reportes autorizados.',
      economico:'Plataformas y automatizaciones que aceleran flujos de información y seguimiento.',
      cultura:'Herramientas de IA generativa con revisión humana para activar acervos y contenidos.',
      bienestar:'Servicios digitales y agentes supervisados para orientar trámites e información aprobada.'
    },
    deliveries:['Human Developers','AI Agents & RAG','Automations & MCP','Software Factory','APIs & plataformas','Gobernanza y supervisión humana']
  },
  {
    id:'motion', number:'05', title:'Diseño & motion graphics', label:'DISEÑO & MOTION GRAPHICS', icon:'nodes', image:'catedral',
    lead:'Sistemas visuales que hacen entendible lo complejo.',
    tagline:'Identidad, infografía, animación y consistencia gráfica en cada formato.',
    impact:{
      infraestructura:'Gráficos de proyectos, localización, etapas y procesos.',
      economico:'Visualización clara de cadenas de valor, programas e indicadores.',
      cultura:'Sistemas gráficos inspirados en el patrimonio sin reemplazar su identidad.',
      bienestar:'Infografías accesibles y animaciones explicativas de servicios.'
    },
    deliveries:['Dirección de arte','Visualización de información','Animación 2D/3D','Kits gráficos multiformato']
  },
  {
    id:'contenidos', number:'06', title:'Contenidos institucionales', label:'CONTENIDOS INSTITUCIONALES', icon:'document', image:'catedral',
    lead:'Una voz institucional coherente, en los formatos que las audiencias necesitan.',
    tagline:'Videomensajes, cápsulas, presentaciones y narrativa multicanal.',
    impact:{
      infraestructura:'Actualizaciones claras sobre avances y proyectos públicos.',
      economico:'Contenidos para explicar oportunidades y líneas de desarrollo.',
      cultura:'Series editoriales que visibilizan historias, tradiciones y comunidad.',
      bienestar:'Comunicación de servicios y convocatorias en lenguaje ciudadano.'
    },
    deliveries:['Videomensajes','Cápsulas informativas','Guiones y storytelling','Piezas para canales digitales']
  },
  {
    id:'integracion', number:'07', title:'Integración y entrega', label:'INTEGRACIÓN Y ENTREGA', icon:'layers', image:'ojuela',
    lead:'Cada pieza, plataforma y canal debe funcionar como parte de un mismo sistema.',
    tagline:'Coordinación multicanal, control de calidad y seguimiento de publicación.',
    impact:{
      infraestructura:'Estructuras de entrega por proyecto, región y audiencia.',
      economico:'Distribución y seguimiento de contenidos en puntos de contacto relevantes.',
      cultura:'Adaptación consistente para campañas, eventos y acervos digitales.',
      bienestar:'Accesibilidad, verificación y disponibilidad de materiales informativos.'
    },
    deliveries:['Paquetes multicanal','Control de versiones','QA y entregables','Medición de resultados']
  }
];

// Preserve intentionally distinct wording in official communications. Never imply TOM
// or Durango has deployed proposed features without evidence and authorization.
