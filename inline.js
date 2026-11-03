
const $=s=>document.querySelector(s),GOAL=100;
// إعداد الاتصال: الصقي رابط المشروع والمفتاح العام Publishable هنا فقط.
// لا تضعي Secret key أو service_role في هذا الملف.
const SUPABASE_URL='https://phedhelvxhemghsjjdle.supabase.co';
const SUPABASE_ANON_KEY='sb_publishable_fOeHkLPSEkkZiyohxlucCw_6tpaqk4b';
const CONFIGURED=SUPABASE_URL.startsWith('https://') && !SUPABASE_ANON_KEY.startsWith('PASTE');
let sb=null,DB=[],ADMIN=false;
if(CONFIGURED&&window.supabase)sb=supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY);
async function ensureUser(){let {data:{session}}=await sb.auth.getSession();if(!session){const r=await sb.auth.signInAnonymously();if(r.error)throw r.error;session=r.data.session}return session.user.id}
async function hydrate(){if(!sb)return;for(const e of document.querySelectorAll('[data-mp]:not([src])')){const {data}=await sb.storage.from('media').createSignedUrl(e.dataset.mp,3600);if(data)e.src=data.signedUrl}}
const mapR=r=>({id:r.id,n:r.name,c:r.category,r:r.region||'',t:r.type,h:r.title,x:r.body,s:r.status,mp:r.media_path,mt:r.media_type});
const toast=m=>{$('#mb').innerHTML='<p>'+esc(m)+'</p>';$('#modal').classList.add('on')};
const media=d=>!d.mp||!sb?'':d.mt==='image'?`<img data-mp="${d.mp}" style="max-width:100%;border-radius:10px" loading="lazy" alt="">`:d.mt==='video'?`<video data-mp="${d.mp}" controls playsinline preload="metadata" style="max-width:100%;border-radius:10px"></video>`:`<audio data-mp="${d.mp}" controls style="width:100%"></audio>`;
async function load(){if(!sb){render();return}
 const {data,error}=await sb.from('submissions').select('id,name,category,region,type,title,body,media_path,media_type,status,created_at').order('created_at',{ascending:false});
 if(error)toast('تعذر تحميل البيانات: '+error.message);else DB=data.map(mapR);render()}
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const ap=()=>DB.filter(d=>d.s==='approved');
// Audio starts from a real user gesture (Safari requirement). Navigation does not restart it.
const song=$('#nationalSong');
const soundButton=$('#snd');
let soundWanted=true;
function updateSoundButton(){
 const playing=!song.paused&&!song.muted;
 soundButton.textContent=playing?'🔊':'🔇';
 soundButton.setAttribute('aria-label',playing?'كتم أغنية بلادي':'تشغيل أغنية بلادي');
 soundButton.setAttribute('aria-pressed',String(playing));
}
function startSong(){
 soundWanted=true; song.muted=false;
 if(!song.paused){updateSoundButton();return;}
 const promise=song.play();
 if(promise&&typeof promise.catch==='function')promise.catch(err=>{
  updateSoundButton();console.warn('تعذر تشغيل أغنية بلادي:',err);
 });
 updateSoundButton();
}
function beep(){} // National song replaces synthetic effects.
soundButton.onclick=()=>{
 if(!song.paused&&!song.muted){soundWanted=false;song.pause();}
 else startSong();
 updateSoundButton();
};
song.addEventListener('play',updateSoundButton);
song.addEventListener('pause',updateSoundButton);
song.addEventListener('error',()=>{updateSoundButton();console.warn('تعذر تحميل ملف biladi.m4a');});
function closeGate(){document.querySelector('#gate').style.display='none';}
$('#enter').onclick=()=>{
 startSong();const g=$('#gate');g.classList.add('go');
 setTimeout(()=>{g.classList.add('open');$('#glow').classList.add('on');$('#welcome').style.opacity=1;},50);
 setTimeout(closeGate,3600);
};
$('#skip').onclick=()=>{startSong();closeGate();};
// router
const views=['home','mission','submit','fort','gallery','heroes','leadership','kids','museum','wall','medal','about','admin'];
function route(){let h=(location.hash||'#home').slice(1);if(!views.includes(h))h='home';
 document.querySelectorAll('.view').forEach(v=>v.classList.toggle('on',v.id==='v-'+h));
 document.querySelectorAll('nav a').forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+h));
 if(h==='fort')setTimeout(()=>{resize();syncBricks()},50);scrollTo(0,0)}
