import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

export function createBuilder(group) {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const cylinder = new THREE.CylinderGeometry(1, 1, 1, 8);
  function mesh(geo, material, x, y, z, name = '') {
    const m = new THREE.Mesh(geo, material);
    m.position.set(x, y, z);
    m.castShadow = m.receiveShadow = true;
    m.name = name;
    group.add(m);
    return m;
  }
  function box(x, y, z, w, h, d, material, name = '') {
    return mesh(geometry, material, x, y, z, name).scale.set(w, h, d);
  }
  // Separate box function returns the mesh to allow slope rotations.
  function block(x, y, z, w, h, d, material, name = '') {
    const m = mesh(geometry, material, x, y, z, name);
    m.scale.set(w, h, d); return m;
  }
  function beam(a, b, radius, material) {
    const from = new THREE.Vector3(...a), to = new THREE.Vector3(...b);
    const delta = to.clone().sub(from);
    const m = mesh(cylinder, material, ...from.clone().add(to).multiplyScalar(.5).toArray());
    m.scale.set(radius, delta.length(), radius);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), delta.normalize());
    return m;
  }
  function profile(points, z, depth, material, name = '') {
    const shape = new THREE.Shape(points.map(p => new THREE.Vector2(...p)));
    const geo = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: 1 });
    return mesh(geo, material, 0, 0, z, name);
  }
  return { mesh, box: block, beam, profile };
}

// Merge static geometry by material. Hundreds of architectural parts become a small
// number of draw calls. No mesh transforms are animated; only the camera moves.
export function batchStatic(group) {
  group.updateMatrixWorld(true);
  const buckets = new Map();
  group.traverse(m => {
    if (!m.isMesh) return;
    const key = m.material.uuid;
    if (!buckets.has(key)) buckets.set(key, { material: m.material, geometries: [] });
    let g = m.geometry.clone();
    if (g.index) { const flat = g.toNonIndexed(); g.dispose(); g = flat; }
    g.applyMatrix4(m.matrixWorld);
    for (const name of Object.keys(g.attributes)) if (!['position', 'normal', 'uv'].includes(name)) g.deleteAttribute(name);
    buckets.get(key).geometries.push(g);
  });
  const result = new THREE.Group(); result.name = group.name;
  for (const { material, geometries } of buckets.values()) {
    const merged = mergeGeometries(geometries, false);
    const mesh = new THREE.Mesh(merged, material);
    mesh.castShadow = mesh.receiveShadow = true;
    merged.computeBoundingSphere();
    result.add(mesh);
    geometries.forEach(g => g.dispose());
  }
  const originals = new Set();
  group.traverse(m => { if (m.isMesh) originals.add(m.geometry); });
  originals.forEach(g => g.dispose());
  return result;
}
