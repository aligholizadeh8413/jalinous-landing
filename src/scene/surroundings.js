import * as THREE from 'three';
import { createBuilder, batchStatic } from './geometry.js';
import { createPines } from './vegetation.js';
import { addRoof } from './roof.js';

export function createSurroundings(m, compact=false) {
  const group=new THREE.Group();group.name='Abstract industrial setting and entrance courtyard';
  const {box,mesh,beam}=createBuilder(group);
  let seed=42;
  const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  box(0,-.33,0,600,.3,600,m.ground);
  box(0,-.13,9,43,.12,25,m.paving);
  // Low curb and the original entrance's central paved approach.
  box(0,-.04,21.6,43,.18,.3,m.curb);
  box(0,-.2,27,140,.06,10,m.road);
  box(5.62,.015,10,1.85,.025,7.5,m.carpet);
  for(const x of [4.5,6.75]) {
    for(let i=0;i<6;i++) {
      const z=6.8+i*1.3;
      mesh(new THREE.CylinderGeometry(.13,.17,.08,10),m.brass,x,.05,z);
      beam([x,.09,z],[x,.94,z],.035,m.brass);
      mesh(new THREE.SphereGeometry(.065,8,6),m.brass,x,1,z);
      if(i<5) {
        const pts=[];
        for(let j=0;j<=8;j++) { const t=j/8;pts.push(new THREE.Vector3(x,.88-Math.sin(t*Math.PI)*.29,z+t*1.3)); }
        mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),8,.017,4,false),m.brass,0,0,0);
      }
    }
  }
  planter(-12.4,10.0,12.0,5.3);planter(15.2,11.3,8.2,5.4);
  // Photographed covered structure at the left edge, with a low hipped roof,
  // dark slender columns and mesh-like side screens. No invented signage.
  const gx=-14.6,gz=5.5;
  box(gx,.12,gz,5.1,.24,3.9,m.paleStone,'Gazebo raised base');
  for(const xx of [gx-2.2,gx+2.2])for(const zz of [gz-1.55,gz+1.55])box(xx,1.75,zz,.09,3.3,.09,m.darkMetal);
  addRoof(group,m,{x:gx,z:gz,w:5.4,d:4.15,y:3.55,rise:.72,inset:1.7});
  for(const xx of [gx-2.2,gx+2.2])for(let zz=gz-1.55;zz<=gz+1.55;zz+=.24)box(xx,1.5,zz,.035,2.7,.035,m.frame);
  for(const yy of [.45,2.9])box(gx,yy,gz-1.55,4.4,.045,.05,m.frame);
  // Adjacent low building fragment is muted; its green wall is in the photo.
  box(-23,2.4,4,4,4.8,13,m.background);box(-20.96,2.2,4,.04,3.6,11.8,m.backgroundDark);
  // Entry approach has two distinct level changes and a coping edge.
  for(let j=0;j<2;j++)box(-18.5,.035+j*.07,14.1-j*.3,5.2,.14,.6+j*.4,m.paleStone);
  // Background masses deliberately suggest scale rather than a claimed digital twin.
  for(const b of [
    [-32,4,-8,19,8,18],[-30,2.9,13,14,5.8,12],[33,4.5,-10,20,9,21],
    [-19,3.2,-29,18,6.4,14],[6,4.1,-26,23,8.2,15],[31,3.2,-37,21,6.4,18],
    [-43,4,-43,23,8,17],[3,3.5,-52,27,7,16],[52,3,-14,14,6,19]
  ]) {
    const [x,y,z,w,h,d]=b;
    box(x,y,z,w,h,d,m.background);
    box(x,h+.14,z,w+.5,.28,d+.5,m.backgroundRoof);
    box(x,h*.4,z+d/2+.025,w-.9,.7,.06,m.backgroundDark);
    for(let j=-w/2+1;j<w/2;j+=3)box(x+j,h*.66,z+d/2+.035,1.4,1.15,.05,m.backgroundDark);
  }
  const result=batchStatic(group);result.add(createPines(m,compact));return result;

  function planter(x,z,w,d) {
    // Chamfered garden-wall outline follows the photographed low stone beds.
    const cut=.7,pts=[[-w/2+cut,-d/2],[w/2-cut,-d/2],[w/2,-d/2+cut],[w/2,d/2-cut],[w/2-cut,d/2],[-w/2+cut,d/2],[-w/2,d/2-cut],[-w/2,-d/2+cut]];
    const shape=new THREE.Shape(pts.map(([px,pz])=>new THREE.Vector2(px,-pz)));
    const ground=new THREE.ShapeGeometry(shape);ground.rotateX(-Math.PI/2);
    mesh(ground,m.soil,x,.29,z);
    for(let i=0;i<pts.length;i++) {
      const a=pts[i],b=pts[(i+1)%pts.length],length=Math.hypot(b[0]-a[0],b[1]-a[1]);
      const cx=x+(a[0]+b[0])/2,cz=z+(a[1]+b[1])/2,rotation=-Math.atan2(b[1]-a[1],b[0]-a[0]);
      const wall=box(cx,.19,cz,length+.05,.38,.24,m.red,'Garden stone wall');wall.rotation.y=rotation;
      const cap=box(cx,.43,cz,length+.09,.1,.34,m.paleStone,'Garden coping',.018);cap.rotation.y=rotation;
      const foot=box(cx,.045,cz,length+.05,.09,.3,m.paleStone);foot.rotation.y=rotation;
      const parts=Math.ceil(length/.64);
      for(let j=1;j<parts;j++){const t=j/parts;const joint=box(x+a[0]+(b[0]-a[0])*t,.19,z+a[1]+(b[1]-a[1])*t,.012,.34,.245,m.redJoint);joint.rotation.y=rotation;}
    }
    // Sparse groundcover tufts and the photographed yellow flower border.
    const n=compact?100:230;
    for(let i=0;i<n;i++) {
      const px=x+(random()-.5)*(w-1.4),pz=z+(random()-.5)*(d-1.3),height=.08+random()*.17;
      for(let j=0;j<3;j++)beam([px,.3,pz],[px+(random()-.5)*.17,.3+height,pz+(random()-.5)*.17],.012,j%2?m.leaf:m.leafLight,.002);
      if(i%7===0)mesh(new THREE.SphereGeometry(.042,5,3),m.flower,px,.3+height,pz);
    }
  }
}
