const itemTemplateLabel = document.querySelector('.new-item-template'),
    newItemInput = document.querySelector('.new-item-template input[type="text"]'),
    addButton = itemTemplateLabel.querySelector('button'),
    ul = document.querySelector('.list ul')

class ElementBuilder {
    build(type, innerHTML, properties) {
        const el = document.createElement(type)
        if(innerHTML) el.innerHTML = innerHTML
        if(properties && properties.length) {
            properties.forEach(prop => {
                if(prop.flag && !prop.value) {
                    return;
                } 
                el.setAttribute(prop.property, prop.value)
            }) 
        }
        return el
    }
}

class MiniDo {
    constructor() {
        this.textColor = '#333'
        this.accentColor = '#777'
        this.currentContent = ''
        this.items = []
        this.elementBuilder = new ElementBuilder()
        this.populate()
    }

    toggleStrike(target) {
        const element = target.nextSibling;
        const parent = element.parentNode;
        element.classList.toggle('strike-through')
        const index = this.items.findIndex(i => i.id === parent.getAttribute('data-id'))
        this.items[index].state = !this.items[index].state
        this.sync()
    }

    static getUniqueId() {
        return performance.now().toString(36)
    }

    appendItem(item) {
        const li = this.elementBuilder.build('li')
        const span = this.elementBuilder.build('span', this.currentContent)
        if(item.state) {
            span.classList.add('strike-through')
        }
        const checkbox = this.elementBuilder.build('input', null, [
            {property: 'type', value: 'checkbox'},
            {property: 'class', value: 'item-check'},
            {property: 'checked', value: item.state, flag: true},
        ])
        const removeButton = this.elementBuilder.build('button', '✕', [{property: 'class', value: 'remove-button'}])
        li.appendChild(span)
        li.appendChild(removeButton)
        li.setAttribute('data-id', item.id)
        ul.prepend(li)
        li.insertBefore(checkbox, span)
        this.currentContent = ''
        newItemInput.value = ''
        newItemInput.focus()
    }

    setContent(value) {
        this.currentContent = value
    }

    sync() {
        localStorage.setItem('miniDo_data', JSON.stringify(this.items))
    }

    populate() {
        const storedItems = localStorage.getItem('miniDo_data')
        if(storedItems) {
            this.items = JSON.parse(storedItems)
            this.items.forEach((item) => {
                this.currentContent = item.content
                this.appendItem(item)
            })
        }
    }

    addItem() {
        if(!this.currentContent) {
            return
        }

        const item = {
            id: MiniDo.getUniqueId(),
            content: this.currentContent,
            state: false
        }

        this.items.push(item)
        this.sync()
        this.appendItem(item)
    }

    removeItem(itemId) {
        const index = this.items.findIndex(obj => obj.id === itemId)
        this.items.splice(index, 1)
        this.sync()
        const listItem = document.querySelector(`li[data-id='${itemId}']`)
        ul.removeChild(listItem)
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
        miniDo.toggleStrike(event.target)
    }

    if(event.target.classList.contains('remove-button')) {
        miniDo.removeItem(event.target.parentNode.getAttribute('data-id'))
    }
})