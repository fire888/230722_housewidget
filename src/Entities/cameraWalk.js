import * as THREE from 'three'
import { TWEEN } from "three/examples/jsm/libs/tween.module.min";

export const createCameraWalk = () => {
    const containerCam = new THREE.Object3D()
    const camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.01, 100000)
    containerCam.position.set(0, 1.7, 10)
    containerCam.add(camera)

    const arrMeshesToWalk = []

    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()
    const cone = new THREE.Group()
    cone.visible = false
    const coneMesh = new THREE.Mesh(
        new THREE.ConeBufferGeometry(.5, .5, 16, 1),
        new THREE.MeshBasicMaterial({ color: 0xff0000 })
    )
    coneMesh.rotation.x = Math.PI / 2
    cone.add(coneMesh)

    let isActive = false
    let isMouseOverGeom = false
    let isMouseDowned = false
    let isMousePan = false
    const savedMousePos = new THREE.Vector2()
    let savedRotationY = 0
    let savedRotationX = 0


    const onMouseDown = event => {
        isMouseDowned = true
        savedMousePos.x = event.clientX
        savedMousePos.y = event.clientY
        savedRotationY = containerCam.rotation.y
        savedRotationX = camera.rotation.x
    }
    window.addEventListener('mousedown', onMouseDown, false)

    const onMouseMove = (event) => {
        if (!isActive) {
            return;
        }
        if (isMouseDowned) {
            isMousePan = true
            containerCam.rotation.y = savedRotationY + (savedMousePos.x - event.clientX) / 150
            camera.rotation.x = savedRotationX - (savedMousePos.y - event.clientY) / 150
            return;
        }

        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1

        raycaster.setFromCamera(mouse, camera)
        const intersects = raycaster.intersectObjects(arrMeshesToWalk, true)

        if (!intersects[0]) {
            isMouseOverGeom = false
            return
        }

        isMouseOverGeom = true

        cone.position.copy(intersects[0].point)

        const n = intersects[ 0 ].face.normal.clone();
        n.transformDirection(intersects[0].object.matrixWorld)
        n.multiplyScalar(10)
        n.add(intersects[0].point );
        cone.lookAt(n)
    }
    window.addEventListener( 'mousemove', onMouseMove, false )


    const vecTarget = new THREE.Vector3()
    const vecSrc = new THREE.Vector3()
    const qTarget = new THREE.Quaternion()
    const qSrc = new THREE.Quaternion()

    const onMouseUp = () => {
        isMouseDowned = false
        if (!isActive) {
            return;
        }
        if (isMousePan) {
            isMousePan = false
            return;
        }
        if (!isMouseOverGeom) {
            return;
        }

        vecTarget.copy(cone.position)
        vecTarget.y += 1.7
        vecSrc.copy(containerCam.position)
        containerCam.position.y = 0
        containerCam.lookAt(vecTarget.x, 0, vecTarget.y)
        //containerCam.rotation.y += Math.PI
        qTarget.copy(containerCam.quaternion)


        const vals = { phase: 0 }

        new TWEEN.Tween(vals)
            .to({ phase: 1 }, 700)
            .onUpdate(() => {
                containerCam.position.lerpVectors(vecSrc, vecTarget, vals.phase)
                containerCam.quaternion.slerpQuaternions(qSrc, qTarget, vals.phase)
            })
            .start()
    }
    window.addEventListener('mouseup', onMouseUp, false)




    return {
        containerCam,
        cone,
        camera,
        update: () => {},
        toggleActive: is => {
            isActive = is
            cone.visible = is
        },
        setMeshesToWalk: arr => {
            arrMeshesToWalk.push(...arr)
            console.log(arrMeshesToWalk)
        },
    }
}
//
// export default function Projector(cam, model) {
//
//     const raycaster = new THREE.Raycaster()
//     const mouse = new THREE.Vector2()
//     const camera = cam
//
//     const targetList = [model]
//
//     const cone = new THREE.Group()
//     const coneMesh = new THREE.Mesh(
//         new THREE.ConeBufferGeometry(10, 30, 16, 1),
//         new THREE.MeshBasicMaterial({ color: 0xff0000 })
//     )
//     coneMesh.rotation.x = Math.PI / 2
//     cone.add(coneMesh)
//
//     const onMouseMove = ( event ) => {
//         mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1
//         mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1
//
//         raycaster.setFromCamera(mouse, camera)
//         const intersects = raycaster.intersectObjects(targetList, true)
//
//         if (!intersects[0]) {
//             return
//         }
//
//         cone.position.copy(intersects[0].point)
//
//         const n = intersects[ 0 ].face.normal.clone();
//         n.transformDirection(intersects[0].object.matrixWorld);
//         n.multiplyScalar( 10 );
//         n.add( intersects[ 0 ].point );
//         cone.lookAt( n );
//     }
//
//     window.addEventListener( 'mousemove', onMouseMove, false )
//
//     return cone
// }
