import nprogress from 'nprogress'

export default class NProgress {

  static install (Vue) {
    if (this.installed) return
    this.installed = true

    Object.defineProperty(Vue.prototype, '$nprogress', {
      get () { return this.$root._nprogress }
    })

    Vue.mixin({
      beforeCreate () {
        const np = this.$options.nprogress
        if (np) {
          this._nprogress = np
          np.init(this)

          if (Vue.http) {
            Vue.http.interceptors.push((request, next) => {
              np.inc(0.2)
              next(response => {
                np.done()
                return response
              })
            })
          }

          const router = this.$options.router
          if (router) {
            router.beforeEach((route, redirect, next) => {
              np.start()
              next()
            })
            router.afterEach(() => {
              np.done()
            })
          }
        }
      }
    })
  }

  constructor (options = {}) {
    this.app = null
    this.configure(options)
  }

  init (app) {
    this.app = app
  }

}

Object.setPrototypeOf(NProgress.prototype, nprogress)
