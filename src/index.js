import { createStudio } from './Entities/Studio'
import { ASSETS } from './constants/ASSETS'
import { loadAssets } from './helpers/loadAssets'
import { createHouse } from "./Entities/house"
import { createLand } from "./Entities/Land"
import { createCameraOrbit } from "./Entities/cameraOrbit"
import { createCameraWalk } from "./Entities/cameraWalk"
import { createUi } from "./ui/ui"
import { TWEEN } from "three/examples/jsm/libs/tween.module.min";

/** *********************************** */

async function runApplication () {
    const studio = createStudio()
    const assets = await loadAssets(ASSETS, () => {})
    const house = createHouse(assets.house.model)
    studio.addToScene(house.mesh)
    const land = createLand()
    studio.addToScene(land.mesh)
    const cameraOrbit = createCameraOrbit(studio.renderer)
    studio.setCamera(cameraOrbit.camera)
    const cameraWalk = createCameraWalk()
    studio.addToScene(cameraWalk.cone)
    studio.addToScene(cameraWalk.containerCam)
    cameraWalk.setMeshesToWalk(house.arrMeshesToWalk)
    const ui = createUi()
    let currentCamera = 'orbit'
    ui.setOnClick('change camera', () => {
        if (currentCamera === 'orbit') {
            studio.setCamera(cameraWalk.camera)
            cameraWalk.toggleActive(true)
            currentCamera = 'walk'
        } else {
            studio.setCamera(cameraOrbit.camera)
            cameraWalk.toggleActive(false)
            currentCamera = 'orbit'
        }
    })


    console.log(assets)

    const animate = () => {
        requestAnimationFrame( animate )
        TWEEN.update()
        cameraOrbit.update()
        studio.render()
    }
    animate()

    // const root = {
    //     studio,
    // }
    //
    // root.arrMeshesCheckHide = []
    // root.onChangeWallVisible = (idWall, isShow) => {
    //     for (let i = 0; i <  root.arrMeshesCheckHide.length; ++i) {
    //         if ( root.arrMeshesCheckHide[i].idWall === idWall) {
    //             root.arrMeshesCheckHide[i].model.visible = isShow
    //         }
    //     }
    // }




    const onWindowResize = () => {
        studio.resize()
    }
    window.addEventListener('resize', onWindowResize, false)
    onWindowResize()
}

window.addEventListener('load', runApplication)

