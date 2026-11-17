(() => {
 const loader=document.getElementById('intro-loader');
 if(!loader)return;
 if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){loader.remove();return;}
 const wires=[...loader.querySelectorAll('.intro-connections path')];
 const nodes=[...loader.querySelectorAll('[data-intro-node]')];
 const status=loader.querySelector('.intro-status');
 const surfaces=[document.querySelector('.concept-nav'),document.getElementById('app')].filter(Boolean);
 let exited=false,frame,removeTimer,timeout;
 let ready=document.readyState==='complete';
 Promise.all([document.fonts?.ready||Promise.resolve(),new Promise(resolve=>{if(ready)resolve();else window.addEventListener('load',resolve,{once:true})})]).then(()=>{ready=true});
 const start=performance.now();
 loader.hidden=false;document.documentElement.classList.add('intro-loading');surfaces.forEach(el=>el.inert=true);
 function draw(progress){wires.forEach((wire,i)=>{const local=Math.max(0,Math.min(1,(progress-i*.15)/.4));wire.style.strokeDashoffset=String(1-local);nodes[i].classList.toggle('connected',local>.45)});loader.classList.toggle('intro-connected',progress>.92)}
 function remove(){loader.remove();document.documentElement.classList.remove('intro-loading');surfaces.forEach(el=>el.inert=false)}
 function finish(immediate=false){if(exited)return;exited=true;cancelAnimationFrame(frame);clearTimeout(timeout);const hadFocus=loader.contains(document.activeElement);draw(1);status.textContent='Connected. Let’s explore.';if(immediate)remove();else{loader.classList.add('intro-complete');removeTimer=setTimeout(remove,850)}if(hadFocus)surfaces[0]?.querySelector('a')?.focus({preventScroll:true})}
 function tick(now){const elapsed=now-start;const progress=Math.min(1,elapsed/1800);draw(Math.min(ready?1:.92,progress));if(progress>=1&&(ready||elapsed>2600)){finish();return}frame=requestAnimationFrame(tick)}
 loader.querySelector('#intro-skip').addEventListener('click',()=>finish(true));
 window.addEventListener('pagehide',()=>{cancelAnimationFrame(frame);clearTimeout(timeout);clearTimeout(removeTimer);remove()},{once:true});
 timeout=setTimeout(()=>finish(true),4000);draw(0);frame=requestAnimationFrame(tick);
})();
