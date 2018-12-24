class MVVM {
    constructor(options) {
        // 首先，把构造函数的数据，挂载到实例上
        this.$el = options.el

        this.$data = options.data

        if (this.$el) {

            // 数据劫持，就是把对象的属性改成get和set方法
            new Observer(this.$el, this)
            // 用数据和元素进行编译
            new Compile(this.$el, this)
        }
    }
}