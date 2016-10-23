import nprogress from 'nprogress'

const defaults = {
  latencyThreshold: 100,
  router: true,
  http: true
}

function install(Vue, options = {}) {
  if (this.installed) return
  this.installed = true

  Object.defineProperty(Vue.prototype, '$nprogress', {
    get: function get() {
      return this.$root._nprogress
    }
  })

  options = Object.assign({}, defaults, options)

  Vue.mixin({
    beforeCreate () {
      let np = this.$options.nprogress

      if (np) {

        let requestsTotal = 0
        let requestsCompleted = 0
        let { latencyThreshold, router: applyOnRouter, http: applyOnHttp } = options

        function setComplete() {
          requestsTotal = 0
          requestsCompleted = 0
          np.done()
        }

        function initProgress() {
          if (0 === requestsTotal) {
            setTimeout(() => np.start(), latencyThreshold)
          }
          requestsTotal++
          np.set(requestsCompleted / requestsTotal)
        }

        function increase() {
          // Finish progress bar 50 ms later
          setTimeout(() => {
            ++requestsCompleted
            if (requestsCompleted >= requestsTotal) {
              setComplete()
            } else {
              np.set((requestsCompleted / requestsTotal) - 0.1)
            }
          }, latencyThreshold + 50)
        }

        this._nprogress = np
        np.init(this)

        const http = applyOnHttp && Vue.http
        if (http) {
          http.interceptors.push((request, next) => {
            const showProgressBar = 'showProgressBar' in request ? request.showProgressBar : applyOnHttp
            if (showProgressBar) initProgress()

            next(response => {
              if (!showProgressBar) return response
              increase()
            })
          })
        }

        const router = applyOnRouter && this.$options.router
        if (router) {
          router.beforeEach((route, from, next) => {
            const showProgressBar = 'showProgressBar' in route.meta ? route.meta.showProgressBar : applyOnRouter
            if (showProgressBar) initProgress()
            next()
          })
          router.afterEach(route => {
            const showProgressBar = 'showProgressBar' in route.meta ? route.meta.showProgressBar : applyOnRouter
            if (showProgressBar) increase()
          })
        }
      }
    }
  })
}

function NProgress(options) {
  this.app = null
  this.configure(options || {})
}

NProgress.prototype.init = function (app) {
  this.app = app
}

NProgress.install = install

Object.setPrototypeOf(NProgress.prototype, nprogress)

export default NProgress
