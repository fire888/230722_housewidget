import * as THREE from 'three'
import * as TWEEN from "@tweenjs/tween.js"
import { Label } from "./Label";


const SPEED_PAN = 0.005
const CAM_MAX_ROT_X = 0.835
const CAM_MIN_ROT_X = -1.04
const PLAYER_HEIGHT = 1.6

export class WalkObject extends THREE.Object3D {
    constructor() {
        super()
        this.position.set(0, 1.7, 10)
        this.camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.01, 100000)
        this.add(this.camera)
        this.label = new Label()
        this.label.camera = this.camera

        const savedMousePos = new THREE.Vector2()
        let savedRotationY = 0
        let savedRotationX = 0

        const panCamera = (clientX, clientY) => {
            this.label.visible = false
            this.rotation.y = savedRotationY + (savedMousePos.x - clientX) * SPEED_PAN
            const rotX = savedRotationX + (savedMousePos.y - clientY) * SPEED_PAN
            this.camera.rotation.x = Math.min(CAM_MAX_ROT_X, Math.max(CAM_MIN_ROT_X, rotX))
        }

        this.isActive = false // disable || enable walk
        let isMouseDowned = false // is can pan

        const onMouseDown = event => {
            if (!this.isActive) {
                return;
            }
            isMouseDowned = true
            savedMousePos.x = event.clientX
            savedMousePos.y = event.clientY
            savedRotationY = this.rotation.y
            savedRotationX = this.camera.rotation.x
        }
        window.addEventListener('mousedown', onMouseDown, false)

        const onMouseMove = (event) => {
            if (!this.isActive) {
                return;
            }
            if (isMouseDowned) {
                this.label.visible = false
                panCamera(event.clientX, event.clientY)
            } else {
                this.label.move(event.clientX, event.clientY)
            }
        }
        window.addEventListener( 'mousemove', onMouseMove, false )


        const onMouseUp = () => {
            if (!this.isActive) {
                return;
            }
            isMouseDowned = false
            if (!this.label.visible) {
                return;
            }
            moveObject1ToObject2(this, this.label)
        }
        window.addEventListener('mouseup', onMouseUp, false)
    }

    setMeshesToWalk (arr) {
        this.label.arrMeshesToWalk.push(...arr)
    }
}



const moveObject1ToObject2 = (m1, m2) => {
    const vecTarget = new THREE.Vector3()
    const vecSrc = new THREE.Vector3()

    vecSrc.copy(m1.position)
    vecTarget.copy(m2.position)
    vecTarget.y += PLAYER_HEIGHT

    const params = {phase: 0}

    new TWEEN.Tween(params)
        .to({phase: 1}, 700)
        .onUpdate(() => {
            m1.position.lerpVectors(vecSrc, vecTarget, params.phase)
        })
        .start()
}
