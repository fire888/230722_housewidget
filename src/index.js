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

    let currentCamera = 'orbit'
    studio.setCamera(cameraOrbit)

    const ui = createUi()

    ui.createButton(
        'walk',
        () => {
            studio.setCamera(walkObject.camera)
            walkObject.toggleActive(true)
            currentCamera = 'walk'
        },
        () => {
            studio.setCamera(cameraOrbit)
            walkObject.toggleActive(false)
            currentCamera = 'orbit'
        }
    )

    ui.createButton(
        'этаж 1',
        () => {
            ui.clearButtonsToggled(['этаж 2'])
            house.toggleVisible('1_', true)
            house.toggleVisible('2_', false, true)
            house.toggleVisible('3_', false, true)
        },
        () => {
            ui.clearButtonsToggled(['этаж 2'])
            house.toggleVisible('1_', true)
            house.toggleVisible('2_', true)
            house.toggleVisible('3_', true)
        },
    )

    ui.createButton(
        'этаж 2',
        () => {
            ui.clearButtonsToggled(['этаж 1'])
            house.toggleVisible('1_', false, true)
            house.toggleVisible('2_', true)
            house.toggleVisible('3_', false, true)
        },
        () => {
            ui.clearButtonsToggled(['этаж 1'])
            house.toggleVisible('1_', true)
            house.toggleVisible('2_', true)
            house.toggleVisible('3_', true)
        },
    )


    // ui.setOnClick('2-й этаж', button => {
    //     ui.clear()
    //     if (isShowSecondFloor) {
    //         house.toggleVisible('1_', true)
    //         house.toggleVisible('2_', true)
    //         house.toggleVisible('3_', true)
    //     } else {
    //         button.style.backgroundColor = '#FFFF00'
    //         isShowFirstFloor = false
    //         house.toggleVisible('1_', false)
    //         house.toggleVisible('2_', true)
    //         house.toggleVisible('3_', false)
    //     }
    //     isShowSecondFloor = !isShowSecondFloor
    // })

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

