const itemTemplateLabel = document.querySelector('.new-item-template'),
    newItemInput = document.querySelector('.new-item-template input[type="text"]')

const textColor = '#333'
const accentColor = '#777'

const addButton = itemTemplateLabel.querySelector('button')
const ul = document.querySelector('.list ul')

const buildCheckbox = () => {
    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    return checkbox
}

const buildSpan = (value) => {
    const span = document.createElement('span')
    span.innerText = value
    return span
}

const buildLi = () =>  {
    const li = document.createElement('li')
    return li
}


const addItem = () => {
    if(!newItemInput.value) {
        return
    }
    const li = buildLi()
    console.log(li)
    const span =  buildSpan(newItemInput.value)
    const checkbox = buildCheckbox()
    li.appendChild(span)
    ul.prepend(li)
    li.insertBefore(checkbox, span)
    newItemInput.value = ''
    newItemInput.focus()
}

addButton.addEventListener('click', addItem)
newItemInput.addEventListener('keypress', (event) => {
    if(event.key === 'Enter') {
        addItem()
    }
})

