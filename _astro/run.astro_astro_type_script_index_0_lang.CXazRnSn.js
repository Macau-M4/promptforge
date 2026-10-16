import{e as j,f as A}from"./markdown.BDLCQyIR.js";const E=[{id:"pollinations",label:"Pollinations — free, no key",models:["openai","mistral","llama","deepseek","phi"],needsKey:!1,help:"Runs instantly with zero setup. Fair-use limits apply."},{id:"gemini",label:"Google Gemini — free tier",models:["gemini-2.0-flash","gemini-1.5-flash","gemini-2.5-flash"],needsKey:!0,keyLabel:"Gemini API key",keyUrl:"https://aistudio.google.com/apikey",help:"Free tier, no credit card. Key is stored only in your browser."},{id:"groq",label:"Groq — free tier",models:["llama-3.3-70b-versatile","llama-3.1-8b-instant","mixtral-8x7b-32768","gemma2-9b-it"],needsKey:!0,keyLabel:"Groq API key",keyUrl:"https://console.groq.com/keys",help:"Very fast open models. Free tier, no credit card."},{id:"openrouter",label:"OpenRouter — free models",models:["meta-llama/llama-3.3-70b-instruct:free","deepseek/deepseek-chat:free","mistralai/mistral-7b-instruct:free","google/gemma-2-9b-it:free"],needsKey:!0,keyLabel:"OpenRouter API key",keyUrl:"https://openrouter.ai/keys",help:"Many free models behind one API. Free tier, no credit card."}];function o(t){return t.replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}function R(t){let e=document.getElementById("pf-toast");e||(e=document.createElement("div"),e.id="pf-toast",e.className="toast",document.body.appendChild(e)),e.textContent=t,e.classList.add("show"),clearTimeout(e._t),e._t=setTimeout(()=>e.classList.remove("show"),2200)}async function K(t,e){if(t.textContent="",!e)return;const r=e.length,w=Math.min(1800,Math.max(400,r*4)),b=performance.now();await new Promise(s=>{const l=p=>{const d=Math.min((p-b)/w,1);t.textContent=e.slice(0,Math.floor(r*(1-Math.pow(1-d,3)))),d<1?requestAnimationFrame(l):(t.textContent=e,s())};requestAnimationFrame(l)})}const M="pf.llm.key.";function P(t){return localStorage.getItem(M+t)||""}function S(t,e){localStorage.setItem(M+t,e)}async function U(t,e,r){if(t.id==="pollinations"){const d="https://text.pollinations.ai/"+encodeURIComponent(r)+`?model=${encodeURIComponent(e)}&system=${encodeURIComponent("You are a helpful, capable assistant.")}&private=true`,a=await fetch(d,{method:"GET"});if(!a.ok)throw new Error(`Pollinations ${a.status}`);return await a.text()}if(t.id==="gemini"){const d=P("gemini"),a=`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(e)}:generateContent?key=${encodeURIComponent(d)}`,g=await(await fetch(a,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{role:"user",parts:[{text:r}]}]})})).json();if(g.error)throw new Error(g.error.message||"Gemini error");return(g.candidates?.[0]?.content?.parts||[]).map(u=>u.text||"").join("").trim()||"(empty response)"}const w=P(t.id),b=t.id==="groq"?"https://api.groq.com/openai/v1/chat/completions":"https://openrouter.ai/api/v1/chat/completions",s={"Content-Type":"application/json",Authorization:`Bearer ${w}`};t.id==="openrouter"&&(s["HTTP-Referer"]=location.origin,s["X-Title"]="PromptForge");const p=await(await fetch(b,{method:"POST",headers:s,body:JSON.stringify({model:e,messages:[{role:"system",content:"You are a helpful, capable assistant."},{role:"user",content:r}]})})).json();if(p.error)throw new Error(p.error.message||"API error");return p.choices?.[0]?.message?.content?.trim()||"(empty response)"}function G(){const t=document.getElementById("run-data"),e=document.getElementById("run-app");if(!t||!e)return;const r=JSON.parse(t.textContent||"[]"),b=new URLSearchParams(location.search).get("prompt")||r[0]?.id||"";let s=r.find(n=>n.id===b)||r[0],l="pollinations",p=!1;const d=n=>({writing:"Writing",coding:"Coding",productivity:"Productivity",analysis:"Analysis",creative:"Creative",learning:"Learning",marketing:"Marketing",automation:"Automation"})[n]||n;function a(){return E.find(n=>n.id===l)}function k(){const n=a(),u=s?j(s.prompt):[],z=r.reduce((i,m)=>((i[m.category]||=[]).push(m),i),{}),$=Object.entries(z).map(([i,m])=>`<optgroup label="${o(d(i))}">`+m.map(f=>`<option value="${f.id}" ${f.id===(s?.id||"")?"selected":""}>${o(f.title)}</option>`).join("")+"</optgroup>").join("");e.innerHTML=`
      <div class="grid lg:grid-cols-2 gap-6">
        <section class="panel p-5 space-y-4">
          <h2 class="font-semibold text-zinc-100">1 · Pick a prompt</h2>
          <select id="prompt-sel" class="w-full py-2.5 px-3 rounded-xl bg-[#0b0b12] border border-[#282838] text-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500/50">${$}</select>
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
          <h2 class="font-semibold text-zinc-100">2 · Choose a free provider</h2>
          <div>
            <label class="text-sm text-zinc-300">Provider</label>
            <select id="provider-sel" class="w-full mt-1 py-2.5 px-3 rounded-xl bg-[#0b0b12] border border-[#282838] text-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500/50">
              ${E.map(i=>`<option value="${i.id}" ${i.id===l?"selected":""}>${o(i.label)}</option>`).join("")}
            </select>
            <p class="text-xs text-zinc-500 mt-1">${o(n.help)}</p>
          </div>
          <div>
            <label class="text-sm text-zinc-300">Model</label>
            <select id="model-sel" class="w-full mt-1 py-2.5 px-3 rounded-xl bg-[#0b0b12] border border-[#282838] text-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500/50">
              ${n.models.map(i=>`<option>${o(i)}</option>`).join("")}
            </select>
          </div>
          <div id="key-wrap" class="${n.needsKey?"":"hidden"}">
            <label class="text-sm text-zinc-300">${o(n.keyLabel||"API key")}</label>
            <input id="key-input" type="password" placeholder="Paste your key (stored locally)" value="${o(P(l))}"
              class="w-full mt-1 py-2.5 px-3 rounded-xl bg-[#0b0b12] border border-[#282838] text-zinc-200 text-sm placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500/50" />
            ${n.keyUrl?`<a href="${o(n.keyUrl)}" target="_blank" rel="noopener" class="text-xs text-zinc-300 underline">Get a free key →</a>`:""}
          </div>
          <button id="run-btn" class="btn-primary w-full py-3">▶ Run prompt</button>
          <div id="status" class="text-sm text-zinc-400"></div>
          <div id="output-wrap" class="hidden">
            <div class="flex items-center justify-between mb-2">
              <span class="mono-label">Output</span>
              <button id="copy-output" class="btn-ghost px-2.5 py-1 text-xs">Copy</button>
            </div>
            <div id="output" class="panel p-4 whitespace-pre-wrap text-zinc-200 text-sm leading-relaxed max-h-96 overflow-y-auto"></div>
          </div>
        </section>
      </div>`,g(n,u)}function g(n,u){const z=e.querySelector("#prompt-sel"),$=e.querySelector("#prompt-preview"),i=e.querySelector("#var-count"),m=e.querySelector("#vars"),f=e.querySelector("#provider-sel"),q=e.querySelector("#model-sel");e.querySelector("#key-wrap");const x=e.querySelector("#key-input"),h=e.querySelector("#run-btn"),v=e.querySelector("#status"),L=e.querySelector("#output"),I=e.querySelector("#output-wrap"),C=e.querySelector("#copy-output");$.value=s?.prompt||"",i.textContent=u.length?`${u.length} variable${u.length>1?"s":""}`:"",m.innerHTML=u.map(c=>`
        <div>
          <label class="text-xs text-zinc-400 font-mono">{{${o(c)}}}</label>
          <input data-var="${o(c)}" type="text" placeholder="value for ${o(c)}"
            class="w-full mt-1 py-2 px-3 rounded-xl bg-[#0b0b12] border border-[#282838] text-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500/50" />
        </div>`).join(""),z.addEventListener("change",()=>{s=r.find(c=>c.id===z.value),k()}),f.addEventListener("change",()=>{l=f.value,S(l,x?.value||""),k()}),x?.addEventListener("change",()=>S(l,x.value)),C.addEventListener("click",async()=>{const c=L.textContent||"";if(c)try{await navigator.clipboard.writeText(c),C.textContent="Copied ✓",R("Output copied to clipboard"),setTimeout(()=>C.textContent="Copy",1500)}catch{R("Copy failed")}}),h.addEventListener("click",async()=>{if(p)return;const c=a().needsKey&&!x?.value?"":x?.value||"";if(a().needsKey&&!c){v.innerHTML=`<span class="text-zinc-300">Please paste a free API key for ${o(a().label)}.</span>`;return}S(l,c);const T={};m.querySelectorAll("[data-var]").forEach(y=>T[y.dataset.var]=y.value);const O=s?A(s.prompt,T):"";p=!0,h.disabled=!0,h.textContent="Running…",v.innerHTML='<span class="text-zinc-400">Generating with '+o(a().label)+" ("+o(q.value)+")…</span>",I.classList.add("hidden");try{const y=await U(a(),q.value,O);I.classList.remove("hidden"),v.innerHTML='<span class="text-zinc-400">Streaming output…</span>',await K(L,y),v.innerHTML='<span class="text-zinc-300">Done ✓</span>'}catch(y){v.innerHTML=`<span class="text-zinc-300">Error: ${o(String(y?.message||y))}. If a keyed provider fails, it may be a CORS or key issue — try Pollinations (no key).</span>`}finally{p=!1,h.disabled=!1,h.textContent="▶ Run prompt"}})}k()}G();