addEventListener('hashchange',route);
// Admin queue shows pending submissions by default. Historical submissions remain accessible.
let ADMIN_HISTORY=false;
$('#showPending').onclick=()=>{ADMIN_HISTORY=false;render()};
$('#showHistory').onclick=()=>{ADMIN_HISTORY=true;render()};
// render
function render(){$('#login').style.display=ADMIN?'none':'block';$('#panel').style.display=ADMIN?'block':'none';$('#pst').style.display=ADMIN?'':'none';$('#cfg').style.display=CONFIGURED?'none':'block';const a=ap().length,p=DB.filter(d=>d.s==='pending').length,pc=Math.min(100,Math.round(a/GOAL*100))+'%';
 document.querySelectorAll('[data-c=approved]').forEach(e=>e.textContent=a);
 document.querySelectorAll('[data-c=pending]').forEach(e=>e.textContent=p);
 $('#pct').textContent=pc;$('#pct2').textContent=pc;$('#goalTxt').textContent=GOAL+' لبنة';
 const q=$('#q').value.trim();
 $('#gl').innerHTML=ap().filter(d=>d.h.includes(q)).map(d=>`<div class="msg"><b>${esc(d.h)}</b><span class="tag">${esc(d.t)}</span><br>${esc(d.x)}<br>${media(d)}<br><small>— ${esc(d.n)} (${esc(d.c)}${d.r?'، '+esc(d.r):''})</small></div>`).join('')||'<p style="opacity:.8">لا توجد مشاركات معتمدة بعد.</p>';
 $('#adminQueueTitle').textContent=ADMIN_HISTORY?'سجل المشاركات المعتمدة والمرفوضة ('+DB.filter(d=>d.s!=='pending').length+')':'مشاركات بانتظار المراجعة ('+p+')';
 $('#showPending').className=ADMIN_HISTORY?'btn alt':'btn';$('#showHistory').className=ADMIN_HISTORY?'btn':'btn alt';
 $('#al').innerHTML=DB.filter(d=>ADMIN_HISTORY?d.s!=='pending':d.s==='pending').map(d=>`<div class="msg"><b>${esc(d.h)}</b> <span class="tag">${d.s==='approved'?'معتمدة':d.s==='rejected'?'مرفوضة':'قيد الانتظار'}</span><br>${esc(d.x)}<br>${media(d)}<br><small>${esc(d.n)} · ${esc(d.c)}${d.r?' · '+esc(d.r):''}</small><br>
 ${d.s==='pending'?`<button type="button" class="btn" data-action="approved" data-id="${esc(d.id)}">قبول</button><button type="button" class="btn alt" data-action="rejected" data-id="${esc(d.id)}">رفض</button><button type="button" class="btn alt" data-action="pending" data-id="${esc(d.id)}">إخفاء</button>`:`<button type="button" class="btn alt" data-action="pending" data-id="${esc(d.id)}">إعادة إلى الانتظار</button>`}<button type="button" class="btn alt" data-action="delete" data-id="${esc(d.id)}">حذف</button></div>`).join('')||(ADMIN_HISTORY?'<p>لا توجد مشاركات سابقة.</p>':'<p>لا توجد مشاركات تنتظر المراجعة.</p>');
 syncBricks();hydrate();refreshExperiences()}
