export const createHouse = model => {
    const mesh = model
    mesh.rotation.x = -Math.PI / 2

    const arrMeshesToWalk = []

    mesh.traverse(item => {
        if (item.name.includes('walk_')) {
            arrMeshesToWalk.push(item)
        }
    })

    return {
        mesh,
        arrMeshesToWalk,
    }
}
