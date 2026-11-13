import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

// Box UVs use physical metres, so a 30m facade and a 20cm sill never stretch
// the same image across their entire width. Branded image planes retain 0..1 UVs.
export function physicalUV(geometry, scale=1) {
  const p=geometry.attributes.position,n=geometry.attributes.normal,uv=geometry.attributes.uv;
  for(let i=0;i<p.count;i++) {
    const ax=Math.abs(n.getX(i)),ay=Math.abs(n.getY(i));
    const u=ax>.7?p.getZ(i):p.getX(i);
    const v=ay>.7?p.getZ(i):p.getY(i);
    uv.setXY(i,u/scale,v/scale);
  }
  return geometry;
}
export function createBuilder(group) {
  const cylinder=new THREE.CylinderGeometry(1,1,1,10);
  function mesh(geo,material,x,y,z,name='') {
    const m=new THREE.Mesh(geo,material);m.position.set(x,y,z);
    m.castShadow=m.receiveShadow=true;m.name=name;group.add(m);return m;
  }
  function box(x,y,z,w,h,d,material,name='',bevel=0) {
    const geo=bevel?new RoundedBoxGeometry(w,h,d,1,Math.min(bevel,w/3,h/3,d/3)):new THREE.BoxGeometry(w,h,d);
    if(material.userData?.metres)physicalUV(geo,material.userData.metres);
    return mesh(geo,material,x,y,z,name);
  }
  function beam(a,b,radius,material,endRadius=radius) {
    const from=new THREE.Vector3(...a),to=new THREE.Vector3(...b),delta=to.clone().sub(from);
    const geo=endRadius===radius?cylinder:new THREE.CylinderGeometry(endRadius/radius,1,1,8);
    const m=mesh(geo,material,...from.clone().add(to).multiplyScalar(.5).toArray());
    m.scale.set(radius,delta.length(),radius);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());return m;
  }
  function profile(points,z,depth,material,name='') {
    const shape=new THREE.Shape(points.map(p=>new THREE.Vector2(...p)));
    const geo=new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:false,curveSegments:1});
    if(material.userData?.metres)physicalUV(geo,material.userData.metres);
    return mesh(geo,material,0,0,z,name);
  }
  function quad(vertices,material,name='') {
    const g=new THREE.BufferGeometry();
    g.setAttribute('position',new THREE.Float32BufferAttribute(vertices.flat(),3));
    g.setAttribute('uv',new THREE.Float32BufferAttribute([0,0,1,0,1,1,0,1],2));
    g.setIndex([0,1,2,0,2,3]);g.computeVertexNormals();
    if(material.userData?.metres)physicalUV(g,material.userData.metres);
    return mesh(g,material,0,0,0,name);
  }
  return {mesh,box,beam,profile,quad};
}

// Preserve attribute layouts, shadow flags and custom depth materials. Instanced
// assets/LODs keep their own geometry and culling; never flatten their transforms.
export function batchStatic(group) {
  group.updateMatrixWorld(true);
  const buckets=new Map(),originals=new Set(),retained=[];
  group.traverse(m=>{
    if(m.isInstancedMesh){retained.push(m);return;}
    if(!m.isMesh)return;
    const attributes=Object.keys(m.geometry.attributes).sort().join(',');
    const key=[m.material.uuid,m.castShadow,m.receiveShadow,attributes,m.customDepthMaterial?.uuid||''].join(':');
    if(!buckets.has(key))buckets.set(key,{source:m,geometries:[]});
    let g=m.geometry.clone();
    if(g.index){const flat=g.toNonIndexed();g.dispose();g=flat;}
    g.applyMatrix4(m.matrixWorld);buckets.get(key).geometries.push(g);originals.add(m.geometry);
  });
  const result=new THREE.Group();result.name=group.name;
  for(const {source,geometries} of buckets.values()) {
    const g=mergeGeometries(geometries,false);
    if(!g)throw new Error('Incompatible architectural geometry batch');
    const mesh=new THREE.Mesh(g,source.material);
    mesh.castShadow=source.castShadow;mesh.receiveShadow=source.receiveShadow;
    mesh.customDepthMaterial=source.customDepthMaterial;
    g.computeBoundingSphere();result.add(mesh);geometries.forEach(part=>part.dispose());
  }
  for(const m of retained){m.matrixWorld.decompose(m.position,m.quaternion,m.scale);result.add(m);}
  originals.forEach(g=>g.dispose());return result;
}