// Admin actions use delegated clicks, avoiding fragile inline onclick handlers.
$('#al').addEventListener('click',async e=>{
 const btn=e.target.closest('button[data-action][data-id]');if(!btn||btn.disabled)return;
 const {action,id}=btn.dataset;btn.disabled=true;const label=btn.textContent;btn.textContent='جارٍ التنفيذ…';
 try{if(action==='delete')await del(id);else await setS(id,action)}
 catch(err){toast('حدث خطأ: '+(err.message||String(err)))}
 finally{btn.disabled=false;btn.textContent=label}
});
async function requireAdmin(){
 if(!sb)throw new Error('تعذر الاتصال بقاعدة البيانات');
 const {data:{session},error}=await sb.auth.getSession();
 if(error||!session)throw new Error('انتهت جلسة الدخول، سجلي الدخول من جديد');
 const r=await sb.rpc('is_admin');
 if(r.error)throw new Error('تعذر التحقق من صلاحية الإدارة: '+r.error.message);
 if(r.data!==true)throw new Error('الحساب الحالي ليس مخولًا لإدارة المشاركات');
}
async function setS(id,status){
 await requireAdmin();
 let reason=null;
 if(status==='rejected'){reason=prompt('سبب الرفض (اختياري)');if(reason===null)return}
 const up={status};if(status==='rejected')up.reject_reason=reason||null;
 const {data,error}=await sb.from('submissions').update(up).eq('id',id).select('id,status');
 if(error)throw new Error('فشل تعديل المشاركة: '+error.message);
 if(!data||data.length!==1||data[0].status!==status)throw new Error('لم تُعدّل المشاركة. يُحتمل أن سياسات RLS تمنع التعديل. نحتاج مراجعة صلاحيات Supabase.');
 await load();toast(status==='approved'?'تم اعتماد المشاركة وإضافتها إلى الحصن':status==='rejected'?'تم رفض المشاركة':'أُعيدت المشاركة إلى الانتظار');
}
function askDeleteConfirmation(){
 return new Promise(resolve=>{
  const shade=document.createElement('div');
  shade.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.78);z-index:2147483647;display:flex;align-items:center;justify-content:center;padding:20px;direction:rtl';
  shade.innerHTML='<div role="dialog" aria-modal="true" aria-label="تأكيد الحذف" style="background:#123d2e;color:#fff;border:2px solid #d8b45c;border-radius:18px;padding:24px;max-width:440px;width:100%;box-sizing:border-box;text-align:center;box-shadow:0 15px 50px #0009"><p style="font-size:21px;line-height:1.7">هل تريدين حذف هذه المشاركة نهائيًا؟ لا يمكن التراجع عن الحذف.</p><div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap"><button type="button" data-confirm="yes" style="background:#e3c36b;color:#1a2b1e;border:0;border-radius:12px;padding:13px 24px;font-weight:bold;font-size:18px">نعم، حذف</button><button type="button" data-confirm="no" style="background:#244b3b;color:white;border:1px solid #b99b51;border-radius:12px;padding:13px 24px;font-size:18px">إلغاء</button></div></div>';
  const done=v=>{shade.remove();resolve(v)};
  shade.querySelector('[data-confirm="yes"]').addEventListener('click',()=>done(true));
  shade.querySelector('[data-confirm="no"]').addEventListener('click',()=>done(false));
  document.body.appendChild(shade);
 });
}
async function del(id){
 if(!(await askDeleteConfirmation()))return;
 await requireAdmin();const d=DB.find(x=>x.id===id);
 const {data,error}=await sb.from('submissions').delete().eq('id',id).select('id');
 if(error)throw new Error('فشل حذف المشاركة: '+error.message);
 if(!data||data.length!==1)throw new Error('لم تُحذف المشاركة. يُحتمل أن سياسات RLS تمنع الحذف.');
 let mediaWarning='';
 if(d?.mp){const r=await sb.storage.from('media').remove([d.mp]);if(r.error)mediaWarning='، لكن تعذر حذف المرفق: '+r.error.message}
 await load();toast('تم حذف المشاركة بنجاح'+mediaWarning);
}
$('#q').oninput=render;
let lastCertificate=null;
/* Certificate: visible preview + PNG download, compatible with iPhone Safari. */
let certificateImageUrl=null;
function fitCertificateText(ctx,text,maxWidth,initial,min){
 let size=initial;
 while(size>min){ctx.font=`800 ${size}px Tajawal, Tahoma, sans-serif`;if(ctx.measureText(text).width<=maxWidth)break;size-=2;}
 return size;
}
async function buildCertificate(){
 if(!lastCertificate)throw new Error('أرسلي مشاركتك أولًا للحصول على الشهادة.');
 if(document.fonts?.ready)await document.fonts.ready;
 const source=new Image();source.src='certificate-approved.png?v=school-logo-clean-20261029';
 if(!source.complete)await new Promise((resolve,reject)=>{source.onload=resolve;source.onerror=()=>reject(new Error('تعذر تحميل تصميم الشهادة. تأكدي من رفع ملف certificate-approved.png مع الموقع.'));});
 const canvas=document.createElement('canvas');canvas.width=3072;canvas.height=2048;
 const ctx=canvas.getContext('2d');ctx.drawImage(source,0,0,canvas.width,canvas.height);
 // School emblem is integrated directly into the certificate image without a white background.
 ctx.direction='rtl';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#073e2c';
 const name=lastCertificate.name.trim(),title=lastCertificate.title.trim();
 fitCertificateText(ctx,name,1120,88,36);ctx.fillText(name,1640,1205);
 if(title){fitCertificateText(ctx,title,1040,49,28);ctx.fillText(title,1640,1464);}
 return canvas.toDataURL('image/png');
}
async function showCertificate(){
 if(!lastCertificate)return toast('أرسلي مشاركتك أولًا للحصول على الشهادة.');
 const btn=$('#getCert');btn.disabled=true;
 try{
  certificateImageUrl=await buildCertificate();
  let panel=$('#certificatePreview');
  if(!panel){panel=document.createElement('div');panel.id='certificatePreview';panel.className='certificate-preview';document.body.appendChild(panel);}
  panel.innerHTML='<div class="certificate-dialog" role="dialog" aria-modal="true" aria-label="معاينة شهادة المشاركة"><div class="certificate-toolbar"><strong>شهادة مشاركتك في حصن الوطن</strong><button type="button" id="closeCertificate" class="btn alt">إغلاق ✕</button></div><img id="certificateResult" alt="شهادة المشاركة باسمك"/><div class="certificate-actions"><a id="saveCertificate" class="btn" download="شهادة-مشاركة-حصن-الوطن.png">تحميل الشهادة كصورة</a><button type="button" id="printCertButton" class="btn alt">طباعة / حفظ PDF</button></div><p class="certificate-hint">على الآيفون: إذا لم يبدأ التحميل، اضغطي مطولًا على صورة الشهادة واختاري «حفظ في الصور».</p></div>';
  panel.querySelector('#certificateResult').src=certificateImageUrl;
  panel.querySelector('#saveCertificate').href=certificateImageUrl;
  panel.querySelector('#closeCertificate').onclick=()=>{panel.classList.remove('on');document.body.style.overflow='';};
  panel.querySelector('#printCertButton').onclick=()=>{
   const w=window.open('','_blank');if(!w){toast('اسمحي بفتح النوافذ المنبثقة، أو احفظي الصورة أولًا ثم اطبعيها.');return;}
   w.document.write('<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>شهادة مشاركة</title><style>@page{size:A4 landscape;margin:0}body{margin:0;background:white}img{width:100%;height:auto;display:block}@media print{img{width:297mm;height:198mm}}</style></head><body><img id="c" alt="شهادة المشاركة"></body></html>');w.document.close();w.document.getElementById('c').src=certificateImageUrl;
   w.document.getElementById('c').onload=()=>{w.focus();w.print();};
  };
  panel.classList.add('on');document.body.style.overflow='hidden';
 }catch(e){toast(e.message||'تعذر إنشاء الشهادة.');}finally{btn.disabled=false;}
}
$('#getCert').onclick=showCertificate;

