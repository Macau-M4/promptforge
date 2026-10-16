import{e as M}from"./markdown.BDLCQyIR.js";function p(o){return o.upvotes-o.downvotes}function N(o,r=new Date){const n=new Date(o+"T00:00:00Z").getTime(),i=r.getTime()-n;return Math.max(0,i/864e5)}function B(o,r=new Date,n=7){return 1/(1+N(o,r)/n)}function w(o,r=new Date,n=7){return p(o)*B(o.updated,r,n)}const $={writing:"✍️ Writing",coding:"💻 Coding",productivity:"⚡ Productivity",analysis:"🔬 Analysis",creative:"🎨 Creative",learning:"📚 Learning",marketing:"📣 Marketing",automation:"🤖 Automation"},S="pf.votes",E="/promptforge/";function D(){try{return JSON.parse(localStorage.getItem(S)||"{}")}catch{return{}}}function O(o){localStorage.setItem(S,JSON.stringify(o))}function u(o){return o.replace(/[&<>"']/g,r=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[r])}function m(o,r){const n=o.upvotes+(r===1?1:0),i=o.downvotes+(r===-1?1:0);return{up:n,down:i,score:n-i}}function V(){const o=document.getElementById("prompts-data");if(!o)return;const r=JSON.parse(o.textContent||"[]"),n=document.getElementById("browser");if(!n)return;const i=D();n.innerHTML=`
    <div class="space-y-6">
      <div class="flex flex-col lg:flex-row gap-3 lg:items-center">
        <div class="relative flex-1">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
          <input id="search" type="search" placeholder="Search prompts, tags, categories…"
            class="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#11111a] border border-[#282838] text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
        </div>
        <div class="flex items-center gap-2">
          <select id="sort" class="py-2.5 px-3 rounded-xl bg-[#11111a] border border-[#282838] text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50">
            <option value="trending">🔥 Trending</option>
            <option value="top">⭐ Top rated</option>
            <option value="newest">🕒 Newest</option>
          </select>
          <select id="difficulty" class="py-2.5 px-3 rounded-xl bg-[#11111a] border border-[#282838] text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50">
            <option value="all">All levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>
      <div id="cats" class="flex flex-wrap gap-2"></div>
      <div class="flex items-center justify-between text-sm text-slate-400">
        <span id="count"></span>
      </div>
      <div id="grid" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"></div>
      <div id="empty" class="hidden panel p-10 text-center text-slate-400">No prompts match. Try a different search or clear filters.</div>
    </div>`;const x=n.querySelector("#search"),h=n.querySelector("#sort"),b=n.querySelector("#difficulty"),y=n.querySelector("#cats"),g=n.querySelector("#grid"),C=n.querySelector("#count"),L=n.querySelector("#empty");let f="all",v=!0;const T=["all",...Array.from(new Set(r.map(t=>t.category)))];y.innerHTML=T.map(t=>`<button data-cat="${t}" class="chip border ${t==="all"?"bg-indigo-500/15 border-indigo-500/40 text-indigo-200":"bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"}">${t==="all"?"All":$[t]||t}</button>`).join(""),y.querySelectorAll("[data-cat]").forEach(t=>t.addEventListener("click",()=>{f=t.dataset.cat,c()})),x.addEventListener("input",c),h.addEventListener("change",c),b.addEventListener("change",c);function q(){const t=x.value.trim().toLowerCase(),a=b.value;return r.filter(e=>f!=="all"&&e.category!==f||a!=="all"&&e.difficulty!==a?!1:t?`${e.title} ${e.description} ${e.tags.join(" ")} ${e.category}`.toLowerCase().includes(t):!0)}function A(t){const a=h.value,e=s=>({...s,upvotes:m(s,i[s.id]||0).up,downvotes:m(s,i[s.id]||0).down}),l=t.map(e);return a==="top"?l.sort((s,d)=>p(d)-p(s)):a==="newest"?l.sort((s,d)=>s.updated<d.updated?1:-1):l.sort((s,d)=>w(d)-w(s)||p(d)-p(s))}function j(t,a){const e=i[t.id]||0,{up:l,down:s}=m(t,e),d=M(t.prompt).length;return`
      <article class="panel card-lift p-5 flex flex-col gap-3" ${v?`data-reveal data-reveal-delay="${Math.min(a*45,300)}"`:""}>
        <div class="flex items-start gap-3">
          <div class="flex flex-col items-center gap-1 shrink-0">
            <button data-vote="${t.id}" data-dir="1" class="vote-btn grid place-items-center w-9 h-9 rounded-lg border ${e===1?"bg-indigo-500/20 border-indigo-500/50 text-indigo-200":"bg-white/5 border-white/10 text-slate-400 hover:text-indigo-300 hover:border-indigo-500/40"} transition-colors" aria-label="upvote">▲</button>
            <span class="text-sm font-semibold text-slate-100" data-score="${t.id}">${l-s}</span>
            <button data-vote="${t.id}" data-dir="-1" class="vote-btn grid place-items-center w-9 h-9 rounded-lg border ${e===-1?"bg-rose-500/20 border-rose-500/50 text-rose-200":"bg-white/5 border-white/10 text-slate-400 hover:text-rose-300 hover:border-rose-500/40"} transition-colors" aria-label="downvote">▼</button>
          </div>
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2 mb-1.5 flex-wrap">
              <span class="chip bg-indigo-500/10 border border-indigo-500/30 text-indigo-200">${u($[t.category]||t.category)}</span>
              <span class="chip bg-white/5 border border-white/10 text-slate-400 capitalize">${u(t.difficulty)}</span>
            </div>
            <h3 class="font-semibold text-slate-100 leading-snug"><a href="${E}prompts/${t.id}" class="hover:text-indigo-300">${u(t.title)}</a></h3>
            <p class="text-sm text-slate-400 mt-1 line-clamp-2">${u(t.description)}</p>
          </div>
        </div>
        <div class="flex flex-wrap gap-1">
          ${t.tags.map(I=>`<span class="chip bg-white/5 border border-white/10 text-slate-500">#${u(I)}</span>`).join("")}
        </div>
        <div class="mt-auto flex items-center gap-2 pt-1 border-t border-white/5 text-xs">
          <button data-copy="${t.id}" class="btn-ghost px-2.5 py-1.5 text-xs">📋 Copy</button>
          <a href="${E}run?prompt=${t.id}" class="btn-ghost px-2.5 py-1.5 text-xs">▶ Run</a>
          ${d>0?`<span class="text-slate-500 ml-auto">${d} variable${d>1?"s":""}</span>`:`<span class="text-slate-500 ml-auto">${u(t.model)}</span>`}
        </div>
      </article>`}function c(){const t=A(q());g.innerHTML=t.map((a,e)=>j(a,e)).join(""),C.textContent=`${t.length} prompt${t.length===1?"":"s"}`,L.classList.toggle("hidden",t.length>0),k(),v&&(v=!1,document.dispatchEvent(new CustomEvent("pf:reveal")))}function k(){g.querySelectorAll("[data-vote]").forEach(t=>t.addEventListener("click",()=>{const a=t.dataset.vote,e=Number(t.dataset.dir),l=i[a]||0;i[a]=l===e?0:e,O(i),c()})),g.querySelectorAll("[data-copy]").forEach(t=>t.addEventListener("click",async()=>{const a=t.dataset.copy,e=r.find(l=>l.id===a);if(e)try{await navigator.clipboard.writeText(e.prompt),t.textContent="✅ Copied",setTimeout(()=>t.textContent="📋 Copy",1500)}catch{t.textContent="⚠️ Copy failed"}}))}c()}V();
