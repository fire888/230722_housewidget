import * as THREE from 'three'
import { COLOR_BOTTOM } from '../constants/CONSTANTS'

export class Land extends THREE.Object3D {
    constructor() {
        super()

        const mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(500, 500, 1, 1),
            new THREE.MeshBasicMaterial({color: COLOR_BOTTOM})
        )
        mesh.rotation.x = -Math.PI / 2
        mesh.position.y = -3
        this.add(mesh)
    }
}