$('#send').onclick=async()=>{const f=$('#f');if(!f.checkValidity()){f.reportValidity();return}
 if(!sb)return toast('تعذر الاتصال بخدمة استقبال المشاركات. تأكدي من اتصال الإنترنت وأعيدي فتح الموقع، ولا تعتبري المشاركة مرسلة.');if($('#hp').value)return;
 $('#certificateReady').style.display='none';const b=$('#send');b.disabled=true;let mp=null,mt=null;const file=$('#ff').files[0];
 try{const uid=await ensureUser();if(file){const k=file.type.split('/')[0],lim={image:10,video:50,audio:15}[k];if(!lim||file.size>lim*1048576)throw new Error('نوع الملف غير مدعوم أو حجمه كبير');
  mp='pending/'+uid+'/'+crypto.randomUUID()+'.'+((file.name.split('.').pop()||'bin').replace(/[^a-z0-9]/gi,'').toLowerCase().slice(0,5)||'bin');mt=k;
  const u=await sb.storage.from('media').upload(mp,file,{contentType:file.type});if(u.error)throw u.error}
  const r=await sb.from('submissions').insert({name:$('#fn').value,category:$('#fc').value,region:$('#fr').value||null,type:$('#ft').value,title:$('#fh').value,body:$('#fx').value,media_path:mp,media_type:mt});
  if(r.error)throw r.error;lastCertificate={name:$('#fn').value.trim(),title:$('#fh').value.trim()};f.reset();beep(740,.5);$('#certificateReady').style.display='block';
  const j=$('#journey');j.style.display='flex';j.innerHTML=['تم استلام بصمتك','بانتظار المراجعة','اعتمدت بصمتك','أضيئت لبنتك في الحصن'].map((t,i)=>`<span class="${i<2?'d':''}">${t}</span>`).join('')
 }catch(e){toast(/RATE_LIMIT|row-level security/.test(e.message||'')?'وصلتَ للحد المسموح من المشاركات أو الرفع حاليًا، حاول لاحقًا.':'تعذر الإرسال: '+(e.message||e))}b.disabled=false};
$('#rand').onclick=()=>{const a=ap(),o=$('#randOut');o.style.display='block';o.innerHTML=a.length?(m=>`<b>${esc(m.h)}</b><br>${esc(m.x)}<br>${media(m)}<small>— ${esc(m.n)}</small>`)(a[Math.floor(Math.random()*a.length)]):'لا توجد رسائل معتمدة بعد. كن أول من يضيء لبنة!';hydrate()};
// 3D
let R,S,C,bricks=[],drag=0,rot=0,ry=.6,flag,pts;
const cv=$('#stage');
try{if(!window.THREE)throw new Error('Three.js unavailable');R=new THREE.WebGLRenderer({canvas:cv,antialias:true});}catch(e){R=null;cv.outerHTML='<div class="card">المتصفح لا يدعم العرض ثلاثي الأبعاد.</div>'}
if(R){S=new THREE.Scene();C=new THREE.PerspectiveCamera(50,1,.1,200);C.position.set(0,11,22);C.lookAt(0,4,0);
 S.add(new THREE.AmbientLight(0xffffff,.55));const dl=new THREE.DirectionalLight(0xfff0c0,.9);dl.position.set(8,14,10);S.add(dl);
 const sandstone=new THREE.MeshStandardMaterial({color:0xc6a66c,roughness:.86}),stoneLight=new THREE.MeshStandardMaterial({color:0xe7d0a0,roughness:.9}),gold=new THREE.MeshStandardMaterial({color:0xe2b34f,metalness:.65,roughness:.27}),deepGreen=new THREE.MeshStandardMaterial({color:0x074d36,metalness:.15,roughness:.6}),wood=new THREE.MeshStandardMaterial({color:0x49301c,roughness:.8});
 const grp=new THREE.Group();S.add(grp);grp.name='fort';
 const add=(g,m,x,y,z)=>{const o=new THREE.Mesh(g,m);o.position.set(x,y,z);grp.add(o);return o};
 // Najdi-inspired fortified courtyard: textured layers, parapets, arched entrance, watch towers.
 add(new THREE.CylinderGeometry(12.8,13.4,.8,64),deepGreen,0,-.45,0);
 add(new THREE.BoxGeometry(13,.35,13),stoneLight,0,.04,0);
 const wall=(x,z,w,d)=>{add(new THREE.BoxGeometry(w,3.5,d),sandstone,x,1.9,z);add(new THREE.BoxGeometry(w+.3,.28,d+.3),gold,x,3.75,z)};
 wall(0,-6,13,.9);wall(-6,0,.9,13);wall(6,0,.9,13);wall(-4.35,6,4.3,.9);wall(4.35,6,4.3,.9);
 // Repeated crenellations, corner detailing, narrow arrow slits.
 for(let i=-6;i<=6;i+=1.15){for(const z of [-6,6]){if(z===6&&Math.abs(i)<2.25)continue;add(new THREE.BoxGeometry(.64,.72,.95),stoneLight,i,4.2,z)}for(const x of [-6,6])add(new THREE.BoxGeometry(.95,.72,.64),stoneLight,x,4.2,i)}
 const turret=(x,z)=>{add(new THREE.CylinderGeometry(1.48,1.68,7.8,12),sandstone,x,3.95,z);add(new THREE.CylinderGeometry(1.75,1.75,.38,12),gold,x,8,z);add(new THREE.CylinderGeometry(1.32,1.42,1.2,12),stoneLight,x,8.75,z);add(new THREE.CylinderGeometry(1.8,1.8,.22,12),gold,x,9.4,z);for(let j=0;j<12;j++){const a=j*Math.PI/6;add(new THREE.BoxGeometry(.47,.7,.55),stoneLight,x+1.43*Math.sin(a),9.8,z+1.43*Math.cos(a)).rotation.y=a}for(let j=0;j<4;j++){const a=j*Math.PI/2;add(new THREE.BoxGeometry(.3,1.15,.09),wood,x+1.54*Math.sin(a),5.9,z+1.54*Math.cos(a)).rotation.y=a}};
 [[-6,-6],[6,-6],[-6,6],[6,6]].forEach(([x,z])=>turret(x,z));
 // Grand gateway and inset rounded arch, with an ornamental gilded crown.
 add(new THREE.BoxGeometry(4.4,5.4,1.25),sandstone,0,2.8,6.15);
 add(new THREE.BoxGeometry(2.7,3.5,.14),wood,0,1.78,6.84);
 add(new THREE.TorusGeometry(1.36,.17,10,32,Math.PI),gold,0,3.52,6.92).rotation.z=0;
 add(new THREE.BoxGeometry(3.35,.25,.32),gold,0,5.55,6.8);
 for(let i=-1;i<=1;i++)add(new THREE.BoxGeometry(.34,.52,.38),gold,i*1.05,5.95,6.8);
 // Inner citadel, arched niches and gold roofline.
 add(new THREE.BoxGeometry(5.3,5.7,5),sandstone,0,3,-.2);add(new THREE.BoxGeometry(5.8,.35,5.5),gold,0,6,-.2);
 for(let x of [-1.55,0,1.55])for(let y of [2.1,4.15]){add(new THREE.BoxGeometry(.7,1.2,.09),wood,x,y,2.36);add(new THREE.TorusGeometry(.35,.09,8,16,Math.PI),gold,x,y+.6,2.4)}
 for(let i=-2.2;i<=2.2;i+=.9)for(let z of [-2.3,1.9])add(new THREE.BoxGeometry(.48,.6,.5),stoneLight,i,6.47,z);
 add(new THREE.CylinderGeometry(.07,.07,3,10),gold,0,8.1,-.2);
 const fg=new THREE.PlaneGeometry(2.6,1.5,18,3);flag=add(fg,new THREE.MeshStandardMaterial({color:0x087a4a,side:THREE.DoubleSide,roughness:.7}),1.3,9,-.2);
 S.add(new THREE.HemisphereLight(0xffedc3,0x123c2e,1.0));const glow=new THREE.PointLight(0xffc75a,1.8,28);glow.position.set(1,8,10);S.add(glow);
 const pg=new THREE.BufferGeometry(),pa=[];for(let i=0;i<300;i++)pa.push((Math.random()-.5)*34,Math.random()*16,(Math.random()-.5)*34);
 pg.setAttribute('position',new THREE.Float32BufferAttribute(pa,3));pts=new THREE.Points(pg,new THREE.PointsMaterial({color:0xf6dd8e,size:.12,transparent:true,opacity:.8}));S.add(pts);
 let lx=0;const dn=e=>{drag=1;lx=e.clientX},mv=e=>{if(drag){ry+=(e.clientX-lx)*.01;lx=e.clientX}},up=e=>{drag=0};
 cv.addEventListener('pointerdown',dn);addEventListener('pointermove',mv);addEventListener('pointerup',up);
 const rc=new THREE.Raycaster(),mp=new THREE.Vector2();let sx,sy;
 cv.addEventListener('pointerdown',e=>{sx=e.clientX;sy=e.clientY});
 cv.addEventListener('pointerup',e=>{if(Math.abs(e.clientX-sx)+Math.abs(e.clientY-sy)>6)return;const r=cv.getBoundingClientRect();mp.set((e.clientX-r.left)/r.width*2-1,-((e.clientY-r.top)/r.height)*2+1);rc.setFromCamera(mp,C);
  const h=rc.intersectObjects(bricks)[0];if(h){const d=DB.find(x=>x.id===h.object.userData.id);if(d){$('#mb').innerHTML=`<h2>${esc(d.h)}</h2><p>${esc(d.x)}</p>${media(d)}<small>— ${esc(d.n)}</small>`;modal.classList.add('on');hydrate();beep(990,.3)}}});
 var gfort=grp;
 (function loop(t){requestAnimationFrame(loop);if(!$('#v-fort').classList.contains('on'))return;
  if(!drag&&!matchMedia('(prefers-reduced-motion:reduce)').matches)ry+=.003;gfort.rotation.y=ry;
  const p=flag.geometry.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i);p.setZ(i,Math.sin(x*2+t/300)*.12*(x+1.3)/2.6)}p.needsUpdate=true;
  bricks.forEach(b=>{if(b.scale.x<1)b.scale.setScalar(Math.min(1,b.scale.x+.04))});
  pts.rotation.y=t/20000;R.render(S,C)})(0)}
