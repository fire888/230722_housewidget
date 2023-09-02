import { ASSETS } from './constants/ASSETS'
import { createStudio } from './Entities/Studio'
import { loadAssets } from './helpers/loadAssets'
import { House, PARAMS_OPACITY } from "./Entities/House"
import { Land } from "./Entities/Land"
import { CameraOrbit } from "./Entities/CameraOrbit"
import { WalkObject } from "./Entities/WalkObject"
import { createUi } from "./ui/ui"
import * as TWEEN from "@tweenjs/tween.js"
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';


async function runApplication () {
    const studio = createStudio()
    const assets = await loadAssets(ASSETS, () => {})

    const startScreen = document.querySelector('.progress-wrapper')
    document.body.removeChild(startScreen)

    const house = new House(assets.Rizhskiy_s1f2_WB_detachWalls.model)
    studio.addToScene(house)
    house.toggleVisible('Ceiling', false)

    const land = new Land()
    studio.addToScene(land)

    const walkObject = new WalkObject(assets.label.model)
    walkObject.setMeshesToWalk(house.arrMeshesToWalk)
    studio.addToScene(walkObject)
    studio.addToScene(walkObject.label)

    const cameraOrbit = new CameraOrbit(studio.renderer)
    studio.setCamera(cameraOrbit)

    const ui = createUi()

    let timer = null
    ui.createButton(
        'walk',
        () => {
            cameraOrbit.flyToObject(walkObject.camera, walkObject.camera.fov)
            timer = setTimeout(() => {
                house.toggleVisible('Ceiling', true)
                studio.setCamera(walkObject.camera)
                walkObject.toggleActive(true)
                house.resetOpacity()
            }, 1000)
        },
        () => {
            clearTimeout(timer)
            house.toggleVisible('Ceiling', false)
            walkObject.toggleActive(false)
            studio.setCamera(cameraOrbit)
            cameraOrbit.flyFromObjectToSavedPos(walkObject.camera)
        }
    )

    // ui.createButton(
    //     'этаж 1',
    //     () => {
    //         cameraOrbit.flyToFloorView('1_')
    //         ui.clearButtonsToggled(['этаж 2'])
    //         house.toggleVisible('1_', true)
    //         house.toggleVisible('2_', false, true)
    //         house.toggleVisible('3_', false, true)
    //     },
    //     () => {
    //         cameraOrbit.flyToFloorView('fullHouse')
    //         ui.clearButtonsToggled(['этаж 2'])
    //         house.toggleVisible('1_', true)
    //         house.toggleVisible('2_', true, true)
    //         house.toggleVisible('3_', true, true)
    //     },
    // )
    //
    // ui.createButton(
    //     'этаж 2',
    //     () => {
    //         cameraOrbit.flyToFloorView('2_')
    //         ui.clearButtonsToggled(['этаж 1'])
    //         house.toggleVisible('1_', false, true)
    //         house.toggleVisible('2_', true)
    //         house.toggleVisible('3_', false, true)
    //     },
    //     () => {
    //         cameraOrbit.flyToFloorView('fullHouse')
    //         ui.clearButtonsToggled(['этаж 1'])
    //         house.toggleVisible('1_', true, true)
    //         house.toggleVisible('2_', true)
    //         house.toggleVisible('3_', true, true)
    //     },
    // )

    // const gui = new GUI()
    // gui.domElement.style.left = '0'
    //
    // gui.add(PARAMS_OPACITY, 'hide_walls_by_angle')
    //     .onChange(() => {
    //         house.resetOpacity()
    //     })
    //     .listen()
    // gui.add(PARAMS_OPACITY, 'min_opacity')
    //     .min(0)
    //     .max(1)
    //     .listen()
    // gui.add(PARAMS_OPACITY, 'min_angle')
    //     .min(0)
    //     .max(1)
    //     .onChange(v => {
    //         if (PARAMS_OPACITY.max_angle < v) {
    //             PARAMS_OPACITY.max_angle = v
    //         }
    //     })
    //     .listen()
    // gui.add(PARAMS_OPACITY, 'max_angle')
    //     .min(0)
    //     .max(1)
    //     .onChange(v => {
    //         if (PARAMS_OPACITY.min_angle > v) {
    //             PARAMS_OPACITY.min_angle = v
    //         }
    //     })
    //     .listen()
    // gui.add(PARAMS_OPACITY, 'hide_walls_by_scroll')
    //     .onChange(() => {
    //         house.resetOpacity()
    //     })
    //     .listen()
    // gui.add(PARAMS_OPACITY, 'min_dist')
    //     .min(0)
    //     .max(15)
    //     .onChange(v => {
    //         if (PARAMS_OPACITY.max_dist < v) {
    //             PARAMS_OPACITY.max_dist = v + 0.01
    //         }
    //     })
    //     .listen()
    // gui.add(PARAMS_OPACITY, 'max_dist')
    //     .min(0)
    //     .max(15)
    //     .onChange(v => {
    //         if (PARAMS_OPACITY.min_dist > v) {
    //             PARAMS_OPACITY.min_dist = v - 0.01
    //         }
    //     })
    //     .listen()


    const animate = () => {
        requestAnimationFrame( animate )
        TWEEN.update()
        if (!walkObject.isActive) {
            cameraOrbit.update()
            house.setVisibleWallsByVector(cameraOrbit.position, cameraOrbit.target)
        }
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

