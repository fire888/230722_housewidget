import * as THREE from 'three'
import { createStudio } from './Entities/Studio'
import { ASSETS } from './constants/ASSETS'
import { loadAssets } from './helpers/loadAssets'
import { createHouse } from "./Entities/house"
import { createLand } from "./Entities/Land";

/** *********************************** */

async function runApplication () {
    const studio = createStudio()
    const assets = await loadAssets(ASSETS, () => {})
    const house = createHouse(assets.house.model)
    studio.addToScene(house.mesh)
    const land = createLand()
    studio.addToScene(land.mesh)


    console.log(assets)

    const animate = () => {
        requestAnimationFrame( animate )
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

