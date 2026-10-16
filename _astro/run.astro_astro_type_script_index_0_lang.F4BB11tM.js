import{e as A,f as M}from"./markdown.BDLCQyIR.js";const E=[{id:"pollinations",label:"Pollinations — free, no key",models:["openai","mistral","llama","deepseek","phi"],needsKey:!1,help:"Runs instantly with zero setup. Fair-use limits apply."},{id:"gemini",label:"Google Gemini — free tier",models:["gemini-2.0-flash","gemini-1.5-flash","gemini-2.5-flash"],needsKey:!0,keyLabel:"Gemini API key",keyUrl:"https://aistudio.google.com/apikey",help:"Free tier, no credit card. Key is stored only in your browser."},{id:"groq",label:"Groq — free tier",models:["llama-3.3-70b-versatile","llama-3.1-8b-instant","mixtral-8x7b-32768","gemma2-9b-it"],needsKey:!0,keyLabel:"Groq API key",keyUrl:"https://console.groq.com/keys",help:"Very fast open models. Free tier, no credit card."},{id:"openrouter",label:"OpenRouter — free models",models:["meta-llama/llama-3.3-70b-instruct:free","deepseek/deepseek-chat:free","mistralai/mistral-7b-instruct:free","google/gemma-2-9b-it:free"],needsKey:!0,keyLabel:"OpenRouter API key",keyUrl:"https://openrouter.ai/keys",help:"Many free models behind one API. Free tier, no credit card."}];function o(t){return t.replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}function R(t){let e=document.getElementById("pf-toast");e||(e=document.createElement("div"),e.id="pf-toast",e.className="toast",document.body.appendChild(e)),e.textContent=t,e.classList.add("show"),clearTimeout(e._t),e._t=setTimeout(()=>e.classList.remove("show"),2200)}async function K(t,e){if(t.textContent="",!e)return;const s=e.length,w=Math.max(2,Math.ceil(s/90));let p=0;await new Promise(r=>{const l=()=>{p=Math.min(p+w,s),t.textContent=e.slice(0,p),p<s?requestAnimationFrame(l):r()};requestAnimationFrame(l)})}const O="pf.llm.key.";function P(t){return localStorage.getItem(O+t)||""}function C(t,e){localStorage.setItem(O+t,e)}async function U(t,e,s){if(t.id==="pollinations"){const b="https://text.pollinations.ai/"+encodeURIComponent(s)+`?model=${encodeURIComponent(e)}&system=${encodeURIComponent("You are a helpful, capable assistant.")}&private=true`,a=await fetch(b,{method:"GET"});if(!a.ok)throw new Error(`Pollinations ${a.status}`);return await a.text()}if(t.id==="gemini"){const b=P("gemini"),a=`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(e)}:generateContent?key=${encodeURIComponent(b)}`,g=await(await fetch(a,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{role:"user",parts:[{text:s}]}]})})).json();if(g.error)throw new Error(g.error.message||"Gemini error");return(g.candidates?.[0]?.content?.parts||[]).map(d=>d.text||"").join("").trim()||"(empty response)"}const w=P(t.id),p=t.id==="groq"?"https://api.groq.com/openai/v1/chat/completions":"https://openrouter.ai/api/v1/chat/completions",r={"Content-Type":"application/json",Authorization:`Bearer ${w}`};t.id==="openrouter"&&(r["HTTP-Referer"]=location.origin,r["X-Title"]="PromptForge");const u=await(await fetch(p,{method:"POST",headers:r,body:JSON.stringify({model:e,messages:[{role:"system",content:"You are a helpful, capable assistant."},{role:"user",content:s}]})})).json();if(u.error)throw new Error(u.error.message||"API error");return u.choices?.[0]?.message?.content?.trim()||"(empty response)"}function G(){const t=document.getElementById("run-data"),e=document.getElementById("run-app");if(!t||!e)return;const s=JSON.parse(t.textContent||"[]"),p=new URLSearchParams(location.search).get("prompt")||s[0]?.id||"";let r=s.find(n=>n.id===p)||s[0],l="pollinations",u=!1;const b=n=>({writing:"Writing",coding:"Coding",productivity:"Productivity",analysis:"Analysis",creative:"Creative",learning:"Learning",marketing:"Marketing",automation:"Automation"})[n]||n;function a(){return E.find(n=>n.id===l)}function k(){const n=a(),d=r?A(r.prompt):[],z=s.reduce((i,m)=>((i[m.category]||=[]).push(m),i),{}),$=Object.entries(z).map(([i,m])=>`<optgroup label="${o(b(i))}">`+m.map(f=>`<option value="${f.id}" ${f.id===(r?.id||"")?"selected":""}>${o(f.title)}</option>`).join("")+"</optgroup>").join("");e.innerHTML=`
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
      </div>`,g(n,d)}function g(n,d){const z=e.querySelector("#prompt-sel"),$=e.querySelector("#prompt-preview"),i=e.querySelector("#var-count"),m=e.querySelector("#vars"),f=e.querySelector("#provider-sel"),q=e.querySelector("#model-sel");e.querySelector("#key-wrap");const x=e.querySelector("#key-input"),h=e.querySelector("#run-btn"),v=e.querySelector("#status"),L=e.querySelector("#output"),I=e.querySelector("#output-wrap"),S=e.querySelector("#copy-output");$.value=r?.prompt||"",i.textContent=d.length?`${d.length} variable${d.length>1?"s":""}`:"",m.innerHTML=d.map(c=>`
        <div>
          <label class="text-xs text-zinc-400 font-mono">{{${o(c)}}}</label>
          <input data-var="${o(c)}" type="text" placeholder="value for ${o(c)}"
            class="w-full mt-1 py-2 px-3 rounded-xl bg-[#0b0b12] border border-[#282838] text-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500/50" />
        </div>`).join(""),z.addEventListener("change",()=>{r=s.find(c=>c.id===z.value),k()}),f.addEventListener("change",()=>{l=f.value,C(l,x?.value||""),k()}),x?.addEventListener("change",()=>C(l,x.value)),S.addEventListener("click",async()=>{const c=L.textContent||"";if(c)try{await navigator.clipboard.writeText(c),S.textContent="Copied ✓",R("Output copied to clipboard"),setTimeout(()=>S.textContent="Copy",1500)}catch{R("Copy failed")}}),h.addEventListener("click",async()=>{if(u)return;const c=a().needsKey&&!x?.value?"":x?.value||"";if(a().needsKey&&!c){v.innerHTML=`<span class="text-zinc-300">Please paste a free API key for ${o(a().label)}.</span>`;return}C(l,c);const T={};m.querySelectorAll("[data-var]").forEach(y=>T[y.dataset.var]=y.value);const j=r?M(r.prompt,T):"";u=!0,h.disabled=!0,h.textContent="Running…",v.innerHTML='<span class="text-zinc-400">Generating with '+o(a().label)+" ("+o(q.value)+")…</span>",I.classList.add("hidden");try{const y=await U(a(),q.value,j);I.classList.remove("hidden"),v.innerHTML='<span class="text-zinc-400">Streaming output…</span>',await K(L,y),v.innerHTML='<span class="text-zinc-300">Done ✓</span>'}catch(y){v.innerHTML=`<span class="text-zinc-300">Error: ${o(String(y?.message||y))}. If a keyed provider fails, it may be a CORS or key issue — try Pollinations (no key).</span>`}finally{u=!1,h.disabled=!1,h.textContent="▶ Run prompt"}})}k()}G();
