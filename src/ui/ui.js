export const createUi = () => {
    const wrapper = document.createElement('div')
    wrapper.classList.add('ui-wrapper')
    document.body.appendChild(wrapper)

    const buttons = {}


    return {
        setOnClick: (key, f) => {
            const b = document.createElement('button')
            b.classList.add('button-create')
            b.innerText = key
            wrapper.appendChild(b)
            buttons[key] = b
            buttons[key].addEventListener('click', f)
        },
    }
}