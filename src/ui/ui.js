export const createUi = () => {
    const wrapper = document.createElement('div')
    wrapper.classList.add('ui-wrapper')

    const disable = e => {
        e.stopPropagation()
        e.preventDefault()
    }

    wrapper.addEventListener('pointerdown', disable)
    wrapper.addEventListener('pointerup', disable)
    wrapper.addEventListener('pointermove', disable)
    wrapper.addEventListener('mousemove', disable)
    document.body.appendChild(wrapper)

    const buttons = {}

    return {
        createButton: (key, fOn, fOff) => {
            const b = document.createElement('button')
            b.classList.add('button-create')
            b.innerText = key
            wrapper.appendChild(b)
            buttons[key] = {
                isToggled: false,
                button: b,
            }
            b.addEventListener('click', e => {
                buttons[key].isToggled = !buttons[key].isToggled
                b.style.backgroundColor = buttons[key].isToggled ? '#ffff00' : '#ffffff'
                buttons[key].isToggled ? fOn() : fOff()
            })
        },
        clearButtonsToggled: arr => {
            for (let i = 0; i < arr.length; ++i) {
                const key = arr[i]
                if (!buttons[key]) {
                    continue;
                }
                buttons[key].button.style.backgroundColor = '#ffffff'
                buttons[key].isToggled = false
            }
        }
    }
}
