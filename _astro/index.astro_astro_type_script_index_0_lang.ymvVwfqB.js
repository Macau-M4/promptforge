import{e as k}from"./markdown.BDLCQyIR.js";function p(e){return e.upvotes-e.downvotes}function I(e,a=new Date){const o=new Date(e+"T00:00:00Z").getTime(),i=a.getTime()-o;return Math.max(0,i/864e5)}function N(e,a=new Date,o=7){return 1/(1+I(e,a)/o)}function y(e,a=new Date,o=7){return p(e)*N(e.updated,a,o)}const w={writing:"✍️ Writing",coding:"💻 Coding",productivity:"⚡ Productivity",analysis:"🔬 Analysis",creative:"🎨 Creative",learning:"📚 Learning",marketing:"📣 Marketing",automation:"🤖 Automation"},E="pf.votes",$="/promptforge/";function B(){try{return JSON.parse(localStorage.getItem(E)||"{}")}catch{return{}}}function D(e){localStorage.setItem(E,JSON.stringify(e))}function u(e){return e.replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}function v(e,a){const o=e.upvotes+(a===1?1:0),i=e.downvotes+(a===-1?1:0);return{up:o,down:i,score:o-i}}function M(){const e=document.getElementById("prompts-data");if(!e)return;const a=JSON.parse(e.textContent||"[]"),o=document.getElementById("browser");if(!o)return;const i=B();o.innerHTML=`
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
    </div>`;const x=o.querySelector("#search"),m=o.querySelector("#sort"),b=o.querySelector("#difficulty"),h=o.querySelector("#cats"),g=o.querySelector("#grid"),S=o.querySelector("#count"),C=o.querySelector("#empty");let f="all";const L=["all",...Array.from(new Set(a.map(t=>t.category)))];h.innerHTML=L.map(t=>`<button data-cat="${t}" class="chip border ${t==="all"?"bg-indigo-500/15 border-indigo-500/40 text-indigo-200":"bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"}">${t==="all"?"All":w[t]||t}</button>`).join(""),h.querySelectorAll("[data-cat]").forEach(t=>t.addEventListener("click",()=>{f=t.dataset.cat,d()})),x.addEventListener("input",d),m.addEventListener("change",d),b.addEventListener("change",d);function T(){const t=x.value.trim().toLowerCase(),s=b.value;return a.filter(n=>f!=="all"&&n.category!==f||s!=="all"&&n.difficulty!==s?!1:t?`${n.title} ${n.description} ${n.tags.join(" ")} ${n.category}`.toLowerCase().includes(t):!0)}function q(t){const s=m.value,n=r=>({...r,upvotes:v(r,i[r.id]||0).up,downvotes:v(r,i[r.id]||0).down}),l=t.map(n);return s==="top"?l.sort((r,c)=>p(c)-p(r)):s==="newest"?l.sort((r,c)=>r.updated<c.updated?1:-1):l.sort((r,c)=>y(c)-y(r)||p(c)-p(r))}function A(t){const s=i[t.id]||0,{up:n,down:l}=v(t,s),r=k(t.prompt).length;return`
      <article class="panel p-5 flex flex-col gap-3 animate-fade-in">
        <div class="flex items-start gap-3">
          <div class="flex flex-col items-center gap-1 shrink-0">
            <button data-vote="${t.id}" data-dir="1" class="vote-btn grid place-items-center w-9 h-9 rounded-lg border ${s===1?"bg-indigo-500/20 border-indigo-500/50 text-indigo-200":"bg-white/5 border-white/10 text-slate-400 hover:text-indigo-300 hover:border-indigo-500/40"} transition-colors" aria-label="upvote">▲</button>
            <span class="text-sm font-semibold text-slate-100" data-score="${t.id}">${n-l}</span>
            <button data-vote="${t.id}" data-dir="-1" class="vote-btn grid place-items-center w-9 h-9 rounded-lg border ${s===-1?"bg-rose-500/20 border-rose-500/50 text-rose-200":"bg-white/5 border-white/10 text-slate-400 hover:text-rose-300 hover:border-rose-500/40"} transition-colors" aria-label="downvote">▼</button>
          </div>
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2 mb-1.5 flex-wrap">
              <span class="chip bg-indigo-500/10 border border-indigo-500/30 text-indigo-200">${u(w[t.category]||t.category)}</span>
              <span class="chip bg-white/5 border border-white/10 text-slate-400 capitalize">${u(t.difficulty)}</span>
            </div>
            <h3 class="font-semibold text-slate-100 leading-snug"><a href="${$}prompts/${t.id}" class="hover:text-indigo-300">${u(t.title)}</a></h3>
            <p class="text-sm text-slate-400 mt-1 line-clamp-2">${u(t.description)}</p>
          </div>
        </div>
        <div class="flex flex-wrap gap-1">
          ${t.tags.map(c=>`<span class="chip bg-white/5 border border-white/10 text-slate-500">#${u(c)}</span>`).join("")}
        </div>
        <div class="mt-auto flex items-center gap-2 pt-1 border-t border-white/5 text-xs">
          <button data-copy="${t.id}" class="btn-ghost px-2.5 py-1.5 text-xs">📋 Copy</button>
          <a href="${$}run?prompt=${t.id}" class="btn-ghost px-2.5 py-1.5 text-xs">▶ Run</a>
          ${r>0?`<span class="text-slate-500 ml-auto">${r} variable${r>1?"s":""}</span>`:`<span class="text-slate-500 ml-auto">${u(t.model)}</span>`}
        </div>
      </article>`}function d(){const t=q(T());g.innerHTML=t.map(A).join(""),S.textContent=`${t.length} prompt${t.length===1?"":"s"}`,C.classList.toggle("hidden",t.length>0),j()}function j(){g.querySelectorAll("[data-vote]").forEach(t=>t.addEventListener("click",()=>{const s=t.dataset.vote,n=Number(t.dataset.dir),l=i[s]||0;i[s]=l===n?0:n,D(i),d()})),g.querySelectorAll("[data-copy]").forEach(t=>t.addEventListener("click",async()=>{const s=t.dataset.copy,n=a.find(l=>l.id===s);if(n)try{await navigator.clipboard.writeText(n.prompt),t.textContent="✅ Copied",setTimeout(()=>t.textContent="📋 Copy",1500)}catch{t.textContent="⚠️ Copy failed"}}))}d()}M();
