import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { TDSLoader } from 'three/examples/jsm/loaders/TDSLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import * as THREE from 'three'


export const parseGlbInputFile = f => {
    return new Promise(res => {
        const loader = new GLTFLoader()
        const url = URL.createObjectURL(f)
        loader.load(
            url,
            function ( gltf ) {
                res(gltf)
                URL.revokeObjectURL(url)
            },
            function () {},
            function () {
                URL.revokeObjectURL(url)
            }
        )
    })
}

export const loadAssets = (arr, onProgress = () => {}) => {
    return new Promise(res => {
        const loaders = {
            'fbx': new FBXLoader(),
            'img': new THREE.TextureLoader(),
            'imgCube': new THREE.CubeTextureLoader(),
            'gltf': new GLTFLoader(),
            'tdsLoader': new TDSLoader(),
            'obj': new OBJLoader(),
        }

        const assets = {}

        const iterate = i => {
            onProgress(i / arr.length)


            if (!arr[i]) {
                return res(assets);
            }

            const { key, src, typeLoader } = arr[i]
            loaders[typeLoader].load(src, model => {
                assets[key] = {
                    ...arr[i],
                    model,
                }
                iterate(i + 1)
            })
        }

        iterate(0)
    })
}


