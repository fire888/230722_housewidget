import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import { WALK, WALK_BLOCK } from '../constants/NAMES'

const TIME_HIDE = 500
const hPI = Math.PI / 2

export const PARAMS_OPACITY = {
    'hide_walls_by_angle': true,
    'min_opacity': 0,
    'min_angle': .73,
    'max_angle': 1,
    'hide_walls_by_scroll': false,
    'min_dist': 0,
    'max_dist': 7,
}

export class House extends THREE.Object3D {
    constructor(model) {
        super()
        this.add(model.scene)

        console.log(model.scene)

        /** find normals for hide walls */
        this._arrItemsToHideByOrbit = []
        model.scene.traverse(item => {


            if (item.name.includes('normal')) {
                item.visible = false
                const { array } = item.geometry.attributes.position
                const v1 = new THREE.Vector3(array[0], array[1], array[2]).applyMatrix4(item.matrix)
                const v2 = new THREE.Vector3(array[3], array[4], array[5]).applyMatrix4(item.matrix)
                v2.sub(v1).normalize()

                model.scene.traverse(itemMesh => {
                    if (!itemMesh.userData || !itemMesh.userData.normalName || itemMesh.userData.normalName !== item.name) {
                        return
                    }
                    itemMesh.userData.normal = v2
                    itemMesh.userData.positionNormal = v1
                    itemMesh.userData.isCanShowByOrbit = true
                    this._arrItemsToHideByOrbit.push(itemMesh)
                })


                // if (NAMES_TO_HIDE_BY_LINE[item.name]) {
                //     for (let i = 0; i < NAMES_TO_HIDE_BY_LINE[item.name].length; ++i) {
                //         const key = NAMES_TO_HIDE_BY_LINE[item.name][i]
                //         const m = model.scene.getObjectByName(key)
                //         if (!m) {
                //             // console.log('cant find mesh by normalLine:', item.name, key)
                //         } else {
                //             m.userData.normal = v2
                //             m.userData.positionNormal = v1
                //             m.userData.isCanShowByOrbit = true
                //             this._arrItemsToHideByOrbit.push(m)
                //         }
                //     }
                // }

            }
        })

        /** fill arr hidden meshes for player walk */
        this.arrMeshesToWalk = []
        model.scene.traverse(item => {
            if (item.name.includes(WALK)) {
                this.arrMeshesToWalk.push(item)
                item.visible = false
            }
        })

        /** prepare materials for transparent */
        model.scene.traverse(item => {
            if (item.material) {
                if (item.material.length) {
                    for (let i = 0; i < item.material.length; ++i) {
                        const mat = item.material[i].clone()
                        mat.transparent = true
                        item.material = mat
                        item.material.needsUpdate = true

                        if (item.material[i].name === 'Glass_mtl') {
                            item.material[i].transparent = true
                            item.material[i].opacity = .1
                        }
                    }
                }
                if (!item.material.length) {
                    if (item.material.name === 'Glass_mtl') {
                        item.material.transparent = true
                        item.material.opacity = .1
                        item.material.needsUpdate = true
                    }
                    const mat = item.material.clone()
                    mat.transparent = true
                    item.material = mat
                    item.material.needsUpdate = true
                }
            }
        })

        /** empty vec to calculate */
        this._v3 = new THREE.Vector3()
        this._v3LineCam = new THREE.Vector3()
        this._line3 = new THREE.Line3()
    }

    toggleVisible (preName, isView, isAnimate) {
        const items = []
        this.traverse(item => {
            if (item.name.includes(preName)) {
                items.push(item)
            }
        })

        const setItemsOpacity = (opacity, visible) => {
            for (let i = 0; i < items.length; ++i) {
                if (items[i].material.length) {
                    // for (let i = 0; i < items[i].material.length; ++i) {
                    //     items[i].material[i].opacity = opacity
                    // }
                } else {
                    if (items[i].material.name === 'Glass_mtl') {
                        items[i].material.opacity = Math.min(opacity, .1)
                    } else {
                        items[i].material.opacity = opacity
                    }
                }
                items[i].visible = visible
                items[i].userData.isCanShowByOrbit = isView
            }
        }

        if (!isAnimate) {
            setItemsOpacity(isView ? 1 : 0, isView)
            return;
        }

        setItemsOpacity(1, true)

        const data = { phase: 0 }

        new TWEEN.Tween(data)
            .to({ phase: 1 }, TIME_HIDE)
            .onUpdate(() => {
                const opacity = isView ? data.phase : 1 - data.phase
                setItemsOpacity(opacity, true)
            })
            .start()
            .onComplete(() => {
                if (isView) {
                    return;
                }
                setItemsOpacity(0, false)
            })
    }

    setVisibleWallsByVector (camPos, camTargetPos) {
        this._v3.copy(camTargetPos)
        this._v3.sub(camPos)

        for (let i = 0; i < this._arrItemsToHideByOrbit.length; ++i) {
            if (!this._arrItemsToHideByOrbit[i].userData.isCanShowByOrbit) {
                continue;
            }

            const mesh = this._arrItemsToHideByOrbit[i]

            let alphaAngle = 0
            let alphaScroll = 0

            /** update by angle */
            if (PARAMS_OPACITY.hide_walls_by_angle) {
                const angle = this._v3.angleTo(mesh.userData.normal)
                if (angle < Math.PI / 2) {
                    if (mesh.material.name === 'Glass_mtl') {
                        mesh.material.opacity = .2
                    } else {
                        mesh.material.opacity = 1
                    }
                    continue;
                }
                const a = 1 - (angle - hPI) / hPI
                const aClamped = -PARAMS_OPACITY.min_angle + a * (1 / (PARAMS_OPACITY.max_angle - PARAMS_OPACITY.min_angle))
                alphaAngle = Math.max(PARAMS_OPACITY.min_opacity, aClamped)
            }


            /** update by scroll */
            if (PARAMS_OPACITY.hide_walls_by_scroll) {
                this._line3.start.copy(camPos)
                this._line3.end.copy(camTargetPos)
                this._line3.closestPointToPoint(mesh.userData.positionNormal, false, this._v3LineCam)
                const d = this._v3LineCam.distanceTo(mesh.userData.positionNormal)

                alphaScroll = Math.max(0, d / (PARAMS_OPACITY.max_dist - PARAMS_OPACITY.min_dist) - PARAMS_OPACITY.min_dist)
            }



            if (PARAMS_OPACITY.hide_walls_by_angle && PARAMS_OPACITY.hide_walls_by_scroll) {
                mesh.material.opacity = Math.max(alphaAngle, alphaScroll)
            }

            if (!PARAMS_OPACITY.hide_walls_by_angle && PARAMS_OPACITY.hide_walls_by_scroll) {
                mesh.material.opacity = alphaScroll
            }

            if (PARAMS_OPACITY.hide_walls_by_angle && !PARAMS_OPACITY.hide_walls_by_scroll) {
                if (mesh.material.name === 'Glass_mtl') {
                    mesh.material.opacity = Math.min(alphaAngle, .1)
                } else {
                    mesh.material.opacity = alphaAngle
                }
            }
        }
    }

    resetOpacity () {
        for (let i = 0; i < this._arrItemsToHideByOrbit.length; ++i) {
            if (!this._arrItemsToHideByOrbit[i].userData.isCanShowByOrbit) {
                continue;
            }
            if (this._arrItemsToHideByOrbit[i].material.name === 'Glass_mtl') {
                this._arrItemsToHideByOrbit[i].material.opacity = .1
            } else {
                this._arrItemsToHideByOrbit[i].material.opacity = 1
            }
        }
    }
}

