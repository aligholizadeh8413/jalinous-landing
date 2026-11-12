import * as THREE from 'three';
import { createBuilder, batchStatic } from './geometry.js';

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
  planter(-11.7,10.4,11.7,4.8);planter(14.9,11.4,8.1,5.1);
  // Slender mature courtyard trees, leaving the staircase and emblem unobscured.
  tree(-17,9,8.8,1.7);tree(-13.6,9.5,9.9,1.65);tree(-9.5,10.6,8.4,1.6);
  tree(16.7,10.3,9.8,1.8);tree(13.4,12.3,8.2,1.7);
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
  for(const [x,z] of [[-23,-13],[-22,-23],[22,-14],[26,-26],[-27,20],[27,18],[-39,-20]]) tree(x,z,5.6,1.6,true);
  // Thin paving joints support perspective without a decorative grid overlay.
  for(let x=-21;x<=21;x+=3)box(x,-.055,9,.018,.008,24,m.curb);
  return batchStatic(group);

  function planter(x,z,w,d) {
    box(x,.18,z,w,.36,d,m.redLine);box(x,.39,z,w+.1,.08,d+.1,m.paleStone);
    box(x,.43,z,w-.35,.03,d-.35,m.grass);
    const n=compact?16:38;
    for(let i=0;i<n;i++) {
      const px=x+(random()-.5)*(w-.6),pz=z+(random()-.5)*(d-.6);
      mesh(new THREE.IcosahedronGeometry(.12+random()*.18,0),i%3?m.leaf:m.leafLight,px,.55,pz);
    }
  }
  function tree(x,z,h,r,background=false) {
    beam([x,0,z],[x+.13,h*.9,z],background?.13:.115,m.trunk);
    const n=compact?7:12;
    for(let i=0;i<n;i++) {
      const a=i*2.3999, level=.65+random()*.3;
      const radius=r*(.52+random()*.48);
      const px=x+Math.cos(a)*radius*.7,pz=z+Math.sin(a)*radius*.7;
      beam([x,h*level-.7,z],[px,h*level,pz],.035,m.trunk);
      const crown=mesh(new THREE.IcosahedronGeometry(radius,1),i%3===0?m.leafLight:m.leaf,px,h*level,pz);
      crown.scale.set(1,.38+random()*.23,1);crown.rotation.set(random(),random(),random());
    }
  }
}
