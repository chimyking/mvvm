class Observer {

    constructor(data) {
        this.observe(data)
    }

    /**
     * 
     * @param {} data
     */
    observe(data) { // data:1
        // 要对这个data数据原有的属性改成get和set的形式
        if (!data || typeof data !== 'object') {
            return
        }

        // 要讲数据 一一劫持   先获取到data的key和value

        Object.keys(data).forEach(key => {

            // 劫持
            this.defineReactive(data, key, data[key])
            this.observe(data[key])
        })
    }
    /**
     * 定义响应式
     * @param {*} data 
     * @param {*} key 
     * @param {*} value 
     */
    defineReactive(obj, key, value) {

        let that = this
        // 在获取某个值得时候，
        Object.defineProperty(obj, key, {
            configurable: true,
            enumerable: true,

            set(newVal) { // 当给data属性中设置值得适合，更改获取的属性的值
                if (newVal != value) {
                    // 这里的this不是手里  vm.message = 123213
                    that.observe(newVal) // 如果是对象再去劫持
                    value = newVal
                }
            },
            get() { // 当取值调用的方法
                // todo ...
                return value
            }
        })
    }
}