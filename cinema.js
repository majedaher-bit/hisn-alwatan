(()=>{const rm=matchMedia('(prefers-reduced-motion:reduce)').matches,B=document.body,$=s=>document.querySelector(s);
const IM={castle:'castle-hero.jpg',homat:'homat-alwatan.webp',sky:'national-skyline.jpg'};
const MAP={mission:'sky',gallery:'sky',heroes:'homat',leadership:'sky',about:'castle',kids:'castle',medal:'castle'};
const bg=document.createElement('div');bg.id='cine-bg';bg.innerHTML=Object.keys(IM).map(k=>`<i data-k="${k}"></i>`).join('');B.prepend(bg);
const w=document.createElement('div');w.id='cine-wipe';B.appendChild(w);
document.querySelectorAll('.soldier-hero').forEach(i=>{const d=document.createElement('div');d.className='ken';i.replaceWith(d);d.appendChild(i)});
const io='IntersectionObserver'in window?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.06}):null;
function reveal(){if(!io||rm)return;setTimeout(()=>document.querySelectorAll('.view.on:not(#v-admin):not(#v-home) .card:not(.rv),.view.on:not(#v-admin) h2:not(.rv)').forEach(e=>{e.classList.add('rv');io.observe(e)}),60)}
function set(){const v=(location.hash||'#home').slice(1).split('?')[0]||'home',k=MAP[v]||'';B.dataset.view=v;
 bg.querySelectorAll('i').forEach(i=>{if(i.dataset.k===k&&!i.style.backgroundImage)i.style.backgroundImage=`url(${IM[k]})`;i.classList.toggle('on',i.dataset.k===k)});reveal()}
addEventListener('hashchange',()=>{set();if(!rm){w.classList.remove('go');void w.offsetWidth;w.classList.add('go')}});
addEventListener('pointermove',e=>{bg.style.setProperty('--mx',e.clientX+'px');bg.style.setProperty('--my',e.clientY+'px');
 const h=$('.museum-hall');if(h&&B.dataset.view==='museum'){const r=h.getBoundingClientRect();h.style.setProperty('--mx2',e.clientX-r.left+'px');h.style.setProperty('--my2',e.clientY-r.top+'px')}},{passive:true});
let tk=0;addEventListener('scroll',()=>{if(tk||rm)return;tk=1;requestAnimationFrame(()=>{tk=0;const h=$('.cinematic-hero');if(h&&B.dataset.view==='home')h.style.backgroundPositionY=`calc(50% + ${scrollY*.22}px)`})},{passive:true});
const c=document.createElement('canvas');c.id='cine-dust';B.prepend(c);const x=c.getContext('2d');let W,H;const P=[];
function rs(){W=c.width=innerWidth;H=c.height=innerHeight}rs();addEventListener('resize',rs);
for(let i=0;i<(innerWidth<700?24:48);i++)P.push({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.6+.4,s:Math.random()*.35+.1,a:Math.random()*6});
function dust(t){requestAnimationFrame(dust);x.clearRect(0,0,W,H);const v=B.dataset.view;if(document.hidden||['admin','fort','leadership'].includes(v))return;
 for(const p of P){p.y-=p.s;p.x+=Math.sin(t/2000+p.a)*.25;if(p.y<-5){p.y=H+5;p.x=Math.random()*W}x.fillStyle=`rgba(246,221,142,${.25+.35*Math.abs(Math.sin(t/900+p.a))})`;x.beginPath();x.arc(p.x,p.y,p.r,0,7);x.fill()}}
if(!rm)requestAnimationFrame(dust);
/* احتفال ذهبي عند إكمال الرحلة أو صنع الوسام */
const fx=document.createElement('canvas');fx.id='cine-fx';B.appendChild(fx);
function burst(){if(rm)return;const g=fx.getContext('2d');fx.width=innerWidth;fx.height=innerHeight;const q=[];for(let i=0;i<90;i++)q.push({x:innerWidth/2,y:innerHeight*.45,vx:(Math.random()-.5)*11,vy:-Math.random()*11-2,r:Math.random()*3+1.5,l:1});
 (function f(){g.clearRect(0,0,fx.width,fx.height);let a=0;for(const p of q){p.x+=p.vx;p.y+=p.vy;p.vy+=.28;p.l-=.011;if(p.l>0){a=1;g.fillStyle=`rgba(246,221,142,${p.l})`;g.beginPath();g.arc(p.x,p.y,p.r,0,7);g.fill()}}if(a)requestAnimationFrame(f);else g.clearRect(0,0,fx.width,fx.height)})()}
const md=$('#missionDone');if(md)new MutationObserver(()=>{if(!md.hidden)burst()}).observe(md,{attributes:true,attributeFilter:['hidden']});
const mr=$('#medalResult');if(mr)new MutationObserver(()=>{if(mr.children.length)burst()}).observe(mr,{childList:true});
set();})();
