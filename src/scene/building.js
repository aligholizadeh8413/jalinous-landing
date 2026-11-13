import * as THREE from 'three';
import { createBuilder, batchStatic } from './geometry.js';
import { addRoof, addEntranceCanopy } from './roof.js';

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
      box(b.x, y+1.2, front+.31, b.w, 2.22, .49, m.stone, 'Beveled stone cladding', .015);
      stoneJoints(b.x,y+1.2,front+.56,b.w,2.22);
      window(b.x,y+2.86,front+.24,b.w-.1,1.05,true);
    }
    if (i===1) for (const y of [1.7,5.2]) {
      const width=b.w-.32;
      box(b.x,y,4.12,width+.12,2.83,.18,m.recess);
      for(let j=0;j<27;j++) {
        const yy=y-1.3+j*.1;
        // Rounded slat noses and shaded lower folds reveal the shutter relief.
        box(b.x,yy,4.25,width,.089,.065,m.shutter,'Shutter slat',.018);
        box(b.x,yy-.042,4.27,width,.012,.022,m.frame);
      }
      for(const xx of [b.x-width/2-.07,b.x+width/2+.07])box(xx,y,4.28,.14,2.87,.17,m.shutter,'Shutter side track');
      box(b.x,y+1.42,4.27,width+.3,.2,.23,m.shutter,'Shutter head enclosure',.025);
      box(b.x,y-1.38,4.29,width,.08,.1,m.darkMetal);
    }
  }
  for (const x of [-16.05,-11.6,-7.5,-4.05,2.65,8.6,13,16.05]) {
    const tall = x===-4.05||x===2.65;
    box(x,tall?8.45:7.2,front+.45,.52,tall?16.9:14.4,.96,m.red,'Red stone pier');
    box(x+.19,tall?8.45:7.2,front+.94,.065,tall?16.9:14.4,.035,m.redLine);
    for(let yy=.85;yy<(tall?16.9:14.4);yy+=1.05)box(x,yy,4.435,.51,.013,.009,m.redJoint,'Pier panel joint');
    box(x-.235,tall?8.45:7.2,4.438,.025,tall?16.9:14.4,.02,m.redLine);
  }
  // The broad entrance/emblem panel has narrow vertical windows on each edge.
  box(5.6,8.95,front+.39,4.85,10.75,.65,m.stone);
  stoneJoints(5.6,8.95,4.22,4.85,10.75);
  for (const x of [3.49,7.77]) {
    for(let f=0;f<4;f++)window(x,1.95+f*3.48,front+.77,.78,2.8,false);
  }
  for (const x of [10.75,14.55]) {
    box(x,7.1,front+.04,3.55,14.0,.25,m.recess);
    for(let f=0;f<4;f++) {
      box(x,f*3.5+1.02,front+.35,3.55,1.95,.6,m.stone);
      stoneJoints(x,f*3.5+1.02,4.156,3.55,1.95);
      window(x,f*3.5+2.72,front+.3,3.2,1.37,true);
    }
    if(x===10.75)window(x,2.37,front+.52,2.45,4.15,true);
  }
  // The video exposes the right return. Repeat observed bays only, ending
  // in a closed conservative volume before the camera can see the rear.
  for(const z of [-4.35,-1.1,2.25]) {
    box(16.32,7.2,z,.42,14.4,.48,m.red,'Return elevation pier');
    for(let yy=.85;yy<14.4;yy+=1.05)box(16.537,yy,z,.012,.013,.47,m.redJoint);
    for(let f=0;f<4;f++) {
      const yy=2.75+f*3.5,zz=z+1.45;
      box(16.212,yy,zz,.035,1.32,2.35,m.recess);
      box(16.244,yy,zz,.04,1.2,2.2,f%2?m.glassWarm:m.glass);
      for(let c=0;c<=6;c++)box(16.29,yy,zz-1.1+c*2.2/6,.065,1.23,.036,m.frame);
      for(let r=0;r<=3;r++)box(16.29,yy-.6+r*.4,zz,.065,.036,2.24,m.frame);
      box(16.38,yy-.7,zz,.32,.12,2.45,m.paleStone,'Return window sill');
      for(let row=0;row<5;row++)box(16.21,f*3.5+.25+row*.36,zz,.012,.012,2.35,m.joint);
    }
  }
  addRoof(group,m);
  // Upper canopy now projects over the full stair depth, including the front
  // parapet. V1's flat slab ended behind the flights.
  addRoof(group,m,{x:-.7,z:3.82,w:8.15,d:6.4,y:17.03,rise:.54,inset:1.1,sign:true});
  // External staircase: rear return flights + forward flights and thick parapets.
  box(-.7,8.2,front+.01,5.8,16.2,.12,m.recess);
  const left=-3.74, low=-2.33, high=1.1, right=2.37;
  for (let f=0;f<4;f++) {
    const base=.3+f*3.8;
    const mid=base+1.9, top=base+3.8;
    // Horizontal landings join both flights. The stepped profile has
    // closed risers and a continuous, correctly thick sloping underside.
    box((left+low)/2,mid-.14,5.02,low-left,.28,2.96,m.paleStone,'Shared intermediate landing');
    box((high+right)/2,top-.14,5.6,right-high,.28,1.46,m.paleStone,'Upper landing');
    box((high+right)/2,base-.14,4.22,right-high,.28,1.12,m.paleStone,'Return landing');
    steppedFlight(low,high,mid,top,4.87,1.46,'Front stair flight');
    steppedFlight(high,low,base,mid,3.69,1.12,'Return stair flight');
    for(const z of [4.82,6.38])box(left+.06,mid-.36,z,.18,.45,.18,m.paleStone,'Landing bearing');
    // Deep, unlit stair-well glazing behind the flights.
    if(f===3)window(-.65,base+2.8,3.58,5.65,1.25,true);
    // Continuous solid zigzag parapet, red stone inlay, and slender top rail.
    const path=[[left,mid],[low,mid],[high,top],[right,top]];
    const ribbon=(offset,height,mat,depth,z)=>profile([...path.map(([x,y])=>[x,y+offset+height]),...path.toReversed().map(([x,y])=>[x,y+offset])],z,depth,mat);
    ribbon(0,.58,m.stone,.17,6.29);
    ribbon(.36,.055,m.redLine,.025,6.468);
    ribbon(.58,.045,m.paleStone,.23,6.26);
    // Vertical cladding joints follow the inclined parapet, not a floating decal.
    for(let sx=low+.3;sx<high;sx+=.6) {const sy=mid+(sx-low)/(high-low)*1.9;box(sx,sy+.28,6.473,.009,.48,.006,m.joint);}
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
    for(let i=0;i<=7;i++){const t=i/7,xx=low+(high-low)*t,yy=mid+1.9*t;beam([xx,yy+.06,4.87],[xx,yy+.8,4.87],.018,m.frame);}
    // Short ceiling fixtures under the exposed landings, visible in the photo.
    box(left+.55,mid-.3,5.5,.38,.045,.19,m.soffit);
  }
  // Roof sign uses the original photographed lettering, never invented text.
  box(-.7,18.75,4.3,6.5,1.7,.18,m.frame,'Rooftop sign casing');
  const sign=mesh(new THREE.PlaneGeometry(6.38,1.57),m.sign,-.7,18.75,4.402);sign.castShadow=false;
  for(const yy of [17.91,19.59])box(-.7,yy,4.42,6.56,.055,.07,m.redLine);
  for(const xx of [-3.95,2.55])box(xx,18.75,4.42,.055,1.72,.07,m.redLine);
  // Source photograph on a shallow mounted plaque preserves the emblem exactly.
  const emblem=mesh(new THREE.PlaneGeometry(3.55,3.55),m.emblem,5.61,9.0,front+.73,'Photographed company emblem');emblem.castShadow=false;
  // Entry glass, canopy, red-stone supports, shallow roof tiles.
  box(5.62,1.95,4.0,3.45,3.8,.22,m.recess);
  window(5.62,1.82,4.16,2.82,3.3,false);
  for(const x of [5.39,5.85])beam([x,1.28,4.29],[x,2.12,4.29],.024,m.brass);
  addEntranceCanopy(group,m);
  for(let i=0;i<3;i++)box(5.62,.08+i*.08,6.48-i*.18,4.35,.16,.45+i*.36,m.paleStone);
  for(const x of [3.2,8.05]) {
    mesh(new THREE.CylinderGeometry(.27,.21,.52,12),m.paleStone,x,.32,6.6);
    for(let j=0;j<24;j++){const a=j*2.4,r=.16+((j*7)%9)*.017;const shrub=mesh(new THREE.SphereGeometry(.12,5,4),j%3?m.leaf:m.leafLight,x+Math.cos(a)*r,.75+(j%6)*.075,6.6+Math.sin(a)*r);shrub.scale.y=1.4;}
  }
  // Small fixtures visible in the reference.
  box(5.6,11.7,4.27,.4,.28,.24,m.darkMetal);
  box(5.6,11.58,4.4,.3,.045,.12,m.paleStone);
  const result=batchStatic(group);
  result.userData={frontFlights:4,returnFlights:4,photoDerivedLogo:true,closedSupportVolume:true,slopedRoofs:2,continuousSteppedFlights:8};
  return result;

  function stoneJoints(x,y,z,w,h) {
    const spacing=.39;
    for(let row=0;row<Math.floor(h/spacing);row++) {
      const yy=y-h/2+.16+row*spacing;
      box(x,yy,z,w,.009,.008,m.joint,'Fine stone bed joint');
      for(let xx=x-w/2+.7+(row%2)*.55;xx<x+w/2-.15;xx+=1.45)box(xx,yy+spacing/2,z,.009,spacing,.008,m.joint);
    }
  }
  function steppedFlight(a,b,lowY,highY,z,depth,name) {
    const count=13,run=(b-a)/count,rise=(highY-lowY)/count;
    const points=[[a,lowY-.25],[a,lowY]];
    for(let i=0;i<count;i++) {
      const xx=a+i*run,yy=lowY+(i+1)*rise;
      points.push([xx,yy],[xx+run,yy]);
      box(xx+run/2,yy+.017,z+depth/2,Math.abs(run)+.025,.035,depth+.025,m.stone,'Stone tread nosing');
      box(xx+run*.04,yy-.025,z+depth/2,.022,.026,depth-.05,m.joint,'Nosing contact line');
    }
    points.push([b,highY-.25]);profile(points,z,depth,m.paleStone,name);
  }
  function window(x,y,z,w,h,grid) {
    box(x,y,z,w+.04,h+.04,.15,m.recess,'Dark window reveal');
    box(x,y,z+.084,w-.12,h-.12,.025,grid?m.glassWarm:m.glass,'Recessed glazing');
    for(const side of [-1,1]) {
      box(x+side*(w/2-.035),y,z+.14,.065,h,.15,m.frame,'Deep outer jamb');
      box(x,y+side*(h/2-.035),z+.14,w,.065,.15,m.frame);
      box(x+side*(w/2-.09),y,z+.175,.018,h-.12,.028,m.darkMetal,'Glazing gasket');
    }
    if(grid) {
      const cols=Math.max(2,Math.round(w/.4)),rows=Math.max(2,Math.round(h/.4));
      // Restrained variation in a minority of panes, no invented illuminated rooms.
      for(let j=0;j<cols;j++)for(let k=0;k<rows;k++)if((j*7+k*3+Math.round(x))%9===0)box(x-w/2+(j+.5)*w/cols,y-h/2+(k+.5)*h/rows,z+.102,w/cols-.04,h/rows-.04,.008,m.glassDark);
      for(let j=1;j<cols;j++)box(x-w/2+j*w/cols,y,z+.18,.035,h,.075,m.frame);
      for(let j=1;j<rows;j++)box(x,y-h/2+j*h/rows,z+.18,w,.035,.075,m.frame);
    } else {
      box(x,y,z+.18,w,.045,.08,m.frame);
      if(w>2)box(x,y,z+.18,.065,h,.08,m.frame);
    }
    box(x,y-h/2-.06,z+.17,w+.18,.12,.38,m.paleStone,'Projecting stone sill',.012);
    box(x,y+h/2+.045,z+.14,w+.16,.055,.3,m.paleStone,'Window lintel');
  }
}
