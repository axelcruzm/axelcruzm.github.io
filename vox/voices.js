// Replace src with an approved voice file and set prototype:false for each VOX sample.
// Only IDs travel with a brief. Performer names are never displayed.
(() => {
  const es=[
   'Cada historia encuentra su ritmo cuando le damos espacio para respirar. Antes de encender el micrófono, pensemos en la persona que va a escuchar. Tal vez está de camino a casa. Tal vez abre un libro después de un día largo. Una pausa, una intención clara o un cambio en el volumen pueden hacer que esa persona se quede. La voz no tiene que llenar todo el silencio. Tiene que saber cuándo dejarlo estar. Cuando trabajamos con dos idiomas, el objetivo no es repetir cada palabra. Es conservar la intención y encontrar cómo decirla de forma natural. Escuchar es la primera etapa del trabajo. Después viene la voz.',
   'Hay una diferencia entre leer un mensaje y contarlo. Para contarlo, imagina que le hablas a una sola persona. Deja que las palabras tengan una intención y que cada frase conduzca a la siguiente. No hace falta exagerar para que se note una emoción. A veces basta con cambiar de ritmo. En una producción, la voz forma parte de una conversación entre el texto, la dirección y la gente que la escucha. Podemos empezar con un guion, probar dos maneras de decirlo y escoger la que mejor encaje con la historia. Después, ajustamos cada detalle hasta que todo suene a la misma conversación.',
   'Cae la tarde y la ciudad cambia de voz. Se oye el cierre de una puerta, una bicicleta al fondo y alguien que llama a su familia. En medio de todo ese sonido, una frase pequeña puede llamar nuestra atención. No porque sea más fuerte, sino porque llega en el momento indicado. Contar una historia es escoger esas pequeñas decisiones. Qué palabra merece una pausa. Qué imagen ya está clara y no necesita más explicación. Dónde conviene dar un paso atrás. Cuando la voz acompaña a la imagen, no tiene que describirla. Puede darle una intención diferente. Y cuando la voz va sola, puede hacernos ver una escena sin mostrarla.'
  ];
  const catalog={};
  for(const gender of ['women','men'])for(const lang of ['es','en']){
    const key=gender+'-'+lang;
    catalog[key]=Array.from({length:3},(_,i)=>{
      const seq=i+1;
      return {id:lang.toUpperCase()+'-'+(gender==='women'?'W':'M')+'-'+String(seq).padStart(2,'0'),gender,lang,seq,prototype:true,
        src:'audio/'+key+'-'+seq+'.mp3',speech:lang==='es'?es[i]:null};
    });
  }
  globalThis.VOX_VOICES=catalog;
})();
