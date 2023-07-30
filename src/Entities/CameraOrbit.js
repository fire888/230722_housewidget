import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as TWEEN from '@tweenjs/tween.js'

export const FLOOR_VIEWS = {
    'fullHouse': {
        camPos: [4.024487155079189,12.883812901297985,7.495981733166685], targetPos: [0.7451711650976472,-0.004245794279778661,-7.498484902802483],
    },
    '1_': {
        camPos: [3.467508371002247,12.876034389806387,5.45479577035581], targetPos: [0.2196469198074736,-1.4099869843544313,-6.706051827195408],
    },
    '2_': {
        camPos: [3.622523568601783,14.9136519145966,5.092977680390664], targetPos: [0.8358011749270896,0.04990622798469363,-8.059711872104655],
    },
}


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


        // document.addEventListener("keydown", (event) => {
        //     if (event.code === 'KeyX') {
        //         console.log(`camPos: [${this.position.toArray()}], targetPos: [${this._controls.target.toArray()}]`)
        //     }
        // });
    }

    update() {
        this._controls.update()
    }

    flyToFloorView (key) {
        if (!FLOOR_VIEWS[key]) {
            console.log('no view key:', key)
        }

        const data = {
            camPos: this.position.toArray(),
            targetPos: this._controls.target.toArray(),
        }

        new TWEEN.Tween(data)
            .to({
                camPos: FLOOR_VIEWS[key].camPos,
                targetPos: FLOOR_VIEWS[key].targetPos
            }, 500)
            .onUpdate(() => {
                this.position.fromArray(data.camPos)
                this._controls.target.fromArray(data.targetPos)
            })
            .onComplete(() => {
                this._controls.update()
            })
            .start()
    }
}
