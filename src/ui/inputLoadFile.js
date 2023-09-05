export const createInputLoadFile = () => {
    return new Promise(res => {
        const input = document.createElement('input')
        input.classList.add('load-file')
        input.setAttribute('type', 'file')
        document.body.appendChild(input)
        function handle () {
            console.log(this.files)
            res(this.files[0])
            document.body.removeChild(input)
        }
        input.addEventListener("change", handle)
    })

}
