import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'

const TIME_HIDE = 500
const MIN_OPACITY = .5


export class House extends THREE.Object3D {
    constructor(model) {
        super()
        model.rotation.x = -Math.PI / 2
        this.add(model)

        /** find normals for hide walls */
        this._arrItemsToHideByOrbit = []
        model.traverse(item => {
            if (item.name.includes('lf')) {
                const data = item.name.split('lf')
                const params = data[1].split('n')
                const key = params[0] + '_' + params[1]
                const { array } = item.geometry.attributes.position
                const v2 = new THREE.Vector3(array[3], array[4], array[5])
                const v1 = new THREE.Vector3(array[0], array[1],array[2])
                v2.sub(v1).normalize().applyAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2)
                console.log(key)
                const m = model.getObjectByName(key)
                if (!m) {
                    console.log('cant find mesh by normalLine:', item.name)
                } else {
                    m.userData.normal = v2
                    m.userData.isCanShowByOrbit = true
                    this._arrItemsToHideByOrbit.push(m)
                }
            }
        })

        /** fill arr hidden meshes for player walk */
        this.arrMeshesToWalk = []
        model.traverse(item => {
            if (item.name.includes('walk')) {
                this.arrMeshesToWalk.push(item)
                item.visible = false
            }
        })

        /** prepare materials for transparent */
        model.traverse(item => {
            if (item.material) {
                if (item.material.length) {
                    for (let i = 0; i < item.material.length; ++i) {
                        const mat = item.material[i].clone()
                        mat.transparent = true
                        mat.opacity = 1
                        item.material = mat
                        item.material.needsUpdate = true
                    }
                }
                if (!item.material.length) {
                    const mat = item.material.clone()
                    mat.transparent = true
                    mat.opacity = 1
                    item.material = mat
                    item.material.needsUpdate = true
                }
            }
        })

        /** empty vec to calculate */
        this._v3 = new THREE.Vector3()
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
                    for (let i = 0; i < items[i].material.length; ++i) {
                        items[i].material[i].opacity = opacity
                    }
                } else {
                    items[i].material.opacity = opacity
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

            const dot = this._v3.dot(this._arrItemsToHideByOrbit[i].userData.normal)

            const alpha = Math.max(MIN_OPACITY, (dot + 17) / 5)
            this._arrItemsToHideByOrbit[i].material.opacity = alpha
        }
    }
}
