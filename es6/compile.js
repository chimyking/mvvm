class Compile {

    constructor(el, vm) {

        this.el = this.isElement(el) ? el : document.querySelector(el) // #app  | document.querySelector("#app")
        this.vm = vm

        if (this.el) {
            // if get this elelment,then compile
            // 1.move real DOM to fragment
            let fragment = this.node2fragment(this.el)

            // 2.compile => get Node elemment and text element
            this.compile(fragment)

            // 3.move fragment to realDom
            this.el.appendChild(fragment)
        }
    }

    /**
     * 是不是指令
     */
    isDirective() {
        return name.includes('v-')
    }
    // ======辅助方法========
    /**
     * 判断el是否是个元素节点
     * @param {} el 
     */
    isElement(node) {
        return node.nodeType === 1
    }

    getVal() {

    }
    // ======核心方法========

    /**
     * move el to fragment
     * 
     * appendChild,
     * @param {*} el 
     */
    node2fragment(el) {

        // create temp memery
        let fragment = document.createDocumentFragment()

        let firstChild

        while (firstChild = el.firstChild) {
            fragment.appendChild(firstChild)
        }

        return fragment
    }

    /**
     * core fn 
     * compile fragement to realDOM
     * @param {*} fragment 
     */
    compile(fragment) {
        // NodeList   (array-liked)


        // 需要递归
        let childNodes = fragment.childNodes

        Array.from(childNodes).forEach(node => {
            if (this.isElement(node)) { // element
                // if element，should compile children
                // 是元素节点，还需要继续深入的检查
                // 这里需要编译元素
                console.log('element', node)
                this.compileElement(node)
                this.compile(node)
            } else { // text
                // 这里需要编译文本
                // 文本节点
                this.compileText(node)
            }
        })
    }
    /**
     * 编译元素
     * 带 v-model
     * @param {*} node 
     */
    compileElement(node) {
        // 取出当前节点的属性
        // [{type,v-model}]
        let attrs = node.attributes // namedNodeMap

        Array.from(attrs).forEach(attr => { // {name,value}
            console.log(attr.name)
            // 判断属性名字包含 'v-'
            let attrName = attr.name
            if (this.isDirective(attrName)) {
                // 取到对应的值，放到节点中
                // node vm.$data.message   attr.value
                let epxr = attr.value;
                let [, type] = attr.name.split('-')
                compileUtil['type'](node, this.vm, expr)
            }
        })
    }
    /**
     * 编译文本
     * 带{{}}
     * @param {*} node 
     */
    compileText(node) {
        // 带{{}}
        let text = node.textContent // 取文本中的内容

        console.log(text)
        let reg = /\{\{[(^}]+)\}\}/g // {{a}} {{b}} {{c}}

        if (reg.test(text)) {
            // node this.vm.$data text
            compileUtil['text'](node, this.vm, expr)
            // todo.....
        }
    }
}

CompileUtil = {
    getVal(vm, expr) {
        expr = expr.split('.')
        return expr.reduce((prev, next) => {
            return prev[next]
        }, vm.$data)
    },
    getTextVal(vm, expr) {
        return expr.replace(/\{\{([^}]+)\}\}/g, (...arguments) => {
            return this.getVal(vm, arguments[1])
        })
    },
    text(node, vm, expr) { // 文本处理
        let updateFn = this.updater['textUpdater']
        // {{message.a.b.c}} => this.getVal(message.a.b.c)

        let value = this.getTextVal(vm, expr)

        expr.replace(/\{\{([^}]+)\}\}/g, (...arguments) => {
            new Watcher(vm, arguments[1], (newValue) => {
                // 如果数据变化，文本节点需要重新获取依赖的睡醒更新文本中的内容
                updateFn && updateFn(node, this.getTextVal())
            })
        })

        updateFn && updateFn(node, value)
    },
    model(node, vm, expr) { // 双向绑定
        let updateFn = this.updater['modelUpdater']
        // 这里应该加一个监控，数据变了，应该调用watcher的callback
        new Wactcher(vm, expr, (newValue) => {
            // 当值变化后调用cb，将新的值 传递过来
            updateFn && updateFn(node, this.getVal(vm, expr))
        })
        updateFn && updateFn(node, this.getVal(vm, expr))
    },
    html(node, vm, expr) { // dom 处理

    },
    update: {
        // 文本更新
        textUpdater(node, value) {
            node.textContent = value
        },
        // 输入框更新
        modelUpdater(node, value) {
            node.value = value
        }
    }
}