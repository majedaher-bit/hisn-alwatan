(()=>{const $=s=>document.querySelector(s),rm=matchMedia('(prefers-reduced-motion:reduce)').matches;
const hs=$('.fortress-hotspot[href="#submit"]');if(hs){hs.classList.add('has-boy');hs.insertAdjacentHTML('afterbegin','<img class="boy" src="boy-gate.webp" alt="" loading="lazy">')}
const ct=$('.courtyard');if(ct)ct.insertAdjacentHTML('beforeend','<img class="girl-fig" src="girl-front.png" alt="" loading="lazy">');
/* الحصن ثلاثي الأبعاد: غروب ونجوم وتوهج ودخول وتقريب الكاميرا */
(function(){try{if(typeof R==='undefined'||!R||typeof THREE==='undefined')return;let foc=0;
 const cs=document.createElement('canvas');cs.width=2;cs.height=256;const g=cs.getContext('2d'),gr=g.createLinearGradient(0,0,0,256);
 [[0,'#0b1d3f'],[.45,'#6b4a7a'],[.75,'#e9955a'],[1,'#ffd58a']].forEach(a=>gr.addColorStop(a[0],a[1]));g.fillStyle=gr;g.fillRect(0,0,2,256);
 S.background=new THREE.CanvasTexture(cs);S.fog=new THREE.FogExp2(0x7a5a80,.011);
 const sa=[];for(let i=0;i<260;i++){const a=Math.random()*6.283,e=Math.random()*1.2+.2;sa.push(Math.cos(a)*70*Math.cos(e*.6),20+Math.sin(e)*45,Math.sin(a)*70*Math.cos(e*.6))}
 const sg=new THREE.BufferGeometry();sg.setAttribute('position',new THREE.Float32BufferAttribute(sa,3));S.add(new THREE.Points(sg,new THREE.PointsMaterial({color:0xffffff,size:.35,fog:false,transparent:true,opacity:.8})));
 const sun=new THREE.DirectionalLight(0xffb36b,1.1);sun.position.set(-12,10,8);S.add(sun);
 const gl=new THREE.PointLight(0xffc766,1.8,16);gl.position.set(0,2.6,7.8);S.add(gl);
 const gc=document.createElement('canvas');gc.width=gc.height=64;const g2=gc.getContext('2d'),rg=g2.createRadialGradient(32,32,0,32,32,32);rg.addColorStop(0,'rgba(255,230,150,1)');rg.addColorStop(1,'rgba(255,200,90,0)');g2.fillStyle=rg;g2.fillRect(0,0,64,64);const gt=new THREE.CanvasTexture(gc);
 const home=new THREE.Vector3(0,11,22),homeL=new THREE.Vector3(0,4,0),tp=home.clone(),tl=homeL.clone(),look=homeL.clone();C.position.set(0,30,46);
 (function lp(t){requestAnimationFrame(lp);if(!$('#v-fort').classList.contains('on'))return;gl.intensity=1.6+Math.sin(t/170)*.35;
  for(const b of bricks)if(!b.userData.gl){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:gt,blending:THREE.AdditiveBlending,depthWrite:false,transparent:true,opacity:.8}));s.scale.set(2.4,2.4,1);b.add(s);b.userData.gl=1;b.castShadow=true}
  if(!foc)tp.set(rm?0:Math.sin(t/4500)*1.4,home.y,home.z);C.position.lerp(tp,rm?1:.04);look.lerp(tl,.05);C.lookAt(look)})(0);
 const rc=new THREE.Raycaster(),mp=new THREE.Vector2();let sx=0,sy=0;
 cv.addEventListener('pointerdown',e=>{sx=e.clientX;sy=e.clientY});
 cv.addEventListener('pointerup',e=>{if(Math.abs(e.clientX-sx)+Math.abs(e.clientY-sy)>6)return;const r=cv.getBoundingClientRect();mp.set((e.clientX-r.left)/r.width*2-1,-((e.clientY-r.top)/r.height)*2+1);rc.setFromCamera(mp,C);
  const h=rc.intersectObjects(bricks)[0];if(h){const p=new THREE.Vector3();h.object.getWorldPosition(p);foc=1;tl.copy(p);tp.set(p.x*1.5,p.y+2.2,p.z*1.5+4.5)}});
 const md=$('#modal');new MutationObserver(()=>{if(!md.classList.contains('on')&&foc){foc=0;tp.copy(home);tl.copy(homeL)}}).observe(md,{attributes:true,attributeFilter:['class']});
 /* ظلال ناعمة من الشمس لإحساس العمق */
 R.shadowMap.enabled=true;R.shadowMap.type=THREE.PCFSoftShadowMap;sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);const sc=sun.shadow.camera;sc.left=-17;sc.right=17;sc.top=17;sc.bottom=-17;sc.near=1;sc.far=60;
 gfort.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;if(o.material)o.material.needsUpdate=true}})}catch(e){console.warn('fort enhancement skipped',e)}})();
/* المتحف: رواق لوحات بمنظور */
const mi=$('#museumItems');function mz(){if(!mi)return;const r=mi.getBoundingClientRect(),cx=r.left+r.width/2;[...mi.children].forEach(c=>{const q=c.getBoundingClientRect(),d=Math.max(-1,Math.min(1,((q.left+q.width/2)-cx)/(r.width/1.6)));c.style.transform=`scale(${1-Math.abs(d)*.2}) rotateY(${d*-26}deg)`;c.style.opacity=1-Math.abs(d)*.45})}
if(mi){mi.addEventListener('scroll',()=>requestAnimationFrame(mz),{passive:true});new MutationObserver(mz).observe(mi,{childList:true});addEventListener('hashchange',()=>setTimeout(mz,300));addEventListener('resize',mz)}
/* الجدار: شريط زمن لكل رسالة */
const ws=$('#wallStage'),wi=$('#wallItems');if(ws&&wi){const pr=document.createElement('div');pr.id='wallProg';ws.appendChild(pr);
 new MutationObserver(()=>{pr.style.animation='none';void pr.offsetWidth;pr.style.animation='wfill 8s linear'}).observe(wi,{childList:true})}
/* أبطال الوفاء: فصول */
const kw=$('.kid-world');if(kw){const st=[...kw.querySelectorAll('.kid-step')];if(st.length){let k=0;
 const nav=document.createElement('div');nav.className='kid-nav';nav.innerHTML='<button type="button" class="btn alt" id="kidPrev">السابق</button><span id="kidDots"></span><button type="button" class="btn" id="kidNext">التالي</button>';st[st.length-1].after(nav);
 const go=n=>{k=Math.max(0,Math.min(st.length-1,n));kw.dataset.ks=k;kw.dataset.last=k===st.length-1?1:0;st.forEach((s,i)=>{s.hidden=i!==k;if(i===k){s.style.animation='none';void s.offsetWidth;s.style.animation=''}});
  $('#kidDots').textContent=st.map((_,i)=>i===k?'●':'○').join(' ');$('#kidPrev').style.visibility=k?'visible':'hidden';$('#kidNext').style.display=k===st.length-1?'none':''};
 $('#kidPrev').onclick=()=>go(k-1);$('#kidNext').onclick=()=>go(k+1);go(0)}}
})();