function resize(){if(!R)return;const w=cv.clientWidth,h=cv.clientHeight;R.setSize(w,h,false);R.setPixelRatio(Math.min(devicePixelRatio,2));C.aspect=w/h;C.updateProjectionMatrix()}
addEventListener('resize',resize);
function syncBricks(){if(!R)return;const a=ap();bricks.forEach(b=>{if(!a.find(d=>d.id===b.userData.id)){gfort.remove(b);b.userData.dead=1}});bricks=bricks.filter(b=>!b.userData.dead);
 a.forEach(d=>{if(bricks.find(b=>b.userData.id===d.id))return;const i=bricks.length,per=24,lv=Math.floor(i/per),k=i%per,ang=k/per*Math.PI*2,rad=3.4+(lv%3)*.1;
  const m=new THREE.Mesh(new THREE.BoxGeometry(.9,.5,.5),new THREE.MeshStandardMaterial({color:0xf2c14e,emissive:0xd9ad45,emissiveIntensity:.8,metalness:.7,roughness:.3}));
  m.position.set(Math.cos(ang)*rad,.4+lv*.55,Math.sin(ang)*rad+0);m.rotation.y=-ang+Math.PI/2;m.scale.setScalar(.01);m.userData.id=d.id;gfort.add(m);bricks.push(m)})}
async function chk(se){ADMIN=false;if(se){const r=await sb.rpc('is_admin');if(r.error)toast('تعذر التحقق من صلاحيات الإدارة: '+r.error.message);else ADMIN=r.data===true}await load()}
$('#lg').onclick=async()=>{if(!sb)return toast('تعذر الاتصال بخدمة استقبال المشاركات. تأكدي من اتصال الإنترنت وأعيدي فتح الموقع، ولا تعتبري المشاركة مرسلة.');const {data,error}=await sb.auth.signInWithPassword({email:$('#le').value,password:$('#lp').value});
 if(error)return toast('بيانات الدخول غير صحيحة');await chk(data.session);if(!ADMIN){await sb.auth.signOut();toast('هذا الحساب ليس مشرفًا');load()}};
