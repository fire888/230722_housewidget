import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export class CameraOrbit extends THREE.PerspectiveCamera {
    constructor (renderer) {
        super(45, window.innerWidth / window.innerHeight, 0.01, 100000)

        this.position.set(0, 1.7, 10)
        if (!renderer) {
            console.log('!!!: no renderer for orbitControls')
        }
        this._controls = new OrbitControls(this, renderer.domElement)
        this._controls.minDistance = 0
        this._controls.maxDistance = 200
        this._controls.zoomSpeed = 1
        this._controls.target.set(0, 3, -10)
        this._controls.update()
    }

    update() {
        this._controls.update()
    }
}
