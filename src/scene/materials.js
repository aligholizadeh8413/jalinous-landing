import * as THREE from 'three';

export function createMaterials(manager) {
  const loader=new THREE.TextureLoader(manager);
  function texture(name,color=true) {
    const map=loader.load(`${import.meta.env?.BASE_URL??'/'}textures/${name}.webp`);
    map.colorSpace=color?THREE.SRGBColorSpace:THREE.NoColorSpace;
    map.wrapS=map.wrapT=THREE.RepeatWrapping;map.anisotropy=8;return map;
  }
  const standard=(color,extra={})=>new THREE.MeshStandardMaterial({color,roughness:.85,...extra});
  function pbr(name,metres,color='#ffffff',roughness=1,normal=.4){
    const material=standard(color,{map:texture(name),normalMap:texture(`${name}-normal`,false),roughnessMap:texture(`${name}-roughness`,false),roughness,normalScale:new THREE.Vector2(normal,normal)});
    material.userData.metres=metres;return material;
  }
  const m={
    stone:pbr('limestone-v2',1.8),paleStone:standard('#cfc6b0'),
    red:pbr('cladding-v2',1.25),redLine:standard('#6e4b40'),
    joint:standard('#a3977f'),redJoint:standard('#593e36'),recess:standard('#202925'),
    glass:standard('#526e70',{roughness:.19,metalness:.56,envMapIntensity:1.1}),
    glassWarm:standard('#4d5d56',{roughness:.27,metalness:.48,envMapIntensity:.9}),
    glassDark:standard('#303e3a',{roughness:.22,metalness:.46,envMapIntensity:.9}),
    frame:standard('#a49f82',{metalness:.55,roughness:.43}),
    darkMetal:standard('#303b34',{metalness:.4,roughness:.48}),
    brass:standard('#b19a53',{metalness:.75,roughness:.3}),
    tile:pbr('roof-shingles',1.6),roof:standard('#aba597'),soffit:standard('#d5cdbb'),
    shutter:standard('#b0a88e',{metalness:.35,roughness:.53}),
    paving:pbr('pavers-v2',2.56,'#ffffff',1,.55),
    curb:standard('#c5c4b0'),grass:standard('#657044'),soil:standard('#595342'),
    leaf:standard('#526b34'),leafLight:standard('#7c8752'),
    trunk:pbr('pine-bark',1,'#ffffff',1,.6),
    carpet:standard('#963b2c'),ground:standard('#cdd5c5'),
    background:standard('#bfcac4'),backgroundDark:standard('#a5b9b2'),backgroundRoof:standard('#afbab2'),road:standard('#b1b9ad'),
    emblem:standard('#fff8ea',{map:texture('emblem'),roughness:.72}),
    sign:standard('#fff9ee',{map:texture('roof-sign')}),
    pine:standard('#ffffff',{map:texture('pine-sprig'),alphaTest:.35,side:THREE.DoubleSide,roughness:1,alphaToCoverage:true}),
    flower:standard('#d6b749')
  };
  m.pine.shadowSide=THREE.DoubleSide;
  return m;
}