$('#lc').onclick=async()=>{const {data,error}=await sb.rpc('orphan_media');if(error)return toast(error.message);if(!data.length)return toast('لا توجد ملفات يتيمة.');const r=await sb.storage.from('media').remove(data);toast(r.error?r.error.message:'حُذف '+data.length+' ملف يتيم.')};
$('#lo').onclick=async()=>{await sb.auth.signOut();ADMIN=false;load()};


let museumFilter='all',wallOffset=0,wallPlaying=true,wallTimer=null,kidAudioFile=null,kidRecorder=null,kidStream=null,kidChunks=[],kidRecordTimeout=null;
function refreshExperiences(){
 const approved=ap(), museum=document.getElementById('museumItems'),wall=document.getElementById('wallItems');
 if(museum){
  const matches=approved.filter(d=>museumFilter==='all'||(museumFilter==='text'?!d.mp:d.mt===museumFilter));
  museum.innerHTML=matches.map((d,i)=>'<button type="button" class="museum-art" data-museum-index="'+i+'"><span class="museum-frame"><span class="museum-icon">'+(d.mt==='image'?'🎨':d.mt==='video'?'🎬':d.mt==='audio'?'🎧':'✉️')+'</span><strong>'+esc(d.h)+'</strong><small>'+esc(d.n)+'</small></span></button>').join('')||'<p class="museum-empty">بانتظار أولى الإبداعات المعتمدة لتضيء قاعات المتحف.</p>';
  museum._entries=matches;
 }
 if(wall){
  const entries=approved.filter(d=>d.x);
  if(entries.length&&wallOffset>=entries.length)wallOffset=0;
  const d=entries[wallOffset];
  wall.innerHTML=d?'<article class="wall-note wall-spotlight"><div class="wall-quote">❝</div><h3>'+esc(d.h)+'</h3><p>'+esc(d.x)+'</p><small>رسالة وفاء من '+esc(d.n)+'</small></article>':'<p class="museum-empty">بانتظار أولى رسائل الوفاء المعتمدة.</p>';
 }
 hydrate();
}
document.querySelectorAll('#kidChoices button').forEach(b=>b.addEventListener('click',()=>{
 document.querySelectorAll('#kidChoices button').forEach(x=>x.classList.remove('chosen'));
 b.classList.add('chosen');document.getElementById('kidText').value=b.dataset.kid;
}));
const recordStatus=document.getElementById('kidRecordStatus'),playback=document.getElementById('kidPlayback');
document.getElementById('kidRecord').addEventListener('click',async()=>{
 try{
  if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder)throw Error('المتصفح لا يدعم التسجيل الصوتي. يمكنك رفع ملف صوتي من نموذج المشاركة.');
  kidStream=await navigator.mediaDevices.getUserMedia({audio:true});
  const preferred=['audio/mp4','audio/webm;codecs=opus','audio/webm'].find(t=>MediaRecorder.isTypeSupported(t));
  kidRecorder=new MediaRecorder(kidStream,preferred?{mimeType:preferred}:undefined);kidChunks=[];
  kidRecorder.ondataavailable=e=>{if(e.data.size)kidChunks.push(e.data)};
  kidRecorder.onstop=()=>{
   const blob=new Blob(kidChunks,{type:kidRecorder.mimeType||'audio/mp4'});
   if(blob.size>15*1048576){recordStatus.textContent='التسجيل كبير جدًا. جرّب تسجيلًا أقصر.';return}
   const ext=blob.type.includes('webm')?'webm':'m4a';
   kidAudioFile=new File([blob],'رسالة-إلى-حامي-الوطن.'+ext,{type:blob.type||'audio/mp4'});
   playback.src=URL.createObjectURL(blob);playback.style.display='block';
   document.getElementById('kidClearAudio').style.display='inline-block';
   recordStatus.textContent='اكتمل التسجيل. استمع إليه ثم أرسل رسالتك.';
  };
  kidRecorder.start();document.getElementById('kidRecord').disabled=true;
  document.getElementById('kidStop').disabled=false;recordStatus.textContent='🔴 جارٍ التسجيل…';
  kidRecordTimeout=setTimeout(()=>{if(kidRecorder?.state==='recording')document.getElementById('kidStop').click()},60000);
 }catch(e){recordStatus.textContent=e.message||'تعذر استخدام الميكروفون. تحقّق من السماح له في Safari.'}
});
document.getElementById('kidStop').addEventListener('click',()=>{
 if(kidRecorder?.state==='recording')kidRecorder.stop();
 kidStream?.getTracks().forEach(t=>t.stop());clearTimeout(kidRecordTimeout);
 document.getElementById('kidRecord').disabled=false;document.getElementById('kidStop').disabled=true;
});
document.getElementById('kidClearAudio').addEventListener('click',()=>{
 kidAudioFile=null;playback.removeAttribute('src');playback.style.display='none';
 document.getElementById('kidClearAudio').style.display='none';recordStatus.textContent='تم حذف التسجيل.';
});
document.getElementById('kidContinue').addEventListener('click',()=>{
 const n=document.getElementById('kidName').value.trim(),t=document.getElementById('kidText').value.trim();
 if(!n||!t){toast('أدخلي اسم المشارك واختاري أو اكتبي رسالة الشكر أولًا.');return}
 if(kidRecorder?.state==='recording'){toast('أوقفي التسجيل أولًا.');return}
 document.getElementById('fn').value=n;document.getElementById('ft').value='رسالة إلى جنودنا';
 document.getElementById('fh').value='رسالة من قلب طفل إلى حامي الوطن';
 document.getElementById('fx').value=t;document.getElementById('fc').value='طالب';
 if(kidAudioFile){try{const dt=new DataTransfer();dt.items.add(kidAudioFile);document.getElementById('ff').files=dt.files}
 catch(e){toast('تعذر نقل التسجيل تلقائيًا. احفظيه وارفعِيه من نموذج المشاركة.');return}}
 const env=document.getElementById('kidEnvelope');env.classList.add('fly');
 setTimeout(()=>{env.classList.remove('fly');location.hash='#submit';toast('الرسالة جاهزة! وافقي على الشروط واضغطي «أرسل بصمتي».')},1200);
});
document.getElementById('museumFilters').addEventListener('click',e=>{
 const b=e.target.closest('button[data-filter]');if(!b)return;
 museumFilter=b.dataset.filter;
 document.querySelectorAll('#museumFilters button').forEach(x=>x.classList.toggle('active',x===b));
 refreshExperiences();
});
document.getElementById('museumItems').addEventListener('click',e=>{
 const b=e.target.closest('[data-museum-index]');if(!b)return;
 const d=document.getElementById('museumItems')._entries[Number(b.dataset.museumIndex)];
 if(!d)return;
 const detail=document.getElementById('museumDetail');
 detail.innerHTML='<h2>'+esc(d.h)+'</h2><p>'+esc(d.x)+'</p>'+media(d)+'<p>— '+esc(d.n)+'</p>';
 document.getElementById('museumLightbox').hidden=false;document.body.style.overflow='hidden';hydrate();
});
document.getElementById('museumClose').addEventListener('click',()=>{
 document.getElementById('museumLightbox').hidden=true;document.body.style.overflow='';
 document.querySelectorAll('#museumDetail video,#museumDetail audio').forEach(x=>x.pause());
});
function wallAdvance(){const count=ap().filter(d=>d.x).length;wallOffset=count?(wallOffset+1)%count:0;refreshExperiences()}
document.getElementById('wallNext').addEventListener('click',wallAdvance);
document.getElementById('wallPlay').addEventListener('click',()=>{
 wallPlaying=!wallPlaying;document.getElementById('wallPlay').textContent=wallPlaying?'⏸ إيقاف العرض التلقائي':'▶ تشغيل العرض التلقائي';
});
wallTimer=setInterval(()=>{if(wallPlaying&&location.hash==='#wall')wallAdvance()},8000);
document.getElementById('wallFullscreen').addEventListener('click',async()=>{
 const el=document.getElementById('wallStage');
 if(document.fullscreenElement){await document.exitFullscreen();return}
 if(el.requestFullscreen){try{await el.requestFullscreen()}catch(e){toast('يمكنك استخدام وضع الشاشة الأفقية في Safari للعرض على السبورة.')}}
 else toast('ملء الشاشة غير متاح في هذا المتصفح. استخدمي العرض الأفقي أو AirPlay.');
});
document.getElementById('makeMedal').addEventListener('click',async()=>{
 const n=document.getElementById('medalName').value.trim();
 if(!n){toast('اكتبي اسم المشارك أولًا.');return}
 if(document.fonts?.ready)await document.fonts.ready;
 const c=document.createElement('canvas');c.width=1800;c.height=1800;
 const ctx=c.getContext('2d');
 const bg=ctx.createRadialGradient(900,600,100,900,900,1200);
 bg.addColorStop(0,'#176447');bg.addColorStop(1,'#021c15');ctx.fillStyle=bg;ctx.fillRect(0,0,1800,1800);
 const edge=ctx.createLinearGradient(0,0,1800,1800);edge.addColorStop(0,'#fff1b7');edge.addColorStop(.3,'#bc7924');edge.addColorStop(.55,'#ffe69a');edge.addColorStop(1,'#995a15');
 ctx.strokeStyle=edge;ctx.lineWidth=25;ctx.strokeRect(65,65,1670,1670);
 ctx.textAlign='center';ctx.fillStyle='#ffe8aa';ctx.font='bold 96px Tajawal,Tahoma,Arial';ctx.fillText('حصن الوطن',900,245);
 // Satin ribbon behind the relief medal.
 ctx.fillStyle='#0b7652';ctx.beginPath();ctx.moveTo(640,430);ctx.lineTo(820,460);ctx.lineTo(680,1120);ctx.lineTo(470,1190);ctx.closePath();ctx.fill();
 ctx.beginPath();ctx.moveTo(1160,430);ctx.lineTo(980,460);ctx.lineTo(1120,1120);ctx.lineTo(1330,1190);ctx.closePath();ctx.fill();
 ctx.strokeStyle='#e9c16d';ctx.lineWidth=12;ctx.stroke();
 const centerX=900,centerY=725;
 for(let r=365;r>=300;r-=8){ctx.beginPath();ctx.arc(centerX,centerY,r,0,Math.PI*2);ctx.fillStyle=r%16?'#a7681d':'#f4d275';ctx.fill()}
 const gold=ctx.createLinearGradient(500,380,1290,1050);
 gold.addColorStop(0,'#fff5bd');gold.addColorStop(.28,'#dfad46');gold.addColorStop(.55,'#fff3a7');gold.addColorStop(.85,'#a76b23');gold.addColorStop(1,'#f8d77b');
 ctx.beginPath();ctx.arc(centerX,centerY,310,0,Math.PI*2);ctx.fillStyle=gold;ctx.fill();
 ctx.beginPath();ctx.arc(centerX,centerY,268,0,Math.PI*2);ctx.fillStyle='#07563d';ctx.fill();ctx.strokeStyle='#fff0aa';ctx.lineWidth=13;ctx.stroke();
 ctx.fillStyle='#ffe8a2';ctx.font='180px Arial';ctx.fillText('🌴',900,735);
 ctx.font='bold 72px Tajawal,Tahoma,Arial';ctx.fillText('حارس الوفاء',900,860);
 ctx.font='bold 90px Tajawal,Tahoma,Arial';ctx.fillText('وسام الوفاء الوطني',900,1280);
 let size=84;do{ctx.font='bold '+size+'px Tajawal,Tahoma,Arial';if(ctx.measureText(n).width<=1550)break;size-=3}while(size>28);
 ctx.fillStyle='#fff9e6';ctx.fillText(n,900,1410);
 ctx.font='48px Tajawal,Tahoma,Arial';ctx.fillStyle='#e9ce86';ctx.fillText('رسالة شكر لحماة الوطن',900,1515);
 ctx.font='35px Tajawal,Tahoma,Arial';ctx.fillText('وسام تذكاري للمشاركة، وليس اعتمادًا للنشر',900,1610);
 const result=document.getElementById('medalResult');result.replaceChildren();
 const url=c.toDataURL('image/png'),img=document.createElement('img');img.src=url;img.alt='وسام الوفاء باسم المشارك';img.style='display:block;width:100%;max-width:480px;margin:18px auto;border-radius:16px';
 const a=document.createElement('a');a.href=url;a.download='وسام-حارس-الوفاء.png';a.className='btn';a.textContent='تحميل الوسام عالي الدقة';
 result.append(img,a);
});

