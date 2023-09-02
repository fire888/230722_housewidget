// import houseSrc from '../assets/house.3DS'
import Rizhskiy_s1f2_WB_detachWalls from '../assets/Rizhskiy_s1f2_WB_detachWalls.glb'
import labelSrc from '../assets/label.png'
import labelObjSrc from '../assets/label.obj'

export const ASSETS = [
  //  { key: 'house', src: houseSrc, typeLoader: 'tdsLoader' },
    { key: 'Rizhskiy_s1f2_WB_detachWalls', src: Rizhskiy_s1f2_WB_detachWalls, typeLoader: 'gltf' },
    //{ key: 'env00', src: [px, nx, py, ny, pz, nz], typeLoader: 'imgCube' },
    //{ key: 'craneT', src: craneT, typeLoader: 'gltf' },
    //{ key: 'label', src: labelSrc, typeLoader: 'img' },
    { key: 'label', src: labelObjSrc, typeLoader: 'obj' },
]
