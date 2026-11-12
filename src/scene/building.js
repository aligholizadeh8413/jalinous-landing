import * as THREE from 'three';
import { createBuilder, batchStatic } from './geometry.js';

export const dimensions = Object.freeze({ width: 32.4, facadeHeight: 14.4, stairHeight: 17.0, depth: 9.0 });
export function createBuilding(m) {
  const group = new THREE.Group(); group.name = 'Jalinous limited-view reconstruction';
  const { box, beam, profile, mesh } = createBuilder(group);
  const front = 3.5;
  // Closed, shallow support volume. Detailed elevations are limited to observed faces.
  box(0, 7.2, -1.25, 32.4, 14.4, 8.5, m.stone, 'Closed support volume');
  box(0, .14, -.4, 33.5, .28, 10.7, m.redLine);
  // Left wing: three stone bays, deep glazing strips, central roller shutters.
  const bays = [{x:-13.9,w:4.2},{x:-9.5,w:3.65},{x:-5.8,w:2.9}];
  for (const [i,b] of bays.entries()) {
    box(b.x, 7, front+.04, b.w, 13.8, .24, m.recess);
    for (let floor=0; floor<4; floor++) {
      const y = floor*3.5;
      box(b.x, y+1.2, front+.31, b.w, 2.22, .49, m.stone);
      window(b.x,y+2.86,front+.24,b.w-.1,1.05,true);
    }
    if (i===1) for (const y of [1.7,5.2]) {
      box(b.x,y,front+.59,b.w-.3,2.7,.12,m.shutter);
      for(let j=0;j<24;j++)box(b.x,y-1.29+j*.11,front+.66,b.w-.35,.018,.025,m.paleStone);
    }
  }
  for (const x of [-16.05,-11.6,-7.5,-4.05,2.65,8.6,13,16.05]) {
    const tall = x===-4.05||x===2.65;
    box(x,tall?8.45:7.2,front+.45,.52,tall?16.9:14.4,.96,m.red,'Red stone pier');
    box(x+.19,tall?8.45:7.2,front+.94,.065,tall?16.9:14.4,.035,m.redLine);
  }
  // The broad entrance/emblem panel has narrow vertical windows on each edge.
  box(5.6,8.95,front+.39,4.85,10.75,.65,m.stone);
  for (const x of [3.49,7.77]) {
    for(let f=0;f<4;f++)window(x,1.95+f*3.48,front+.77,.78,2.8,false);
  }
  for (const x of [10.75,14.55]) {
    box(x,7.1,front+.04,3.55,14.0,.25,m.recess);
    for(let f=0;f<4;f++) {
      box(x,f*3.5+1.02,front+.35,3.55,1.95,.6,m.stone);
      window(x,f*3.5+2.72,front+.3,3.2,1.37,true);
    }
    if(x===10.75)window(x,2.37,front+.52,2.45,4.15,true);
  }
  // Return elevation: the video supports a short, repeated side rhythm.
  for(let z=-4;z<3;z+=3.3) {
    box(16.27,7.2,z,.23,14.4,.4,m.red);
    for(let f=0;f<4;f++) {
      box(16.23,2.5+f*3.5,z+1.35,.08,1.5,1.8,m.recess);
      box(16.29,2.5+f*3.5,z+1.35,.04,1.35,1.64,m.glass);
      box(16.32,2.5+f*3.5,z+1.35,.05,1.4,.06,m.frame);
    }
  }
  // Main cornice and a restrained roof slab; no speculative roof equipment.
  box(0,14.42,-.7,33.4,.22,10.1,m.paleStone);
  box(0,14.59,-.7,33.65,.12,10.3,m.stone);
  box(0,14.7,-1,32.3,.1,8.5,m.roof);
  for(let x=-16;x<16;x+=.32)box(x,14.28,front+.67,.035,.08,.9,m.paleStone);
  box(-.7,16.82,3.06,7.75,.23,4.0,m.paleStone);
  box(-.7,16.98,3.06,8.0,.12,4.15,m.stone);
  for(let x=-4.6;x<3.1;x+=.3)box(x,16.66,4.1,.035,.08,1.5,m.paleStone);
  // External staircase: rear return flights + forward flights and thick parapets.
  box(-.7,8.2,front+.01,5.8,16.2,.12,m.recess);
  const left=-3.74, low=-2.33, high=1.1, right=2.37;
  for (let f=0;f<4;f++) {
    const base=.3+f*3.8;
    const mid=base+1.9, top=base+3.8;
    profile([[left,mid],[low,mid],[high,base],[right,base],[right,base-.2],[high,base-.2],[low,mid-.2],[left,mid-.2]],3.69,1.0,m.paleStone,'Return stair flight');
    const points=[[left,mid],[low,mid],[high,top],[right,top],[right,top-.26],[high,top-.26],[low,mid-.26],[left,mid-.26]];
    profile(points,4.87,1.46,m.paleStone,'Front stair flight');
    // Treads are true geometry above the inclined slab.
    for(let s=0;s<13;s++) {
      const t=s/13;const x=low+(high-low)*t;
      box(x+(high-low)/26,mid+(top-mid)*t+.08,5.58,(high-low)/13,.16,1.4,m.stone,'Stair tread');
      const xr=low+(high-low)*t;
      box(xr+(high-low)/26,mid-(mid-base)*t+.08,4.18,(high-low)/13,.16,.96,m.stone);
    }
    // Continuous solid zigzag parapet, red stone inlay, and slender top rail.
    const path=[[left,mid],[low,mid],[high,top],[right,top]];
    const ribbon=(offset,height,mat,depth,z)=>profile([...path.map(([x,y])=>[x,y+offset+height]),...path.toReversed().map(([x,y])=>[x,y+offset])],z,depth,mat);
    ribbon(0,.58,m.stone,.17,6.29);
    ribbon(.36,.055,m.redLine,.025,6.468);
    for(let i=0;i<path.length-1;i++) {
      const a=path[i],b=path[i+1];
      beam([a[0],a[1]+.82,6.39],[b[0],b[1]+.82,6.39],.028,m.frame);
      const segments=Math.ceil((b[0]-a[0])/.8);
      for(let j=0;j<segments;j++) {
        const t=j/segments,x=THREE.MathUtils.lerp(a[0],b[0],t),y=THREE.MathUtils.lerp(a[1],b[1],t);
        beam([x,y+.57,6.39],[x,y+.82,6.39],.019,m.frame);
      }
    }
    // Inner rail makes the stair depth legible from the allowed elevated angle.
    beam([low,mid+.8,4.87],[high,top+.8,4.87],.025,m.frame);
  }
  // Roof sign uses the original photographed lettering, never invented text.
  for(const x of [-2.8,1.3])box(x,17.5,3.75,.1,1.0,.1,m.darkMetal);
  box(-.7,18.0,3.7,6.5,1.7,.14,m.frame);
  const sign = mesh(new THREE.PlaneGeometry(6.38,1.57),m.sign,-.7,18,3.79);sign.castShadow=false;
  // Source photograph on a shallow mounted plaque preserves the emblem exactly.
  const emblem=mesh(new THREE.PlaneGeometry(3.55,3.55),m.emblem,5.61,9.0,front+.73,'Photographed company emblem');emblem.castShadow=false;
  // Entry glass, canopy, red-stone supports, shallow roof tiles.
  box(5.62,1.95,4.0,3.45,3.8,.22,m.recess);
  window(5.62,1.82,4.16,2.82,3.3,false);
  for(const x of [5.39,5.85])beam([x,1.28,4.29],[x,2.12,4.29],.024,m.brass);
  for(const x of [3.85,7.4])box(x,1.85,6.07,.38,3.7,.38,m.red);
  box(5.62,3.68,5.2,4.42,.22,3.4,m.stone);
  box(5.62,3.86,5.2,4.6,.12,3.48,m.paleStone);
  const canopy=box(5.62,4.24,5.15,4.45,.13,3.6,m.tile);canopy.rotation.x=.25;
  for(let i=0;i<12;i++) { const z=3.47+i*.29;const y=4.65-(z-3.47)*.25;box(5.62,y,z,4.5,.025,.035,m.redLine); }
  for(let i=0;i<3;i++)box(5.62,.08+i*.08,6.48-i*.18,4.35,.16,.45+i*.36,m.paleStone);
  for(const x of [3.2,8.05]) {
    mesh(new THREE.CylinderGeometry(.27,.21,.52,12),m.paleStone,x,.32,6.6);
    mesh(new THREE.IcosahedronGeometry(.42,1),m.leaf,x,.96,6.6);
  }
  // Small fixtures visible in the reference.
  box(5.6,11.7,4.27,.4,.28,.24,m.darkMetal);
  box(5.6,11.58,4.4,.3,.045,.12,m.paleStone);
  const result=batchStatic(group);
  result.userData={frontFlights:4,returnFlights:4,photoDerivedLogo:true,closedSupportVolume:true};
  return result;

  function window(x,y,z,w,h,grid) {
    box(x,y,z,w,h,.13,m.recess);
    box(x,y,z+.075,w-.1,h-.08,.04,grid?m.glassWarm:m.glass);
    for(const side of [-1,1]) {
      box(x+side*(w/2-.035),y,z+.12,.055,h,.055,m.frame);
      box(x,y+side*(h/2-.035),z+.12,w,.055,.055,m.frame);
    }
    if(grid) {
      const cols=Math.max(2,Math.round(w/.38)), rows=Math.max(2,Math.round(h/.4));
      for(let j=1;j<cols;j++)box(x-w/2+j*w/cols,y,z+.13,.035,h,.05,m.frame);
      for(let j=1;j<rows;j++)box(x,y-h/2+j*h/rows,z+.13,w,.035,.05,m.frame);
    } else {
      box(x,y,z+.13,w,.04,.05,m.frame);
      if(w>2)box(x,y,z+.14,.055,h,.05,m.frame);
    }
    box(x,y-h/2-.05,z+.14,w+.13,.1,.27,m.paleStone);
  }
}
