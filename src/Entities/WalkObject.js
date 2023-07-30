import * as THREE from 'three'
import { Label } from "./Label"
import { moveObject1ToPos } from "../helpers/helpers3D"


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
            this.rotation.y = savedRotationY + (savedMousePos.x - clientX) * SPEED_PAN
            const rotX = savedRotationX + (savedMousePos.y - clientY) * SPEED_PAN
            this.camera.rotation.x = Math.min(CAM_MAX_ROT_X, Math.max(CAM_MIN_ROT_X, rotX))
        }

        this._isActive = false // disable || enable walk
        let isPointerMoved = false // disable player move to final point in phones if panStarted
        let isMouseDowned = false // disable pan if mouse not downed

        window.addEventListener('pointerdown', event => {
            if (!this._isActive) {
                return;
            }
            isMouseDowned = true
            savedMousePos.x = event.clientX
            savedMousePos.y = event.clientY
            savedRotationY = this.rotation.y
            savedRotationX = this.camera.rotation.x
        }, false)

        window.addEventListener( 'pointermove', event => {
            if (!this._isActive) {
                return;
            }
            if (!isMouseDowned) {
                return;
            }
            isPointerMoved = true
            panCamera(event.clientX, event.clientY)
        })

        window.addEventListener('pointerup', event => {
            if (!this._isActive) {
                return;
            }
            isMouseDowned = false
            if (isPointerMoved) {
                isPointerMoved = false
                return;
            }
            this.label.move(event.clientX, event.clientY)
            moveObject1ToPos(this, [this.label.position.x, this.label.position.y + PLAYER_HEIGHT, this.label.position.z])
        })

        window.addEventListener('mousemove', event => {
            if (!this._isActive) {
                return;
            }
            if (isMouseDowned) {
                return;
            }
            this.label.move(event.clientX, event.clientY)
        })
    }

    toggleActive (is) {
        this.label.visible = false
        this._isActive = is
    }

    setMeshesToWalk (arr) {
        this.label.arrMeshesToWalk.push(...arr)
    }
}
