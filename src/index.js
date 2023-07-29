import { ASSETS } from './constants/ASSETS'
import { createStudio } from './Entities/Studio'
import { loadAssets } from './helpers/loadAssets'
import { House } from "./Entities/House"
import { Land } from "./Entities/Land"
import { CameraOrbit } from "./Entities/CameraOrbit"
import { WalkObject } from "./Entities/WalkObject"
import { createUi } from "./ui/ui"
import * as TWEEN from "@tweenjs/tween.js"


async function runApplication () {
    const studio = createStudio()
    const assets = await loadAssets(ASSETS, () => {})

    const house = new House(assets.house.model)
    studio.addToScene(house)

    const land = new Land()
    studio.addToScene(land)

    const cameraOrbit = new CameraOrbit(studio.renderer)
    const walkObject = new WalkObject()
    studio.addToScene(walkObject.label)
    studio.addToScene(walkObject)
    walkObject.setMeshesToWalk(house.arrMeshesToWalk)

    const ui = createUi()
    let currentCamera = 'orbit'
    const changeCamera = () => {
        if (currentCamera === 'orbit') {
            studio.setCamera(walkObject.camera)
            walkObject.isActive = true
            currentCamera = 'walk'
        } else {
            studio.setCamera(cameraOrbit)
            walkObject.isActive = false
            currentCamera = 'orbit'
        }
    }
    ui.setOnClick('change camera', changeCamera)
    changeCamera()

    const animate = () => {
        requestAnimationFrame( animate )
        TWEEN.update()
        cameraOrbit.update()
        studio.render()
    }
    animate()


    const onWindowResize = () => {
        studio.resize()
    }
    window.addEventListener('resize', onWindowResize, false)
    onWindowResize()
}

window.addEventListener('load', runApplication)

