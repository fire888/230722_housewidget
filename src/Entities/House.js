import * as THREE from 'three'

export class House extends THREE.Object3D {
    constructor(model) {
        super()
        model.rotation.x = -Math.PI / 2
        this.add(model)

        this.arrMeshesToWalk = []
        model.traverse(item => {
            if (item.name.includes('walk')) {
                this.arrMeshesToWalk.push(item)
                item.visible = false
            }
        })
    }

    toggleVisible (preName, is) {
        this.traverse(item => {
            if (item.name.includes(preName)) {
                item.visible = is
            }
        })
    }
}
