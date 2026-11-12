import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export function createScene(container) {
  const compact=window.innerWidth<700;
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,compact?1.5:1.75));
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.32;
  renderer.shadowMap.enabled=true;
  renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  // All geometry and lighting are static; calculate shadows once.
  renderer.shadowMap.autoUpdate=false;
  renderer.shadowMap.needsUpdate=true;
  container.appendChild(renderer.domElement);
  const scene=new THREE.Scene();scene.background=new THREE.Color('#e6ede4');
  scene.fog=new THREE.Fog('#e6ede4',65,155);
  const pmrem=new THREE.PMREMGenerator(renderer);
  const room=new RoomEnvironment();
  const environment=pmrem.fromScene(room,.06);
  scene.environment=environment.texture;scene.environmentIntensity=.3;
  room.dispose();pmrem.dispose();
  const hemi=new THREE.HemisphereLight('#f1f6ed','#c5c6b3',2.15);scene.add(hemi);
  const sun=new THREE.DirectionalLight('#fff0cc',3.4);sun.position.set(-26,43,35);
  sun.castShadow=true;sun.shadow.mapSize.setScalar(compact?1024:2048);
  Object.assign(sun.shadow.camera,{left:-34,right:34,top:30,bottom:-30,near:1,far:115});
  sun.shadow.normalBias=.035;sun.shadow.bias=-.00015;sun.target.position.set(0,4,2);
  scene.add(sun,sun.target);
  const fill=new THREE.DirectionalLight('#d9e9f4',.65);fill.position.set(25,16,-6);scene.add(fill);
  const camera=new THREE.PerspectiveCamera(37,1,.2,240);
  function resize(){const w=container.clientWidth,h=container.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();return {width:w,height:h};}
  return {scene,camera,renderer,resize,compact,environment};
}
