import * as THREE from 'three';

export function createMaterials(manager) {
  const loader = new THREE.TextureLoader(manager);
  function texture(name, repeat = 1) {
    const map = loader.load(`${import.meta.env?.BASE_URL ?? '/'}textures/${name}.webp`);
    map.colorSpace = THREE.SRGBColorSpace;
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(repeat, repeat);
    map.anisotropy = 4;
    return map;
  }
  const stone = texture('limestone');
  const red = texture('red-stone');
  const paving = texture('paving');
  const standard = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: .85, ...extra });
  return {
    stone: standard('#fff4df', { map: stone, bumpMap: stone, bumpScale: .025 }),
    paleStone: standard('#e6ddc7'),
    red: standard('#dac6b6', { map: red, bumpMap: red, bumpScale: .018, roughness: .66 }),
    redLine: standard('#896653'),
    recess: standard('#303b36'),
    glass: standard('#526a66', { roughness: .25, metalness: .38, envMapIntensity: .65 }),
    glassWarm: standard('#687064', { roughness: .31, metalness: .25 }),
    frame: standard('#aeab8c', { metalness: .3, roughness: .51 }),
    darkMetal: standard('#354039', { metalness: .35, roughness: .5 }),
    brass: standard('#bc9c52', { metalness: .67, roughness: .35 }),
    tile: standard('#65544b', { roughness: .92 }),
    roof: standard('#b3afa2'),
    shutter: standard('#c7be9f'),
    paving: standard('#f0eee3', { map: paving, bumpMap: paving, bumpScale: .015 }),
    curb: standard('#d6d7c4'),
    grass: standard('#879375'),
    leaf: standard('#647b4d'),
    leafLight: standard('#879765'),
    trunk: standard('#75614b'),
    carpet: standard('#98594e'),
    ground: standard('#dce3d6'),
    background: standard('#c6d0c7'),
    backgroundDark: standard('#b4c3bd'),
    backgroundRoof: standard('#adbfb8'),
    road: standard('#c1ccc1'),
    emblem: standard('#fff6df', { map: texture('emblem'), roughness: .7 }),
    sign: standard('#fff8e9', { map: texture('roof-sign') })
  };
}
