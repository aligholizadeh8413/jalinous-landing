import * as THREE from 'three';
import {createBuilder,batchStatic} from './geometry.js';

// Mature pine: long bare trunk, irregular lateral limbs, secondary twigs and
// alpha-tested needle sprays. No spherical crown geometry. Near/distant variants
// share one atlas and one instanced draw per level of detail.
export function createPines(materials,compact=false) {
  let seed=3187;const random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
  const wood=new THREE.Group();wood.name='Mature pine branch structure';
  const {beam}=createBuilder(wood),transforms=[];
  const sites=[[-17,9,18.8,2.9],[-13.8,8.4,20.4,2.8],[-10,10.7,17.1,2.55],[16.9,9.1,20.6,3.1],[13.5,12.2,18.2,2.65],[-23,-13,9,2],[-22,-23,8.4,2],[22,-14,8.8,2],[26,-26,8,2],[-27,20,7,2],[27,18,7.6,2],[-39,-20,8,2]];
  for(const [index,[x,z,h,r]] of sites.entries()) {
    const distant=index>4,boughs=distant?14:compact?24:34;
    const bendX=(random()-.5)*.8,bendZ=(random()-.5)*.5;
    // Segmented tapered trunk produces real bark shading and gentle natural lean.
    for(let i=0;i<9;i++) {
      const t=i/9,t1=(i+1)/9;
      beam([x+bendX*t*t,h*t,z+bendZ*t],[x+bendX*t1*t1,h*t1,z+bendZ*t1],(distant?.19:.22)*(1-t*.88),materials.trunk,(distant?.19:.22)*(1-t1*.88));
    }
    for(let j=0;j<boughs;j++) {
      const t=.53+(j/boughs)*.43,angle=j*2.399963+random()*.6;
      const length=r*(.55+random()*.55)*Math.sin((t-.42)*Math.PI/1.05);
      const start=new THREE.Vector3(x+bendX*t*t,h*t,z+bendZ*t);
      const mid=start.clone().add(new THREE.Vector3(Math.cos(angle)*length*.57,-.15+random()*.3,Math.sin(angle)*length*.57));
      const tip=start.clone().add(new THREE.Vector3(Math.cos(angle)*length,.3+random()*.6,Math.sin(angle)*length));
      beam(start.toArray(),mid.toArray(),.045*(1-t*.5),materials.trunk,.018);
      beam(mid.toArray(),tip.toArray(),.018,materials.trunk,.006);
      const twigs=distant?3:compact?4:6;
      for(let k=0;k<twigs;k++) {
        const v=.35+random()*.64,base=mid.clone().lerp(tip,v);
        const a=angle+(k%2?1:-1)*(.5+random()*.7),twigLength=.35+random()*.52;
        const end=base.clone().add(new THREE.Vector3(Math.cos(a)*twigLength,.1+random()*.35,Math.sin(a)*twigLength));
        if(!distant)beam(base.toArray(),end.toArray(),.01,materials.trunk,.003);
        for(let card=0;card<(compact||distant?2:3);card++) {
          const pos=base.clone().lerp(end,.5+random()*.5);
          const object=new THREE.Object3D();object.position.copy(pos);
          object.rotation.set(random()*Math.PI,random()*Math.PI,random()*Math.PI);
          const size=(distant?1.1:.88)+random()*.55;object.scale.set(size,size,1);object.updateMatrix();
          transforms.push({matrix:object.matrix.clone(),color:new THREE.Color().setHSL(.22+random()*.015,.12+random()*.18,.68+random()*.24)});
        }
      }
    }
  }
  const foliage=new THREE.InstancedMesh(new THREE.PlaneGeometry(1,1),materials.pine,transforms.length);
  foliage.name='Instanced pine needle sprays';foliage.castShadow=foliage.receiveShadow=true;
  transforms.forEach((t,i)=>{foliage.setMatrixAt(i,t.matrix);foliage.setColorAt(i,t.color);});
  foliage.computeBoundingSphere();foliage.instanceMatrix.needsUpdate=true;
  const result=batchStatic(wood);result.add(foliage);
  result.userData={trees:sites.length,foliageCards:transforms.length,compact,method:'tapered branches and alpha-tested needle cards'};
  return result;
}
