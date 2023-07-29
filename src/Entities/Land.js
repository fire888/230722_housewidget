import * as THREE from 'three'
export class Land extends THREE.Object3D {
    constructor() {
        super()

        const mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(500, 500, 1, 1),
            new THREE.MeshBasicMaterial({color: 0x009900})
        )
        mesh.rotation.x = -Math.PI / 2
        this.add(mesh)
    }
}
