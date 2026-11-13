# Durango — siete loops de servicio

Objetivo: siete piezas de aproximadamente 12 segundos, pendientes de los videos de Alberto y las tres pistas de Axel. No están creadas ni publicadas todavía. Las fotografías actuales son el respaldo visual.

## Sistema visual V11
Número 01–07 dominante, nombre del servicio como título principal, promesa y explicación debajo. Icono, número y avance comparten acento de color. Línea oficial de color, firma DGO y adorno transparente acompañan el contenido. Filtros de esquina se aplican también al video sin hornear la marca dentro del master.

## Preparación del master
- Duración objetivo: 12 segundos. Ajustar a compases completos de la pista aprobada.
- Referencia inicial: 30 fps, 360 cuadros para un loop de 12 segundos; primer y último estado deben conectar sin salto ni cuadro negro.
- MP4 H.264 para la entrega web. Validar peso y fluidez con el material real.
- El panel de escritorio es vertical y el móvil es panorámico: mantener sujeto principal en zona central y entregar encuadres por separado si el recorte pierde información.
- Supers breves y grandes, sin incrustar textos esenciales en zonas que se recorten. Dejar la explicación del servicio en HTML.
- Reproducción inicial sin sonido, loop, pausa disponible y respeto a movimiento reducido. La reproducción de música requiere activación voluntaria; no hay aún un control de audio en esta versión.
- Cargar solo el video activo; al cambiar servicio o cerrar se descarga su recurso.

## Integración
En src/presentation.js, serviceMedia admite una entrada por id: estrategia, audiovisual, informacion, ia, motion, contenidos, integracion.
Cada entrada contiene src (ruta relativa), poster, label y credit. Publicar solo piezas aprobadas. serviceFacts admite cifras verificadas con fuente, valor y etiqueta; no contiene estadísticas de demostración.

## Arte
Archivos originales aportados por Axel: dgo-arte.png, patron-durango.png, linea-color.svg y durango-oficial.png. Adorno generado: durango-flourish.png, PNG transparente. No se presenta como arte oficial ni identificación científica de especies.
Prompt del adorno: ilustración de esquina transparente inspirada en las formas planas entrelazadas y paleta carmesí/magenta/naranja/dorado/cobalto/cian/lima del DGO aportado; águila, venado, pinos, río y hojas en una composición diagonal; sin letras ni logotipo. Generación con la herramienta integrada de imágenes.
