'use strict';
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let localAIAvailable=false;
const aiOptions={expectedInputs:[{type:'text',languages:['en']}],expectedOutputs:[{type:'text',languages:['en']}]};
async function checkAI(){try{if(typeof globalThis.LanguageModel==='undefined')throw Error('Not supported');const availability=await globalThis.LanguageModel.availability(aiOptions);localAIAvailable=availability==='available';}catch{localAIAvailable=false;}if($('#ai-switch-label'))$('#ai-switch-label').hidden=!localAIAvailable;if($('#ai-status'))$('#ai-status').textContent=localAIAvailable?'Optional on-device AI is ready in this browser. Your brief is processed locally; no cloud model is called.':'Guided mode: curated keyword matching, not generative AI. On-device AI is unavailable in this browser. Your brief stays in this page.';window.dispatchEvent(new CustomEvent('axel-ai-ready'));}

checkAI();
