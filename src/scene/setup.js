import * as THREE from 'three';
import { Sky } from 'three/addons/objects/Sky.js';

export function createScene(container) {
  const compact=window.innerWidth<700;
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,compact?1.35:1.65));
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.98;
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.shadowMap.autoUpdate=false;renderer.shadowMap.needsUpdate=true;
  container.appendChild(renderer.domElement);
  const scene=new THREE.Scene();scene.background=new THREE.Color('#e6ede4');
  scene.fog=new THREE.Fog('#e6ede4',70,160);
  // Outdoor sky irradiance replaces the interior showroom reflection of V1.
  const sky=new Sky();sky.scale.setScalar(450000);
  const u=sky.material.uniforms;u.turbidity.value=3;u.rayleigh.value=1.2;
  u.mieCoefficient.value=.005;u.mieDirectionalG.value=.8;
  u.sunPosition.value.set(-.55,1,.65).normalize();
  const environmentScene=new THREE.Scene();environmentScene.add(sky);
  const pmrem=new THREE.PMREMGenerator(renderer),environment=pmrem.fromScene(environmentScene,.04);
  scene.environment=environment.texture;scene.environmentIntensity=.22;
  sky.geometry.dispose();sky.material.dispose();pmrem.dispose();
  scene.add(new THREE.HemisphereLight('#e8f1f6','#a19b7c',.65));
  const sun=new THREE.DirectionalLight('#fff0d8',2.35);sun.position.set(-27,42,32);
  sun.castShadow=true;sun.shadow.mapSize.setScalar(compact?1024:2048);
  Object.assign(sun.shadow.camera,{left:-29,right:29,top:31,bottom:-26,near:1,far:105});
  sun.shadow.normalBias=.018;sun.shadow.bias=-.00006;sun.shadow.radius=2;
  sun.target.position.set(0,6,3);scene.add(sun,sun.target);
  const fill=new THREE.DirectionalLight('#d5e6ed',.3);fill.position.set(25,16,2);scene.add(fill);
  const camera=new THREE.PerspectiveCamera(37,1,.2,240);
  function resize(){const w=container.clientWidth,h=container.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();return {width:w,height:h};}
  return {scene,camera,renderer,resize,compact,environment};
}
