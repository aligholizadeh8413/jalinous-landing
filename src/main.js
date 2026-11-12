import './style.css';
import * as THREE from 'three';
import { content } from './content.js';
import { createMaterials } from './scene/materials.js';
import { createBuilding } from './scene/building.js';
import { createSurroundings } from './scene/surroundings.js';
import { createScene } from './scene/setup.js';
import { createCameraRig } from './scene/camera-rig.js';
import { createMotion } from './motion.js';

document.querySelectorAll('[data-copy]').forEach(el=>el.textContent=content[el.dataset.copy]);
const state={progress:0};
const preference=matchMedia('(prefers-reduced-motion: reduce)');
let cleanup=()=>{};
function fallback(reason) {
  cleanup();
  document.body.classList.add('has-fallback','is-ready');
  document.querySelector('#fallback').hidden=false;
  document.querySelector('#scene').replaceChildren();
  document.querySelector('#experience').setAttribute('aria-label','Jalinous building photograph and introduction');
  console.warn('Jalinous interactive view unavailable:',reason);
}
try {
  const manager=new THREE.LoadingManager();
  let assetFailed=false;
  manager.onError=()=>{assetFailed=true;};
  const {scene,camera,renderer,resize,compact,environment}=createScene(document.querySelector('#scene'));
  const materials=createMaterials(manager);
  const building=createBuilding(materials);scene.add(building,createSurroundings(materials,compact));
  const rig=createCameraRig(camera,preference.matches);
  let size=resize(),last=performance.now(),raf=0,visible=true,renderCount=0,previousView='';
  const onResize=()=>{size=resize();previousView='';};
  const onVisibility=()=>{visible=!document.hidden;last=performance.now();};
  window.addEventListener('resize',onResize,{passive:true});
  document.addEventListener('visibilitychange',onVisibility);
  const onContextLost=e=>{e.preventDefault();fallback('WebGL context lost');};
  renderer.domElement.addEventListener('webglcontextlost',onContextLost);
  cleanup=()=>{cancelAnimationFrame(raf);window.removeEventListener('resize',onResize);document.removeEventListener('visibilitychange',onVisibility);rig.dispose();environment.dispose();renderer.dispose();};
  function render(now) {
    raf=requestAnimationFrame(render);
    if(!visible)return;
    const dt=Math.min((now-last)/1000,.05);last=now;
    rig.update(state.progress,dt,size.width,size.height);
    const view=[state.progress.toFixed(4),rig.pose.yaw.toFixed(3),size.width,size.height].join(':');
    if(view!==previousView){renderer.render(scene,camera);previousView=view;}
    renderCount++;
    // Read-only DOM diagnostics for browser QA. No free-camera controls are exposed.
    {
      const canvas=renderer.domElement;
      canvas.dataset.progress=state.progress.toFixed(3);
      canvas.dataset.yaw=rig.pose.yaw.toFixed(2);
      canvas.dataset.drawCalls=String(renderer.info.render.calls);
      canvas.dataset.triangles=String(renderer.info.render.triangles);
      canvas.dataset.camera=rig.pose.position.map(n=>n.toFixed(2)).join(',');
      canvas.dataset.pointerFine=String(matchMedia('(pointer:fine)').matches);
      canvas.dataset.renderMs=(performance.now()-now).toFixed(1);
      canvas.dataset.version='2';
    }
  }
  rig.update(0,0,size.width,size.height);renderer.render(scene,camera);
  manager.onLoad=()=>{
    if(assetFailed){fallback('A required visual asset could not load');return;}
    renderer.shadowMap.needsUpdate=true;
    document.body.classList.add('is-ready');
    createMotion(state,preference.matches);
    requestAnimationFrame(render);
  };
  // A texture request can hang independently of the renderer.
  setTimeout(()=>{if(!document.body.classList.contains('is-ready'))fallback('Loading timed out');},18000);
  preference.addEventListener('change',()=>location.reload());
} catch(error) { fallback(error.message); }
