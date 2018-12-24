// 发布订阅模式   订阅  在有发布[fn1,fn2,fn3]



// 绑定方法，都有一个update方法
function Dep() {
    this.subs = [];
}

Dep.prototype.addSub = function(sub) {
    this.subs.push(sub);
}

Dep.prototype.notify = function() {
    this.subs.forEach(sub => sub.update());
}



/**
 * Watcher是一个类， 通过这个类创建爱你的实例都拥有update方法
 * @param {} fn 
 */
function Watcher(fn) {
    this.fn = fn;
}
Watcher.prototype.update = function() {
    this.fn();
}


let watcher = new Watcher(function() {
    alert(0);
})


let dep = new Dep();

dep.addSub(watcher);
dep.addSub(watcher);


dep.notify();