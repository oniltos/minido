const itemTemplateLabel = document.querySelector('.new-item-template'),
    newItemInput = document.querySelector('.new-item-template input[type="text"]')

const textColor = '#333'
const accentColor = '#777'

const addButton = itemTemplateLabel.querySelector('button')
const ul = document.querySelector('.list ul')


const addItem = () => {
    const li = document.createElement('li')
    const span = document.createElement('span')
    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    span.innerText = newItemInput.value
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

