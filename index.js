const itemTemplateLabel = document.querySelector('.new-item-template'),
    newItemInput = document.querySelector('.new-item-template input[type="text"]'),
    addButton = itemTemplateLabel.querySelector('button'),
    ul = document.querySelector('.list ul')
    listsUl = document.querySelector('.lists ul')
    newListButton = document.querySelector('.lists .lists-header button')

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

class Helper {
    static getUniqueId() {
        return (performance.now().toString(36)+Math.random().toString(36)).replace(/\./g,"");
    }
}

class List {
    newList(name) {
        this.id = Helper.getUniqueId()
        this.name = name
        return this
    }

    serialize() {
        return {
            id: this.id,
            name: this.name,
            items: []
        }
    }
}

class MiniDo {
    constructor(activeId) {
        this.textColor = '#333'
        this.accentColor = '#777'
        this.currentContent = ''
        this.items = []
        this.elementBuilder = new ElementBuilder()
        this.list = new List()
        this.lists = []
        this.activeList = null
        this.getLists()
        if(activeId) {
            this.setActiveList(activeId)
            this.populate()
        }
        this.populateLists()
    }

    createList(name) {
        const list = this.list.newList(name).serialize()
        this.lists.push(list)
        this.sync()
        this.appendList(list)
    }

    toggleStrike(target) {
        const element = target.nextSibling;
        const parent = element.parentNode;
        element.classList.toggle('strike-through')
        const index = this.items.findIndex(i => i.id === parent.getAttribute('data-id'))
        this.lists[this.activeListIndex].items[index].state = !this.lists[this.activeListIndex].items[index].state
        this.sync()
    }
    
    appendList(list) {
        const li = this.elementBuilder.build('li')
        const a = this.elementBuilder.build('a', list.name, [
            {property: 'href', value: `#${list.id}`},
            { property: 'class', value: 'list-link'}
        ])
        li.appendChild(a)
        listsUl.prepend(li)
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
        localStorage.setItem('miniDo_data_lists', JSON.stringify(this.lists))
    }

    populate() {
        ul.innerHTML = ''
        const activeList = this.lists[this.activeListIndex]
        if(activeList.items.length) {
            this.items.forEach((item) => {
                this.currentContent = item.content
                this.appendItem(item)
            })
        }
    }

    getLists() {
        const storedLists = localStorage.getItem('miniDo_data_lists')
        if(storedLists) {
            this.lists = JSON.parse(storedLists)
        }
    }

    populateLists() {
        if(this.lists.length) {
            this.lists.forEach((list) => {
                this.appendList(list)
            })
        }
    }

    addItem() {
        if(!this.currentContent) {
            return
        }

        const item = {
            id: Helper.getUniqueId(),
            content: this.currentContent,
            state: false
        }

        this.lists[this.activeListIndex].items.push(item)

        this.sync()
        this.appendItem(item)
    }

    removeItem(itemId) {
        const index = this.items.findIndex(obj => obj.id === itemId)
        this.lists[this.activeListIndex].items.splice(index, 1)
        this.sync()
        const listItem = document.querySelector(`li[data-id='${itemId}']`)
        ul.removeChild(listItem)
    }

    setActiveList(id) {
        this.activeList = id
        this.activeListIndex = this.lists.findIndex(list => list.id === id)
        this.items = this.lists[this.activeListIndex].items
    }

}

let activeId = null

if(window.location.hash) {
    activeId = window.location.hash.replace('#', '')
    document.querySelector('.lists').classList.add('hidden')
}

const miniDo = new MiniDo(activeId)

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

newListButton.addEventListener('click', (event) => {
    const newListInput = event.target.previousSibling
    if(newListInput.value) {
        miniDo.createList(newListInput.value)
        newListInput.value = ''
    }
})

ul.addEventListener('click', (event) => {
    if(event.target.classList.contains('item-check')) {
        miniDo.toggleStrike(event.target)
    }

    if(event.target.classList.contains('remove-button')) {
        miniDo.removeItem(event.target.parentNode.getAttribute('data-id'))
    }
})

listsUl.addEventListener('click', event => {
    if(event.target.classList.contains('list-link')) {
        const listElement = event.target,
        id = listElement.getAttribute('href').replace('#', '')
        miniDo.setActiveList(id)
        miniDo.populate()
    }
})