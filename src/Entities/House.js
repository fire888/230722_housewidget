import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'


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
                const m = model.getObjectByName(key)
                if (!m) {
                    console.log('cant find mesh by normalLine:', item.name)
                } else {
                    m.userData.normal = v2
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
        this._materials = {}
        model.traverse(item => {
            if (item.material) {
                if (item.material.length) {
                    for (let i = 0; i < item.material.length; ++i) {
                        const mat = item.material[i].clone()
                        mat.transparent = true
                        mat.opacity = 1
                        item.material = mat
                        item.material.needsUpdate = true
                        this._materials[item.name + '_n' + i] = mat
                    }
                }
                if (!item.material.length) {
                    const mat = item.material.clone()
                    mat.transparent = true
                    mat.opacity = 1
                    item.material = mat
                    item.material.needsUpdate = true
                    this._materials[item.name] = mat
                }
            }
        })

        /** empty vec to calculate */
        this._v3 = new THREE.Vector3()
    }

    toggleVisible (preName, isView, isAnimate) {
        let arrMaterialsFiltered = []
        for (let key in this._materials) {
            if (key.includes(preName)) {
                arrMaterialsFiltered.push(this._materials[key])
            }
        }
        let arrItemsFiltered = []
        this.traverse(item => {
            if (item.name.includes(preName)) {
                arrItemsFiltered.push(item)
            }
        })

        if (!isAnimate) {
            for (let i = 0; i < arrMaterialsFiltered.length; ++i) {
                arrMaterialsFiltered[i].opacity = isView ? 1 : 0
            }
            for (let i = 0; i < arrItemsFiltered.length; ++i) {
                arrItemsFiltered[i].visible = isView
            }
            return;
        }

        for (let i = 0; i < arrItemsFiltered.length; ++i) {
            arrItemsFiltered[i].visible = true
        }

        const data = { phase: 0 }

        new TWEEN.Tween(data)
            .to({ phase: 1 }, 300)
            .onUpdate(() => {
                const opacity = isView ? data.phase : 1 - data.phase
                for (let i = 0; i < arrMaterialsFiltered.length; ++i) {
                    arrMaterialsFiltered[i].opacity = opacity
                }
            })
            .start()
            .onComplete(() => {
                if (isView) {
                    return;
                }
                for (let i = 0; i < arrItemsFiltered.length; ++i) {
                    arrItemsFiltered[i].visible = false
                }
            })
    }

    setVisibleWallsByVector (camPos, camTargetPos) {
        this._v3.copy(camTargetPos)
        this._v3.sub(camPos)

        const DOT = -10

        for (let i = 0; i < this._arrItemsToHideByOrbit.length; ++i) {
            const dot = this._v3.dot(this._arrItemsToHideByOrbit[i].userData.normal)
            if (dot < DOT && this._arrItemsToHideByOrbit[i].visible) {
                const data = { opacity: 1 }
                new TWEEN.Tween(data)
                    .to({ opacity: 0 }, 300)
                    .onUpdate(() => {
                        this._materials[this._arrItemsToHideByOrbit[i].name].opacity = data.opacity
                    })
                    .onComplete(() => {
                        this._arrItemsToHideByOrbit[i].visible = false
                    })
                    .start()
            }
            if (dot >= DOT && !this._arrItemsToHideByOrbit[i].visible) {
                this._arrItemsToHideByOrbit[i].visible = true
                const data = { opacity: 0 }
                new TWEEN.Tween(data)
                    .to({ opacity: 1 }, 300)
                    .onUpdate(() => {
                        this._materials[this._arrItemsToHideByOrbit[i].name].opacity = data.opacity
                    })
                    .start()
            }
        }
    }
}
