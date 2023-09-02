import * as THREE from 'three'
import { WALK, WALK_BLOCK } from '../constants/NAMES'

export class Label extends THREE.Object3D {
    constructor(obj) {
        super()
        this.visible = false

        this.camera = null
        this.arrMeshesToWalk = []

        this._raycaster = new THREE.Raycaster()
        this._mouse = new THREE.Vector2()
        obj.rotation.x = Math.PI / 2
        const mat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF })
        obj.children[0].material = mat
        this.add(obj)
    }

    move(clientX, clientY) {
        if (!this.camera) {
            return
        }
        this._mouse.x = (clientX / window.innerWidth) * 2 - 1
        this._mouse.y = -(clientY / window.innerHeight) * 2 + 1

        this._raycaster.setFromCamera(this._mouse, this.camera)
        const intersects = this._raycaster.intersectObjects(this.arrMeshesToWalk, true)
        if (!intersects[0]) {
            this.visible = false
            return
        }
        if (intersects[0].object.name.includes(WALK_BLOCK)) {
            this.visible = false
            return
        }

        this.visible = true
        this.position.copy(intersects[0].point)
        const n = intersects[0].face.normal.clone();
        n.transformDirection(intersects[0].object.matrixWorld)
        n.multiplyScalar(10)
        n.add(intersects[0].point);
        this.lookAt(n)
    }
}
