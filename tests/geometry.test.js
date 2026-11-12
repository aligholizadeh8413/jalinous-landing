import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {createBuilder,batchStatic} from '../src/scene/geometry.js';
import {createBuilding} from '../src/scene/building.js';
import {createMaterials} from '../src/scene/materials.js';
import {createSurroundings} from '../src/scene/surroundings.js';
THREE.TextureLoader.prototype.load=function(url){const t=new THREE.Texture();t.userData.source=url;return t;};
test('static batching preserves shadow flags, UVs and instanced assets',()=>{
  const g=new THREE.Group(),m=new THREE.MeshStandardMaterial();m.userData.metres=2;
  const b=createBuilder(g);b.box(0,0,0,10,2,1,m);b.box(0,2,0,1,1,1,m).castShadow=false;
  const instance=new THREE.InstancedMesh(new THREE.PlaneGeometry(1,1),m,2);g.add(instance);
  const result=batchStatic(g);assert.equal(result.children.length,3);
  assert.ok(result.children.includes(instance));assert.ok(result.children.some(x=>!x.castShadow));
  assert.ok(Math.max(...result.children[0].geometry.attributes.uv.array)>1,'UVs use physical tiling');
});
test('architectural geometry is finite, bounded and includes eight closed stepped flights',()=>{
  const m=createMaterials(),b=createBuilding(m);assert.equal(b.userData.continuousSteppedFlights,8);assert.equal(b.userData.slopedRoofs,2);
  b.traverse(o=>{if(o.isMesh)for(const v of o.geometry.attributes.position.array)assert.ok(Number.isFinite(v));});
  const bounds=new THREE.Box3().setFromObject(b);assert.ok(bounds.max.y<20&&bounds.max.y>19);assert.ok(bounds.max.x<18);
  const env=createSurroundings(m,true);let foliage;env.traverse(o=>{if(o.isInstancedMesh)foliage=o;});
  assert.ok(foliage.count>1000);assert.equal(foliage.material.alphaTest,.35);
});
