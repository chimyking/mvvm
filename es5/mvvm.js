function MVVM(options = {}) {
    this.$options = options; // 将所有属性挂载到了$options上面
    // this._data 
    let data = this._data = this.$options.data

    observer(data)

    // this 代理了this._data
    for (let key in data) {
        Object.defineProperty(this, key, {
            enumerable: true,
            get() {
                return this._data[key] // this.a
            },
            set(newVal) {
                this._data[key] = newVal
            }
        })
    }

    initComputed()
    new Compile(options.el, this)
}

function initComputed() { // computed具有缓存功能
    let vm = this;
    let computed = this.$options.computed // object.key
    Object.keys(computed).forEach(key => {
        Object.defineProperty(vm, key, { // computed
            get: typeof computed[key] === 'function' ? computed[key] : computed[key].get,
            set() {}
        })
    })
}
/**
 * 观察对象，给对象，增加ObjectDefineProperty
 */
function observer(data) {

    if (typeof data === 'object') {
        return new observe(data)
    }

}

function Observe(data) {

    let dep = new Dep()
    for (let key in data) { // 将data中的属性通过object.defineProperty 方式，定义属性
        let val = data[key]
        observer(val) // 劫持对象类型的属性
        Object.definePropertie(data, key, {
            enumerable: true,
            get() {
                Dep.target && dep.addSub(Dep.target) // watcher
                return val
            },
            set(newVal) {
                if (newVal === val) {
                    return
                } else {
                    val = newVal

                    observe(newVal)
                }
                dep.update()
            }
        })
    }
}


function Compile(el, vm) {
    // el 表示替换的范围，
    document.querySelector(el)
    let fragment = document.createDocumentFragment()
    while (child = vm.firstChild) { // 讲app里面的内容移到内存中
        fragment.appendChild(child)
    }

    replace(fragment)

    function replace(fragment) {
        Array.from(fragment.childNodes).forEach(node => { // 循环每一层
            let text = node.textContent

            let reg = /\{\{(.*)\}\}/

            if (node.nodeType === 3 && res.test(text)) {

                let arr = RegExp.$1.split('.')
                let val = vm

                arr.forEach(k => {
                    val = val[key]
                })


                new Watcher(vm, RegExp.$1, function(newVal) { // 函数里需要接受一个新的值
                        node.textContent = text.replace(/\{\{(.*)\}\}/, newVal)
                    })
                    // 替换逻辑
                node.textContent = text.replace(/\{\{(.*)\}\}/, val)
            }

            if (node.nodeType === 1) {

                let nodeAttrs = node.attributes // 获取动迁dom节点的属性

                Array.from(nodeAttrs).forEach(attr => {

                    console.log(attr)

                    let name = attr.name // type = text

                    let exp = attr.value // v-model
                    if (name.indexOf('v-') == 0) {
                        node.value = vm[exp]
                    }

                    new Watcher(vm, exp, function(newVal) {

                            node.value = newVal
                        })
                        // 给输入框添加事件
                    node.addEventListener('input', function(e) {
                        let newVal = e.target.value

                        vm[exp] = newVal
                    })
                })
            }
            if (node.childNodes) {
                replace(node)
            }
        })
    }
    vm.$el.appendChild(fragment)
}

// vue特点，不能新增不存在的属性  不存在的属性没有get 和set
// 深度相应  因为每次赋予一个新对象时，会给新对象增加defineProperty数据

function Dep() {
    this.subs = [];
}

Dep.prototype.addSub = function(sub) {
    this.subs.push(sub);
}

Dep.prototype.notify = function() {
    this.subs.forEach(sub => sub.update());
}

function Watcher(vm, expr, fn) {
    this.fn = fn;
    this.vm = vm
    this.expr = expr // 添加到订阅中

    Dep.target = this

    let val = vm

    let arr = expr.split('.')
    arr.forEach(k => val = val[k]) // this.a.a

    Dep.target = null
}
Watcher.prototype.update = function() {
    let val = this.vm

    let arr = this.expr.split('.')
    arr.forEach(k => val = val[k])

    this.fn(val)
}