import{e as T,f as j}from"./markdown.BDLCQyIR.js";const C=[{id:"pollinations",label:"Pollinations — free, no key",models:["openai","mistral","llama","deepseek","phi"],needsKey:!1,help:"Runs instantly with zero setup. Fair-use limits apply."},{id:"gemini",label:"Google Gemini — free tier",models:["gemini-2.0-flash","gemini-1.5-flash","gemini-2.5-flash"],needsKey:!0,keyLabel:"Gemini API key",keyUrl:"https://aistudio.google.com/apikey",help:"Free tier, no credit card. Key is stored only in your browser."},{id:"groq",label:"Groq — free tier",models:["llama-3.3-70b-versatile","llama-3.1-8b-instant","mixtral-8x7b-32768","gemma2-9b-it"],needsKey:!0,keyLabel:"Groq API key",keyUrl:"https://console.groq.com/keys",help:"Very fast open models. Free tier, no credit card."},{id:"openrouter",label:"OpenRouter — free models",models:["meta-llama/llama-3.3-70b-instruct:free","deepseek/deepseek-chat:free","mistralai/mistral-7b-instruct:free","google/gemma-2-9b-it:free"],needsKey:!0,keyLabel:"OpenRouter API key",keyUrl:"https://openrouter.ai/keys",help:"Many free models behind one API. Free tier, no credit card."}];function n(o){return o.replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}const R="pf.llm.key.";function P(o){return localStorage.getItem(R+o)||""}function S(o,e){localStorage.setItem(R+o,e)}async function A(o,e,i){if(o.id==="pollinations"){const f="https://text.pollinations.ai/"+encodeURIComponent(i)+`?model=${encodeURIComponent(e)}&system=${encodeURIComponent("You are a helpful, capable assistant.")}&private=true`,r=await fetch(f,{method:"GET"});if(!r.ok)throw new Error(`Pollinations ${r.status}`);return await r.text()}if(o.id==="gemini"){const f=P("gemini"),r=`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(e)}:generateContent?key=${encodeURIComponent(f)}`,b=await(await fetch(r,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{role:"user",parts:[{text:i}]}]})})).json();if(b.error)throw new Error(b.error.message||"Gemini error");return(b.candidates?.[0]?.content?.parts||[]).map(c=>c.text||"").join("").trim()||"(empty response)"}const I=P(o.id),w=o.id==="groq"?"https://api.groq.com/openai/v1/chat/completions":"https://openrouter.ai/api/v1/chat/completions",a={"Content-Type":"application/json",Authorization:`Bearer ${I}`};o.id==="openrouter"&&(a["HTTP-Referer"]=location.origin,a["X-Title"]="PromptForge");const p=await(await fetch(w,{method:"POST",headers:a,body:JSON.stringify({model:e,messages:[{role:"system",content:"You are a helpful, capable assistant."},{role:"user",content:i}]})})).json();if(p.error)throw new Error(p.error.message||"API error");return p.choices?.[0]?.message?.content?.trim()||"(empty response)"}function K(){const o=document.getElementById("run-data"),e=document.getElementById("run-app");if(!o||!e)return;const i=JSON.parse(o.textContent||"[]"),w=new URLSearchParams(location.search).get("prompt")||i[0]?.id||"";let a=i.find(t=>t.id===w)||i[0],l="pollinations",p=!1;const f=t=>({writing:"Writing",coding:"Coding",productivity:"Productivity",analysis:"Analysis",creative:"Creative",learning:"Learning",marketing:"Marketing",automation:"Automation"})[t]||t;function r(){return C.find(t=>t.id===l)}function v(){const t=r(),c=a?T(a.prompt):[],h=i.reduce((s,u)=>((s[u.category]||=[]).push(u),s),{}),z=Object.entries(h).map(([s,u])=>`<optgroup label="${n(f(s))}">`+u.map(y=>`<option value="${y.id}" ${y.id===(a?.id||"")?"selected":""}>${n(y.title)}</option>`).join("")+"</optgroup>").join("");e.innerHTML=`
      <div class="grid lg:grid-cols-2 gap-6">
        <section class="panel p-5 space-y-4">
          <h2 class="font-semibold text-zinc-100">1 ยท Pick a prompt</h2>
          <select id="prompt-sel" class="w-full py-2.5 px-3 rounded-xl bg-[#0b0b12] border border-[#282838] text-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500/50">${z}</select>
          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="text-sm text-zinc-300">Prompt text</label>
              <span id="var-count" class="text-xs text-zinc-500"></span>
            </div>
            <textarea id="prompt-preview" readonly class="w-full h-48 p-3 rounded-xl bg-[#0b0b12] border border-[#282838] text-zinc-300 text-sm font-mono focus:outline-none"></textarea>
          </div>
          <div id="vars" class="space-y-2"></div>
        </section>

        <section class="panel p-5 space-y-4">
          <h2 class="font-semibold text-zinc-100">2 ยท Choose a free provider</h2>
          <div>
            <label class="text-sm text-zinc-300">Provider</label>
            <select id="provider-sel" class="w-full mt-1 py-2.5 px-3 rounded-xl bg-[#0b0b12] border border-[#282838] text-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500/50">
              ${C.map(s=>`<option value="${s.id}" ${s.id===l?"selected":""}>${n(s.label)}</option>`).join("")}
            </select>
            <p class="text-xs text-zinc-500 mt-1">${n(t.help)}</p>
          </div>
          <div>
            <label class="text-sm text-zinc-300">Model</label>
            <select id="model-sel" class="w-full mt-1 py-2.5 px-3 rounded-xl bg-[#0b0b12] border border-[#282838] text-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500/50">
              ${t.models.map(s=>`<option>${n(s)}</option>`).join("")}
            </select>
          </div>
          <div id="key-wrap" class="${t.needsKey?"":"hidden"}">
            <label class="text-sm text-zinc-300">${n(t.keyLabel||"API key")}</label>
            <input id="key-input" type="password" placeholder="Paste your key (stored locally)" value="${n(P(l))}"
              class="w-full mt-1 py-2.5 px-3 rounded-xl bg-[#0b0b12] border border-[#282838] text-zinc-200 text-sm placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/50" />
            ${t.keyUrl?`<a href="${n(t.keyUrl)}" target="_blank" rel="noopener" class="text-xs text-zinc-300 underline">Get a free key →</a>`:""}
          </div>
          <button id="run-btn" class="btn-primary w-full py-3">โ–ถ Run prompt</button>
          <div id="status" class="text-sm text-zinc-400"></div>
          <div id="output" class="hidden panel p-4 whitespace-pre-wrap text-zinc-200 text-sm leading-relaxed max-h-96 overflow-y-auto"></div>
        </section>
      </div>`,b(t,c)}function b(t,c){const h=e.querySelector("#prompt-sel"),z=e.querySelector("#prompt-preview"),s=e.querySelector("#var-count"),u=e.querySelector("#vars"),y=e.querySelector("#provider-sel"),q=e.querySelector("#model-sel");e.querySelector("#key-wrap");const g=e.querySelector("#key-input"),x=e.querySelector("#run-btn"),k=e.querySelector("#status"),$=e.querySelector("#output");z.value=a?.prompt||"",s.textContent=c.length?`${c.length} variable${c.length>1?"s":""}`:"",u.innerHTML=c.map(d=>`
        <div>
          <label class="text-xs text-zinc-400 font-mono">{{${n(d)}}}</label>
          <input data-var="${n(d)}" type="text" placeholder="value for ${n(d)}"
            class="w-full mt-1 py-2 px-3 rounded-xl bg-[#0b0b12] border border-[#282838] text-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500/50" />
        </div>`).join(""),h.addEventListener("change",()=>{a=i.find(d=>d.id===h.value),v()}),y.addEventListener("change",()=>{l=y.value,S(l,g?.value||""),v()}),g?.addEventListener("change",()=>S(l,g.value)),x.addEventListener("click",async()=>{if(p)return;const d=r().needsKey&&!g?.value?"":g?.value||"";if(r().needsKey&&!d){k.innerHTML=`<span class="text-zinc-300">Please paste a free API key for ${n(r().label)}.</span>`;return}S(l,d);const L={};u.querySelectorAll("[data-var]").forEach(m=>L[m.dataset.var]=m.value);const E=a?j(a.prompt,L):"";p=!0,x.disabled=!0,x.textContent="Running…",k.innerHTML='<span class="text-zinc-400">Generating with '+n(r().label)+" ("+n(q.value)+")…</span>",$.classList.add("hidden");try{const m=await A(r(),q.value,E);$.textContent=m,$.classList.remove("hidden"),k.innerHTML='<span class="text-zinc-300">Done โ“</span>'}catch(m){k.innerHTML=`<span class="text-zinc-300">Error: ${n(String(m?.message||m))}. If a keyed provider fails, it may be a CORS or key issue — try Pollinations (no key).</span>`}finally{p=!1,x.disabled=!1,x.textContent="โ–ถ Run prompt"}})}v()}K();
