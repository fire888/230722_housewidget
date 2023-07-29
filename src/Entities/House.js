import * as THREE from 'three'

export class House extends THREE.Object3D {
    constructor(model) {
        super()

        this.add(model)
        const mesh = model
        mesh.rotation.x = -Math.PI / 2

        this.arrMeshesToWalk = []
        mesh.traverse(item => {
            if (item.name.includes('walk')) {
                this.arrMeshesToWalk.push(item)
                item.visible = false
            }
        })
    }
}
