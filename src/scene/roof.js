import { createBuilder } from './geometry.js';

// Closed hip/perimeter roof shell: only the visible shallow roof is reconstructed.
// Its quiet central surface closes the model without claiming a rooftop survey.
export function addRoof(group,m,{x=0,z=-.8,w=34,d=11,y=14.55,rise=.85,inset=1.5,sign=false}={}) {
  const {box,quad,beam}=createBuilder(group);
  const l=x-w/2,r=x+w/2,b=z-d/2,f=z+d/2,top=y+rise;
  const A=[l,y,b],B=[r,y,b],C=[r,y,f],D=[l,y,f];
  const a=[l+inset,top,b+inset],b1=[r-inset,top,b+inset],c=[r-inset,top,f-inset],d1=[l+inset,top,f-inset];
  quad([D,C,c,d1],m.tile,'Sloped front roof');quad([C,B,b1,c],m.tile,'Hipped right roof');
  quad([B,A,a,b1],m.tile,'Closed rear roof edge');quad([A,D,d1,a],m.tile,'Hipped left roof');
  quad([d1,c,b1,a],m.roof,'Simplified closed upper roof');
  box(x,y-.13,z,w,.22,d,m.soffit,'Deep roof soffit');
  // Layered drip edge and fascia on all edges; white ribbed undersides in photos.
  for(const yy of [y-.18,y-.035]) {
    box(x,yy,f+.018,w+.08,.055,.09,m.paleStone,'Front fascia lip');
    box(x,yy,b-.018,w+.08,.055,.09,m.paleStone);
    box(l-.018,yy,z,.09,.055,d,m.paleStone);box(r+.018,yy,z,.09,.055,d,m.paleStone);
  }
  for(let xx=l+.12;xx<r;xx+=.19)box(xx,y-.25,f-.65,.018,.018,1.25,m.joint,'Soffit panel joint');
  for(let zz=b+.15;zz<f;zz+=.2){box(r-.58,y-.25,zz,1.15,.018,.018,m.joint);box(l+.58,y-.25,zz,1.15,.018,.018,m.joint);}
  // Shingle course lips sit on the actual slope rather than floating above it.
  const courses=Math.ceil(inset/.2);
  for(let i=1;i<courses;i++) {
    const t=i/courses,zz=f-t*inset,yy=y+t*rise+.012;
    box(x,yy,zz,w-2*t*inset,.028,.045,m.tile,'Roof shingle course');
    box(r-t*inset,yy,z,.045,.028,d-2*t*inset,m.tile);
  }
  if(sign) {
    // The original lettering remains a photographed texture. Bracing is visible.
    for(const xx of [x-2.1,x+2.1]) {
      box(xx,top+.42,z+.4,.085,.84,.085,m.darkMetal);
      beam([xx,top,z-1],[xx,top+.8,z+.4],.035,m.darkMetal);
      box(xx,top+.03,z-.3,.24,.08,1.65,m.darkMetal);
    }
  }
}

export function addEntranceCanopy(group,m) {
  const {box,quad}=createBuilder(group);
  const x=5.62,l=x-2.3,r=x+2.3,back=3.72,front=6.92,low=3.85,high=4.93;
  box(x,3.67,5.32,4.6,.21,3.25,m.soffit,'Entrance canopy underside');
  quad([[l,low,front],[r,low,front],[r,high,back],[l,high,back]],m.tile,'Pitched entrance canopy');
  quad([[l,3.78,back],[l,3.78,front],[l,low,front],[l,high,back]],m.tile,'Canopy side fascia');
  quad([[r,3.78,front],[r,3.78,back],[r,high,back],[r,low,front]],m.tile,'Canopy side fascia');
  for(const y of [3.55,3.76]){box(x,y,front,4.75,.09,.11,m.paleStone);for(const xx of [l,r])box(xx,y,5.32,.11,.09,3.28,m.paleStone);}
  for(let xx=l+.15;xx<r;xx+=.25)box(xx,3.55,5.32,.016,.016,3.15,m.joint);
  for(let i=1;i<=15;i++){const t=i/16;box(x,low+(high-low)*t+.015,front-(front-back)*t,4.61,.03,.045,m.tile);}
  for(const xx of [3.85,7.4]) {
    box(xx,1.82,6.07,.43,3.64,.46,m.red,'Entrance stone column',.025);
    box(xx,.18,6.07,.55,.28,.57,m.redLine,'Column plinth',.02);
    box(xx,3.51,6.07,.56,.16,.59,m.paleStone,'Column capital');
  }
}
