// 观察者的目的就是 给需要变化的那个元素增加的观察者 ，当数据变化后由对应的方法

class Watcher {

    constructor(vm, expr, cb) {
        this.vm = vm
        this.expr = expr
        this.cb = cb


        // 先获取一下老的值
        this.value = this.get()
    }

    getVal(vm, expr) {
        expr = expr.split('.')
        return expr.reduce((prev, next) => {
            return prev[next]
        }, vm.$data)
    }

    get() {
        let val = this.getVal(this.vm, this.expr)

        return val
    }

    // 对外暴露的方法
    update() {
        let newValue = this.getVal(this.vm, this.expr)
        let oldValue = this.value
        if (newValue != oldValue) {
            this.cb(newValue)
        }
    }
}
