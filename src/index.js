import nprogress from 'nprogress'

export Nprogress from './Nprogress.vue'

export default class NProgress {

  static install (Vue) {
    if (install.installed) return
    install.installed = true

    Object.defineProperty(Vue.prototype, '$nprogress', {
      get () { return this.$root._nprogress }
    })

    Vue.mixin({
      beforeCreate () {
        if (this.$options.nprogress) {
          this._nprogress = this.$options.nprogress
          this._nprogress.init(this)
        }
      }
    })
  }

  constructor (options = {}) {
    this.app = null
    this.getPrototypeOf(NProgress)
    this.configure(options)
  }

  init (app) {
    this.app = app
  }

}
