const itemTemplateLabel = document.querySelector('.new-item-template'),
    newItemInput = document.querySelector('.new-item-template input[type="text"]'),
    addButton = itemTemplateLabel.querySelector('button'),
    ul = document.querySelector('.list ul')

const textColor = '#333',
    accentColor = '#777'

const buildCheckbox = () => {
    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.classList.add('item-check')
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
    const span =  buildSpan(newItemInput.value)
    const checkbox = buildCheckbox()
    li.appendChild(span)
    ul.prepend(li)
    li.insertBefore(checkbox, span)
    newItemInput.value = ''
    newItemInput.focus()
}

const toggleStrike = (target) => {
    target.nextSibling.classList.toggle('strike-through')
}

addButton.addEventListener('click', addItem)
newItemInput.addEventListener('keypress', (event) => {
    if(event.key === 'Enter') {
        addItem()
    }
})
ul.addEventListener('click', (event) => {
    if(event.target.classList.contains('item-check')) {
        toggleStrike(event.target)
    }
})

