import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";

export const moveObject1ToPos = (mesh, [x, y, z]) => {
    const vecTarget = new THREE.Vector3(x, y, z)
    const vecSrc = new THREE.Vector3().copy(mesh.position)

    const params = { phase: 0 }

    new TWEEN.Tween(params)
        .to({phase: 1}, 700)
        .onUpdate(() => {
            mesh.position.lerpVectors(vecSrc, vecTarget, params.phase)
        })
        .start()
}

