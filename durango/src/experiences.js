// V02 editorial demo content. Illustrative interactions, not operational government dashboards.
export const experiences = {
  estrategia: {
    headline:'Primero, claridad.',
    subline:'La estrategia organiza el mensaje antes de producirlo.',
    kind:'strategy',
    steps:[
      {label:'Diagnóstico',caption:'Entender el contexto y sus audiencias.',detail:'Escucha · fuentes · objetivos'},
      {label:'Prioridades',caption:'Identificar lo que importa comunicar.',detail:'Enfoque · mensajes · criterios'},
      {label:'Plan',caption:'Convertir la visión en una ruta editorial.',detail:'Acciones · calendario · validación'}
    ],
    outputs:['Ruta editorial','Mapa de audiencias']
  },
  audiovisual: {
    headline:'Hacemos visible el territorio.',
    subline:'Historias capturadas en campo, con calidad de producción.',
    kind:'film',
    steps:[
      {label:'Territorio',caption:'Identificar las historias y sus protagonistas.',detail:'Investigación de locaciones'},
      {label:'Registro',caption:'Capturar imagen, sonido y testimonios.',detail:'Producción en campo'},
      {label:'Edición',caption:'Dar ritmo y sentido a cada historia.',detail:'Montaje y postproducción'},
      {label:'Difusión',caption:'Preparar cada historia para su audiencia.',detail:'Versiones y formatos'}
    ],
    outputs:['Cápsula documental','Registro audiovisual']
  },
  informacion: {
    headline:'Del dato al contexto.',
    subline:'Fuentes dispersas, organizadas para comunicar mejor.',
    kind:'pipeline',
    steps:[
      {label:'Fuentes',caption:'Recibir la información desde sus responsables.',detail:'Información de origen'},
      {label:'Verificación',caption:'Confirmar la consistencia de los datos.',detail:'Revisión humana'},
      {label:'Estructura',caption:'Ordenar los hallazgos para consulta.',detail:'Matriz editorial'},
      {label:'Mensaje',caption:'Convertir datos validados en claridad.',detail:'Comunicación útil'}
    ],
    outputs:['Matriz validada','Tablero editorial']
  },
  ia: {
    headline:'La información también puede actuar.',
    subline:'IA aplicada, ingeniería humana y plataformas conectadas.',
    kind:'ai',
    steps:[
      {label:'Conocimiento',caption:'Preparar información autorizada y trazable.',detail:'Fuentes verificadas · acceso controlado'},
      {label:'RAG y Agents',caption:'Responder y ejecutar tareas dentro de límites definidos.',detail:'RAG · agentes · orquestación'},
      {label:'Human Developers',caption:'Ingeniería senior y revisión humana en cada decisión sensible.',detail:'Arquitectura · seguridad · QA'},
      {label:'APIs y MCP',caption:'Conectar modelos, herramientas y procesos institucionales.',detail:'Integración · interoperabilidad'},
      {label:'Plataformas',caption:'Construir experiencias digitales útiles y mantenibles.',detail:'Software Factory · Skills · Automations'}
    ],
    outputs:['Asistente institucional (demo)','Plataforma a medida']
  },
  motion: {
    headline:'Lo complejo, comprensible.',
    subline:'Diseño que convierte información en significado.',
    kind:'compare',
    steps:[
      {label:'Comparar',caption:'Desliza para revelar la claridad que aporta el diseño.',detail:'Antes / después ilustrativo'}
    ],
    outputs:['Sistema visual','Motion kit']
  },
  contenidos: {
    headline:'Una voz. Muchas audiencias.',
    subline:'Consistencia institucional adaptada a cada canal.',
    kind:'formats',
    steps:[
      {label:'Video',caption:'Una historia principal con identidad y ritmo.',detail:'Pieza audiovisual'},
      {label:'Cápsula',caption:'Una idea potente en un formato ágil.',detail:'Resumen de contenido'},
      {label:'Presentación',caption:'Argumentos preparados para tomadores de decisión.',detail:'Narrativa ejecutiva'},
      {label:'Publicación',caption:'Contenido claro en el canal adecuado.',detail:'Adaptación digital'}
    ],
    outputs:['Kit multicanal','Guion institucional']
  },
  integracion: {
    headline:'Todo conectado. Todo listo.',
    subline:'Coordinación y calidad desde el origen hasta la publicación.',
    kind:'rail',
    steps:[
      {label:'Plan',caption:'Definir entregas, responsables y fechas.',detail:'Plan de trabajo'},
      {label:'Producir',caption:'Coordinar equipos y especialidades.',detail:'Producción integrada'},
      {label:'Revisar',caption:'Validar calidad, cambios y versiones.',detail:'QA + validación'},
      {label:'Publicar',caption:'Entregar los formatos adecuados.',detail:'Canales y distribución'},
      {label:'Seguir',caption:'Dar trazabilidad a la entrega.',detail:'Seguimiento editorial'}
    ],
    outputs:['QA y publicación','Control de versiones']
  }
};
