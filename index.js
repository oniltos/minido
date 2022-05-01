const itemTemplateLabel = document.querySelector('.new-item-template'),
    newItemInput = document.querySelector('.new-item-template input[type="text"]'),
    addButton = itemTemplateLabel.querySelector('button'),
    ul = document.querySelector('.list ul')

class MiniDo {
    constructor() {
        this.textColor = '#333'
        this.accentColor = '#777'
        this.currentContent = ''
    }

    static buildCheckbox() {
        const checkbox = document.createElement('input')
        checkbox.type = 'checkbox'
        checkbox.classList.add('item-check')
        return checkbox
    }

    buildSpan() {
        const span = document.createElement('span')
        span.innerText = this.currentContent
        return span
    }

    static buildLi() {
        const li = document.createElement('li')
        return li
    }

    static toggleStrike(target) {
        target.nextSibling.classList.toggle('strike-through')
    }

    setContent(value) {
        this.currentContent = value
    }

    addItem() {
        if(!this.currentContent) {
            return
        }
        const li = MiniDo.buildLi()
        const span =  this.buildSpan()
        const checkbox = MiniDo.buildCheckbox()
        li.appendChild(span)
        ul.prepend(li)
        li.insertBefore(checkbox, span)
        this.currentContent = ''
        newItemInput.value = ''
        newItemInput.focus()
    }

}

const miniDo = new MiniDo()

newItemInput.addEventListener('keypress', (event) => {
    if(event.key === 'Enter') {
        miniDo.addItem()
    }
})

newItemInput.addEventListener('keyup', (event) => {
    miniDo.setContent(event.target.value)
})

addButton.addEventListener('click', () => {
    miniDo.addItem()
})

ul.addEventListener('click', (event) => {
    if(event.target.classList.contains('item-check')) {
        MiniDo.toggleStrike(event.target)
    }
})

