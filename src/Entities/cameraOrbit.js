import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export const createCameraOrbit = (renderer) => {
    const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.01, 100000)
    camera.position.set(0, 1.7, 10)
    //scene.add(camera)

    if (!renderer) {
        console.log('!!!: no renderer for orbitControls')
    }

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.minDistance = 0
    controls.maxDistance = 200
    controls.zoomSpeed = 1
    controls.target.set(0, 3, -10)
    controls.update()

    return {
        camera,
        update: () => {
            if (camera.position.y < 0.001) {
                camera.position.y = 0.001
                controls.update()
            }
        }
    }
}