// Self-contained educational mission. Does not write to Supabase or modify moderation.
const missionSets={
 kids:{title:'براعم الوفاء',q:[['من يحافظ على أمن وطننا؟',['حماة الوطن','الألعاب','الحقائب'],0],['كيف نشكر حماة الوطن؟',['نكتب رسالة جميلة','ننشر معلومات خاصة','نؤذي الآخرين'],0],['ما السلوك الذي يدل على حب الوطن؟',['المحافظة على الممتلكات العامة','إتلاف الحدائق','رمي النفايات'],0]]},
 students:{title:'صنّاع الأثر',q:[['وصلتك معلومة مجهولة عن أمن الوطن. ماذا تفعل؟',['أنشرها بسرعة','أتحقق من مصدر رسمي ولا أنشر الشائعات','أرسلها لكل المجموعات'],1],['ما أفضل تعبير عن تقدير حماة الوطن؟',['رسالة احترام ومشاركة إيجابية','نشر معلومات عسكرية','السخرية من الآخرين'],0],['كيف تساهم في أمن مجتمعك الرقمي؟',['حماية المعلومات الشخصية والتحقق من الأخبار','مشاركة كلمات المرور','تداول الشائعات'],0]]},
 adults:{title:'سفراء الوفاء',q:[['كيف تعزز قيمة الوفاء لحماة الوطن في المدرسة أو الأسرة؟',['بنشاط تعليمي ورسائل تقدير هادفة','بإعادة نشر الشائعات','بمشاركة معلومات حساسة'],0],['أي مشاركة تناسب مبادرة وطنية مسؤولة؟',['عمل موثق يحترم الخصوصية','نشر صور أطفال دون موافقة','نشر بيانات شخصية'],0],['ما أفضل طريقة لقياس أثر المبادرة؟',['متابعة المشاركة والتعلم والتفاعل الحقيقي','الاكتفاء بعدد الزخارف','استخدام أرقام غير حقيقية'],0]]}
};
let missionTrack=null,missionIndex=0;
function missionReset(){document.getElementById('missionChoice').hidden=false;document.getElementById('missionGame').hidden=true;document.getElementById('missionDone').hidden=true}
function missionShow(){const m=missionSets[missionTrack],q=m.q[missionIndex];document.getElementById('missionBar').style.width=(missionIndex/3*100)+'%';document.getElementById('missionStep').textContent=m.title+' — المحطة '+(missionIndex+1)+' من 3';document.getElementById('missionQuestion').textContent=q[0];document.getElementById('missionFeedback').textContent='';const answers=document.getElementById('missionAnswers');answers.replaceChildren();q[1].forEach((v,i)=>{const b=document.createElement('button');b.type='button';b.className='mission-answer';b.textContent=v;b.onclick=()=>{if(i!==q[2]){document.getElementById('missionFeedback').textContent='حاولي مرة أخرى، وفكّري في السلوك الأكثر مسؤولية.';return}missionIndex++;if(missionIndex===3){document.getElementById('missionGame').hidden=true;document.getElementById('missionDone').hidden=false;document.getElementById('missionResult').textContent='أكملت المحطات الثلاث في مسار '+m.title+'. يمكنك الآن تقديم رسالة امتنان إلى حماة الوطن.'}else missionShow()};answers.appendChild(b)})}
document.querySelectorAll('[data-track]').forEach(b=>b.addEventListener('click',()=>{missionTrack=b.dataset.track;missionIndex=0;document.getElementById('missionChoice').hidden=true;document.getElementById('missionDone').hidden=true;document.getElementById('missionGame').hidden=false;missionShow()}));
document.getElementById('missionBack').onclick=missionReset;
document.getElementById('missionAgain').onclick=missionReset;

route();render();
if(sb){sb.auth.getSession().then(({data})=>chk(data.session));sb.channel('subs').on('postgres_changes',{event:'*',schema:'public',table:'submissions'},()=>load()).subscribe()}
