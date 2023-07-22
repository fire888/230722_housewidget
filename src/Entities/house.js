export const createHouse = model => {
    const mesh = model
    mesh.rotation.x = -Math.PI / 2
    return {
        mesh
    }
}
