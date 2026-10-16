import{e as j,f as A}from"./markdown.BDLCQyIR.js";const R=[{id:"pollinations",label:"Pollinations — free, no key",models:["openai","mistral","llama","deepseek","phi"],needsKey:!1,help:"Runs instantly with zero setup. Fair-use limits apply."},{id:"gemini",label:"Google Gemini — free tier",models:["gemini-2.0-flash","gemini-1.5-flash","gemini-2.5-flash"],needsKey:!0,keyLabel:"Gemini API key",keyUrl:"https://aistudio.google.com/apikey",help:"Free tier, no credit card. Key is stored only in your browser."},{id:"groq",label:"Groq — free tier",models:["llama-3.3-70b-versatile","llama-3.1-8b-instant","mixtral-8x7b-32768","gemma2-9b-it"],needsKey:!0,keyLabel:"Groq API key",keyUrl:"https://console.groq.com/keys",help:"Very fast open models. Free tier, no credit card."},{id:"openrouter",label:"OpenRouter — free models",models:["meta-llama/llama-3.3-70b-instruct:free","deepseek/deepseek-chat:free","mistralai/mistral-7b-instruct:free","google/gemma-2-9b-it:free"],needsKey:!0,keyLabel:"OpenRouter API key",keyUrl:"https://openrouter.ai/keys",help:"Many free models behind one API. Free tier, no credit card."}];function n(o){return o.replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}const E="pf.llm.key.";function I(o){return localStorage.getItem(E+o)||""}function P(o,e){localStorage.setItem(E+o,e)}async function K(o,e,l){if(o.id==="pollinations"){const g="https://text.pollinations.ai/"+encodeURIComponent(l)+`?model=${encodeURIComponent(e)}&system=${encodeURIComponent("You are a helpful, capable assistant.")}&private=true`,s=await fetch(g,{method:"GET"});if(!s.ok)throw new Error(`Pollinations ${s.status}`);return await s.text()}if(o.id==="gemini"){const g=I("gemini"),s=`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(e)}:generateContent?key=${encodeURIComponent(g)}`,f=await(await fetch(s,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{role:"user",parts:[{text:l}]}]})})).json();if(f.error)throw new Error(f.error.message||"Gemini error");return(f.candidates?.[0]?.content?.parts||[]).map(c=>c.text||"").join("").trim()||"(empty response)"}const q=I(o.id),w=o.id==="groq"?"https://api.groq.com/openai/v1/chat/completions":"https://openrouter.ai/api/v1/chat/completions",a={"Content-Type":"application/json",Authorization:`Bearer ${q}`};o.id==="openrouter"&&(a["HTTP-Referer"]=location.origin,a["X-Title"]="PromptForge");const p=await(await fetch(w,{method:"POST",headers:a,body:JSON.stringify({model:e,messages:[{role:"system",content:"You are a helpful, capable assistant."},{role:"user",content:l}]})})).json();if(p.error)throw new Error(p.error.message||"API error");return p.choices?.[0]?.message?.content?.trim()||"(empty response)"}function U(){const o=document.getElementById("run-data"),e=document.getElementById("run-app");if(!o||!e)return;const l=JSON.parse(o.textContent||"[]"),w=new URLSearchParams(location.search).get("prompt")||l[0]?.id||"";let a=l.find(t=>t.id===w)||l[0],i="pollinations",p=!1;const g=t=>({writing:"Writing",coding:"Coding",productivity:"Productivity",analysis:"Analysis",creative:"Creative",learning:"Learning",marketing:"Marketing",automation:"Automation"})[t]||t;function s(){return R.find(t=>t.id===i)}function v(){const t=s(),c=a?j(a.prompt):[],h=l.reduce((r,u)=>((r[u.category]||=[]).push(u),r),{}),$=Object.entries(h).map(([r,u])=>`<optgroup label="${n(g(r))}">`+u.map(y=>`<option value="${y.id}" ${y.id===(a?.id||"")?"selected":""}>${n(y.title)}</option>`).join("")+"</optgroup>").join("");e.innerHTML=`
      <div class="grid lg:grid-cols-2 gap-6">
        <section class="panel p-5 space-y-4">
          <h2 class="font-semibold text-slate-100">1 · Pick a prompt</h2>
          <select id="prompt-sel" class="w-full py-2.5 px-3 rounded-xl bg-[#0b0b12] border border-[#282838] text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50">${$}</select>
          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="text-sm text-slate-300">Prompt text</label>
              <span id="var-count" class="text-xs text-slate-500"></span>
            </div>
            <textarea id="prompt-preview" readonly class="w-full h-48 p-3 rounded-xl bg-[#0b0b12] border border-[#282838] text-slate-300 text-sm font-mono focus:outline-none"></textarea>
          </div>
          <div id="vars" class="space-y-2"></div>
        </section>

        <section class="panel p-5 space-y-4">
          <h2 class="font-semibold text-slate-100">2 · Choose a free provider</h2>
          <div>
            <label class="text-sm text-slate-300">Provider</label>
            <select id="provider-sel" class="w-full mt-1 py-2.5 px-3 rounded-xl bg-[#0b0b12] border border-[#282838] text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50">
              ${R.map(r=>`<option value="${r.id}" ${r.id===i?"selected":""}>${n(r.label)}</option>`).join("")}
            </select>
            <p class="text-xs text-slate-500 mt-1">${n(t.help)}</p>
          </div>
          <div>
            <label class="text-sm text-slate-300">Model</label>
            <select id="model-sel" class="w-full mt-1 py-2.5 px-3 rounded-xl bg-[#0b0b12] border border-[#282838] text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50">
              ${t.models.map(r=>`<option>${n(r)}</option>`).join("")}
            </select>
          </div>
          <div id="key-wrap" class="${t.needsKey?"":"hidden"}">
            <label class="text-sm text-slate-300">${n(t.keyLabel||"API key")}</label>
            <input id="key-input" type="password" placeholder="Paste your key (stored locally)" value="${n(I(i))}"
              class="w-full mt-1 py-2.5 px-3 rounded-xl bg-[#0b0b12] border border-[#282838] text-slate-200 text-sm placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
            ${t.keyUrl?`<a href="${n(t.keyUrl)}" target="_blank" rel="noopener" class="text-xs text-indigo-300 underline">Get a free key →</a>`:""}
          </div>
          <button id="run-btn" class="btn-primary w-full py-3">▶ Run prompt</button>
          <div id="status" class="text-sm text-slate-400"></div>
          <div id="output" class="hidden panel p-4 whitespace-pre-wrap text-slate-200 text-sm leading-relaxed max-h-96 overflow-y-auto"></div>
        </section>
      </div>`,f(t,c)}function f(t,c){const h=e.querySelector("#prompt-sel"),$=e.querySelector("#prompt-preview"),r=e.querySelector("#var-count"),u=e.querySelector("#vars"),y=e.querySelector("#provider-sel"),L=e.querySelector("#model-sel");e.querySelector("#key-wrap");const b=e.querySelector("#key-input"),x=e.querySelector("#run-btn"),k=e.querySelector("#status"),S=e.querySelector("#output");$.value=a?.prompt||"",r.textContent=c.length?`${c.length} variable${c.length>1?"s":""}`:"",u.innerHTML=c.map(d=>`
        <div>
          <label class="text-xs text-slate-400 font-mono">{{${n(d)}}}</label>
          <input data-var="${n(d)}" type="text" placeholder="value for ${n(d)}"
            class="w-full mt-1 py-2 px-3 rounded-xl bg-[#0b0b12] border border-[#282838] text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
        </div>`).join(""),h.addEventListener("change",()=>{a=l.find(d=>d.id===h.value),v()}),y.addEventListener("change",()=>{i=y.value,P(i,b?.value||""),v()}),b?.addEventListener("change",()=>P(i,b.value)),x.addEventListener("click",async()=>{if(p)return;const d=s().needsKey&&!b?.value?"":b?.value||"";if(s().needsKey&&!d){k.innerHTML=`<span class="text-rose-300">Please paste a free API key for ${n(s().label)}.</span>`;return}P(i,d);const C={};u.querySelectorAll("[data-var]").forEach(m=>C[m.dataset.var]=m.value);const T=a?A(a.prompt,C):"";p=!0,x.disabled=!0,x.textContent="⏳ Running…",k.innerHTML='<span class="text-slate-400">Generating with '+n(s().label)+" ("+n(L.value)+")…</span>",S.classList.add("hidden");try{const m=await K(s(),L.value,T);S.textContent=m,S.classList.remove("hidden"),k.innerHTML='<span class="text-emerald-300">Done ✓</span>'}catch(m){k.innerHTML=`<span class="text-rose-300">Error: ${n(String(m?.message||m))}. If a keyed provider fails, it may be a CORS or key issue — try Pollinations (no key).</span>`}finally{p=!1,x.disabled=!1,x.textContent="▶ Run prompt"}})}v()}U();
