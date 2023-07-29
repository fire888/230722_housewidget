import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'

export class House extends THREE.Object3D {
    constructor(model) {
        super()
        model.rotation.x = -Math.PI / 2
        this.add(model)

        this.arrMeshesToWalk = []
        model.traverse(item => {
            if (item.name.includes('walk')) {
                this.arrMeshesToWalk.push(item)
                item.visible = false
            }
        })

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
    }

    toggleVisible (preName, isView, isAnimate) {
        if (isView) {
            this.traverse(item => {
                if (item.name.includes(preName)) {
                    item.visible = true
                }
            })
        }

        let arrMaterialsFiltered = []
        for (let key in this._materials) {
            if (key.includes(preName)) {
                arrMaterialsFiltered.push(this._materials[key])
            }
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
                this.traverse(item => {
                    if (item.name.includes(preName)) {
                        item.visible = false
                    }
                })
            })
    }
}
