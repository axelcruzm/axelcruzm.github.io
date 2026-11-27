// Loaded only after the visitor opts in. Source passages and queries stay in this worker.
let pipelinePromise;
self.onmessage = async ({data}) => {
  const {request, prompt} = data;
  try {
    if (!pipelinePromise) {
      const {pipeline, env} = await import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1');
      env.allowLocalModels = false;
      env.backends.onnx.wasm.numThreads = 1;
      const bytes = new Map();
      pipelinePromise = pipeline('text2text-generation','Xenova/flan-t5-small',{
        device:'wasm', dtype:'q8',
        progress_callback(event) {
          if (event.file && Number.isFinite(event.loaded)) bytes.set(event.file,event.loaded);
          const loaded = [...bytes.values()].reduce((sum,n) => sum+n,0);
          self.postMessage({kind:'loading',request,mb:Math.floor(loaded/1e6)});
        }
      });
    }
    const model = await pipelinePromise;
    self.postMessage({kind:'generating',request});
    const output = await model(prompt,{do_sample:false, max_new_tokens:48});
    self.postMessage({kind:'answer',request,answer:output?.[0]?.generated_text || ''});
  } catch {
    pipelinePromise = null;
    self.postMessage({kind:'failed',request});
  }
};
