import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const BACK_COLOR = 0x5577aa

export const createStudio = () => {
    const container = document.querySelector('.scene-container')
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.01, 100000)
    camera.position.set(0, 1.7, 10)
    scene.add(camera)


    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(BACK_COLOR)
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap

    container.appendChild(renderer.domElement)

    const fog = new THREE.Fog(BACK_COLOR, 0, 100)
    scene.fog = fog

    const light = new THREE.PointLight(0xffffff, .7)
    light.position.set(0, 15, 0)
    scene.add(light)

    const ambLight = new THREE.AmbientLight(0xffffff, .2)
    scene.add(ambLight)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.minDistance = 0
    controls.maxDistance = 200
    controls.zoomSpeed = 1
    controls.target.set(0, 3, -10)
    controls.update()

    return {
        scene,
        addToScene(model) {
            scene.add(model)
        },
        removeFromScene(model) {
            scene.remove(model)
        },
        render () {
            if (!camera) {
                return
            }

            if (camera.position.y < 0.001) {
                camera.position.y = 0.001
                controls.update()
            }

            renderer.render(scene, camera)

        },
        setTargetCam: v => {
            controls.target.set( v.x, v.y, v.z )
            controls.update()
        },
        resize () {
            if (!camera) {
                return;
            }
            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()
            renderer.setSize(window.innerWidth, window.innerHeight)
        },
        onCameraMove: func => {
            //functionsOmCameraMove.push(func)
        },
    }
}
