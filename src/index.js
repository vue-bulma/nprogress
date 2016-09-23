import nprogress from 'nprogress'

function install (Vue) {
  if (this.installed) return
  this.installed = true

  Object.defineProperty(Vue.prototype, '$nprogress', {
    get: function get () { return this.$root._nprogress }
  })

  Vue.mixin({
    beforeCreate: function beforeEach () {
      const np = this.$options.nprogress
      if (np) {
        this._nprogress = np
        np.init(this)

        if (Vue.http) {
          Vue.http.interceptors.push(function (request, next) {
            np.inc(0.2)
            next(function (response) {
              np.done()
              return response
            })
          })
        }

        const router = this.$options.router
        if (router) {
          router.beforeEach(function (route, redirect, next) {
            np.start()
            next()
          })
          router.afterEach(function () {
            np.done()
          })
        }
      }
    }
  })
}

function NProgress (options) {
  this.app = null
  this.configure(options || {})
}

NProgress.prototype.init = function (app) {
  this.app = app
}

NProgress.install = install

Object.setPrototypeOf(NProgress.prototype, nprogress)

export default NProgress
